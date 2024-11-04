import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DisEmpVerOtpComponent } from '../../../login/components/dis-emp-ver-otp/dis-emp-ver-otp.component';
import { DisEmpVerOtpService } from '../../../login/services/dis-emp-ver-otp.service';
import { HomeService } from '../../../services/home.service';
import { formatDate } from '@angular/common'; // Import for formatting date
import { ParcelTotals } from '../../../model/parcelTotals';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { TrnParcelInService } from '../../services/trn-parcel-in.service';
import { TrnParcelOutService } from '../../../services/trn-parcel-out.service';
import { TrnParcelIn } from '../../../model/trnParcelIn';
import { TrnParcelOut } from '../../../model/trnParcelOut';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HistoryService } from '../../../services/history.service';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parcel-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    NgFor,
    MatToolbarModule,
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule, NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './parcel-edit.component.html',
  styleUrl: './parcel-edit.component.css'
})
export class ParcelEditComponent {
  editForm!: FormGroup;
  parcelData!: TrnParcelIn;

  constructor(
    private historyService:HistoryService ,
    private parcelInService:TrnParcelInService,
    private fb: FormBuilder,
    private router:Router,
    private snackBar:MatSnackBar
    
  ) { }

  ngOnInit() {
    this.parcelData = this.historyService.getParcelData();

    this.editForm = this.fb.group({
      consignmentNumber: [this.parcelData.consignmentNumber,Validators.required],
      consignmentDate: [this.parcelData.consignmentDate,Validators.required],
      receivedDate: [this.parcelData.receivedDate,Validators.required],
      senderLocCode: [this.parcelData.senderLocCode,Validators.required],
      senderDepartment: [this.parcelData.senderDepartment,Validators.required],
      senderName: [this.parcelData.senderName,Validators.required],
      recipientDepartment: [this.parcelData.recipientDepartment,Validators.required],
      recipientName: [this.parcelData.recipientName,Validators.required],
      courierName: [this.parcelData.courierName,Validators.required],
       createdDate: [this.parcelData.createdDate,Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.markAllAsTouched(); // Optional: Mark all fields as touched to show validation errors
      return;
    }
  
    // const updatedData = this.editForm.value;
  
     // Extract form values and convert dates if needed
  const formValues = this.editForm.value;
  const updatedData = {
    ...formValues,
    consignmentDate: formatDate(formValues.consignmentDate, 'yyyy-MM-dd', 'en-US'),
    receivedDate: formatDate(formValues.receivedDate, 'yyyy-MM-dd', 'en-US'),
    createdDate: formatDate(formValues.createdDate, 'yyyy-MM-dd', 'en-US'),
    senderLocCode: this.extractLocCode(formValues.senderLocCode) // Extract locCode from the string

  };
    // Assuming recipientLocCode and inTrackingId are part of the parcelData
    const recipientLocCode = this.parcelData.recipientLocCode.trim();
    const inTrackingId = this.parcelData.inTrackingId;
  
    this.parcelInService.updateParcelIn(recipientLocCode, inTrackingId, updatedData).subscribe(
      response => {
        this.handleSuccess(response); // Handle success response
      },
      error => {
        this.handleError(error); // Handle error response
      }
    );
  }
  
  markAllAsTouched() {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  extractLocCode(locCodeString: string): string {
    const locCodeMatch = locCodeString.match(/\((\d+)\)/); // Extract digits inside parentheses
    return locCodeMatch ? locCodeMatch[1] : locCodeString.trim(); // Return locCode or the original value if no match
  }
  handleSuccess(response: any) {
    // Optionally show a success message
    console.log('Update successful', response);
    this.snackBar.open('Parcel updated successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    
    // Navigate to another page or display a success message
    this.router.navigate(['/dispatchEmployee/history']); // Redirect on success
    
    // Optionally clear the shared data
    this.historyService.clearParcelData(); // Clear the data after successful update
  }
  handleError(error: any) {
    // Optionally show an error message
    console.error('Update failed', error);
    
    // Display user-friendly error message (optional)
    alert('Failed to update the record. Please try again later.');
  }
  onClose(): void {
    this.router.navigate(['/dispatchEmployee/history']);
  }
    
}
