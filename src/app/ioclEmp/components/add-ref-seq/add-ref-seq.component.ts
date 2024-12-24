import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Observable, of, startWith, map } from 'rxjs';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { RefSequenceService } from '../../../services/ref-sequence.service';
import { catchError } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-add-ref-seq',
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
  templateUrl: './add-ref-seq.component.html',
  styleUrl: './add-ref-seq.component.css'
})
export class AddRefSeqComponent {

  seqForm!: FormGroup;
  filteredLocationCodes: Observable<string[]> = of([]);
  // empRoles:string[]=[];
  locationCodes: string[] = []; // Populate this with your location codes
  // empCodes: string[] = []; // Populate this with your sender codes
  // empName: string = ''; // Populate this with your recipient codes
  
  constructor(
    private fb: FormBuilder,
    private snackBar:MatSnackBar,
    private ioclEmpService:IoclEmpServiceService,
    private refSeqService:RefSequenceService,
    private router:Router
  ) {
    this.seqForm = this.fb.group({
    // locCode: ['', Validators.required],
    locCode: [
      '',
      [Validators.required],
      [this.checkLocationExistsValidator()] // Add async validator here
    ],
      inSequenceNo: [0, Validators.required], // Default value as number
      outSequenceNo: [0, Validators.required], // Default value as number
    });
    
  }
  
  ngOnInit(): void {
  
    this.loadLocCodes();
  
    this.filteredLocationCodes = this.seqForm.get('locCode')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocationCodes(value))
    ) ?? of([]); 
  }

  loadLocCodes():void{ 
    this.ioclEmpService.getAllLocations().subscribe(locations => {
      this.locationCodes = locations;
    });
  }
  

  filterLocationCodes(value: string): string[] {
    if (value.trim() === '') {
      return []; // No suggestions when input is empty
    }
    const filterValue = value.toLowerCase();
    return this.locationCodes.filter(locCode => locCode.toLowerCase().includes(filterValue));
  }
  
 
  validateNumber(controlName: string): void {
    const control = this.seqForm.get(controlName);
    if (control) {
      const value = control.value;
  
      // Remove non-numeric characters if any
      if (isNaN(value) || value === null || value === '') {
        control.setValue('0'); // Reset to default value if invalid
      } else {
        control.setValue(Number(value)); // Ensure the value is a valid number
      }
    }
  }
  
  checkLocationExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null); // If there's no value, skip validation
      }
  
      // Extract the code from locname(code)
      const locCode = this.extractCodeFromLocation(control.value);
  
      // Call the backend API to check location code existence
      return this.refSeqService.checkLocationExists(locCode).pipe(
        map((exists) => (exists ? { LocationExists: true } : null)), // Set error if location exists
        catchError((error) => {
          console.error('Validation Error:', error);
          return of(null); // Gracefully handle errors
        })
      );
    };
  }
  
  // Helper method to extract the code part
  private extractCodeFromLocation(location: string): string {
    if (location && location.includes('(') && location.includes(')')) {
      const startIdx = location.indexOf('(') + 1;
      const endIdx = location.indexOf(')');
      return location.substring(startIdx, endIdx); // Extract the code inside parentheses
    }
    return location; // If no format, return as is
  }
  
  
  
  // onSubmit(): void {
  //   if (this.seqForm.invalid) {
  //     this.snackBar.open('Please fill all required fields.', 'Close', {
  //       duration: 3000,
  //       verticalPosition: 'top'
  //     });
  //     const user = this.seqForm.value;
  //     console.log('user Data:', user);
  //     return;
  //   }
  
  //   const seq = this.seqForm.value;
  
  //   // Manually extract the code inside parentheses for locCode before submission
  //   if (seq.locCode && seq.locCode.includes('(')) {
  //     const startIdx = seq.locCode.indexOf('(') + 1;
  //     const endIdx = seq.locCode.indexOf(')');
  //     seq.locCode = seq.locCode.substring(startIdx, endIdx);
  //   }
  
  //   this.refSeqService.createSequence(seq).subscribe({
  //     next: (response) => {
  //       this.snackBar.open('Data submitted successfully!', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //       console.log('user Data:', seq);
  //       this.seqForm.markAsPristine();
  //       this.seqForm.markAsUntouched();
  //       this.seqForm.reset();
  //       this.router.navigate(['/ioclEmployee/loc-implementation']); // Redirect to history after save
  //     },
  //     error: (err) => {
  //       this.snackBar.open('Failed to submit. Please try again.', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //       const user = this.seqForm.value;
  //       console.log('user Data:', user);
  //     }
  //   });
  // }


  onSubmit(): void {
    if (this.seqForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
      const user = this.seqForm.value;
      console.log('user Data:', user);
      return;
    }
  
    // Extract the form data
    const seq = this.seqForm.value;
  
    // Convert inSequenceNo and outSequenceNo to numbers
    seq.inSequenceNo = parseInt(seq.inSequenceNo, 10) || 0;
    seq.outSequenceNo = parseInt(seq.outSequenceNo, 10) || 0;
  
    // Manually extract the locCode inside parentheses before submission
    if (seq.locCode && seq.locCode.includes('(')) {
      const startIdx = seq.locCode.indexOf('(') + 1;
      const endIdx = seq.locCode.indexOf(')');
      seq.locCode = seq.locCode.substring(startIdx, endIdx);
    }
  
    this.refSeqService.createSequence(seq).subscribe({
      next: (response) => {
        this.snackBar.open('Data submitted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log('Submitted Data:', seq);
        this.seqForm.markAsPristine();
        this.seqForm.markAsUntouched();
        this.seqForm.reset();
        this.router.navigate(['/ioclEmployee/loc-implementation']); // Redirect to history after save
      },
      error: (err) => {
        this.snackBar.open('Failed to submit. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
        console.error('Error:', err);
      },
    });
  }

  
  
}  