// import { NgIf, NgFor, JsonPipe, DatePipe, TitleCasePipe, formatDate } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTableModule } from '@angular/material/table';
// import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';

// @Component({
//   selector: 'app-emp-reports',
//   standalone: true,
//   imports: [
//     MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
//     MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
//     MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor,
//     FormsModule, 
//     ReactiveFormsModule,
//     MatTableModule,
//     JsonPipe,
//     DatePipe,
//     TitleCasePipe
//   ],
//   templateUrl: './emp-reports.component.html',
//   styleUrl: './emp-reports.component.css'
// })
// export class EmpReportsComponent {
//   filterForm!: FormGroup;
//   filteredData: any[] = [];
//   displayedColumns: string[] = [];

//   constructor(private fb: FormBuilder, private ioclService:IoclEmpServiceService) {
//     this.filterForm = this.fb.group({
//       fromDate: [''],
//       toDate: [''],
//       parcelType: ['']
//     });
//   }

//   onSubmit() {
//     const formData = this.filterForm.value;
//     // const fromDate = formatDate(formData.fromDate, 'DD-MM-YYYY', 'en-US');
//     // const toDate = formatDate(formData.toDate, 'DD-MM-YYYY', 'en-US');

//     const fromDate = this.datePipe.transform(formData.fromDate, 'dd-MM-yyyy');
//     const toDate = this.datePipe.transform(formData.toDate, 'dd-MM-yyyy');


//     this.ioclService.getHistoryByDate(fromDate, toDate, formData.parcelType)
//       .subscribe(
//         data => {
//           this.filteredData = data;
//           this.setDisplayedColumns(formData.parcelType);
//         },
//         error => {
//           console.error('Error fetching dispatch history:', error);
//         }
//       );
//   }

//   private setDisplayedColumns(parcelType: string) {
//     if (parcelType === 'in') {
//       this.displayedColumns = ['senderLocCode', 'senderName','senderDepartment', 'recipientName', 'recipientDepartment','recordStatus','receivedDate','createdDate'];
//     } else if (parcelType === 'out') {
//       this.displayedColumns = ['senderName','senderDepartment', 'recipientLocCode', 'recipientName','recipientDepartment', 'weight', 'unit','recordStatus', 'createdDate'];
//     }
//   }

// }
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
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';

@Component({
  selector: 'app-emp-reports',
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
  providers: [DatePipe],
  templateUrl: './emp-reports.component.html',
  styleUrls: ['./emp-reports.component.css']
})
export class EmpReportsComponent {
  filterForm!: FormGroup;
  filteredData: any[] = [];
  displayedColumns: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private ioclService: IoclEmpServiceService,
    private datePipe: DatePipe // Inject DatePipe into the constructor
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      parcelType: ['']
    });
  }

  onSubmit() {
    const formData = this.filterForm.value;

    // Format dates to 'yyyy-MM-dd' format
    const fromDate = this.datePipe.transform(formData.fromDate, 'yyyy-MM-dd')!;
    const toDate = this.datePipe.transform(formData.toDate, 'yyyy-MM-dd')!;

    this.ioclService.getHistoryByDate(fromDate, toDate, formData.parcelType)
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
