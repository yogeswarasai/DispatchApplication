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
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MstUserService } from '../../../services/mst-user.service';
import { map, Observable, of, startWith } from 'rxjs';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MstLocationService } from '../../../services/mst-location.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-dis-user',
  standalone: true,
  imports: [
    CommonModule,
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
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './add-dis-user.component.html',
  styleUrl: './add-dis-user.component.css'
})
export class AddDisUserComponent 
  {
    userForm!: FormGroup;
    filteredLocationCodes: Observable<string[]> = of([]);
    filteredEmployeeCodes: Observable<string[]> = of([]);
    filteredUserNames: Observable<string[]> = of([]);
    empRoles:string[]=[];
    locationCodes: string[] = []; // Populate this with your location codes
    empCodes: string[] = []; // Populate this with your sender codes
    empName: string = ''; // Populate this with your recipient codes
    hide = false;

    mobileNumberExists = false;  // Flag to indicate if the mobile number exists

    constructor(
      private fb: FormBuilder,
      private mstUserService: MstUserService,
      private ioclEmpService: IoclEmpServiceService,
      private mstLocationService:MstLocationService,
      private snackBar:MatSnackBar,
      private router:Router
    ) {
      this.userForm = this.fb.group({
        // locCode: ['', Validators.required],
        userId: ['', Validators.required],
        userName: ['', Validators.required],
        mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$'),Validators.minLength(10),Validators.maxLength(10) ]],
        roleId: ['', Validators.required],
        password:['', Validators.required]

      });
    }
    
    ngOnInit(): void {
    
     
      this.loadRoles();
      this.loadUserIdByLocCodes();
    
     
    
      this.userForm.get('userId')?.valueChanges.subscribe((userId) => {
        if (userId) {
          this.loadUserNamesByUserId();
        } else {
          this.empName = ''; // Clear the names if locCode is empty
        }
      });
    
    
      this.filteredEmployeeCodes = this.userForm.get('userId')?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterEmployeeCodes(value))
      ) ?? of([]);
    
      
    }
    
    
    loadUserIdByLocCodes():void{

       
        this.ioclEmpService.getEmpCodesBylogUserLocCode().subscribe({
          
          next: (response) => {
            console.log('Full Response:', response);
           this.empCodes = response;
            console.log('Received location Codes:', this.empCodes);
          },
          error: (err) => {
            console.error('Failed to load loaction codes:', err);
          }
        });
        
      }
    
    
  
    loadUserNamesByUserId(): void {
      const empCode = this.userForm.get('userId')?.value;
      console.log('user id:', empCode); // Debugging
      if (empCode) {
        const userId = empCode;  // Extract the locName from senderLocCode
        console.log("userId:",userId);
       
        this.ioclEmpService.getUserNameByUserId(userId).subscribe({
          
          next: (response) => {
            console.log('Full Response:', response);
           this.empName = response;
            console.log('Received user Names:', this.empName);
          },
          error: (err) => {
            console.error('Failed to user names:', err);
          }
        });
        
      }
    }
    
    
    loadRoles():void{
      this.ioclEmpService.getRoles().subscribe(roles =>{
        this.empRoles=roles;
      }
      )
    }
    
    // filterLocationCodes(value: string): string[] {
    //   if (value.trim() === '') {
    //     return []; // No suggestions when input is empty
    //   }
    //   const filterValue = value.toLowerCase();
    //   return this.locationCodes.filter(locCode => locCode.toLowerCase().includes(filterValue));
    // }
    
    filterEmployeeCodes(value: string): string[]{
      if (value.trim() === '') {
        return []; // No suggestions when input is empty
      }
      const filterValue = value.toLowerCase();
      return this.empCodes.filter(empCode=> empCode.toLowerCase().includes(filterValue));
    }
    
   
    // onSubmit(): void {
    //   if (this.userForm.invalid) {
    //     this.snackBar.open('Please fill all required fields.', 'Close', {
    //       duration: 3000,
    //       verticalPosition: 'top'
    //     });
    //     const user = this.userForm.value;
    //     console.log('user  Data:', user);
    //     return;
    //   }
    
    //   const user = this.userForm.value;
    
    //   this.mstUserService.createLocAdmin(user).subscribe({
    //     next: (response) => {
    //       this.snackBar.open('user submitted successfully!', 'Close', {
    //         duration: 3000,
    //         verticalPosition: 'top'
    //       });
    //       console.log('user  Data:', user);
    //       // this.parcelInForm.reset();
    //       this.userForm.markAsPristine();
    //       this.userForm.markAsUntouched();
    //        this.userForm.reset();
    //        this.router.navigate(['/ioclEmployee/dispatch']); // Redirect to history after save
    //     },
    //     error: (err) => {
    //       this.snackBar.open('Failed to submit user. Please try again.', 'Close', {
    //         duration: 3000,
    //         verticalPosition: 'top'
    //       });
    //       const user = this.userForm.value;
    //     console.log('user  Data:', user);
    //     }
    //   });
    // }

    onSubmit(): void {
      if (this.userForm.invalid) {
        this.snackBar.open('Please fill all required fields.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }
    
      const user = this.userForm.value;
    
      // Check if the mobile number already exists before proceeding
      this.mstUserService.checkMobileNumber(user.mobileNumber).subscribe({
        next: (exists: boolean) => {
          if (exists) {
            // Set the custom error for mobileNumberExists
            this.userForm.get('mobileNumber')?.setErrors({ mobileNumberExists: true });
    
            // Show error message using snackBar
            this.snackBar.open('Mobile number already exists. Please use a different number.', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          } else {
            // Clear any previous errors for mobile number
            this.userForm.get('mobileNumber')?.setErrors(null);
    
            // Proceed with the user creation process
            this.mstUserService.createLocAdmin(user).subscribe({
              next: (response) => {
                this.snackBar.open('User submitted successfully!', 'Close', {
                  duration: 3000,
                  verticalPosition: 'top'
                });
                console.log('User Data:', user);
                this.userForm.markAsPristine();
                this.userForm.markAsUntouched();
                this.userForm.reset();
                this.router.navigate(['/ioclEmployee/dispatch']); // Redirect to history after save
              },
              error: (err) => {
                this.snackBar.open('Failed to submit user. Please try again.', 'Close', {
                  duration: 3000,
                  verticalPosition: 'top'
                });
              }
            });
          }
        },
        error: (err) => {
          this.snackBar.open('Error validating mobile number. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }
    

    togglePasswordVisibility() {
      this.hide = !this.hide;
    }

    onInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      // You can leave this method empty if you don't want to prevent any non-numeric characters
      // But it will not update or validate until form validation is triggered
      this.userForm.get('mobileNumber')?.updateValueAndValidity();
    }
  }
    
    


