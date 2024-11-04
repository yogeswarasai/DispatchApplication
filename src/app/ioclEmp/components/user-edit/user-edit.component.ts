import { Component } from '@angular/core';
import { MstUserDTO } from '../../../model/mstUserDto';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MstUser } from '../../../model/mstUser';
import { MstUserService } from '../../../services/mst-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
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
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  editForm!: FormGroup;
  userData!:MstUser ;
  isDisabled:boolean=true;

  constructor(
    private mstUserService:MstUserService,
    private fb: FormBuilder,
    private router:Router,
    private snackBar:MatSnackBar
    
  ) { }

  ngOnInit() {
    this.userData = this.mstUserService.getUserData();

    this.editForm = this.fb.group({
      locCode: [{ value: this.userData.locCode, disabled: true },Validators.required],
      userId: [{ value: this.userData.userId, disabled: true },Validators.required],
      userName:[this.userData.userName,Validators.required],
      mobileNumber: [this.userData.mobileNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
      roleId: [this.userData.roleId,Validators.required],
    });
  }

  // onSubmit() {
  //   if (this.editForm.invalid) {
  //     this.markAllAsTouched(); // Optional: Mark all fields as touched to show validation errors
  //     return;
  //   }
  
  //   const updatedData = this.editForm.value;
  
  //   // Assuming recipientLocCode and inTrackingId are part of the parcelData
  //   const empLocCode = this.userData.locCode.trim();
  //   const empUserId = this.userData.userId;
  
  //   this.mstUserService.updateUser(empLocCode,empUserId , updatedData).subscribe(
  //     response => {
  //       this.handleSuccess(response); // Handle success response
  //     },
  //     error => {
  //       this.handleError(error); // Handle error response
  //     }
  //   );
  // }

  onSubmit() {
    if (this.editForm.invalid) {
      this.markAllAsTouched(); // Optional: Mark all fields as touched to show validation errors
      return;
    }
  
    const updatedData = this.editForm.value;
  
    // Extract the locCode inside the brackets if locCode includes a formatted name
    let empLocCode = this.userData.locCode.trim();
    const locCodeMatch = empLocCode.match(/\(([^)]+)\)/); // Regex to extract the code inside parentheses
    if (locCodeMatch) {
      empLocCode = locCodeMatch[1]; // Get the value inside the parentheses
    }
  
    empLocCode = empLocCode.trim(); // Ensure no extra spaces in locCode
    const empUserId = this.userData.userId;
  
    this.mstUserService.updateUser(empLocCode, empUserId, updatedData).subscribe(
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
  handleSuccess(response: any) {
    // Optionally show a success message
    console.log('Update successful', response);
    this.snackBar.open('user updated successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    
    // Navigate to another page or display a success message
    this.router.navigate(['/ioclEmployee/loc-admin']); // Redirect on success
    
    // Optionally clear the shared data
    this.mstUserService.clearUserData(); // Clear the data after successful update
  }
  handleError(error: any) {
    // Optionally show an error message
    console.error('Update failed', error);
    
    // Display user-friendly error message (optional)
    alert('Failed to update the record. Please try again later.');
  }
  onClose(): void {
    this.router.navigate(['/ioclEmployee/loc-admin']);
  }
    
}

