import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe, formatDate, JsonPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReportsService } from '../../../services/reports.service';
import { TrnParcelIn } from '../../../model/trnParcelIn';
import { TrnParcelInService } from '../../services/trn-parcel-in.service';
import { error } from 'node:console';


interface DispatchData {
  senderLocCode: string;
  senderDepartment: string;
  senderName: string;
  recipientLocCode: string;
  recipientDepartment: string;
  recipientName:string;
  courierName:string;
  consignmentDate:Date;
  consignmentNumber:string;
  createdDate:Date;
  [key: string]: any; // Use this for additional dynamic fields if needed
}




@Component({
  selector: 'app-dispatch-details',
  standalone: true,
  imports: [  MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor,
    MatTableModule,
    JsonPipe,
    ReactiveFormsModule,
    DatePipe,
    TitleCasePipe],
  templateUrl: './dispatch-details.component.html',
  styleUrl: './dispatch-details.component.css'
})
// export class DispatchDetailsComponent {
//   filterForm!: FormGroup;
//   filteredData: any[] = [];
//   displayedColumns: string[] = [];
//   isDownloadVisible: boolean = false; // Flag to control the visibility of the download button
//   isFiltered: boolean = false;



//   constructor(private fb: FormBuilder, private reportsService: ReportsService) {
//     this.filterForm = this.fb.group({
//       fromDate: [''],
//       toDate: [''],
//       parcelType: ['']
//     });
//   }

  
//   onSubmit() {
//     const formData = this.filterForm.value;
//     const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
//     const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
  
//     this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType)
//       .subscribe(
//         data => {
//           this.filteredData = data;
//           this.setDisplayedColumns(formData.parcelType);
//           this.isFiltered = true;  
//           this.isDownloadVisible = true;
//           console.log("Download Visible:", this.isDownloadVisible); 
//         },
//         error => {
//           console.error('Error fetching dispatch history:', error);
//           this.filteredData = [];
//           this.isFiltered = true;
//           this.isDownloadVisible = false; 
//           console.log("Download Visible (on error):", this.isDownloadVisible);
//         }
//       );
//   }
  
//   onDownload() {
//     const formData = this.filterForm.value;
//     const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
//     const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
  
//     this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType, true)
//       .subscribe(
//         blob => {
//           this.reportsService.downloadPdf(blob, `dispatch_history_${formData.parcelType}.pdf`);
//         },
//         error => {
//           console.error('Error downloading PDF:', error);
//         }
//       );
//   }
  

//   private setDisplayedColumns(parcelType: string) {
//     if (parcelType === 'in') {
//       this.displayedColumns = ['senderLocCode','senderDepartment', 'senderName','recipientDepartment', 'recipientName','courierName','consignmentDate','consignmentNumber','createdDate'];
//     } else if (parcelType === 'out') {
//       this.displayedColumns = ['senderName','senderDepartment', 'recipientLocCode', 'recipientName','recipientDepartment', 'weight', 'unit','distance','courierName','recordStatus','consignmentDate','createdDate'];
//     }
//   }
// }
export class DispatchDetailsComponent {
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
    private reportsService: ReportsService,
    private parcelinservice: TrnParcelInService
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

// onSubmit() {
//   const formData = this.filterForm.value;
//   console.log('Form Data:', formData); // Log the form data to see the values

//   // Format the date values for comparison
//   const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
//   const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
//   console.log('Formatted fromDate:', fromDate); // Log formatted fromDate
//   console.log('Formatted toDate:', toDate); // Log formatted toDate

//   // Call the service to fetch data
//   this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType, false).subscribe(
//     (data) => {
//       console.log('Fetched Data:', data); // Log the data fetched from the API

//       // Update the full data and filtered data
//       this.fullData = data;
//       this.filteredData = [...data];

//       console.log('Filtered Data:', this.filteredData); // Log the filtered data

//       // Update dropdown options if applicable
//       this.updateDropdownOptions();
//       this.filterForm.patchValue({ searchBy: '' });


//       // Update columns based on the parcel type
//       this.setDisplayedColumns(formData.parcelType);
//       console.log('Displayed Columns:', this.displayedColumns); // Log the displayed columns

//       // Set the filtered status and show download button
//       this.isFiltered = true;
//       this.isDownloadVisible = true;
//     },
//     (error) => {
//       console.error('Error fetching dispatch history:', error);

//       // Handle error and reset data
//       this.filteredData = [];
//       this.isFiltered = true;
//       this.isDownloadVisible = false;
//       this.filterForm.patchValue({ searchBy: '' });
//     }
//   );
// }

onSubmit() {
  const formData = this.filterForm.value;
  console.log('Form Data Submitted:', formData); // Debugging log for form data

  // Format dates for API compatibility
  const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
  const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
  console.log('Formatted Dates:', { fromDate, toDate });

  // Fetch data using the reports service
  this.reportsService
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


  
  // sortDatas(column: string, order: 'asc' | 'desc') {
  //   // Update form fields for sorting
  //   this.filterForm.patchValue({
  //     sortBy: column,
  //     sortOrder: order
  //   });
  
  //   if (column === 'senderLocCode') {
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       const valueA = (a[column] || '').toString().toLowerCase();
  //       const valueB = (b[column] || '').toString().toLowerCase();
  //       return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  //     });
  //   } else if (column === 'senderDepartment') {
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
        
  //       if (locComparison !== 0) {
  //         return locComparison;
  //       }
  
  //       const valueA = (a[column] || '').toString().toLowerCase();
  //       const valueB = (b[column] || '').toString().toLowerCase();
  //       return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  //     });
  //   } else if (column === 'senderName') {
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
        
  //       if (locComparison !== 0) {
  //         return locComparison;
  //       }
  
  //       const deptComparison = (a['senderDepartment'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderDepartment'] || '').toString().toLowerCase());
  //       if (deptComparison !== 0) {
  //         return deptComparison;
  //       }
  
  //       const valueA = (a[column] || '').toString().toLowerCase();
  //       const valueB = (b[column] || '').toString().toLowerCase();
  //       return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  //     });
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
  
  
  
  // sortDatas(column: string, order: 'asc' | 'desc') {
  //   if (column === 'senderLocCode') {
  //     // Sort only by location
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       const valueA = (a['senderLocCode'] || '').toString().toLowerCase();
  //       const valueB = (b['senderLocCode'] || '').toString().toLowerCase();
  //       return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  //     });
  //   } else if (column === 'senderDepartment') {
  //     // Sort departments within the currently sorted location groups
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       // Preserve current location sorting
  //       const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
  //       if (locComparison !== 0) return locComparison;
  
  //       // Sort departments within each location
  //       const deptA = (a['senderDepartment'] || '').toString().toLowerCase();
  //       const deptB = (b['senderDepartment'] || '').toString().toLowerCase();
  //       return order === 'asc' ? deptA.localeCompare(deptB) : deptB.localeCompare(deptA);
  //     });
  //   } else if (column === 'senderName') {
  //     // Sort names within the currently sorted department and location groups
  //     this.filteredData = [...this.filteredData].sort((a, b) => {
  //       // Maintain location grouping
  //       const locComparison = (a['senderLocCode'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderLocCode'] || '').toString().toLowerCase());
  //       if (locComparison !== 0) return locComparison;
  
  //       // Maintain department grouping within the same location
  //       const deptComparison = (a['senderDepartment'] || '').toString().toLowerCase()
  //         .localeCompare((b['senderDepartment'] || '').toString().toLowerCase());
  //       if (deptComparison !== 0) return deptComparison;
  
  //       // Sort by sender name within the same department and location
  //       const nameA = (a['senderName'] || '').toString().toLowerCase();
  //       const nameB = (b['senderName'] || '').toString().toLowerCase();
  //       return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  //     });
  //   }
  // }
  

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
  
 
  
  // onDownload(format: "pdf" | "excel"): void {
  //   const formData = this.filterForm.value;  // Assuming you're using a form for inputs
  //   console.log('Form Data before downloading:', formData);  // Debugging log
  
  //   const { fromDate, toDate, parcelType, senderLocCode, senderDepartment, searchBy } = formData;
  
  //   console.log('Download initiated with values:', {
  //     fromDate,
  //     toDate,
  //     parcelType,
  //     senderLocCode,
  //     senderDepartment,
  //     searchBy,
  //   });
  
  //   // Set the export flags based on the selected format
  //   const exportPdf = format === 'pdf';
  //   const exportExcel = format === 'excel';
  
  //   // Call the backend service to get the data (PDF/Excel)
  //   this.reportsService
  //     .getHistoryByDate(
  //       formatDate(fromDate, 'yyyy-MM-dd', 'en-US'),  // Format date for API
  //       formatDate(toDate, 'yyyy-MM-dd', 'en-US'),    // Format date for API
  //       parcelType,
  //       exportPdf,  // Export PDF flag
  //       exportExcel, // Export Excel flag
  //       senderLocCode, // Sender location
  //       senderDepartment, // Sender department
  //       searchBy?.trim() // Consignment number (if present)
  //     )
  //     .subscribe(
  //       (blob) => {
  //         // If PDF is selected
  //         if (exportPdf) {
  //           this.downloadPdf(blob, `dispatch_history_${parcelType}.pdf`);
  //         }
  //         // If Excel is selected
  //         else if (exportExcel) {
  //           this.downloadExcel(blob, `dispatch_history_${parcelType}.xlsx`);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error downloading file:', error);
  //       }
  //     );
  // }
  

  // onDownload(format: 'pdf' | 'excel'): void {
  //   const formData = this.filterForm.value; // Get form data
  //   console.log('Form Data before downloading:', formData); // Debugging log
  
  //   const {
  //     fromDate,
  //     toDate,
  //     parcelType,
  //     senderLocCode,
  //     senderDepartment,
  //     searchBy,
  //     sortBy,
  //     sortOrder,
  //   } = formData;
  
  //   console.log('Download initiated with values:', {
  //     fromDate,
  //     toDate,
  //     parcelType,
  //     senderLocCode,
  //     senderDepartment,
  //     searchBy,
  //     sortBy,
  //     sortOrder,
  //   });
  
  //   // Validate sorting inputs (apply defaults if missing)
  //   const validSortBy = sortBy || ''; // If no sortBy provided, use an empty string to indicate no sorting
  //   const validSortOrder = sortOrder || ''; // If no sortOrder provided, use an empty string to indicate no sorting
  
  //   // Set the export flags based on the selected format
  //   const exportPdf = format === 'pdf';
  //   const exportExcel = format === 'excel';
  
  //   // Call the backend service to get the data (PDF/Excel) with sorting (if any)
  //   this.reportsService
  //     .getHistoryByDate(
  //       formatDate(fromDate, 'yyyy-MM-dd', 'en-US'), // Format date for API
  //       formatDate(toDate, 'yyyy-MM-dd', 'en-US'), // Format date for API
  //       parcelType,
  //       exportPdf, // Export PDF flag
  //       exportExcel, // Export Excel flag
  //       senderLocCode?.trim(), // Sender location (trimmed)
  //       senderDepartment?.trim(), // Sender department (trimmed)
  //       searchBy?.trim(), // Consignment number (if present, trimmed)
  //       validSortBy, // Sorting field (can be empty)
  //       validSortOrder // Sorting order (can be empty)
  //     )
  //     .subscribe(
  //       (blob) => {
  //         // If PDF is selected
  //         if (exportPdf) {
  //           this.downloadPdf(blob, `dispatch_history_${parcelType}.pdf`);
  //         }
  //         // If Excel is selected
  //         else if (exportExcel) {
  //           this.downloadExcel(blob, `dispatch_history_${parcelType}.xlsx`);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error downloading file:', error);
  //       }
  //     );
  // }
  onDownload(format: 'pdf' | 'excel'): void {
    const formData = this.filterForm.value;
    const { fromDate, toDate, parcelType, senderLocCode, senderDepartment, searchBy, sortBy, sortOrder } = formData;
  
    console.log('Download initiated with sorting:', { sortBy, sortOrder });
  
    // Validate sorting inputs
    const validSortBy = sortBy || '';
    const validSortOrder = sortOrder || '';
  
    const exportPdf = format === 'pdf';
    const exportExcel = format === 'excel';
  
    this.reportsService
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
