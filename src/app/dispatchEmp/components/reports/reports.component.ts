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
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor,
    MatTableModule,
    JsonPipe,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  filterForm!: FormGroup;
  filteredData: any[] = [];
  displayedColumns: string[] = [];
  isDownloadVisible: boolean = false; // Flag to control the visibility of the download button
  isFiltered: boolean = false;


  constructor(private fb: FormBuilder, private reportsService: ReportsService) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      parcelType: ['']
    });
  }

  // onSubmit() {
  //   const formData = this.filterForm.value;
  //   const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
  //   const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');

  //   this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType)
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

  // onSubmit() {
  //   const formData = this.filterForm.value;
  //   const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
  //   const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
  
  //   this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType)
  //     .subscribe(
  //       data => {
  //         this.filteredData = data;
  //         this.setDisplayedColumns(formData.parcelType);
  //         this.isFiltered = true;  // Mark as filtered
  //         this.isDownloadVisible = true; // Enable the download button
  //         console.log("Download Visible:", this.isDownloadVisible); // Debug line
  //       },
  //       error => {
  //         console.error('Error fetching dispatch history:', error);
  //         this.filteredData = [];
  //         this.isFiltered = true;
  //         this.isDownloadVisible = false; // Disable the download button on error
  //         console.log("Download Visible (on error):", this.isDownloadVisible); // Debug line
  //       }
  //     );
  // }
  
  // onDownload() {
  //   const formData = this.filterForm.value;
  //   const fromDate = formatDate(formData.fromDate, 'yyyy-MM-dd', 'en-US');
  //   const toDate = formatDate(formData.toDate, 'yyyy-MM-dd', 'en-US');
  
  //   this.reportsService.getHistoryByDate(fromDate, toDate, formData.parcelType, true)
  //     .subscribe(
  //       blob => {
  //         this.reportsService.downloadPdf(blob, `dispatch_history_${formData.parcelType}.pdf`);
  //       },
  //       error => {
  //         console.error('Error downloading PDF:', error);
  //       }
  //     );
  // }
  
  // private setDisplayedColumns(parcelType: string) {
  //   if (parcelType === 'in') {
  //     this.displayedColumns = ['SenderLocation','SenderDepartment', 'SenderName','RecipientDepartment', 'RecipientName', 'consignmentDateTime','ConsignmentNumber','courierName','EntryDateTime'];
  //   } else if (parcelType === 'out') {
  //     this.displayedColumns = ['senderName','senderDepartment', 'recipientLocCode', 'recipientName','recipientDepartment', 'weight', 'unit','distance','courierName','recordStatus','consignmentDate','createdDate'];
  //   }
  // }
}
