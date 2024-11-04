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
    this. seqForm = this.fb.group({
      locCode: ['', Validators.required],
      inSequenceNo: ['', Validators.required],
      outSequenceNo: ['', Validators.required],
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
  
 
  
  
  onSubmit(): void {
    if (this.seqForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      const user = this.seqForm.value;
      console.log('user Data:', user);
      return;
    }
  
    const seq = this.seqForm.value;
  
    // Manually extract the code inside parentheses for locCode before submission
    if (seq.locCode && seq.locCode.includes('(')) {
      const startIdx = seq.locCode.indexOf('(') + 1;
      const endIdx = seq.locCode.indexOf(')');
      seq.locCode = seq.locCode.substring(startIdx, endIdx);
    }
  
    this.refSeqService.createSequence(seq).subscribe({
      next: (response) => {
        this.snackBar.open('Data submitted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        console.log('user Data:', seq);
        this.seqForm.markAsPristine();
        this.seqForm.markAsUntouched();
        this.seqForm.reset();
        this.router.navigate(['/ioclEmployee/loc-implementation']); // Redirect to history after save
      },
      error: (err) => {
        this.snackBar.open('Failed to submit. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        const user = this.seqForm.value;
        console.log('user Data:', user);
      }
    });
  }
}  