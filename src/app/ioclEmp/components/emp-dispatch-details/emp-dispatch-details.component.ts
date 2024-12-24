import { Component } from '@angular/core';
import { NgIf, NgFor, JsonPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-emp-dispatch-details',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor,
    FormsModule, 
    ReactiveFormsModule,
    MatTableModule,
    JsonPipe,
    DatePipe,
    TitleCasePipe],
  templateUrl: './emp-dispatch-details.component.html',
  styleUrl: './emp-dispatch-details.component.css'
})
export class EmpDispatchDetailsComponent {
  // filterForm!: FormGroup;
  // filteredData: any[] = [];
  // displayedColumns: string[] = [];

  // constructor(
  //   private fb: FormBuilder, 
  //   private ioclService: IoclEmpServiceService,
  //   private datePipe: DatePipe // Inject DatePipe into the constructor
  // ) {
  //   this.filterForm = this.fb.group({
  //     fromDate: [''],
  //     toDate: [''],
  //     parcelType: ['']
  //   });
  // }

  // onSubmit() {
  //   const formData = this.filterForm.value;

  //   // Format dates to 'yyyy-MM-dd' format
  //   const fromDate = this.datePipe.transform(formData.fromDate, 'yyyy-MM-dd')!;
  //   const toDate = this.datePipe.transform(formData.toDate, 'yyyy-MM-dd')!;

  //   this.ioclService.getHistoryByDate(fromDate, toDate, formData.parcelType)
  //     .subscribe(
  //       data => {
  //         this.filteredData = data;
  //         this.setDisplayedColumns(formData.parcelType);
  //       },
  //       error => {
  //         console.error('Error fetching dispatch history:', error);
  //       }
  //     );
  // }

  // private setDisplayedColumns(parcelType: string) {
  //   if (parcelType === 'in') {
  //     this.displayedColumns = ['senderLocCode', 'senderName','senderDepartment', 'recipientName', 'recipientDepartment','courierName','recordStatus','receivedDate','consignmentDate','createdDate'];
  //   } else if (parcelType === 'out') {
  //     this.displayedColumns = ['senderName','senderDepartment', 'recipientLocCode', 'recipientName','recipientDepartment','courierName', 'weight', 'unit','distance','recordStatus','consignmentDate', 'createdDate'];
  //   }
  // }

  filterForm!: FormGroup;
  filteredData: any[] = [];
  fullData: any[] = [];
  displayedColumns: string[] = [];
  allSenderLocCodes: string[] = [];
  allSenderDepartments: string[] = [];
  isFiltered: boolean = false;
  isDownloadVisible: boolean = false;
  sortColumn: string = '';  // Added this to track the column being sorted
  sortDirection: 'asc' | 'desc' = 'asc';  // Initialize sortDirection
  
  currentSortColumn: string | null = null; // Track the current column being sorted
  sortOrder: 'asc' | 'desc' = 'asc'; // Track the current sort order

  ngOnInit() {
    // Initialize filteredData with fullData on component load
    this.filteredData = [...this.fullData];
  }


  constructor(
    private fb: FormBuilder,
    private ioclempservice: IoclEmpServiceService,
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      parcelType: [''],
      senderLocCode: [''],
      senderDepartment: [''],
      searchBy: [''] , // Add this form control for consignment number search
      sortBy: [''],  // Make sure this field exists
      sortOrder: [''] // Make sure this field exists

    });
  }

  onSubmit() {
    const formData = this.filterForm.value;
    console.log('Form Data Submitted:', formData); // Debugging log for form data
  
    // Format dates for API compatibility
    const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
    const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
    console.log('Formatted Dates:', { fromDate, toDate });
  
    // Fetch data using the reports service
    this.ioclempservice
      .getHistoryByDate(
        fromDate,
        toDate,
        formData.parcelType,  // Parcel type filter
        false,                // exportPdf (not exporting here)
        false,                // exportExcel (not exporting here)
        formData.senderLocCode?.trim() || '',  // Sender location code (optional)
        formData.senderDepartment?.trim() || '',  // Sender department (optional)
        formData.searchBy?.trim() || '',  // Search filter (optional)
        '',  // Sort by (not specified in this context)
        ''   // Sort order (not specified in this context)
      )
      .subscribe(
        (data) => {
          console.log('Data Fetched Successfully:', data); // Log fetched data
  
          // Update data and state variables
          this.fullData = data;
          this.filteredData = [...data];
          this.isFiltered = true;
          this.isDownloadVisible = true;
  
          console.log('Filtered Data Updated:', this.filteredData);
  
          // Update dropdown options (assumes a helper method exists)
          this.updateDropdownOptions();
  
          // Reset the search filter
          this.filterForm.patchValue({ searchBy: '' });
  
          // Adjust displayed columns based on parcel type
          this.setDisplayedColumns(formData.parcelType);
          console.log('Displayed Columns Set:', this.displayedColumns);
        },
        (error) => {
          console.error('Error Fetching Dispatch History:', error);
  
          // Reset data and UI state on error
          this.fullData = [];
          this.filteredData = [];
          this.isFiltered = true;
          this.isDownloadVisible = false;
  
          // Reset the search filter
          this.filterForm.patchValue({ searchBy: '' });
        }
      );
  }
// onConsignmentNumberSearch() {
//   const consignmentNumber = this.filterForm.value.consignmentNumber.trim().toLowerCase();

//   if (consignmentNumber) {
//     this.filteredData = this.fullData.filter((item) =>
//       item.consignmentNumber.toLowerCase().includes(consignmentNumber)
//     );
//   } else {
//     this.filteredData = [...this.fullData];
//   }
// }
onSearch() {
  const searchTerm = this.filterForm.value.searchBy?.trim().toLowerCase();

  if (searchTerm) {
    this.filteredData = this.fullData.filter((item) => {
      // Check all fields in the item
      return Object.keys(item).some((key) => {
        const fieldValue = item[key];
        // Convert the field value to a string and compare
        return fieldValue?.toString().toLowerCase().includes(searchTerm);
      });
    });
  } else {
    // Reset to full data if the search box is empty
    this.filteredData = [...this.fullData];
  }
}


resetToMainFilters() {
  this.filteredData = [...this.fullData]; // Restore to full data
  const formData = this.filterForm.value;

  // Apply the main filters again
  if (formData.senderLocCode) {
    this.filteredData = this.filteredData.filter(item => item.senderLocCode === formData.senderLocCode);
  }
  if (formData.senderDepartment) {
    this.filteredData = this.filteredData.filter(item => item.senderDepartment === formData.senderDepartment);
  }

  console.log('Data after resetting main filters:', this.filteredData); // Debugging log
}


  // updateDropdownOptions() {
  //   this.allSenderLocCodes = [...new Set(this.fullData.map(item => item.senderLocCode))].sort();
  //   this.allSenderDepartments = [...new Set(this.fullData.map(item => item.senderDepartment))].sort();
  // }

  // applyFilter(column: string, value: string) {
  //   this.filterForm.get(column)?.setValue(value); // Set value in the form control
  //   console.log(`Filter applied for ${column}: ${value}`); // Log to debug
  
   
  //   if (value) {
  //     this.filteredData = this.fullData.filter(item => item[column] === value);
     
  //   } else {
  //     this.filteredData = [...this.fullData];
  //   }
  //   if (column !== 'consignmentNumber') {
  //     this.filterForm.get('consignmentNumber')?.setValue(''); // Reset consignment number search field
  //   }
  //   this.updateDropdownOptions(); // Rebuild dropdown options if needed
  // }

  // applyFilter(column: string, value: string) {
  //   this.filterForm.get(column)?.setValue(value); // Set value in the form control
  //   console.log(`Filter applied for ${column}: ${value}`); // Debug log
  
  //   // Get the current selected values for location and department
  //   const selectedLocation = this.filterForm.get('senderLocCode')?.value || null;
  //   const selectedDepartment = this.filterForm.get('senderDepartment')?.value || null;
  
  //   // Apply filtering logic
  //   this.filteredData = this.fullData.filter(item => {
  //     const matchesLocation = selectedLocation ? item.senderLocCode === selectedLocation : true;
  //     const matchesDepartment = selectedDepartment ? item.senderDepartment === selectedDepartment : true;
  //     return matchesLocation && matchesDepartment;
  //   });
  
  //   // Update dropdown options to reflect the latest filtering state
  //   this.updateDropdownOptions(selectedLocation, selectedDepartment);
  
  //   if (column !== 'consignmentNumber') {
  //     this.filterForm.get('consignmentNumber')?.setValue(''); // Reset consignment number search field
  //   }
  // }
  
  // updateDropdownOptions(selectedLocation?: string, selectedDepartment?: string) {
  //   // Filter department options based on the selected location
  //   if (selectedLocation) {
  //     this.allSenderDepartments = [...new Set(
  //       this.fullData
  //         .filter(item => item.senderLocCode === selectedLocation) // Filter by selected location
  //         .map(item => item.senderDepartment)
  //     )].sort();
  //   } else {
  //     // Show all unique sender departments if no location is selected
  //     this.allSenderDepartments = [...new Set(this.fullData.map(item => item.senderDepartment))].sort();
  //   }
  
  //   // Filter location options based on the selected department
  //   if (selectedDepartment) {
  //     this.allSenderLocCodes = [...new Set(
  //       this.fullData
  //         .filter(item => item.senderDepartment === selectedDepartment) // Filter by selected department
  //         .map(item => item.senderLocCode)
  //     )].sort();
  //   } else {
  //     // Show all unique sender locations if no department is selected
  //     this.allSenderLocCodes = [...new Set(this.fullData.map(item => item.senderLocCode))].sort();
  //   }
  // }
  
  sortDatas(column: string, order: 'asc' | 'desc') {
    // Update form fields for sorting
    this.filterForm.patchValue({
      sortBy: column,
      sortOrder: order
    });
  
    // Sorting for senderLocCode
    if (column === 'senderLocCode') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
    // Sorting for senderDepartment
    else if (column === 'senderDepartment') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
          .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
        
        if (locComparison !== 0) {
          return locComparison;
        }
  
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
    // Sorting for senderName
    else if (column === 'senderName') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
          .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
        
        if (locComparison !== 0) {
          return locComparison;
        }
  
        const deptComparison = (a['senderDepartment'] || '').toString().toLowerCase()
          .localeCompare((b['senderDepartment'] || '').toString().toLowerCase());
        if (deptComparison !== 0) {
          return deptComparison;
        }
  
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
    // Sorting for recipientLocCode
    else if (column === 'recipientLocCode') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
    // Sorting for recipientDepartment
    else if (column === 'recipientDepartment') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const locComparison = (a['recipientLocCode'] || '').toString().toLowerCase()
          .localeCompare((b['recipientLocCode'] || '').toString().toLowerCase());
        
        if (locComparison !== 0) {
          return locComparison;
        }
  
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
    // Sorting for recipientName
    else if (column === 'recipientName') {
      this.filteredData = [...this.filteredData].sort((a, b) => {
        const locComparison = (a['recipientLocCode'] || '').toString().toLowerCase()
          .localeCompare((b['recipientLocCode'] || '').toString().toLowerCase());
        
        if (locComparison !== 0) {
          return locComparison;
        }
  
        const deptComparison = (a['recipientDepartment'] || '').toString().toLowerCase()
          .localeCompare((b['recipientDepartment'] || '').toString().toLowerCase());
        if (deptComparison !== 0) {
          return deptComparison;
        }
  
        const valueA = (a[column] || '').toString().toLowerCase();
        const valueB = (b[column] || '').toString().toLowerCase();
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }
  }
  

  applyFilter(column: string, value: string) {
    this.filterForm.get(column)?.setValue(value); // Update the form control value
    console.log(`Filter applied for ${column}: ${value}`); // Debug log
  
    // Get the current selected values for location and department
    const selectedLocation = this.filterForm.get('senderLocCode')?.value || null;
    const selectedDepartment = this.filterForm.get('senderDepartment')?.value || null;
  
    // Apply filtering logic based on selected location and department
    this.filteredData = this.fullData.filter(item => {
      const matchesLocation = selectedLocation ? item.senderLocCode === selectedLocation : true;
      const matchesDepartment = selectedDepartment ? item.senderDepartment === selectedDepartment : true;
      return matchesLocation && matchesDepartment;
    });
  
    // Update dropdown options to reflect the selected location and maintain all locations
    this.updateDropdownOptions(selectedLocation);
  }

  

  updateDropdownOptions(selectedLocation?: string) {
    // Always show all unique locations in the location dropdown
    this.allSenderLocCodes = [...new Set(this.fullData.map(item => item.senderLocCode))].sort();
  
    // Filter department options based on the selected location
    if (selectedLocation) {
      this.allSenderDepartments = [...new Set(
        this.fullData
          .filter(item => item.senderLocCode === selectedLocation) // Filter by selected location
          .map(item => item.senderDepartment)
      )].sort();
    } else {
      // Show all unique departments if no location is selected
      this.allSenderDepartments = [...new Set(this.fullData.map(item => item.senderDepartment))].sort();
    }
  }
  
 
  
  // onDownload() {
  //   const formData = this.filterForm.value;
  //   console.log('Form Data before downloading:', formData);  // Debugging log
  
  //   const { fromDate, toDate, parcelType, senderLocCode, senderDepartment } = formData;
  //   console.log('Download initiated with values:', { fromDate, toDate, parcelType, senderLocCode, senderDepartment });
  
  //   // Call backend service to download the PDF
  //   this.reportsService.getHistoryByDate(
  //     formatDate(fromDate, 'yyyy-MM-dd', 'en-US'),
  //     formatDate(toDate, 'yyyy-MM-dd', 'en-US'),
  //     parcelType,
  //     true, // Export PDF
  //     senderLocCode, // Make sure this value is passed
  //     senderDepartment // And this one
  //   ).subscribe((blob) => {
  //     this.downloadPdf(blob, `dispatch_history_${parcelType}.pdf`);
  //   });
  // }

  // onDownload() {
  //   const formData = this.filterForm.value;
  //   console.log('Form Data before downloading:', formData); // Debugging log
  
  //   const { fromDate, toDate, parcelType, senderLocCode, senderDepartment, consignmentNumber } = formData;
  
  //   console.log('Download initiated with values:', {
  //     fromDate,
  //     toDate,
  //     parcelType,
  //     senderLocCode,
  //     senderDepartment,
  //     consignmentNumber,
  //   });
  
  //   // Call backend service to download the PDF
  //   this.reportsService
  //     .getHistoryByDate(
  //       formatDate(fromDate, 'yyyy-MM-dd', 'en-US'),
  //       formatDate(toDate, 'yyyy-MM-dd', 'en-US'),
  //       parcelType,
  //       true, // Export PDF
  //       senderLocCode, // Include sender location
  //       senderDepartment, // Include sender department
  //       consignmentNumber?.trim() // Include consignment number if present
  //     )
  //     .subscribe(
  //       (blob) => {
  //         this.downloadPdf(blob, `dispatch_history_${parcelType}.pdf`);
  //       },
  //       (error) => {
  //         console.error('Error downloading PDF:', error);
  //       }
  //     );
  // }
  // Function to handle both PDF and Excel download
  onDownload(format: 'pdf' | 'excel'): void {
    const formData = this.filterForm.value;
    const { fromDate, toDate, parcelType, senderLocCode, senderDepartment, searchBy, sortBy, sortOrder } = formData;
  
    console.log('Download initiated with sorting:', { sortBy, sortOrder });
  
    // Validate sorting inputs
    const validSortBy = sortBy || '';
    const validSortOrder = sortOrder || '';
  
    const exportPdf = format === 'pdf';
    const exportExcel = format === 'excel';
  
    this.ioclempservice
      .getHistoryByDate(
        formatDate(fromDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(toDate, 'yyyy-MM-dd', 'en-US'),
        parcelType,
        exportPdf,
        exportExcel,
        senderLocCode?.trim(),
        senderDepartment?.trim(),
        searchBy?.trim(),
        validSortBy,
        validSortOrder
      )
      .subscribe(
        (blob) => {
          if (exportPdf) {
            this.downloadPdf(blob, `dispatch_history_${parcelType}.pdf`);
          } else if (exportExcel) {
            this.downloadExcel(blob, `dispatch_history_${parcelType}.xlsx`);
          }
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
  }
  
  
  
  downloadPdf(blob: Blob, filename: string): void {
    const fileURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  downloadExcel(blob: Blob, filename: string): void {
    const fileURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Toggle the sorting direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set sorting to ascending if a different column is clicked
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort the data based on the column and direction
    this.filteredData.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }

  setDisplayedColumns(parcelType: string) {
    this.displayedColumns = parcelType === 'in'
      ? ['senderLocCode', 'senderDepartment', 'senderName', 'recipientDepartment', 'recipientName', 'courierName', 'consignmentDate', 'consignmentNumber', 'createdDate']
      : ['senderDepartment', 'senderName', 'recipientLocCode','recipientDepartment', 'recipientName', 'consignmentDate', 'consignmentNumber', 'courierName','weight','distance','createdDate'];
  }
}





