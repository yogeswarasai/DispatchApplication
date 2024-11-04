import { Component, OnInit , TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CourierhistoryService } from '../../../services/courierhistory.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CourierContractEditComponent } from '../courier-contract-edit/courier-contract-edit.component';
import { Router } from '@angular/router';


interface Discount {
  fromMonthlyAmt: number;
  toMonthlyAmt: number;
  discountPercentage: number;
}

interface Rate {
  fromWtGms: number;
  toWtGms: number;
  fromDistanceKm: number;
  toDistanceKm: number;
  rate: number;
}

interface CourierContract {
  courierCode: string;
  contractStartDate: string | null;
  contractEndDate: string | null;
  courierContNo?: string;
  status?: string;
  createdBy?: string;
  createdDate: string | null;
  discounts?: Discount[];
  rates?: Rate[];
}

interface Courier {
  locCode: string;
  courierCode: string;
  courierName: string;
}

@Component({
  selector: 'app-courier-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DatePipe
  ],
  templateUrl: './courier-history.component.html',
  styleUrls: ['./courier-history.component.css']
})
export class CourierHistoryComponent implements OnInit {
  @ViewChild('courierDialogTemplate') courierDialogTemplate!: TemplateRef<any>;
  @ViewChild('contractDialogTemplate') contractDialogTemplate!: TemplateRef<any>;
  @ViewChild('editContractDialogTemplate') editContractDialogTemplate!: TemplateRef<any>;




  courierContracts: CourierContract[] = [];
  couriers: Courier[] = [];
  selectedContract?: CourierContract;
  selectedCourier?: Courier;
  displayedContractColumns: string[] = ['courierCode', 'contractStartDate', 'contractEndDate', 'view'];
  displayedCourierColumns: string[] = ['locCode', 'courierCode', 'courierName', 'view'];

  constructor(
    public dialog: MatDialog,
    private courierService: CourierhistoryService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourierContracts();
    this.loadCouriers();
  }

  

  loadCourierContracts(): void {
    this.courierService.getCourierContracts()
      .subscribe({
        next: (data) => {
          console.log('Raw API data:', data); // Log raw data
          this.courierContracts = data.map(contract => ({
            ...contract,
            contractStartDate: this.datePipe.transform(contract.contractStartDate, 'yyyy-MM-dd'),
            contractEndDate: this.datePipe.transform(contract.contractEndDate, 'yyyy-MM-dd'),
            createdDate: this.datePipe.transform(contract.createdDate, 'yyyy-MM-dd'),
            lastUpdatedDate: contract.lastUpdatedDate
              ? this.datePipe.transform(contract.lastUpdatedDate, 'yyyy-MM-dd HH:mm:ss')
              : null
          }));
        },
        error: (error) => {
          console.error('Error loading courier contracts:', error);
          // Handle the error appropriately (show a message to the user, etc.)
        }
      });
  }
  

  loadCouriers(): void {
    this.courierService.getCouriers()
      .pipe(catchError((error) => {
        
        console.error("Error fetching couriers:", error);
        return of([]); // Return empty array on error
      }))
      .subscribe((data) => {
        this.couriers = data;
        console.log('Raw API data:', data); // Log raw data

      });
  }

  openContractViewDialog(contract: CourierContract): void {
    this.selectedContract = contract;
  }

  closeContractDialog(): void {
    this.selectedContract = undefined;
  }

  // Inside your CourierHistoryComponent class

  changeCourierStatus(courierCode: string): void {
    const confirmation = confirm('Are you sure you want to change the status of this courier?');
    if (confirmation) {
        this.courierService.changeCourierStatus(courierCode).subscribe({
            next: () => {
                console.log(`Courier status for ${courierCode} changed successfully.`);
                this.loadCouriers(); // Refresh the courier list
            },
            error: (error) => {
                console.error('Error changing courier status:', error);
            }
        });
    }
}

changeContractStatus(courierContNo: string): void {
  const confirmation = confirm('Are you sure you want to change the status of this contract?');

  if (confirmation) {
    this.courierService.changeContractStatus(courierContNo).subscribe({
      next: (response) => {
        console.log('Status changed successfully:', response);
        this.loadCourierContracts(); // Reload contracts to reflect changes
      },
      error: (error) => {
        console.error("Error changing contract status:", error);
        alert("There was an error changing the contract status. Please try again.");
      }
    });
  }
}
// openEditContractDialog(data: CourierContract): void {
//   console.log('Opening edit contract dialog with data:', data);

//   const dialogRef = this.dialog.open(CourierContractEditComponent, {
//     width: '500px',
//     data: data // Pass the contract data to the dialog
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       console.log('Dialog closed with result:', result);
//       // You can handle the result if needed, e.g., refreshing the contract list
//       this.loadCourierContracts();
//     }
//   });
// }
navigateToEditContract(courierContNo: string) {
  const trimmedContNo = courierContNo.trim();
  console.log("Navigating to edit contract with:", trimmedContNo);
  this.router.navigate(['/ioclEmployee/contractEdit', courierContNo]);
}






  

  viewCourierDetails(courier: Courier): void {
    const dialogRef = this.dialog.open(this.courierDialogTemplate, {
      data: courier, // Pass the selected courier data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close if necessary
    });
  }

  viewContractDetails(contract: CourierContract): void {  // Move this method outside of viewCourierDetails
    const dialogRef = this.dialog.open(this.contractDialogTemplate, {
      data: contract,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  onClose(): void {
    this.dialog.closeAll();  // Close the dialog
  }

 
}
