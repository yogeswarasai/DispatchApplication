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
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TrnParcelOutService } from '../../../services/trn-parcel-out.service';
import { MstCourier } from '../../../model/mstCourier';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-parcel-out',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgFor, JsonPipe,
    MatAutocompleteModule,
  ],
  templateUrl: './parcel-out.component.html',
  styleUrls: ['./parcel-out.component.css'],
})
export class ParcelOutComponent implements OnInit {
  parcelOutForm: FormGroup;
  locationCodes: string[] = [];
  senderDepartments: string[] = [];
  senders: string[] = [];
  recipients: string[] = [];
  couriers: MstCourier[] = [];
  recipientDepartments: string[] = [];
  filteredLocationCodes: Observable<string[]> = of([]);
  filteredSenders: Observable<string[]> = of([]);
  filteredRecipients: Observable<string[]> = of([]);
  showOtherRecipientDepartmentOption = false;

  constructor(
    private fb: FormBuilder,
    private parcelOutService: TrnParcelOutService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router:Router
  ) {
    this.parcelOutForm = this.fb.group({
    //  consignmentNumber: ['', Validators.required],
    consignmentNumber: [
      '',
      [Validators.required],
      [
        (control) =>
          this.parcelOutService.checkConsignmentExists(control.value).pipe(
            map((exists) => (exists ? { consignmentExists: true } : null)),
            catchError(() => of(null)) // Graceful error handling
          ),
      ],
    ],
      consignmentDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      senderDepartment: ['', Validators.required],
      senderName: ['', Validators.required],
      recipientLocCode: ['', Validators.required],
      recipientDepartment: ['', Validators.required],
      recipientName: ['', Validators.required],
      courierName: ['', Validators.required],
      // weight: ['', Validators.required],
      weight: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]], // Allows integer and decimal numbers
      unit: ['', Validators.required],
      distance: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  
    
    this.parcelOutForm.patchValue({
      unit: 'g'
    });
            // Other form controls...
    
    this.loadLocations();
    this.loadSenderDepartments();
    this.loadCouriers();
    // this.loadRecipientDepartments();
    //this.loadSenderNames();
    // this.loadRecipientNames();

    this.parcelOutForm.get('recipientLocCode')?.valueChanges.subscribe(recipientLocCode => {
      this.loadDepartmentsByLocationName(recipientLocCode);
    });
    this.parcelOutForm.get('recipientDepartment')?.valueChanges.subscribe(()=> {
      this.loadRecipientNamesByDepartment();
    });

    this.parcelOutForm.get('senderDepartment')?.valueChanges.subscribe(() => {
      this.loadSenderNames();
    });


    this.parcelOutForm.get('recipientLocCode')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocations(value))
    ).subscribe(filtered => this.filteredLocationCodes = of(filtered));

    this.parcelOutForm.get('senderName')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSenders(value))
    ).subscribe(filtered => this.filteredSenders = of(filtered));

    this.parcelOutForm.get('recipientName')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterRecipients(value))
    ).subscribe(filtered => this.filteredRecipients = of(filtered));
  }

  

  // onRecipientLocCodeInput(): void {
  //   const recipientLocCode = this.parcelOutForm.get('recipientLocCode')?.value;
  
  //   // Validate recipient location code
  //   if (this.locationCodes.indexOf(recipientLocCode) === -1) {
  //     this.showOtherRecipientDepartmentOption = true;
  //     this.parcelOutForm.patchValue({ distance: '' }); // Clear distance field if invalid code
  //     this.parcelOutService.getDistance(recipientLocCode).subscribe(
  //       (distance) => {
  //         this.parcelOutForm.patchValue({ distance }); // Update form field with fetched distance
  //       },
  //       (error) => {
  //         console.error('Error fetching distance:', error);
  //         this.parcelOutForm.patchValue({ distance: '' }); // Clear distance field on error
  //       }
  //     );
    
  //   } else {
  //     this.showOtherRecipientDepartmentOption = false;
  
  //     // Fetch distance using the servic
  // }
  
//}
onRecipientLocCodeInput(): void {
  // Get the value from the form
  const recipientLocCodeInput = this.parcelOutForm.get('recipientLocCode')?.value;

  console.log('Recipient Loc Code Input:', recipientLocCodeInput); // Debugging

  // Extract location code from the input
  const recipientLocCode = this.extractLocCode(recipientLocCodeInput);

  if (!recipientLocCode) {
    console.error('Invalid location format! Please select a valid location.');
    this.parcelOutForm.patchValue({ distance: '' }); // Clear distance field
    return;
  }

  console.log('Extracted Location Code:', recipientLocCode);

  // Fetch the distance based on the extracted code
  this.parcelOutService.getDistance(recipientLocCode).subscribe(
    (distance) => {
      console.log('Fetched Distance:', distance); // Debugging
      this.parcelOutForm.patchValue({ distance }); // Update the distance field
    },
    (error) => {
      console.error('Error fetching distance:', error);
      this.parcelOutForm.patchValue({ distance: '' }); // Clear distance if error occurs
    }
  );
}

extractLocCode(input: string): string | null {
  // Match digits inside parentheses (e.g., "(4401)")
  const match = input?.match(/\((\d+)\)/);
  if (match) {
    return match[1]; // Extract and return the numeric code
  }

  // If the input is purely numeric, return it directly
  const isNumeric = /^\d+$/.test(input?.trim());
  if (isNumeric) {
    return input?.trim();
  }

  return null; // Return null if format is invalid
}


onRecipientLocCodeSelect(event: MatAutocompleteSelectedEvent): void {
  const selectedValue = event.option.value; // Get the selected value from dropdown
  console.log('Selected Value:', selectedValue); // Debugging

  // Trigger the same logic as input
  this.parcelOutForm.patchValue({ recipientLocCode: selectedValue });
  this.onRecipientLocCodeInput(); // Call the input handling logic
}



  loadLocations(): void {
    this.parcelOutService.getLocations().subscribe(locations => {
      this.locationCodes = locations;
    });
  }

  loadDepartmentsByLocationName(recipientLocCode: string): void {
    const locName = recipientLocCode.split('(')[0];
    this.parcelOutService.getDepartmentsByLocationName(locName).subscribe(departments => {
      this.recipientDepartments = departments;
    });
  }
  loadRecipientNamesByDepartment(): void {
    const recipientLocCode = this.parcelOutForm.get('recipientLocCode')?.value;
    const recipientDepartment = this.parcelOutForm.get('recipientDepartment')?.value;

    if (recipientLocCode && recipientDepartment) {
      const locName = recipientLocCode.split('(')[0].trim();
      this.parcelOutService.getRecipientNamesByLocCodeAndPsa(locName,recipientDepartment).subscribe({
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

  loadSenderDepartments(): void {
    this.parcelOutService.getSenderDepartments().subscribe(departments => {
      this.senderDepartments = departments;
    });
  }

  loadSenderNames(): void {
    // const recipientLocCode = this.parcelOutForm.get('recipientLocCode')?.value;
     const senderDepartment = this.parcelOutForm.get('senderDepartment')?.value;
 
     if (senderDepartment) {
       this.parcelOutService.getSenderNameByDept(senderDepartment).subscribe({
         next: (senders) => {
          console.log('sender names',senders);
           this.senders = senders;
           console.log('Received senders Names:', this.senders);  // Debugging
         },
         error: (err) => {
           console.error('Failed to load senders names:', err);
         }
       });
     }
   }

  // loadRecipientNames(): void {
  //   this.parcelOutService.getAllEmployees().subscribe(recipients => {
  //     this.recipients = recipients;
  //   });
  // }

  loadCouriers(): void {
    this.parcelOutService.getAllCouriers().subscribe(couriers => {
      this.couriers = couriers;
      console.log(this.couriers); // Debugging output

    });
  }

  filterLocations(value: string): string[] {
    if (value.trim() === '') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.locationCodes.filter(loc => loc.toLowerCase().includes(filterValue));
  }

  filterSenders(value: string): string[] {
    if (value.trim() === '') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.senders.filter(sender => sender.toLowerCase().includes(filterValue));
  }

  filterRecipients(value: string): string[] {
    if (value.trim() === '') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.recipients.filter(recipient => recipient.toLowerCase().includes(filterValue));
  }

  // onSubmit(): void {
  //   if (this.parcelOutForm.invalid) {
  //     this.snackBar.open('Please fill all required fields.', 'Close', {
  //       duration: 3000,
  //       verticalPosition: 'top'
  //     });
  //     return;
  //   }

  //   const parcelOut = this.parcelOutForm.value;

  //   this.parcelOutService.createParcel(parcelOut).subscribe({
  //     next: () => {
  //       this.snackBar.open('Parcel created successfully!', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //       // this.parcelOutForm.reset();
  //       this.parcelOutForm.markAsPristine();
  //       this.parcelOutForm.markAsUntouched();
  //       this.parcelOutForm.reset();
  //       this.router.navigate(['/dispatchEmployee/history'])
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to create parcel. Please try again.', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top'
  //       });
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.parcelOutForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }
  
    const parcelOut = this.parcelOutForm.value;
  
    // Manually extract the code inside parentheses for recipientLocCode before submission
    if (parcelOut.recipientLocCode && parcelOut.recipientLocCode.includes('(')) {
      const startIdx = parcelOut.recipientLocCode.indexOf('(') + 1;
      const endIdx = parcelOut.recipientLocCode.indexOf(')');
      parcelOut.recipientLocCode = parcelOut.recipientLocCode.substring(startIdx, endIdx);
    }
  
    this.parcelOutService.createParcel(parcelOut).subscribe({
      next: () => {
        this.snackBar.open('Parcel created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.parcelOutForm.markAsPristine();
        this.parcelOutForm.markAsUntouched();
        this.parcelOutForm.reset();
        this.router.navigate(['/dispatchEmployee/history']);
      },
      error: () => {
        this.snackBar.open('Failed to create parcel. Please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
  
}
