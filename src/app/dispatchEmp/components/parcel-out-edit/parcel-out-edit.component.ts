import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrnParcelOutService } from '../../../services/trn-parcel-out.service';
import { HistoryService } from '../../../services/history.service';
import { TrnParcelOut } from '../../../model/trnParcelOut';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';  // Import formatDate

@Component({
  selector: 'app-parcel-out-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './parcel-out-edit.component.html',
  styleUrl: './parcel-out-edit.component.css'
})
export class ParcelOutEditComponent {
  editForm!: FormGroup;
  parcelData!: TrnParcelOut;
  showCard: boolean = true; // Controls the visibility of the mat-card

  constructor(
    private historyService: HistoryService,
    private parcelOutService: TrnParcelOutService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit() {
    this.parcelData = this.historyService.getParcelData();

    this.editForm = this.fb.group({
      consignmentNumber: [this.parcelData.consignmentNumber, Validators.required],
      consignmentDate: [this.parcelData.consignmentDate, Validators.required],
      senderDepartment: [this.parcelData.senderDepartment, Validators.required],
      senderName: [this.parcelData.senderName, Validators.required],
      recipientLocCode: [this.parcelData.recipientLocCode, Validators.required],
      recipientDepartment: [this.parcelData.recipientDepartment, Validators.required],
      recipientName: [this.parcelData.recipientName, Validators.required],
      courierName: [this.parcelData.courierName,Validators.required],
      weight: [this.parcelData.weight, Validators.required],
      unit: [this.parcelData.unit, Validators.required],
       createdDate: [this.parcelData.createdDate, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    //const updatedData = this.editForm.value;
    const formValues = this.editForm.value;
    const updatedData = {
      ...formValues,
      createdDate: formatDate(formValues.createdDate, 'yyyy-MM-dd', 'en-US'),  // Adjust format if needed
      recipientLocCode: this.extractLocCode(formValues.recipientLocCode) // Handle undefined by providing a fallback empty string

    };
    const senderLocCode = this.parcelData.senderLocCode.trim();
    const outTrackingId = this.parcelData.outTrackingId; // Assuming you have a trackingId field in the parcelData

    this.parcelOutService.updateParcelOut(senderLocCode, outTrackingId, updatedData).subscribe(
      response => {
        this.handleSuccess(response);
      },
      error => {
        this.handleError(error);
      }
    );
  }


  extractLocCode(locCodeString: string): string {
    const locCodeMatch = locCodeString.match(/\((\d+)\)/); // Extract digits inside parentheses
    return locCodeMatch ? locCodeMatch[1] : locCodeString.trim(); // Return locCode or original value if no match
  }
  
  markAllAsTouched() {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  handleSuccess(response: any) {
    console.log('Update successful', response);
    this.snackBar.open('Parcel updated successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    this.router.navigate(['/dispatchEmployee/history']);
    this.historyService.clearParcelData();
  }

  handleError(error: any) {
    console.error('Update failed', error);
    alert('Failed to update the record. Please try again later.');
  }
  // onClose(): void {
  //   this.dialogRef.close(); // Closes the dialog
  // }
  onClose(): void {
    this.router.navigate(['/dispatchEmployee/history']);
  }

}
