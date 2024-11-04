// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatNativeDateModule } from '@angular/material/core';
// import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
// import { MstCouriercontractService } from '../../../services/mst-couriercontract.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MstCourierService } from '../../../services/mst-courier.service';

// @Component({
//   selector: 'app-mst-couriercontract',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatInputModule,
//     MatButtonModule,
//     MatDatepickerModule,
//     MatFormFieldModule,
//     MatNativeDateModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './mst-couriercontract.component.html',
//   styleUrls: ['./mst-couriercontract.component.css']
// })
// export class MstCouriercontractComponent implements OnInit {

  
//   courierForm: FormGroup;
//   empProfile: any;
//   responseMessage: string = ''; 
//   courierResponseMessage:string='';
//   discounts: Array<{ fromMonthlyAmt: number; toMonthlyAmt: number; discountPercentage: number }> = [];
//   rates: Array<{ fromWtGms: number; toWtGms: number; fromDistanceKm: number; toDistanceKm: number; rate: number }> = [];

//   constructor(
//     private fb: FormBuilder,
//     private empService: IoclEmpServiceService,
//     private courierService: MstCouriercontractService,
//     private courier:MstCourierService
//   ) {
//     this.courierForm = this.fb.group({
//       courierCode: ['', Validators.required],
//       courierContNo: ['', Validators.required],
//       contractStartDate: ['', Validators.required],
//       contractEndDate: ['', Validators.required],
//       fromMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
//       toMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
//       discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
//       fromWtGms: [0, [Validators.required, Validators.min(0)]],
//       toWtGms: [0, [Validators.required, Validators.min(0)]],
//       fromDistanceKm: [0, [Validators.required, Validators.min(0)]],
//       toDistanceKm: [0, [Validators.required, Validators.min(0)]],
//       rate: [0, [Validators.required, Validators.min(0)]]
//     });
//   }

  



//   ngOnInit(): void {
//     this.empProfile = this.empService.getEmpData();
//     console.log(this.empProfile);
//   }

//   addDiscount() {
//     const { fromMonthlyAmt, toMonthlyAmt, discountPercentage } = this.courierForm.value;
//     this.discounts.push({ fromMonthlyAmt, toMonthlyAmt, discountPercentage });
//     this.courierForm.patchValue({
//       fromMonthlyAmt: 0,
//       toMonthlyAmt: 0,
//       discountPercentage: 0
//     });
//   }

//   removeDiscount(index: number) {
//     this.discounts.splice(index, 1);
//   }

// addRate() {
//   const { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate } = this.courierForm.value;
//   if (fromWtGms && toWtGms && fromDistanceKm && toDistanceKm && rate) {
//       console.log('Adding Rate:', { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
//       this.rates.push({ fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
      
//       this.courierForm.patchValue({
//           fromWtGms: 0,
//           toWtGms: 0,
//           fromDistanceKm: 0,
//           toDistanceKm: 0,
//           rate: 0
//       });
//   } else {
//       console.error('Invalid rate values:', this.courierForm.value);
//   }
// }


  

//   removeRate(index: number) {
//     this.rates.splice(index, 1);
//   }



// onSubmitContract() {
//   if (this.courierForm.valid) {
//       const contractData = {
//           courierCode: this.courierForm.value.courierCode,
//           courierContNo: this.courierForm.value.courierContNo,
//           contractStartDate: this.courierForm.value.contractStartDate,
//           contractEndDate: this.courierForm.value.contractEndDate,
//           courierDiscount: this.discounts,
//           courierRates: this.rates,
//       };
//       console.log('Contract Data:', contractData);
//       this.courierService.createContract(contractData).subscribe({
//           next: (response) => {
//             this.responseMessage = 'Contract created successfully: ' + response; // Set success message

//               console.log('Contract created successfully', response);
//               this.courierForm.reset();
//               this.discounts = [];
//               this.rates = [];
//           },
//           error: (error) => {
//               console.error('Error creating contract:', error.message || error);
//           }
//       });
//   } else {
//       console.log('Form is invalid');
//   }
// }

// }











import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { MstCouriercontractService } from '../../../services/mst-couriercontract.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MstCourierService } from '../../../services/mst-courier.service';
import { CourierService } from '../../../services/courier-service.service';

@Component({
  selector: 'app-mst-couriercontract',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './mst-couriercontract.component.html',
  styleUrls: ['./mst-couriercontract.component.css']
})
export class MstCouriercontractComponent implements OnInit {
  contractForm: FormGroup; // Form for courier contract
  courierForm: FormGroup; // Form for adding a courier
  empProfile: any;
  contractResponseMessage: string = ''; // Success/error message for contract submission
  courierResponseMessage: string = ''; // Success/error message for courier addition
  discounts: Array<{ fromMonthlyAmt: number; toMonthlyAmt: number; discountPercentage: number }> = [];
  rates: Array<{ fromWtGms: number; toWtGms: number; fromDistanceKm: number; toDistanceKm: number; rate: number }> = [];

  constructor(
    private fb: FormBuilder,
    private empService: IoclEmpServiceService,
    private courierService: MstCouriercontractService,
    private courier: CourierService
  ) {
    // Initializing contract form
    this.contractForm = this.fb.group({
      courierCode: ['', Validators.required],
      courierContNo: ['', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['', Validators.required],
      fromMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
      toMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fromWtGms: [0, [Validators.required, Validators.min(0)]],
      toWtGms: [0, [Validators.required, Validators.min(0)]],
      fromDistanceKm: [0, [Validators.required, Validators.min(0)]],
      toDistanceKm: [0, [Validators.required, Validators.min(0)]],
      rate: [0, [Validators.required, Validators.min(0)]]
    });

    // Initializing add courier form
    this.courierForm = this.fb.group({
      courierCode: ['', Validators.required],
      courierName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.empProfile = this.empService.getEmpData();
    console.log(this.empProfile);
  }

  // Methods for handling discounts
  addDiscount() {
    const { fromMonthlyAmt, toMonthlyAmt, discountPercentage } = this.contractForm.value;
    this.discounts.push({ fromMonthlyAmt, toMonthlyAmt, discountPercentage });
    this.contractForm.patchValue({
      fromMonthlyAmt: 0,
      toMonthlyAmt: 0,
      discountPercentage: 0
    });
  }

  removeDiscount(index: number) {
    this.discounts.splice(index, 1);
  }

  // Methods for handling rates
  addRate() {
    const { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate } = this.contractForm.value;
    if (fromWtGms && toWtGms && fromDistanceKm && toDistanceKm && rate) {
      console.log('Adding Rate:', { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
      this.rates.push({ fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });

      this.contractForm.patchValue({
        fromWtGms: 0,
        toWtGms: 0,
        fromDistanceKm: 0,
        toDistanceKm: 0,
        rate: 0
      });
    } else {
      console.error('Invalid rate values:', this.contractForm.value);
    }
  }

  removeRate(index: number) {
    this.rates.splice(index, 1);
  }

  // Submit handler for contract form
  onSubmitContract() {
    if (this.contractForm.valid) {
      const contractData = {
        courierCode: this.contractForm.value.courierCode,
        courierContNo: this.contractForm.value.courierContNo,
        contractStartDate: this.contractForm.value.contractStartDate,
        contractEndDate: this.contractForm.value.contractEndDate,
        courierDiscount: this.discounts,
        courierRates: this.rates,
      };
      console.log('Contract Data:', contractData);

      this.courierService.createContract(contractData).subscribe({
        next: (response) => {
          this.contractResponseMessage = 'Contract created successfully: ' + response;
          console.log('Contract created successfully', response);
          this.contractForm.reset();
          this.discounts = [];
          this.rates = [];
        },
        error: (error) => {
          this.contractResponseMessage = 'Error creating contract: ' + (error.message || error);
          console.error('Error creating contract:', error.message || error);
        }
      });
    } else {
      this.contractResponseMessage = 'Form is invalid';
      console.log('Form is invalid');
    }
  }

  // Submit handler for add courier form
  onSubmitCourier() {
    if (this.courierForm.valid) {
      const courierData = {
        courierCode: this.courierForm.value.courierCode,
        courierName: this.courierForm.value.courierName
      };

      this.courier.addCourier(courierData).subscribe({
        next: (response) => {
          this.courierResponseMessage = 'Courier added successfully';
          // console.log('Courier added successfully', response);
          this.courierForm.reset();
        },
        error: (error) => {
          this.courierResponseMessage = 'Error adding courier: ' + (error.message || error);
          console.error('Error adding courier:', error.message || error);
        }
      });
    } else {
      this.courierResponseMessage = 'Form is invalid';
      console.log('Form is invalid');
    }
  }
}
