import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MstUser } from '../../../model/mstUser';
import { MstUserService } from '../../../services/mst-user.service';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';

@Component({
  selector: 'app-dis-user-edit',
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
  templateUrl: './dis-user-edit.component.html',
  styleUrl: './dis-user-edit.component.css'
})
export class DisUserEditComponent
{
  editForm!: FormGroup;
  userData!:MstUser ;
  isDisabled:boolean=true;
  empRoles:string[]=[];

  constructor(
    private mstUserService:MstUserService,
    private fb: FormBuilder,
    private router:Router,
    private snackBar:MatSnackBar,
    private ioclEmpServcie:IoclEmpServiceService
    
  ) { }

  
loadRoles():void{
  this.ioclEmpServcie.getRoles().subscribe(roles =>{
    this.empRoles=roles;
  }
  )
}

  ngOnInit() {
    this.userData = this.mstUserService.getUserData();

    this.editForm = this.fb.group({
      //locCode: [{ value: this.userData.locCode, disabled: true },Validators.required],
      userId: [{ value: this.userData.userId, disabled: true },Validators.required],
      userName:[this.userData.userName,Validators.required],
      mobileNumber: [this.userData.mobileNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
      roleId: [{value:this.userData.roleId, disabled: true },Validators.required],
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.markAllAsTouched(); // Optional: Mark all fields as touched to show validation errors
      return;
    }
  
    const updatedData = this.editForm.value;
  
    // Assuming recipientLocCode and inTrackingId are part of the parcelData
    const empLocCode = this.ioclEmpServcie.getEmpData().locCode.trim();
    const empUserId = this.userData.userId;
  
    this.mstUserService.updateUser(empLocCode,empUserId , updatedData).subscribe(
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
    // const roleId = this.userData.roleId;
    // if (roleId === 'locAdmin') {
    //   this.router.navigate(['/ioclEmployee/loc-admin']);
    // } else {
    //   this.router.navigate(['/ioclEmployee/dispatch']);
    // }

    
    this.router.navigate(['/ioclEmployee/dispatch']); // Redirect on success
    
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
    this.router.navigate(['/ioclEmployee/dispatch']);
  }
    
}
