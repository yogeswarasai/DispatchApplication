import { CommonModule, JsonPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TrnParcelInService } from '../../services/trn-parcel-in.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TrnParcelIn } from '../../../model/trnParcelIn';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { matchValidator } from '../../MatchValidator';
import { MstCourier } from '../../../model/mstCourier';
import { error } from 'console';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError } from 'rxjs/operators';



export interface ParcelOutResponse {
  senderLocCode: string;
  consignmentDate: string; // Consider using Date type if you want to handle dates.
  senderDepartment: string;
  senderName: string;
  recipientName: string;
  recipientDepartment: string;
  courierName: string;
}
@Component({
  selector: 'app-parcel-in',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor, JsonPipe,
    MatAutocompleteModule,MatProgressSpinnerModule
  ],
  templateUrl: './parcel-in.component.html',
  styleUrls: ['./parcel-in.component.css']
})


  export class ParcelInComponent implements OnInit {
  parcelInForm: FormGroup;
  locationCodes: string[] = [];
  senderDepartments: string[] = [];  // Array to hold sender departments
  senders: string[] = [];
  recipients: string[] = [];
  couriers: MstCourier[] = [];
  recipientDepartments: string[] = [];
  filteredLocationCodes: Observable<string[]> = of([]);
  filteredSenders: Observable<string[]> = of([]);
  filteredRecipients: Observable<string[]> = of([]);
  showOtherDepartmentOption = false;
  loading: boolean = false; // Initialize loading property


  
    constructor(
      private fb: FormBuilder,
      private parcelInService: TrnParcelInService,
      private snackBar: MatSnackBar,
      private datePipe: DatePipe,
      private router: Router
    ) {
      this.parcelInForm = this.fb.group({
       // consignmentNumber: ['', Validators.required],
       consignmentNumber: [
        '',
        [Validators.required],
        [
          (control) =>
            this.parcelInService.checkConsignmentExists(control.value).pipe(
              map((exists) => (exists ? { consignmentExists: true } : null)),
              catchError(() => of(null)) // Graceful error handling
            ),
        ],
      ],
        consignmentDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
        receivedDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
        senderLocCode: ['', Validators.required],
        senderDepartment: ['', Validators.required], // Add senderDepartments form control
        senderName: ['', Validators.required],
        recipientDepartment: ['', Validators.required],
        recipientName: ['', Validators.required],
        courierName: ['', Validators.required],
      });
    }
  
    ngOnInit(): void {
      this.loadLocations();
      this.loadCouriers();
      this.loadRecipientDepartments();
     // this.loadRecipientNames();
      //this.loadSenderNames();
     
      this.parcelInForm.get('senderLocCode')?.valueChanges.subscribe(senderLocCode => {
        this.loadDepartmentsByLocationName(senderLocCode);
      });

      this.parcelInForm.get('senderDepartment')?.valueChanges.subscribe(() => {
        this.loadSenderNamesByLocationAndPSA();
      });

      this.parcelInForm.get('recipientDepartment')?.valueChanges.subscribe(() => {
        this.loadRecipientNames();
      });

  
      this.parcelInForm.get('senderLocCode')?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterLocations(value))
      ).subscribe(filtered => this.filteredLocationCodes = of(filtered));
  
      this.parcelInForm.get('senderName')?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSenders(value))
      ).subscribe(filtered => this.filteredSenders = of(filtered));
  
      this.parcelInForm.get('recipientName')?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterRecipients(value))
      ).subscribe(filtered => this.filteredRecipients = of(filtered));
    }

    // onConsignmentNumberChange(): void {
    //   const consignmentNumber = this.parcelInForm.get('consignmentNumber')?.value;
    
    //   // Clear previous data if consignment number is empty
    //   if (!consignmentNumber) {
    //     this.clearForm();
    //     return;
    //   }
    
    //   // Indicate loading state
    //   this.loading = true;
    
    //   this.parcelInService.getParcelOutByConsignmentNumber(consignmentNumber).subscribe({
    //     next: (response: ParcelOutResponse) => {
    //       this.populateForm(response);
    //       this.loading = false; // Hide loading state
    //     },
    //     error: (err) => {
    //       console.error('Error fetching parcel data:', err);
    //       this.loading = false; // Hide loading state
    //       // Optionally show an error message to the user
    //     }
    //   });
    // }
    onConsignmentNumberChange(): void {
      const consignmentNumber = this.parcelInForm.get('consignmentNumber')?.value;
    
      // Clear previous data if consignment number is empty
      if (!consignmentNumber) {
        this.clearForm();
        return;
      }
    
      // Indicate loading state
      this.loading = true;
    
      this.parcelInService.getParcelOutByConsignmentNumber(consignmentNumber).subscribe({
        next: (response: ParcelOutResponse) => {
          if (response) {
            // Populate form if valid data is returned
            this.populateForm(response);
          } else {
            // Clear form if no data is returned
            this.clearForm();
          }
          this.loading = false; // Hide loading state
        },
        error: (err) => {
          console.error('Error fetching parcel data:', err);
          this.clearForm(); // Clear form on error
          this.loading = false; // Hide loading state
          // Optionally show an error message to the user
        },
      });
    }

    
    // clearForm(): void {
    //   this.parcelInForm.reset(); // Reset the entire form
    //   this.parcelInForm.get('consignmentNumber')?.setValue(''); // Optionally retain consignmentNumber
    // }
    


    populateForm(parcelData: ParcelOutResponse): void {
      this.parcelInForm.patchValue({
        senderLocCode: parcelData.senderLocCode,
        consignmentDate: parcelData.consignmentDate,
        senderDepartment: parcelData.senderDepartment,
        senderName: parcelData.senderName,
        recipientName: parcelData.recipientName,
        recipientDepartment: parcelData.recipientDepartment,
        courierName: parcelData.courierName,
      });
    }
    
    // Optional method to clear form fields
    // clearForm(): void {
    //   const consignmentNumber = this.parcelInForm.get('consignmentNumber')?.value; // Retain current consignment number
    //   this.parcelInForm.reset({
    //     consignmentNumber: consignmentNumber || '', // Preserve existing value or set to empty
    //     senderLocCode: '',
    //     consignmentDate: '',
    //     senderDepartment: '',
    //     senderName: '',
    //     recipientName: '',
    //     recipientDepartment: '',
    //     courierName: '',
    //   });
    // }
    clearForm(): void {
      const consignmentNumber = this.parcelInForm.get('consignmentNumber')?.value; // Retain current consignment number
      const consignmentDate = this.parcelInForm.get('consignmentDate')?.value; // Retain current consignment date
      const receivedDate = this.parcelInForm.get('receivedDate')?.value; // Retain current received date
    
      this.parcelInForm.reset({
        consignmentNumber: consignmentNumber || '', // Preserve existing value or set to empty
        consignmentDate: consignmentDate || '', // Preserve consignment date
        receivedDate: receivedDate || '', // Preserve received date
        senderLocCode: '',
        senderDepartment: '',
        senderName: '',
        recipientName: '',
        recipientDepartment: '',
        courierName: '',
      });
    }
    
    

    
    onSenderLocCodeInput(): void {
      const senderLocCode = this.parcelInForm.get('senderLocCode')?.value;
      if (this.locationCodes.indexOf(senderLocCode) === -1) {
        // The inputted location code is not in the list
        this.showOtherDepartmentOption = true;
      } else {
        this.showOtherDepartmentOption = false;
      }
    }
  
    loadLocations(): void {
      this.parcelInService.getLocations().subscribe(locations => {
        this.locationCodes = locations;
      });
    }
  
    loadDepartmentsByLocationName(senderLocCode: string): void {
      const locName = senderLocCode.split('(')[0];
      this.parcelInService.getDepartmentsByLocationName(locName).subscribe(departments => {
        this.senderDepartments= departments;

      });
    }

    loadSenderNamesByLocationAndPSA(): void {
      const senderLocCode = this.parcelInForm.get('senderLocCode')?.value;
      const senderDepartment = this.parcelInForm.get('senderDepartment')?.value;
    
      console.log('Sender Location Code:', senderLocCode); // Debugging
      console.log('Sender Department:', senderDepartment); // Debugging
    
      if (senderLocCode && senderDepartment) {
        const locName = senderLocCode.split('(')[0].trim();  // Extract the locName from senderLocCode
        console.log("locname:",locName);
        console.log("senderdept",senderDepartment);
        this.parcelInService.getSenderNameByLocCodeAndPsa(locName, senderDepartment).subscribe({
          
          next: (response) => {
            console.log('Full Response:', response);
           this.senders = response;
            console.log('Received Sender Names:', this.senders);
          },
          error: (err) => {
            console.error('Failed to load sender names:', err);
          }
        });
        
      }
    }
    
    loadCouriers(): void {
      this.parcelInService.getAllCouriers().subscribe(couriers => {
        this.couriers = couriers;
      });
    }
  
    loadRecipientDepartments(): void {
      this.parcelInService.getRecipientDepartments().subscribe(departments => {
        this.recipientDepartments = departments;
      });
    }
  
    loadRecipientNames(): void {
      // const recipientLocCode = this.parcelOutForm.get('recipientLocCode')?.value;
       const recipientDepartment = this.parcelInForm.get('recipientDepartment')?.value;
       if (recipientDepartment) {
         this.parcelInService.getRecipientNameByDept(recipientDepartment).subscribe({
           next: (recipients) => {
             this.recipients = recipients;
             console.log('Received Recipient Names:', this.recipients);  // Debugging
           },
           error: (err) => {
             console.error('Failed to load recipient names:', err);
           }
         });
       }
     }

    // loadSenderNames():void{
    //   this.parcelInService.getAllEmployees().subscribe(senders => {
    //     this.senders = senders;
    //   });
    // }
  
    filterLocations(value: string): string[] {
      if (value.trim() === '') {
        return []; // No suggestions when input is empty
      }
      const filterValue = value.toLowerCase();
      return this.locationCodes.filter(loc => loc.toLowerCase().includes(filterValue));
    }
  
    filterSenders(value: string): string[] {
      if (value.trim() === '') {
        return []; // No suggestions when input is empty
      }
      const filterValue = value.toLowerCase();
      return this.senders.filter(sender => sender.toLowerCase().includes(filterValue));
    }
  
    filterRecipients(value: string): string[] {
      if (value.trim() === '') {
        return []; // No suggestions when input is empty
      }
      const filterValue = value.toLowerCase();
      return this.recipients.filter(recipient => recipient.toLowerCase().includes(filterValue));
    }
  
  
  // onSubmit(): void {
  //   if (this.parcelInForm.invalid) {
  //     this.snackBar.open('Please fill all required fields.', 'Close', {
  //       duration: 3000,
  //       verticalPosition: 'top'
  //     });
  //     return;
  //   }

  //   const parcelIn = this.parcelInForm.value;

  //   this.parcelInService.createParcel(parcelIn).subscribe({
  //     next: (response) => {
  //       this.snackBar.open('Parcel submitted successfully!', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //       console.log('Parcel In Data:', parcelIn);
  //       // this.parcelInForm.reset();
  //       this.parcelInForm.markAsPristine();
  //       this.parcelInForm.markAsUntouched();
  //        this.parcelInForm.reset();
  //        this.router.navigate(['/dispatchEmployee/history']); // Redirect to history after save
  //     },
  //     error: (err) => {
  //       this.snackBar.open('Failed to submit parcel. Please try again.', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.parcelInForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }
  
    // Extract only the code inside the brackets for senderLocCode
    // let senderLocCode = this.parcelInForm.get('senderLocCode')?.value;
    // if (senderLocCode) {
    //   const match = senderLocCode.match(/\(([^)]+)\)/);  // Extract code inside parentheses
    //   if (match && match[1]) {
    //     senderLocCode = match[1];  // Assign only the code to senderLocCode
    //     this.parcelInForm.get('senderLocCode')?.setValue(senderLocCode); // Update form value
    //   }
    // }
  
    const parcelIn = this.parcelInForm.value;

    if (parcelIn.senderLocCode && parcelIn.senderLocCode.includes('(')) {
      const startIdx = parcelIn.senderLocCode.indexOf('(') + 1;
      const endIdx = parcelIn.senderLocCode.indexOf(')');
      parcelIn.senderLocCode = parcelIn.senderLocCode.substring(startIdx, endIdx);
    }
  
    this.parcelInService.createParcel(parcelIn).subscribe({
      next: (response) => {
        this.snackBar.open('Parcel submitted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        console.log('Parcel In Data:', parcelIn);
        this.parcelInForm.markAsPristine();
        this.parcelInForm.markAsUntouched();
        this.parcelInForm.reset();
        this.router.navigate(['/dispatchEmployee/history']); // Redirect to history after save
      },
      error: (err) => {
        this.snackBar.open('Failed to submit parcel. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
  
}