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
  //contractRateDiscountList: RateDiscount[]=[];

  contractRateDiscountList: any[] = [];
  rateList:any[]=[];
  discountList:any[]=[];
  contractRateDiscountDataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'sno',
    'courierContNo',
    'fromWtGms',
    'toWtGms',
    'fromDistanceKm',
    'toDistanceKm',
    'rate',
    'fromMonthlyAmt',
    'toMonthlyAmt',
    'discountPercentage',
    'actions'
  ];

  rateDisplayedColumns: string[] = ['sno', 'courierContNo','fromWtGms', 'toWtGms', 'fromDistanceKm', 'toDistanceKm', 'rate', 'actions'];
discountDisplayedColumns: string[] = ['sno','courierContNo', 'fromMonthlyAmt', 'toMonthlyAmt', 'discountPercentage', 'actions'];



  // discounts: Array<{ fromMonthlyAmt: number; toMonthlyAmt: number; discountPercentage: number }> = [];
  // rates: Array<{ fromWtGms: number; toWtGms: number; fromDistanceKm: number; toDistanceKm: number; rate: number }> = [];

  rates: any[] = [];
  discounts: any[] = [];

  selectedCourier: any;
  selectedCouriercontNo:any;
  showContractForm = false;
  showContractRateForm=false;
  //showSuccessMessage: boolean = false; 
  showCourierSuccessMessage: boolean = false;
  showContractSuccessMessage: boolean = false;
  showConfirmation: boolean = false;
  selectedCourierCode: string = '';
  isEditMode: boolean = false;
  editCourierCode: string = '';
  editCourierContractNo: string = ''
  successMessage: string = '';
  selectedContractIndex: number | null = null;
  selectedCourierIndex:number | null = null;
  selectedContractNo: string | null = null;
  selectedContractRate: string | null = null;

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
    // this.contractratediscountForm = this.fb.group({
    //   courierContNo: ['', Validators.required],
    //   fromWtGms: [0, [Validators.required, Validators.min(0)]],
    //   toWtGms: [0, [Validators.required, Validators.min(0)]],
    //   fromDistanceKm: [0, [Validators.required, Validators.min(0)]],
    //   toDistanceKm: [0, [Validators.required, Validators.min(0)]],
    //   rate: [0, [Validators.required, Validators.min(0)]],
    //   fromMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
    //   toMonthlyAmt: [0, [Validators.required, Validators.min(0)]],
    //   discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    
    // });
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
 
  
  this.rateGroup = this.contractratediscountForm.get('rateGroup') as FormGroup;
  this.discountGroup = this.contractratediscountForm.get('discountGroup') as FormGroup;
  
  }
  ngOnInit(): void {
    this.loadCouriers();
    const courierContNo = this.contractratediscountForm.get('courierContNo')?.value;
    if (courierContNo) {
      this.loadContractRatesAndDiscounts(courierContNo);
    }
  }

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

  deleteCourier(index: number, courierCode: string): void {
    this.showConfirmation = true;
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
  
  confirmDelete(confirm: boolean): void {
   // const index = this.courierList.findIndex(c => c.courierCode === this.selectedCourierCode);
    if (confirm && this.selectedCourierIndex !== null && this.selectedCourierCode) {
      this.deleteCourier(this.selectedCourierIndex, this.selectedCourierCode);
    }
    this.loadCouriers();
    this.showConfirmation = false;
    this.selectedCourierIndex = null;

  
  }
  

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
    this.showContractRateForm = true;
    this.contractForm.reset();
  
    // Enable courierContNo field
    this.contractForm.get('courierContNo')?.enable();
  
    // Patch the form with the selected row's courierContNo
    this.contractratediscountForm.patchValue({
      courierContNo: row.courierContNo
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

  


  openDeleteConfirmation(index: number, courierContNo: string): void {
    this.showConfirmation = true;
    this.selectedContractIndex = index;
    this.selectedContractNo = courierContNo;
  }

  openDeleteConfirmations(index: number, courierrate: any): void {
    this.showConfirmation = true;
    this.selectedContractIndex = index;
  //  this.selectedContractNo = courierContNo;
  this.selectedContractRate=courierrate;
  }


  confirmDelcontract(confirm: boolean): void {
    if (confirm && this.selectedContractIndex !== null && this.selectedContractNo) {
      this.deleteContract(this.selectedContractIndex, this.selectedContractNo);
    }
    this.showConfirmation = false;
    this.selectedContractIndex = null;
    this.selectedContractNo = null;
  }

  confirmDelcontractRate(confirm: boolean): void {
    if (confirm && this.selectedContractIndex !== null && this.selectedContractRate) {
      this.delete(this.selectedContractIndex,this.selectedContractRate);
    }
    this.showConfirmation = false;
    this.selectedContractIndex = null;
    this.selectedContractRate = null;
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



  closeContractForm(): void {
    this.showContractForm = false;
  }
  closeContractrateForm(): void {
    this.showContractRateForm = false;
  }
  // closeContractRateForm(): void {
  //   this.showContractRateForm = false;
  // }


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

loadContractRatesAndDiscounts(courierContNo: string): void {
  this.courierHistoryService.getContractRateDiscountBasedOnCourierContNo(courierContNo).subscribe({
    next: (data: any) => {
      if (data) {
        // Assign rates and discounts separately to their respective lists
        this.rateList = Array.isArray(data.rates) ? data.rates : [];
        this.discountList = Array.isArray(data.discounts) ? data.discounts : [];
        
        // If needed, you can create separate data sources for MatTableDataSource
        this.contractRateDiscountDataSource.data = this.rateList; // Assuming a MatTableDataSource for rates
        this.contractRateDiscountDataSource.data = this.discountList; // Assuming a MatTableDataSource for discounts
      } else {
        console.error("Unexpected data structure:", data);
        this.rateList = [];
        this.discountList = [];
        
        // Reset the data sources
        this.contractRateDiscountDataSource.data = this.rateList;
        this.contractRateDiscountDataSource.data = this.discountList;
      }
    },
    error: (error) => {
      console.error('Error fetching contract rates and discounts:', error);
      
      // Clear lists and data sources in case of an error
      this.rateList = [];
      this.discountList = [];
      this.contractRateDiscountDataSource.data = this.rateList;
      this.contractRateDiscountDataSource.data = this.discountList;
    }
  });
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

  submitForm() {
    console.log('Form values before validation:', this.contractratediscountForm.value);
  
    // Retrieve the courier contract number from the form
    const courierContNo = this.contractratediscountForm.get('courierContNo')?.value;
  
    // Check if the form is invalid
    if (this.contractratediscountForm.invalid) {
      console.error('Form is invalid. Errors:', this.contractratediscountForm.errors);
      return;
    }
  
    // Prepare the form data
    const formValues = {
      courierContNo: courierContNo,
      courierRates: this.rates.length > 0 ? this.rates : [], // Use an empty array if no rates are entered
      courierDiscounts: this.discounts.length > 0 ? this.discounts : [] // Use an empty array if no discounts are entered
    };
  
    console.log('Form Submitted', formValues);
  
    // Call the service to submit the data
    this.couriercontract.createContractRatesAndDiscounts(formValues).subscribe({
      next: (response) => {
        console.log('Contract rates and discounts created successfully:', response);
  
        // Show success message
        this.successMessage = 'Rates And Discounts Added Successfully';
        this.showContractSuccessMessage = true;
  
        // Clear the rates and discounts
        this.rates = [];
        this.discounts = [];
  
        // Reset the rate and discount groups
        setTimeout(() => {
          const rateGroup = this.contractratediscountForm.get('rateGroup');
          const discountGroup = this.contractratediscountForm.get('discountGroup');
          
          if (rateGroup) {
            // rateGroup.reset({
            //   fromWtGms: 0,
            //   toWtGms: 0,
            //   fromDistanceKm: 0,
            //   toDistanceKm: 0,
            //   rate: 0
            // });
            this.rateGroup.reset();       
          }
  
          if (discountGroup) {
            // discountGroup.reset({
            //   fromMonthlyAmt: 0,
            //   toMonthlyAmt: 0,
            //   discountPercentage: 0
            // });
            this.discountGroup.reset(); 
          }
        }, 3000);
  
        // Load the updated contract rates and discounts
        this.loadContractRatesAndDiscounts(courierContNo);
  
        // Hide the success message after a delay
        setTimeout(() => {
          this.showContractSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.log("Data being sent:", formValues);
        console.error('Error creating contract rates and discounts:', error);
      }
    });
  }
  

  
  delete(index:number , contract: any): void {
    const courierContNo = contract.courierContNo;
    const fromWtGms = contract.fromWtGms;
    const toWtGms = contract.toWtGms;
    const fromDistanceKm = contract.fromDistanceKm;
    const toDistanceKm = contract.toDistanceKm;
    const fromMonthlyAmt = contract.fromMonthlyAmt;
    const toMonthlyAmt = contract.toMonthlyAmt;

    this.courierHistoryService
      .deleteContractRateDiscount(courierContNo, fromWtGms, toWtGms, fromDistanceKm, toDistanceKm, fromMonthlyAmt, toMonthlyAmt)
      .subscribe({
        next: (response) => {
          console.log('Contract deleted successfully:', response);
          this.successMessage = 'Rates And Discounts Deleted Successfully';
  
          this.showContractSuccessMessage = true;
          setTimeout(() => {
            this.showContractSuccessMessage = false;
          }, 3000);
          // Remove the deleted contract from the list or refresh the list
          this.contractRateDiscountList = this.contractRateDiscountList.filter(c => c !== contract);
        },
        error: (error) => {
          console.error('Error deleting contract:', error);
        }
      });
  }
edit(index: number): void {
  this.showConfirmation = true;
}
  
  

}
