
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule,Validators } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { CourierhistoryService } from '../../../services/courierhistory.service';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatCardModule } from '@angular/material/card';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { FormsModule } from '@angular/forms';


// @Component({
//   selector: 'app-courier-contract-edit',
//   standalone: true,
//   templateUrl: './courier-contract-edit.component.html',
//   styleUrls: ['./courier-contract-edit.component.css'],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatDialogModule,
//     MatCardModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     FormsModule
//   ]
// })

// export class CourierContractEditComponent implements OnInit {
//   contractForm: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private courierService: CourierhistoryService,
//     private fb: FormBuilder
//   ) {
//     this.contractForm = this.fb.group({
//       courierContNo: ['', Validators.required],
//       courierCode: ['', Validators.required],
//       contractStartDate: ['', Validators.required],
//       contractEndDate: ['', Validators.required],
//       courierDiscount: this.fb.group({
//         fromMonthlyAmt: ['', Validators.required],
//         toMonthlyAmt: ['', Validators.required],
//         discountPercentage: ['', Validators.required]
//       }),
//       courierRates: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     const courierContNo = this.route.snapshot.paramMap.get('courierContNo');
//     this.route.queryParams.subscribe(params => {
//       const contractNumber = params['courierContNo'] || courierContNo;
//       if (contractNumber) {
//         this.loadContractData(contractNumber);
//       }
//     });
//   }
 
//   loadContractData(courierContNo: string): void {
//     this.courierService.getContractByContNo(courierContNo).subscribe({
//       next: (response) => {
//         if (response && response.length > 0) {
//           const contract = response[0]; 
//           console.log('Received contract data:', contract);
          
//           this.contractForm.patchValue({
//             courierContNo: contract.courierContNo.trim(),
//             courierCode: contract.courierCode,
//             contractStartDate: contract.contractStartDate,
//             contractEndDate: contract.contractEndDate,
//             courierDiscount: contract.discounts?.[0] || { fromMonthlyAmt: '', toMonthlyAmt: '', discountPercentage: '' }
//           });
  
//           this.setCourierRates(contract.rates || []);
//         } else {
//           console.error('No contract data found');
//         }
//       },
//       error: (error) => console.error('Failed to load contract data:', error)
//     });
//   }
  

//   setCourierRates(rates: any[]): void {
//     const rateArray = this.contractForm.get('courierRates') as FormArray;
//     rateArray.clear();
//     rates.forEach(rate => {
//       rateArray.push(this.fb.group({
//         fromWtGms: [rate.fromWtGms, Validators.required],
//         toWtGms: [rate.toWtGms, Validators.required],
//         fromDistanceKm: [rate.fromDistanceKm, Validators.required],
//         toDistanceKm: [rate.toDistanceKm, Validators.required],
//         rate: [rate.rate, Validators.required]
//       }));
//     });
//   }

//   get courierRatesControls() {
//     return (this.contractForm.get('courierRates') as FormArray).controls;
//   }

//   get courierDiscountControl(): FormGroup {
//     return this.contractForm.get('courierDiscount') as FormGroup;
//   }

//   addRate(): void {
//     const rateArray = this.contractForm.get('courierRates') as FormArray;
//     rateArray.push(this.fb.group({
//       fromWtGms: ['', Validators.required],
//       toWtGms: ['', Validators.required],
//       fromDistanceKm: ['', Validators.required],
//       toDistanceKm: ['', Validators.required],
//       rate: ['', Validators.required]
//     }));
//   }

//   addDiscount(): void {
//     const discount = this.courierDiscountControl.value;
//     console.log('Adding discount:', discount);
//   }

//   onSubmitContract(): void {
//     const updatedContract = this.contractForm.value;
//     this.updateContract(updatedContract.courierContNo, updatedContract);
//   }

//   updateContract(courierContNo: string, updatedContract: any): void {
//     console.log('Updating contract with data:', updatedContract);
//     this.courierService.updateContract(courierContNo, updatedContract)
//       .subscribe({
//         next: response => {
//           console.log('Contract updated successfully', response);
//           alert('Contract updated successfully!');
//         },
//         error: err => {
//           console.error('Error updating contract:', err);
//           alert('An error occurred while updating the contract.');
//         }
//       });
//   }

// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourierhistoryService } from '../../../services/courierhistory.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-courier-contract-edit',
  standalone: true,
  templateUrl: './courier-contract-edit.component.html',
  styleUrls: ['./courier-contract-edit.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ]
})
export class CourierContractEditComponent implements OnInit {
  contractForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private courierService: CourierhistoryService,
    private fb: FormBuilder
  ) {
    // this.contractForm = this.fb.group({
    //   courierContNo: ['', Validators.required],
    //   courierCode: ['', Validators.required],
    //   contractStartDate: ['', Validators.required],
    //   contractEndDate: ['', Validators.required],
    //   courierDiscounts: this.fb.array([]),  // Changed to FormArray
    //   courierRates: this.fb.array([])
    // });
    this.contractForm = this.fb.group({
      courierCode: ['', Validators.required],
      courierContNo: ['', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['', Validators.required],
      courierDiscounts: this.fb.array([
        this.fb.group({
          fromMonthlyAmt: ['', Validators.required],
          toMonthlyAmt: ['', Validators.required],
          discountPercentage: ['', Validators.required]
        })
      ]),
      courierRates: this.fb.array([
        this.fb.group({
          fromWtGms: ['', Validators.required],
          toWtGms: ['', Validators.required],
          fromDistanceKm: ['', Validators.required],
          toDistanceKm: ['', Validators.required],
          rate: ['', Validators.required]
        })
      ])
    });
    
  }

  ngOnInit(): void {
    const courierContNo = this.route.snapshot.paramMap.get('courierContNo');
    this.route.queryParams.subscribe(params => {
      const contractNumber = params['courierContNo'] || courierContNo;
      if (contractNumber) {
        this.loadContractData(contractNumber);
      }
    });
  }

  loadContractData(courierContNo: string): void {
    this.courierService.getContractByContNo(courierContNo).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          const contract = response[0];
          console.log('Received contract data:', contract);

          this.contractForm.patchValue({
            courierContNo: contract.courierContNo.trim(),
            courierCode: contract.courierCode,
            contractStartDate: contract.contractStartDate,
            contractEndDate: contract.contractEndDate,
          });

          // Load multiple discounts
          this.setCourierDiscounts(contract.discounts || []);
          this.setCourierRates(contract.rates || []);
        } else {
          console.error('No contract data found');
        }
      },
      error: (error) => console.error('Failed to load contract data:', error)
    });
  }

  setCourierDiscounts(discounts: any[]): void {
    const discountArray = this.contractForm.get('courierDiscounts') as FormArray;
    discountArray.clear();  // Clear existing discounts
    discounts.forEach(discount => {
      discountArray.push(this.fb.group({
        fromMonthlyAmt: [discount.fromMonthlyAmt, Validators.required],
        toMonthlyAmt: [discount.toMonthlyAmt, Validators.required],
        discountPercentage: [discount.discountPercentage, Validators.required]
      }));
    });
  }

  setCourierRates(rates: any[]): void {
    const rateArray = this.contractForm.get('courierRates') as FormArray;
    rateArray.clear();
    rates.forEach(rate => {
      rateArray.push(this.fb.group({
        fromWtGms: [rate.fromWtGms, Validators.required],
        toWtGms: [rate.toWtGms, Validators.required],
        fromDistanceKm: [rate.fromDistanceKm, Validators.required],
        toDistanceKm: [rate.toDistanceKm, Validators.required],
        rate: [rate.rate, Validators.required]
      }));
    });
  }

  get courierRatesControls() {
    return (this.contractForm.get('courierRates') as FormArray).controls;
  }

  get courierDiscountControls() {
    return (this.contractForm.get('courierDiscounts') as FormArray).controls; // Getter for discounts
  }

  addDiscount(): void {
    const discountArray = this.contractForm.get('courierDiscounts') as FormArray;
    discountArray.push(this.fb.group({
      fromMonthlyAmt: ['', Validators.required],
      toMonthlyAmt: ['', Validators.required],
      discountPercentage: ['', Validators.required]
    }));
  }

  addRate(): void {
    const rateArray = this.contractForm.get('courierRates') as FormArray;
    rateArray.push(this.fb.group({
      fromWtGms: ['', Validators.required],
      toWtGms: ['', Validators.required],
      fromDistanceKm: ['', Validators.required],
      toDistanceKm: ['', Validators.required],
      rate: ['', Validators.required]
    }));
  }

  // onSubmitContract(): void {
  //   const updatedContract = this.contractForm.value;
  //   this.updateContract(updatedContract.courierContNo, updatedContract);
  // }

  // updateContract(courierContNo: string, updatedContract: any): void {
  //   console.log('Updating contract with data:', updatedContract);
  //   this.courierService.updateContract(courierContNo, updatedContract)
  //     .subscribe({
  //       next: response => {
  //         console.log('Contract updated successfully', response);
  //         alert('Contract updated successfully!');
  //       },
  //       error: err => {
  //         console.error('Error updating contract:', err);
  //         alert('An error occurred while updating the contract.');
  //       }
  //     });
  // }

  onSubmitContract(): void {
    const updatedContract = this.contractForm.value;
  
    // Check if the contract number is present before proceeding
    if (!updatedContract.courierContNo) {
      alert('Contract number is required.');
      return;
    }
  
    // Log the data being sent for easier debugging
    console.log('Submitting contract update with data:', updatedContract);
    
    // Call the method to update the contract
    this.updateContract(updatedContract.courierContNo, updatedContract);
  }
  
  updateContract(courierContNo: string, updatedContract: any): void {
    console.log('Updating contract with data:', updatedContract);
  
    this.courierService.updateContract(courierContNo, updatedContract)
      .subscribe({
        next: response => {
          console.log('Contract updated successfully', response);
          alert('Contract updated successfully!');
        },
        error: err => {
          console.error('Error updating contract:', err);
          alert('An error occurred while updating the contract. Please check console for details.');
        }
      });
  }
  
}
