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
import { MatTableModule } from '@angular/material/table';
import { CourierhistoryService } from '../../../services/courierhistory.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { formatDate } from '@angular/common'; // Import for formatting date
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';




interface Courier {
  courierCode: string;
  courierName: string;
}

interface Contract {
  courierCode: string;
  courierContNo: string;
  contractStartDate?: string;  // add this
  contractEndDate?: string;    // add this
}


// interface RateDiscount{
//   fromWtGms: number;
//   toWtGms: number;
//   fromDistanceKm: number;
//   toDistanceKm: number;
//   rate: number;
//   fromMonthlyAmt: number;
//   toMonthlyAmt: number;
//   discountPercentage: number;
// }
interface ContractData {
  discounts: any[];
  rates: any[];
}
// interface Rate {
  
// }


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
    ReactiveFormsModule,
    MatTableModule,

  ],
  templateUrl: './mst-couriercontract.component.html',
  styleUrls: ['./mst-couriercontract.component.css']
})
export class MstCouriercontractComponent implements OnInit {
  courierForm: FormGroup;
  contractForm: FormGroup;
  contractratediscountForm: FormGroup;
  rateGroup: FormGroup;
  discountGroup: FormGroup;


  courierList: Courier[] = [];
  contractList: Contract[] = [];
  //contractRateDiscountList: any[] = [];
  rateList:any[]=[];
  discountList:any[]=[];
  contractRateDiscountDataSource = new MatTableDataSource<any>();

  contractRateDataSource= new MatTableDataSource<any>();
  contractDiscountDataSource= new MatTableDataSource<any>();

  rateDisplayedColumns: string[] = ['sno', 'courierContNo','fromWtGms', 'toWtGms', 'fromDistanceKm', 'toDistanceKm', 'rate', 'actions'];
  discountDisplayedColumns: string[] = ['sno','courierContNo', 'fromMonthlyAmt', 'toMonthlyAmt', 'discountPercentage', 'actions'];


  rates: any[] = [];
  discounts: any[] = [];

  
  showContractForm = false;
  showContractRateForm=false;
  showCourierSuccessMessage: boolean = false;
  showContractSuccessMessage: boolean = false;
  showConfirmation: boolean = false;
  showCourierConfirmation: boolean = false;
  showDiscountConfirmation: boolean = false;
  showRateConfirmation : boolean = false;
  isEditMode: boolean = false;
  editCourierCode: string = '';
  editCourierContractNo: string = ''
  successMessage: string = '';
  selectedCourier: any;
  selectedCouriercontNo:any;
  selectCourierCode:any;
  selectedCourierCode: string | null = null;
  selectedContractIndex: number | null = null;
  selectedCourierIndex:number | null = null;
  selectedContractNo: string | null = null;
  selectedContractRate: string | null = null;
  selectedContractDiscount:string|null=null;


  isEditingRate: boolean = false;
isEditingDiscount: boolean = false;
editingRateIndex: number | null = null;
editingDiscountIndex: number | null = null;

originalRateValues: {
  fromWtGms: number;
  toWtGms: number;
  fromDistanceKm: number;
  toDistanceKm: number;
} | null = null;

originalDiscountValues: {
  fromMonthlyAmt: number;
  toMonthlyAmt: number;
} | null = null;


  constructor(private fb: FormBuilder,
    private dialog: MatDialog,

    private courierService: CourierService,
    private courierHistoryService: CourierhistoryService,
    private couriercontract: MstCouriercontractService,

  ) {
    this.courierForm = this.fb.group({
      courierCode: ['', Validators.required],
      courierName: ['', Validators.required]
    });
    this.contractForm = this.fb.group({

      courierCode: [{ value: '', disabled: true }, Validators.required],
      courierContNo: ['', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['', Validators.required]
    });
    this.contractratediscountForm = this.fb.group({
      courierContNo: [{ value: '', disabled: true }, Validators.required],  // Courier Contract No form control

      // Define sub-groups for rates and discounts
      rateGroup: this.fb.group({
        fromWtGms: [0, Validators.required],
        toWtGms: [0, Validators.required],
        fromDistanceKm: [0, Validators.required],
        toDistanceKm: [0, Validators.required],
        rate: [0, Validators.required]
      }),
      discountGroup: this.fb.group({
        fromMonthlyAmt: [0, Validators.required],
        toMonthlyAmt: [0, Validators.required],
        discountPercentage: [0, Validators.required]
      })
    });
    this.rateGroup = this.contractratediscountForm.get('rateGroup') as FormGroup;
    this.discountGroup = this.contractratediscountForm.get('discountGroup') as FormGroup;
 
  
  // this.rateGroup = this.contractratediscountForm.get('rateGroup') as FormGroup;
  // this.discountGroup = this.contractratediscountForm.get('discountGroup') as FormGroup;
  
  }
  ngOnInit(): void {
    this.loadCouriers();
    const courierContNo = this.contractratediscountForm.get('courierContNo')?.value;
    if (courierContNo) {
      this.loadContractRatesAndDiscounts(courierContNo);
    }
  }


//add courier section------

  onAddCourier(): void {
    if (this.courierForm.valid) {
      const courierData = this.courierForm.getRawValue(); // Include disabled fields like courierCode

      if (this.isEditMode) {
        // Update existing courier
        this.courierHistoryService.updateCourier(this.editCourierCode, courierData).subscribe({
          next: () => {
            this.loadCouriers(); // Refresh list after update
            this.isEditMode = false;
            this.editCourierCode = '';
            this.showCourierSuccessMessage = true;
            this.successMessage = "Courier updated successfully"; // Set update success message
            this.courierForm.reset();
            this.courierForm.get('courierCode')?.enable();

            setTimeout(() => {
              this.showCourierSuccessMessage = false;
            }, 3000);
          },
          error: (error) => {
            console.error('Error updating courier:', error);
          }
        });
      } else {
        this.courierService.addCourier(courierData).subscribe({
          next: (response) => {
            this.courierList.push(response);
            this.courierForm.reset();
            this.courierForm.get('courierCode')?.enable();
            this.showCourierSuccessMessage = true;
            this.successMessage = "Courier added successfully"; // Set add success message
            this.loadCouriers();
            setTimeout(() => {
              this.showCourierSuccessMessage = false;
            }, 3000);
          },
          error: (error) => {
            console.error('Error adding courier:', error);
          }
        });
      }
    } else {
      console.error('Courier form is invalid');
    }
  }

  //courieredit section-----

  editCourier(courier: Courier): void {
    this.isEditMode = true;
  //  this.courierForm.reset();

    this.editCourierCode = courier.courierCode;
    this.courierForm.patchValue({
      courierCode: courier.courierCode,
      courierName: courier.courierName
    });
    this.courierForm.get('courierCode')?.disable();

  }

// courier delete section--------------

  deleteCourier(index: number, courierCode: string): void {
    this.courierHistoryService.changeCourierStatus(courierCode).subscribe({
      next: () => {
        // Remove courier from the list
        this.courierList.splice(index, 1);
        this.courierList = [...this.courierList]; // Update the list to trigger change detection
  
        // Show success message
        this.successMessage = 'Courier deleted successfully';
        this.showCourierSuccessMessage = true;
  
        // Reset the form (if applicable)
        this.courierForm.patchValue({
          courierCode: '',
          courierName: '',
        });
  
        // Hide the message after 3 seconds
        setTimeout(() => {
          this.showCourierSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting courier:', error);
      },
    });
  }
  
  // courier delete confirm message section--------------

  confirmDelete(confirm: boolean): void {
   // const index = this.courierList.findIndex(c => c.courierCode === this.selectedCourierCode);
    if (confirm && this.selectedCourierIndex !== null && this.selectedCourierCode) {

      this.deleteCourier(this.selectedCourierIndex, this.selectedCourierCode);
    }
    this.loadCouriers();
    this.showCourierConfirmation = false;
    this.selectedCourierIndex = null;
    this.selectedCourierCode=null;

  
  }

  openDelConfirmation(index: number, courierCode: string): void {
    this.showCourierConfirmation = true;
    this.selectedCourierIndex = index;
    this.selectedCourierCode = courierCode;
  }
  
// corier load section ---------

  loadCouriers(): void {
    this.courierHistoryService.getCouriers().subscribe({
      next: (couriers) => {
        this.courierList = couriers;
      },
      error: (error) => {
        console.error('Error fetching couriers:', error);
      }
    });
  }

// ----------------------------------------this is courier section end-------------------------------------------------------



 



  // Function to handle adding or updating a contract
  onAddContract(): void {
    if (this.contractForm.valid) {
      // Convert dates to "YYYY-MM-DD" format strings
      const contractData = {
        ...this.contractForm.getRawValue(),
        contractStartDate: formatDate(this.contractForm.value.contractStartDate, 'yyyy-MM-dd', 'en-US'),
        contractEndDate: formatDate(this.contractForm.value.contractEndDate, 'yyyy-MM-dd', 'en-US')
      };

      if (this.isEditMode && this.editCourierContractNo) {
        // Update existing contract
        this.courierHistoryService.updateContract(this.editCourierContractNo, contractData).subscribe({
          next: () => {
            this.loadContracts(this.editCourierContractNo); // Refresh list after update

            this.isEditMode = false;
            this.editCourierContractNo = '';
        //    this.contractForm.reset();
        this.contractForm.patchValue({
          contractStartDate: '',
          contractEndDate: '',
          courierContNo: ''
        });  
            //    this.courierForm.get('courierCode')?.enable(); 
        //    this.contractForm.get('courierCode')?.enable();
            this.contractForm.get('courierContNo')?.enable();

            this.showContractSuccessMessage = true;
            this.successMessage = "Contract updated successfully";
            this.loadContracts(contractData.courierCode);

            setTimeout(() => {
              this.showContractSuccessMessage = false;
            }, 3000);
          },
          error: (error) => {
            console.error('Error updating contract:', error);
          }
        });
      } else {

        
        // Add new contract
        this.couriercontract.createContract(contractData).subscribe({
          next: (response) => {
            this.contractList.push({
              courierCode: contractData.courierCode,
              courierContNo: response,
              contractStartDate: contractData.contractStartDate,
              contractEndDate: contractData.contractEndDate
            });
          //  this.contractForm.reset();
          this.contractForm.patchValue({
            contractStartDate: '',
            contractEndDate: '',
            courierContNo: ''
          });            // this.courierForm.get('courierCode')?.disable();
            this.contractForm.get('courierContNo')?.enable();


            this.showContractSuccessMessage = true;
            this.successMessage = "Contract added successfully";
            this.loadContracts(contractData.courierCode);
            //this.contractForm.get('courierCode')?.disable();


            setTimeout(() => {
              this.showContractSuccessMessage = false;
            }, 3000);
          },
          
          error: (error) => {
            console.error('Error adding contract:', error);
          }
        });
      }
    } else {
      console.error('Contract form is invalid');
    }
  }




  editContract(contract: Contract): void {
    this.isEditMode = true;
    this.editCourierContractNo = contract.courierContNo;

    // Patch the form values with the correct fields from the contract object
    this.contractForm.patchValue({
      courierCode: contract.courierCode.trim(), // trimming in case there are extra spaces
      courierContNo: contract.courierContNo.trim(),
      contractStartDate: this.parseDate(contract.contractStartDate),
      contractEndDate: this.parseDate(contract.contractEndDate)
    });

    // Disable fields for 'courierCode' and 'courierContNo' during edit mode
    this.contractForm.get('courierCode')?.disable();
    this.contractForm.get('courierContNo')?.disable();
  }

  // Helper function to parse date strings to local Date objects
  private parseDate(dateString: string | undefined): Date | null {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Adjust month for zero-based indexing
  }



  deleteContract(index: number, courierContNo: string): void {
    this.courierHistoryService.deleteContract(courierContNo).subscribe({
      next: () => {
        this.contractList.splice(index, 1);
        this.contractList = [...this.contractList];
        this.successMessage = 'Contract deleted successfully';
        this.showContractSuccessMessage = true;
     //   this.contractForm.reset();
     this.contractForm.patchValue({
      contractStartDate: '',
      contractEndDate: '',
      courierContNo: ''
    });  
        setTimeout(() => {
          this.showContractSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting contract:', error);
      }
    });
  }

  confirmDelcontract(confirm: boolean): void {
    if (confirm && this.selectedContractIndex !== null && this.selectedContractNo) {
      this.deleteContract(this.selectedContractIndex, this.selectedContractNo);
    }
    this.showConfirmation = false;
    this.selectedContractIndex = null;
    this.selectedContractNo = null;
  }
  
  openDeleteConfirmation(index: number, courierContNo: string): void {
    this.showConfirmation = true;
    this.selectedContractIndex = index;
    this.selectedContractNo = courierContNo;
  }


  loadContracts(courierCode: string): void {
    this.courierHistoryService.getContractsBasedOnCourierCode(courierCode).subscribe({
      next: (contracts) => {
        this.contractList = contracts;
        this.onRowSelect
      },
      error: (error) => {
        console.error('Error fetching contracts:', error);
      }
    });
  }

// ------------------------------------------------------------------------this is contract end section -------------------

  // deleteCourier(index: number, courierCode: string): void {
  //   this.selectedCourierCode = courierCode;
  //   this.showConfirmation = true;
  // }

  // confirmDelete(confirm: boolean): void {
  //   if (confirm) {
  //     this.courierHistoryService.changeCourierStatus(this.selectedCourierCode).subscribe({
  //       next: () => {

  //         const index = this.courierList.findIndex(c => c.courierCode === this.selectedCourierCode);
  //         if (index !== -1) {
  //           this.courierList.splice(index, 1);
  //         }
  //         this.loadCouriers();
  //         this.showConfirmation = false;

  //       },
  //       error: (error) => {
  //         console.error('Error deleting courier:', error);
  //       }
  //     });
  //   } else {
  //     this.showConfirmation = false;
  //   }
  // }

 

  onRowSelect(row: any, event: MouseEvent): void {
    // Check if the event target is not an action button
    if ((<HTMLElement>event.target).classList.contains('delete-button') ||
      (<HTMLElement>event.target).classList.contains('edit-button')) {
      return; // Prevents row selection if delete or edit was clicked
    }

    this.selectedCourier = row;
    this.showContractForm = true;
    this.showContractRateForm = false;
    this.courierForm.reset();
    this.contractForm.reset();
    this.courierForm.get('courierCode')?.enable(); // Enable courierCode field

    // Fetch and load contracts for selected courier
    this.courierHistoryService.getContractsBasedOnCourierCode(row.courierCode).subscribe({
      next: (contracts) => {
        this.contractList = contracts;
        this.contractForm.patchValue({
          courierCode: row.courierCode
        });

      },
      error: (error) => {
        console.error('Error fetching contracts:', error);
      }
    });
  }




  // onRowSelectofcontract(row: any,event: MouseEvent): void {

  //   if ((<HTMLElement>event.target).classList.contains('delete-button') ||
  //   (<HTMLElement>event.target).classList.contains('edit-button')) {
  //   return; 
  // }
  //   this.selectedCouriercontNo = row;
  //   this.showContractRateForm = true;
  //   this.contractForm.reset();
  //  this.contractForm.get('courierContNo')?.enable(); 

  //  this.contractForm.patchValue({
  //   courierCode: row.courierCode
  // });
  //   this.rateList=[];
  //   this.discountList=[];
  //   this.contractratediscountForm.patchValue({
  //     courierContNo: row.courierContNo
      
  //   });
  //   this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(row.courierContNo).subscribe({
  //     next: (data: any) => {
  //       if (data && Array.isArray(data.discounts) && Array.isArray(data.rates)) {
  //         const mergedList = data.rates.map((rate: any, index: number) => {
  //           const discount = data.discounts[index] || {}; 
  //           return {
  //             ...rate,
  //             ...discount
  //           };
  //         });
  
  //         this.contractRateDiscountList = mergedList;
        

  //       } else {
  //         console.error("Unexpected data structure:", data);
  //         this.contractRateDiscountList = [];
  //       }
  
      
  //     },
     
  //     error: (error) => {
  //       console.error('Error fetching contract rates and discounts:', error);
  //     }
  //   });
  // }
  
  onRowSelectofcontract(row: any, event: MouseEvent): void {
    // Prevent row selection if delete or edit button is clicked
    if ((<HTMLElement>event.target).classList.contains('delete-button') ||
        (<HTMLElement>event.target).classList.contains('edit-button')) {
      return;
    }
  
    this.selectedCouriercontNo = row;
    this.selectCourierCode=row;
    this.showContractRateForm = true;
    this.contractForm.reset();
  
    // Enable courierContNo field
    this.contractForm.get('courierContNo')?.enable();
  
    // Patch the form with the selected row's courierContNo
    this.contractratediscountForm.patchValue({
      courierContNo: row.courierContNo.trim(),
      courierCode:row.courierCode
    });
  
    // Clear the existing lists
    this.rateList = [];
    this.discountList = [];
  
    // Fetch rates and discounts for the selected courierContNo
    this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(row.courierContNo).subscribe({
      next: (data: any) => {
        // Ensure data contains the expected structure
        if (data) {
          // Assign rates and discounts separately
          this.rateList = Array.isArray(data.rates) ? data.rates : [];
          this.discountList = Array.isArray(data.discounts) ? data.discounts : [];
        } else {
          console.error("Unexpected data structure:", data);
          this.rateList = [];
          this.discountList = [];
        }
      },
      error: (error) => {
        console.error('Error fetching contract rates and discounts:', error);
        this.rateList = [];
        this.discountList = [];
      }
    });
  }
  
  
  selectCourier(courier: Courier): void {
    this.courierForm.patchValue({
      courierCode: courier.courierCode,
      courierName: courier.courierName
    });
  }

  



  closeContractForm(): void {
    this.showContractForm = false;
  }
  closeContractrateForm(): void {
    this.showContractRateForm = false;
  }
  

  addDiscount() {
    const discountGroup = this.contractratediscountForm.get('discountGroup');
    if (discountGroup) {
      // Getting the actual values of number fields
      const fromMonthlyAmt = discountGroup.get('fromMonthlyAmt')?.value;
      const toMonthlyAmt = discountGroup.get('toMonthlyAmt')?.value;
      const discountPercentage = discountGroup.get('discountPercentage')?.value;
  
      console.log('Discount Values:', { fromMonthlyAmt, toMonthlyAmt, discountPercentage });
  
      // Check if the values are valid numbers and not 0 or empty
      if (fromMonthlyAmt !== undefined && toMonthlyAmt !== undefined && discountPercentage !== undefined && 
          fromMonthlyAmt !== 0 && toMonthlyAmt !== 0 && discountPercentage !== 0) {
        
        this.discounts.push({ fromMonthlyAmt, toMonthlyAmt, discountPercentage });
        
       // Reset discount values after adding
        discountGroup.reset({
          fromMonthlyAmt: 0,
          toMonthlyAmt: 0,
          discountPercentage: 0
        });
       // this.discountGroup.reset(); // Clears all fields in discountGroup

      } else {
        console.error('Some discount values are missing or invalid.');
      }
    } else {
      console.error('Discount group not found');
    }
  }
  
  addRate() {
    const rateGroup = this.contractratediscountForm.get('rateGroup');
    if (rateGroup) {
      // Getting the actual number values
      const fromWtGms = rateGroup.get('fromWtGms')?.value;
      const toWtGms = rateGroup.get('toWtGms')?.value;
      const fromDistanceKm = rateGroup.get('fromDistanceKm')?.value;
      const toDistanceKm = rateGroup.get('toDistanceKm')?.value;
      const rate = rateGroup.get('rate')?.value;
  
      console.log('Rate Values:', { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
  
      // Check if the values are valid numbers and not 0 or empty
      if (fromWtGms !== undefined && toWtGms !== undefined && fromDistanceKm !== undefined && 
          toDistanceKm !== undefined && rate !== undefined && 
          fromWtGms !== 0 && toWtGms !== 0 && fromDistanceKm !== 0 && 
          toDistanceKm !== 0 && rate !== 0) {
        
        this.rates.push({ fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
        
        // Reset rate values after adding
        rateGroup.reset({
          fromWtGms: 0,
          toWtGms: 0,
          fromDistanceKm: 0,
          toDistanceKm: 0,
          rate: 0
        });
      //  this.rateGroup.reset(); // Clears all fields in rateGroup
      } else {
        console.error('Some rate values are missing or invalid.');
      }
    } else {
      console.error('Rate group not found');
    }
  }
 
  removeDiscount(index: number) {
    this.discounts.splice(index, 1);
  }

  
  
  removeRate(index: number) {
    this.rates.splice(index, 1);
  }



// Initialize MatTableDataSource for contractRateDiscountList

// loadContractRatesAndDiscounts(courierContNo: string): void {
//   this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(courierContNo).subscribe({
//     next: (data: any) => {
//       if (data && Array.isArray(data.discounts) && Array.isArray(data.rates)) {
//         const mergedList = data.rates.map((rate: any, index: number) => {
//           const discount = data.discounts[index] || {};
//           return {
//             ...rate,
//             ...discount
//           };
//         });
        
//         this.contractRateDiscountList = mergedList;
//         this.contractRateDiscountDataSource.data = this.contractRateDiscountList; // Set data to MatTableDataSource
//       } else {
//         console.error("Unexpected data structure:", data);
//         this.contractRateDiscountList = [];
//         this.contractRateDiscountDataSource.data = this.contractRateDiscountList; // Reset if data is unexpected
//       }
//     },
//     error: (error) => {
//       console.error('Error fetching contract rates and discounts:', error);
//       this.contractRateDiscountList = [];
//       this.contractRateDiscountDataSource.data = this.contractRateDiscountList; // Reset on error
//     }
//   });
// }

// loadContractRatesAndDiscounts(courierContNo: string): void {
//   this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(courierContNo).subscribe({
//     next: (data: any) => {
//       if (data) {
//         this.rateList = Array.isArray(data.rates) ? data.rates : [];
//         this.discountList = Array.isArray(data.discounts) ? data.discounts : [];
        
//         this.contractRateDiscountDataSource.data = this.rateList; 
//         this.contractRateDiscountDataSource.data = this.discountList; 
//       } else {
//         console.error("Unexpected data structure:", data);
//         this.rateList = [];
//         this.discountList = [];
        
//         this.contractRateDiscountDataSource.data = this.rateList;
//         this.contractRateDiscountDataSource.data = this.discountList;
//       }
//     },
//     error: (error) => {
//       console.error('Error fetching contract rates and discounts:', error);
      
//       this.rateList = [];
//       this.discountList = [];
//       this.contractRateDiscountDataSource.data = this.rateList;
//       this.contractRateDiscountDataSource.data = this.discountList;
//     }
//   });
// }
loadContractRatesAndDiscounts(courierContNo: string): void {
  this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(courierContNo).subscribe({
    next: (data: any) => {
      if (data) {
        this.rateList = Array.isArray(data.rates) ? data.rates : [];
        this.discountList = Array.isArray(data.discounts) ? data.discounts : [];

        // Update the data sources for the tables
        this.contractRateDataSource.data = this.rateList; // For rates table
        this.contractDiscountDataSource.data = this.discountList; // For discounts table
      } else {
        console.error("Unexpected data structure:", data);
        this.clearListsAndDataSources();
      }
    },
    error: (error) => {
      console.error('Error fetching contract rates and discounts:', error);
      this.clearListsAndDataSources();
    }
  });
}

private clearListsAndDataSources(): void {
  this.rateList = [];
  this.discountList = [];
  this.contractRateDataSource.data = this.rateList;
  this.contractDiscountDataSource.data = this.discountList;
}


  // submitForm() {
  //   console.log('Form values before validation:', this.contractratediscountForm.value);
  
  //   const courierContNo = this.contractratediscountForm.get('courierContNo')?.value;
  
  //   if (this.contractratediscountForm.invalid) {
  //     console.error('Form is invalid. Errors:', this.contractratediscountForm.errors);
  //     return;
  //   }
  
  //   const formValues = {
  //     courierContNo: courierContNo,
  //     courierRates: this.rates,
  //     courierDiscounts: this.discounts,
  //   };
  //   console.log('Form Submitted', formValues);
  
  //   this.couriercontract.createContractRatesAndDiscounts(formValues)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Contract rates and discounts created successfully:', response);
  //         this.successMessage = 'Rates And Discounts Added Successfully';
  
  //         this.rates = [];
  //         this.discounts = [];
  
  //         setTimeout(() => {
         
  //         this.rateGroup.reset(); 
  //         this.discountGroup.reset(); 
  //         }, 3000);
  
  //         this.loadContractRatesAndDiscounts(courierContNo);
          
  //         this.showContractSuccessMessage = true;
      
  //         setTimeout(() => {
  //           this.showContractSuccessMessage = false;
  //         }, 3000);
  //       },
  //       error: (error) => {
  //         console.log("Data being sent:", formValues);
  //         console.error('Error creating contract rates and discounts:', error);
  //       }
  //     });
  // }

  // submitForm() {

  //   const rateGroup = this.contractratediscountForm.get('rateGroup');
  //   if (rateGroup) {
  //     const fromWtGms = rateGroup.get('fromWtGms')?.value;
  //     const toWtGms = rateGroup.get('toWtGms')?.value;
  //     const fromDistanceKm = rateGroup.get('fromDistanceKm')?.value;
  //     const toDistanceKm = rateGroup.get('toDistanceKm')?.value;
  //     const rate = rateGroup.get('rate')?.value;
  
  //     console.log('Rate Values:', { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
  
  //     if (fromWtGms !== undefined && toWtGms !== undefined && fromDistanceKm !== undefined && 
  //         toDistanceKm !== undefined && rate !== undefined && 
  //         fromWtGms !== 0 && toWtGms !== 0 && fromDistanceKm !== 0 && 
  //         toDistanceKm !== 0 && rate !== 0) {
        
  //       this.rates.push({ fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate });
        
  //       rateGroup.reset({
  //         fromWtGms: 0,
  //         toWtGms: 0,
  //         fromDistanceKm: 0,
  //         toDistanceKm: 0,
  //         rate: 0
  //       });
  //     } else {
  //       console.error('Some rate values are missing or invalid.');
  //     }
  //   } else {
  //     console.error('Rate group not found');
  //   }


  //   const discountGroup = this.contractratediscountForm.get('discountGroup');
  //   if (discountGroup) {
  //     const fromMonthlyAmt = discountGroup.get('fromMonthlyAmt')?.value;
  //     const toMonthlyAmt = discountGroup.get('toMonthlyAmt')?.value;
  //     const discountPercentage = discountGroup.get('discountPercentage')?.value;
  
  //     console.log('Discount Values:', { fromMonthlyAmt, toMonthlyAmt, discountPercentage });
  
  //     if (fromMonthlyAmt !== undefined && toMonthlyAmt !== undefined && discountPercentage !== undefined && 
  //         fromMonthlyAmt !== 0 && toMonthlyAmt !== 0 && discountPercentage !== 0) {
        
  //       this.discounts.push({ fromMonthlyAmt, toMonthlyAmt, discountPercentage });
        
  //       discountGroup.reset({
  //         fromMonthlyAmt: 0,
  //         toMonthlyAmt: 0,
  //         discountPercentage: 0
  //       });

  //     } else {
  //       console.error('Some discount values are missing or invalid.');
  //     }
  //   } else {
  //     console.error('Discount group not found');
  //   }

  //   console.log('Form values before validation:', this.contractratediscountForm.value);
  
  //   const courierContNo = this.contractratediscountForm.get('courierContNo')?.value;
  
  //   if (this.contractratediscountForm.invalid) {
  //     console.error('Form is invalid. Errors:', this.contractratediscountForm.errors);
  //     return;
  //   }
  
  //   const formValues = {
  //     courierContNo: courierContNo,
  //     courierRates: this.rates.length > 0 ? this.rates : [], 
  //     courierDiscounts: this.discounts.length > 0 ? this.discounts : []
  //   };
  
  //   console.log('Form Submitted', formValues);
  
  //   this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
  //     next: (response) => {
  //       console.log('Contract rates and discounts created successfully:', response);
  
  //       this.successMessage = 'Rates And Discounts Added Successfully';
  //       this.showContractSuccessMessage = true;
  
  //       this.rates = [];
  //       this.discounts = [];
  
  //       setTimeout(() => {
  //         const rateGroup = this.contractratediscountForm.get('rateGroup');
  //         const discountGroup = this.contractratediscountForm.get('discountGroup');
          
  //         if (rateGroup) {
  //           rateGroup.reset({
  //             fromWtGms: 0,
  //             toWtGms: 0,
  //             fromDistanceKm: 0,
  //             toDistanceKm: 0,
  //             rate: 0
  //           });
  //         }
  
  //         if (discountGroup) {
  //           discountGroup.reset({
  //             fromMonthlyAmt: 0,
  //             toMonthlyAmt: 0,
  //             discountPercentage: 0
  //           });
  //         }
  //       }, 3000);
  
  //       this.loadContractRatesAndDiscounts(courierContNo);
  
  //       setTimeout(() => {
  //         this.showContractSuccessMessage = false;
  //       }, 3000);
  //     },
  //     error: (error) => {
  //       console.log("Data being sent:", formValues);
  //       console.error('Error creating contract rates and discounts:', error);
  //     }
  //   });
  // }
  
  // submitForm(): void {
  //   if (this.contractratediscountForm.invalid) {
  //     console.log('Form is invalid!');
  //     return;
  //   }
    
  
  //   let courierContNo = this.contractratediscountForm.get('courierContNo')?.value.trim(); 
  // console.log(`Submitting form for courier contract: ${courierContNo}`);
  
    
  // if (this.isEditingRate) {
  //   console.log('Editing rate...');
  //   const rateGroup = this.contractratediscountForm.get('rateGroup');

  //   if (rateGroup) {
  //     const fromWtGms = rateGroup.get('fromWtGms')?.value;
  //     const toWtGms = rateGroup.get('toWtGms')?.value;
  //     const fromDistanceKm = rateGroup.get('fromDistanceKm')?.value;
  //     const toDistanceKm = rateGroup.get('toDistanceKm')?.value;
  //     const rate = rateGroup.get('rate')?.value;

  //     const updatedRate = { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm ,rate};

  //     console.log('Updated Rate Data:', updatedRate);

  //     if (
  //       fromWtGms && toWtGms && fromDistanceKm && toDistanceKm && rate &&
  //       fromWtGms > 0 && toWtGms > 0 && fromDistanceKm > 0 && toDistanceKm > 0 && rate > 0
  //     ) {
  //       this.courierHistoryService.updateCourierRate(courierContNo, updatedRate,fromWtGms,toWtGms,fromDistanceKm,toDistanceKm).subscribe({
  //         next: (response: any) => {
  //           if (response?.status === 'contract rate successfully.' && response?.status_code === 200) {
  //             console.log('Rate update acknowledged by backend:', response);
  //           } else {
  //             console.warn('Unexpected response from backend:', response);
  //           }
  //           console.log('Rate updated successfully:', response);

  //           this.loadContractRatesAndDiscounts(courierContNo);

  //           rateGroup.reset({
  //             fromWtGms: 0,
  //             toWtGms: 0,
  //             fromDistanceKm: 0,
  //             toDistanceKm: 0,
  //             rate: 0
  //           });
  //           console.log('Rate group reset after update');
  //         },
  //         error: (error) => {
  //           console.error('Error updating rate:', error);
  //         }
  //       });
  //     } else {
  //       console.error('Invalid or missing values for rate update.');
  //     }
  //   } else {
  //     console.error('Rate group not found in the form.');
  //   }
  // }

  //    else if (this.isEditingDiscount) {
  //     console.log('Editing discount...');
  //     const updatedDiscount = this.contractratediscountForm.get('discountGroup')?.value;
  //     const { fromMonthlyAmt, toMonthlyAmt } = updatedDiscount;
  
  //     console.log('Updated Discount Data:', updatedDiscount);
  
  //     this.courierHistoryService.updateCourierDiscount(
  //       courierContNo,
  //       updatedDiscount,
  //       fromMonthlyAmt,
  //       toMonthlyAmt
  //     ).subscribe(
  //       (response) => {
  //         console.log('Discount updated successfully:', response);
  //         this.loadContractRatesAndDiscounts(courierContNo);
  //         this. discountGroup.reset({
  //           fromMonthlyAmt: 0,
  //           toMonthlyAmt: 0,
  //           discountPercentage: 0
  //         });
  //         console.log('Discount group reset after update');
  //       },
  //       (error) => {
  //         console.error('Error updating discount:', error);
  //       }
  //     );
  
  //   } else {


   
  //     console.log('Creating new contract rates and discounts...');
  //     const rateGroup = this.contractratediscountForm.get('rateGroup')?.value;
  //     const discountGroup = this.contractratediscountForm.get('discountGroup')?.value;
  
  //     const formValues = {
  //       courierContNo,
  //       courierRates: this.rates.length > 0 ? this.rates : [rateGroup],
  //       courierDiscounts: this.discounts.length > 0 ? this.discounts : [discountGroup]
  //     };
  
  //     console.log('Form Values being sent for creation:', formValues);
  
  //     this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
  //       next: (response) => {
  //         console.log('Contract rates and discounts created successfully:', response);
  
  //         this.successMessage = 'Rates And Discounts Added Successfully';
  //         this.showContractSuccessMessage = true;
  //         console.log('Success message displayed: Rates And Discounts Added Successfully');
  
  //         this.rates = [];
  //         this.discounts = [];
  
  //         setTimeout(() => {
  //           const rateGroup = this.contractratediscountForm.get('rateGroup');
  //           const discountGroup = this.contractratediscountForm.get('discountGroup');
  
  //           if (rateGroup) {
  //             rateGroup.reset({
  //               fromWtGms: 0,
  //               toWtGms: 0,
  //               fromDistanceKm: 0,
  //               toDistanceKm: 0,
  //               rate: 0
  //             });
  //             console.log('Rate group reset after successful creation');
  //           }
  
  //           if (discountGroup) {
  //             discountGroup.reset({
  //               fromMonthlyAmt: 0,
  //               toMonthlyAmt: 0,
  //               discountPercentage: 0
  //             });
  //             console.log('Discount group reset after successful creation');
  //           }
  //         }, 3000);
  
  //         this.loadContractRatesAndDiscounts(courierContNo);
  
  //         setTimeout(() => {
  //           this.showContractSuccessMessage = false;
  //           console.log('Success message hidden after timeout');
  //         }, 3000);
  //       },
  //       error: (error) => {
  //         console.log("Data being sent:", formValues);
  //         console.error('Error creating contract rates and discounts:', error);
  //       }
  //     });
  //   }
  // }
  
  // edittype(element: any, type: string): void {
  //   console.log(`Editing ${type}...`);
  
  //   if (type === 'rate') {
  //     this.isEditingRate = true;
  //     this.isEditingDiscount = false;
  
  //     this.contractratediscountForm.patchValue({
  //       rateGroup: {
  //         fromWtGms: element.fromWtGms,
  //         toWtGms: element.toWtGms,
  //         fromDistanceKm: element.fromDistanceKm,
  //         toDistanceKm: element.toDistanceKm,
  //         rate: element.rate
  //       }
  //     });
    
  //   } else if (type === 'discount') {
  //     this.isEditingDiscount = true;
  //     this.isEditingRate = false;
  
  //     this.contractratediscountForm.patchValue({
  //       discountGroup: {
  //         fromMonthlyAmt: element.fromMonthlyAmt,
  //         toMonthlyAmt: element.toMonthlyAmt,
  //         discountPercentage: element.discountPercentage
  //       }
  //     });
  
  //     console.log('Discount group populated with:', element);
  //   }
  // }
  
  submitForm(): void {
    if (this.contractratediscountForm.invalid) {
      console.log('Form is invalid!');
      return;
    }

    const courierContNo = this.contractratediscountForm.get('courierContNo')?.value.trim();
    if (!courierContNo) {
      console.error('Courier Contract Number is required.');
      return;
    }

    if (this.isEditingRate) {
      this.updateRate(courierContNo);
    } else if (this.isEditingDiscount) {
      this.updateDiscount(courierContNo);
    } else {
      this.createContractRatesAndDiscounts(courierContNo);
    }
  }

  private updateRate(courierContNo: string): void {
    const rateGroup = this.contractratediscountForm.get('rateGroup');
  
    if (!rateGroup) {
      console.error('Rate group not found in the form.');
      return;
    }
  
    // Extract updated rate data from the form
    const updatedRate = rateGroup.value;
    console.log('Updated Rate Data:', updatedRate);
  
    if (!this.originalRateValues) {
      console.error('Original rate values are missing.');
      return;
    }
  
    const { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm } = this.originalRateValues;
  
    if (this.validateRate(updatedRate)) {
      this.courierHistoryService
        .updateCourierRate(
          courierContNo,
          updatedRate,
          fromWtGms,
          toWtGms,
          fromDistanceKm,
          toDistanceKm
        )
        .subscribe({
          next: (response) => {
            console.log('Rate updated successfully:', response);
            this.resetRateGroup();  // Reset the form after success
            this.showSuccessMessage('Rate updated successfully!');
            this.loadContractRatesAndDiscounts(courierContNo);
            this.originalRateValues = null; // Reset the original values after update
            
            // Reset editing flags to switch back to Add mode
            this.isEditingRate = false;
            this.isEditingDiscount = false;
          },
          error: (error) => {
            console.error('Error updating rate:', error);
          },
        });
    } else {
      console.error('Invalid or missing values for rate update.');
    }
  }
  
  private updateDiscount(courierContNo: string): void {
    const discountGroup = this.contractratediscountForm.get('discountGroup');
  
    if (!discountGroup) {
      console.error('Discount group not found in the form.');
      return;
    }
  
    const updatedDiscount = discountGroup.value;
  
    console.log('Updated Discount Data:', updatedDiscount);
  
    if (!this.originalDiscountValues) {
      console.error('Original discount values are missing.');
      return;
    }
  
    const { fromMonthlyAmt, toMonthlyAmt } = this.originalDiscountValues;
  
    if (this.validateDiscount(updatedDiscount)) {
      this.courierHistoryService
        .updateCourierDiscount(
          courierContNo,
          updatedDiscount,
          fromMonthlyAmt,
          toMonthlyAmt
        )
        .subscribe({
          next: (response: any) => {
            console.log('Discount updated successfully:', response);
            this.resetDiscountGroup();
            this.showSuccessMessage('Discount updated successfully!');
            this.loadContractRatesAndDiscounts(courierContNo);
            this.originalDiscountValues = null;
  
            // Reset editing flags to switch back to Add mode
            this.isEditingRate = false;
            this.isEditingDiscount = false;
          },
          error: (error) => {
            console.error('Error updating discount:', error);
          },
        });
    } else {
      console.error('Invalid or missing values for discount update.');
    }
  }
  
  
  
  
  
  // private createContractRatesAndDiscounts(courierContNo: string): void {
  //   const rateGroup = this.contractratediscountForm.get('rateGroup')?.value;
  //   const discountGroup = this.contractratediscountForm.get('discountGroup')?.value;

  //   const formValues = {
  //     courierContNo,
  //     courierRates: this.rates.length > 0 ? this.rates : [rateGroup],
  //     courierDiscounts: this.discounts.length > 0 ? this.discounts : [discountGroup],
  //   };

  //   this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
  //     next: (response) => {
  //       console.log('Contract rates and discounts created successfully:', response);
  //       this.showSuccessMessage('Rates and Discounts added successfully!');
  //       this.resetRateGroup();
  //       this.resetDiscountGroup();
  //       this.loadContractRatesAndDiscounts(courierContNo);
  //     },
  //     error: (error) => console.error('Error creating contract rates and discounts:', error),
  //   });
  // }
  private createContractRatesAndDiscounts(courierContNo: string): void {
    // Validate courierContNo
    if (!courierContNo || courierContNo.trim() === '') {
      console.error('Courier Contract Number is required.');
      return; // Exit if courierContNo is missing
    }
  
    // Gather values from the form
    const rateGroup = this.contractratediscountForm.get('rateGroup')?.value;
    const discountGroup = this.contractratediscountForm.get('discountGroup')?.value;
  
    // Prepare the payload
    let formValues: any = { courierContNo };
  
    // Validate and add rates
    if (rateGroup && this.isRateGroupValid(rateGroup)) {
      this.rates.push({ ...rateGroup }); // Add the current rate group to rates array
    }
    formValues.courierRates = [...this.rates]; // Ensure all added rates are sent
  
    // Validate and add discounts
    if (discountGroup && this.isDiscountGroupValid(discountGroup)) {
      this.discounts.push({ ...discountGroup }); // Add the current discount group to discounts array
    }
    formValues.courierDiscounts = [...this.discounts]; // Ensure all added discounts are sent
  
    // Log final payload for debugging
    console.log('Final payload being sent:', JSON.stringify(formValues));
  
    // Call the service to create contract rates and discounts
    this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
      next: (response) => {
        console.log('Contract rates and discounts created successfully:', response);
  
        this.resetRateAndDiscountGroups();
        // Show success message
       this.successMessage = 'Rates And Discounts Added Successfully';
        this.showContractSuccessMessage = true;
  
        // Reload data to update UI
        this.loadContractRatesAndDiscounts(courierContNo);
  
        // Hide success message after a timeout
        setTimeout(() => {
          this.showContractSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating contract rates and discounts:', error);
      }
    });
  }
  
  // Method to validate rate group
  public isRateGroupValid(rateGroup: any): boolean {
    const isValid =
      rateGroup &&
      rateGroup.fromWtGms >= 0 &&
      rateGroup.toWtGms >= rateGroup.fromWtGms &&
      rateGroup.fromDistanceKm >= 0 &&
      rateGroup.toDistanceKm >= rateGroup.fromDistanceKm &&
      rateGroup.rate > 0;
  
    if (!isValid) {
      console.warn('Rate group validation failed:', rateGroup);
    }
    return isValid;
  }
  
  // Method to validate discount group
  public isDiscountGroupValid(discountGroup: any): boolean {
    const isValid =
      discountGroup &&
      discountGroup.fromMonthlyAmt >= 0 &&
      discountGroup.toMonthlyAmt >= discountGroup.fromMonthlyAmt &&
      discountGroup.discountPercentage > 0;
  
    if (!isValid) {
      console.warn('Discount group validation failed:', discountGroup);
    }
    return isValid;
  }
  
  
  private resetRateAndDiscountGroups(): void {
    const rateGroup = this.contractratediscountForm.get('rateGroup');
    const discountGroup = this.contractratediscountForm.get('discountGroup');
  
    // Reset rate group values to default
    if (rateGroup) {
      rateGroup.reset({
        fromWtGms: 0,
        toWtGms: 0,
        fromDistanceKm: 0,
        toDistanceKm: 0,
        rate: 0
      });
    }
  
    // Reset discount group values to default
    if (discountGroup) {
      discountGroup.reset({
        fromMonthlyAmt: 0,
        toMonthlyAmt: 0,
        discountPercentage: 0
      });
    }
  }
  // private createContractRatesAndDiscounts(courierContNo: string): void {
  //   // Validate courierContNo before proceeding
  //   if (!courierContNo || courierContNo.trim() === '') {
  //     console.error('Courier Contract Number is required.');
  //     return; // Prevent further processing if courierContNo is empty
  //   }
  
  //   // Gather the form values
  //   const rateGroup = this.contractratediscountForm.get('rateGroup')?.value;
  //   const discountGroup = this.contractratediscountForm.get('discountGroup')?.value;
  
  //   // Prepare the form values object to be sent in the request
  //   let formValues: any = { courierContNo };
  
  //   // Check if the user is adding rates only
  //   if (this.rates.length > 0) {
  //     // If rates are already added, only send the rates data
  //     formValues.courierRates = this.rates;
  //   } else if (rateGroup && this.isRateGroupValid(rateGroup)) {
  //     // If a rate group exists and is valid, add the rateGroup to the form values
  //     formValues.courierRates = [rateGroup];
  //   }
  
  //   // Check if the user is adding discounts only
  //   if (this.discounts.length > 0) {
  //     // If discounts are already added, only send the discounts data
  //     formValues.courierDiscounts = this.discounts;
  //   } else if (discountGroup && this.isDiscountGroupValid(discountGroup)) {
  //     // If a discount group exists and is valid, add the discountGroup to the form values
  //     formValues.courierDiscounts = [discountGroup];
  //   }
  
  //   // Ensure that only one of either rates or discounts is added
  //   // If both are missing or both are present, log an error and return
  //   if (!formValues.courierRates && !formValues.courierDiscounts) {
  //     console.error('Neither valid rates nor valid discounts are provided.');
  //     return;
  //   }
  
  //   // Log the final form values to check before sending
  //   console.log('Form Submitted:', formValues);
  
  //   // Call the service to create contract rates and discounts
  //   this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
  //     next: (response) => {
  //       console.log('Contract rates and discounts created successfully:', response);
  
  //       // Show success message after successful submission
  //       this.successMessage = 'Rates And Discounts Added Successfully';
  //       this.showContractSuccessMessage = true;
  
  //       // Clear the rates and discounts arrays after submission
  //       this.rates = [];
  //       this.discounts = [];
  
  //       // Reset the rate and discount groups after a timeout
  //       setTimeout(() => {
  //         const rateGroup = this.contractratediscountForm.get('rateGroup');
  //         const discountGroup = this.contractratediscountForm.get('discountGroup');
  
  //         // Reset rate group values to default
  //         if (rateGroup) {
  //           rateGroup.reset({
  //             fromWtGms: 0,
  //             toWtGms: 0,
  //             fromDistanceKm: 0,
  //             toDistanceKm: 0,
  //             rate: 0
  //           });
  //         }
  
  //         // Reset discount group values to default
  //         if (discountGroup) {
  //           discountGroup.reset({
  //             fromMonthlyAmt: 0,
  //             toMonthlyAmt: 0,
  //             discountPercentage: 0
  //           });
  //         }
  //       }, 3000); // After 3 seconds, reset the groups
  
  //       // Reload contract rates and discounts
  //       this.loadContractRatesAndDiscounts(courierContNo);
  
  //       // Hide success message after another timeout
  //       setTimeout(() => {
  //         this.showContractSuccessMessage = false;
  //       }, 3000);
  //     },
  //     error: (error) => {
  //       // Log the form values being sent and any error that occurs
  //       console.log("Data being sent:", formValues);
  //       console.error('Error creating contract rates and discounts:', error);
  //     }
  //   });
  // }
  
  // // Method to validate rate group
  // public isRateGroupValid(rateGroup: any): boolean {
  //   // Check that all required fields are present and non-negative
  //   return (
  //     rateGroup &&
  //     rateGroup.fromWtGms >= 0 &&
  //     rateGroup.toWtGms >= 0 &&
  //     rateGroup.fromDistanceKm >= 0 &&
  //     rateGroup.toDistanceKm >= 0 &&
  //     rateGroup.rate >= 0
  //   );
  // }
  
  // // Method to validate discount group
  // public isDiscountGroupValid(discountGroup: any): boolean {
  //   // Check that all required fields are present and non-negative
  //   return (
  //     discountGroup &&
  //     discountGroup.fromMonthlyAmt >= 0 &&
  //     discountGroup.toMonthlyAmt >= 0 &&
  //     discountGroup.discountPercentage >= 0
  //   );
  // }
  
  
  private resetRateGroup(): void {
    this.contractratediscountForm.get('rateGroup')?.reset({
      fromWtGms: 0,
      toWtGms: 0,
      fromDistanceKm: 0,
      toDistanceKm: 0,
      rate: 0,
    });
  }

  private resetDiscountGroup(): void {
    this.contractratediscountForm.get('discountGroup')?.reset({
      fromMonthlyAmt: 0,
      toMonthlyAmt: 0,
      discountPercentage: 0,
    });
  }

  private validateRate(rate: any): boolean {
    const { fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rate: rateValue } = rate;
    return [fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, rateValue].every((value) => value > 0);
  }

  private validateDiscount(discount: any): boolean {
    const { fromMonthlyAmt, toMonthlyAmt, discountPercentage } = discount;
    return [fromMonthlyAmt, toMonthlyAmt, discountPercentage].every((value) => value > 0);
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showContractSuccessMessage = true;
    setTimeout(() => {
      this.showContractSuccessMessage = false;
    }, 3000);
  }
  // Handles the editing of rate or discount
  edittype(element: any, type: string): void {
    console.log(`Editing ${type}...`);
  
    if (type === 'rate') {
      this.isEditingRate = true;
      this.isEditingDiscount = false;
  
      // Store the original rate primary key values
      this.originalRateValues = {
        fromWtGms: element.fromWtGms,
        toWtGms: element.toWtGms,
        fromDistanceKm: element.fromDistanceKm,
        toDistanceKm: element.toDistanceKm,
      };
  
      // Populate the rate form group
      this.contractratediscountForm.patchValue({
        rateGroup: {
          fromWtGms: element.fromWtGms,
          toWtGms: element.toWtGms,
          fromDistanceKm: element.fromDistanceKm,
          toDistanceKm: element.toDistanceKm,
          rate: element.rate,
        },
      });
  
      console.log('Rate group populated with:', element);
  
    } else if (type === 'discount') {
      this.isEditingDiscount = true;
      this.isEditingRate = false;
  
      // Store the original discount values if needed
      this.originalDiscountValues = {
        fromMonthlyAmt: element.fromMonthlyAmt,
        toMonthlyAmt: element.toMonthlyAmt,
      };
  
      // Populate the discount form group
      this.contractratediscountForm.patchValue({
        discountGroup: {
          fromMonthlyAmt: element.fromMonthlyAmt,
          toMonthlyAmt: element.toMonthlyAmt,
          discountPercentage: element.discountPercentage,
        },
      });
  
      console.log('Discount group populated with:', element);
    }
  }
  
  
  delete(contract: any): void {
    const courierContNo = (contract.courierContNo || '').trim();
    const fromWtGms = contract.fromWtGms;
    const toWtGms = contract.toWtGms;
    const fromDistanceKm = contract.fromDistanceKm;
    const toDistanceKm = contract.toDistanceKm;
   
    this.courierHistoryService
      .deleteContractRateDiscount(courierContNo, fromWtGms, toWtGms, fromDistanceKm, toDistanceKm)
      .subscribe({
        next: (response) => {
          console.log('Contract deleted successfully:', response);
          this.successMessage = 'Rate Deleted Successfully';
  
          this.showContractSuccessMessage = true;
          setTimeout(() => {
            this.showContractSuccessMessage = false;
          }, 3000);
          // Remove the deleted contract from the list or refresh the list
          this.rateList = this.rateList.filter(c => c !== contract);
        },
        error: (error) => {
          console.error('Error deleting contract:', error);
        }
      });
  }


  deletediscount(contract: any): void {
    const courierContNo = contract.courierContNo;
    const fromMonthlyAmt = contract.fromMonthlyAmt;
    const toMonthlyAmt = contract.toMonthlyAmt;

    this.courierHistoryService
      .deleteContractDiscount(courierContNo, fromMonthlyAmt, toMonthlyAmt)
      .subscribe({
        next: (response) => {
          console.log('Contract deleted successfully:', response);
          this.successMessage = 'Discount Deleted Successfully';
  
          this.showContractSuccessMessage = true;
          setTimeout(() => {
            this.showContractSuccessMessage = false;
          }, 3000);
          // Remove the deleted contract from the list or refresh the list
          this.discountList = this.discountList.filter(c => c !== contract);
        },
        error: (error) => {
          console.error('Error deleting contract:', error);
        }
      });
  }



  confirmDelcontractRate(isconfirm: boolean): void {
  
    if (isconfirm && this.selectedContractRate) {
      this.delete(this.selectedContractRate); // Call the delete function
    }
     
    this.showRateConfirmation = false;
  
   // this.selectedContractIndex = null;
    this.selectedContractRate = null;
  }
  
  openDeleteConfirmationsforrate(courierrate: any): void {
    console.log('Opening confirmation dialog for deletion.'); // Log when the dialog is opened
  
    this.showRateConfirmation = true;
    // this.selectedContractIndex = index;
    this.selectedContractRate = courierrate;
  
  
  }
  

  
  // openDeleteConfirmationsforrate(index: number, courierrate: any): void {
  //   this.showConfirmation = true;
  //   this.selectedContractIndex = index;
  // this.selectedContractRate=courierrate;
  // }

  openDeleteConfirmationsforDiscount(courierdiscount: any): void {
    this.showDiscountConfirmation = true;
  //  this.selectedContractIndex = index;
  //  this.selectedContractNo = courierContNo;
  this.selectedContractDiscount=courierdiscount;
  }


 

  // confirmDelcontractRate(confirm: boolean): void {
   
  //   if (confirm && this.selectedContractIndex !== null && this.selectedContractRate) {
      
  //     this.delete(this.selectedContractIndex,this.selectedContractRate);
  //   }
  //   this.showConfirmation = false;
  //   this.selectedContractIndex = null;
  //   this.selectedContractRate = null;
  // }


  confirmDelcontractDiscount(confirm: boolean): void {
    if (confirm && this.selectedContractDiscount) {
      this.deletediscount(this.selectedContractDiscount);
    }
  
    this.showDiscountConfirmation  = false;
   // this.selectedContractIndex = null;
    this.selectedContractDiscount=null;
  }




edit(index: number): void {
  this.showConfirmation = true;
}
  
  

}
