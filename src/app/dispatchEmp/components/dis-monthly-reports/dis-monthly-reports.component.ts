import { NgIf, NgFor, JsonPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
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
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-dis-monthly-reports',
  standalone: true,
  imports: [
    MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor,
    FormsModule, 
    ReactiveFormsModule,
    MatTableModule,
    JsonPipe,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './dis-monthly-reports.component.html',
  styleUrl: './dis-monthly-reports.component.css'
})
export class DisMonthlyReportsComponent {
  filterForm!: FormGroup;
  filteredData: any[] = [];
  displayedColumns: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private reportsService:ReportsService,
    private datePipe: DatePipe // Inject DatePipe into the constructor
  ) {
    this.filterForm = this.fb.group({
      // fromDate: [''],
      // toDate: [''],
      parcelType: ['']
    });
  }

  onSubmit() {
    const formData = this.filterForm.value;

    // Format dates to 'yyyy-MM-dd' format
   // const fromDate = this.datePipe.transform(formData.fromDate, 'yyyy-MM-dd')!;
    //const toDate = this.datePipe.transform(formData.toDate, 'yyyy-MM-dd')!;

    this. reportsService.getDisHistoryByMonthly(formData.parcelType)
      .subscribe(
        data => {
          this.filteredData = data;
          this.setDisplayedColumns(formData.parcelType);
        },
        error => {
          console.error('Error fetching dispatch history:', error);
        }
      );
  }

  private setDisplayedColumns(parcelType: string) {
    if (parcelType === 'in') {
      this.displayedColumns = ['senderLocCode', 'senderName','senderDepartment', 'recipientName', 'recipientDepartment','courierName','recordStatus','receivedDate','consignmentDate','createdDate'];
    } else if (parcelType === 'out') {
      this.displayedColumns = ['senderName','senderDepartment', 'recipientLocCode', 'recipientName','recipientDepartment','courierName', 'weight', 'unit','recordStatus','consignmentDate', 'createdDate'];
    }
  }
}


