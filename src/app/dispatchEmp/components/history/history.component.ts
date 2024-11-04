import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DisEmpVerOtpComponent } from '../../../login/components/dis-emp-ver-otp/dis-emp-ver-otp.component';
import { DisEmpVerOtpService } from '../../../login/services/dis-emp-ver-otp.service';
import { HomeService } from '../../../services/home.service';
import { formatDate } from '@angular/common'; // Import for formatting date
import { ParcelTotals } from '../../../model/parcelTotals';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { TrnParcelInService } from '../../services/trn-parcel-in.service';
import { TrnParcelOutService } from '../../../services/trn-parcel-out.service';
import { TrnParcelIn } from '../../../model/trnParcelIn';
import { TrnParcelOut } from '../../../model/trnParcelOut';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HistoryService } from '../../../services/history.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
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
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  @ViewChild('parcelInDialogTemplate') parcelInDialogTemplate!: TemplateRef<any>;
  @ViewChild('parcelOutDialogTemplate') parcelOutDialogTemplate!: TemplateRef<any>;
  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  @ViewChild('paginatorIn', { static: false }) paginatorIn!: MatPaginator;
  @ViewChild('paginatorOut', { static: false }) paginatorOut!: MatPaginator;
  
  displayedColumns: string[] = ['senderName', 'recipientName', 'date', 'view'];
  filterIn = '';
  filterOut = '';
  filteredParcelIn = new MatTableDataSource<TrnParcelIn>([]);
  filteredParcelOut = new MatTableDataSource<TrnParcelOut>([]);
  allParcelIn: TrnParcelIn[] = []; // Store the original data for filtering
  allParcelOut: TrnParcelOut[] = []; // Store the original data for filtering
  selectedParcel: any;
  public dialogRef!: MatDialogRef<any>; // Declare MatDialogRef
  deletedParcel:any;

  constructor(
    public dialog: MatDialog,
    private parcelInService: TrnParcelInService,
    private parcelOutService: TrnParcelOutService,
    private router: Router,
    private historyService: HistoryService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadParcelInData();
    this.loadParcelOutData();
  }

  loadParcelInData(page: number = 0, size: number = 8) {
    this.parcelInService.getParcelInData(page, size).subscribe(data => {
      this.filteredParcelIn.data = data.content;
      this.paginatorIn.length = data.totalElements;
      this.applyInFilter();
    });
  }

  loadParcelOutData(page: number = 0, size: number = 8) {
    this.parcelOutService.getParcelOutData(page, size).subscribe(data => {
      this.filteredParcelOut.data = data.content;
      this.paginatorOut.length = data.totalElements;
      this.applyOutFilter();
    });
  }
  // Update your pagination handling methods
  onPageChangeIn(event: PageEvent) {
    this.loadParcelInData(event.pageIndex, event.pageSize);
  }

  onPageChangeOut(event: PageEvent) {
    this.loadParcelOutData(event.pageIndex, event.pageSize);
  }
  // applyInFilter() {
  //   this.filteredParcelIn.data = this.allParcelIn.filter(parcel =>
  //     parcel.senderName?.toLowerCase().includes(this.filterIn.toLowerCase()) ||
  //     parcel.recipientName?.toLowerCase().includes(this.filterIn.toLowerCase())
  //   );
  // }

  // applyOutFilter() {
  //   this.filteredParcelOut.data = this.allParcelOut.filter(parcel =>
  //     parcel.senderName?.toLowerCase().includes(this.filterOut.toLowerCase()) ||
  //     parcel.recipientName?.toLowerCase().includes(this.filterOut.toLowerCase())
  //   );
  // }
  applyInFilter() {
    this.filteredParcelIn.filter = this.filterIn.trim().toLowerCase();
  }

  applyOutFilter() {
    this.filteredParcelOut.filter = this.filterOut.trim().toLowerCase();
  }

  clearFilter(type: string) {
    if (type === 'in') {
      this.filterIn = '';
      this.applyInFilter(); // Reapply the filter to show all data
    } else if (type === 'out') {
      this.filterOut = '';
      this.applyOutFilter(); // Reapply the filter to show all data
    }
  }

  openViewDialog(parcel: any) {
    const isParcelIn = parcel.inTrackingId !== undefined;
    const isParcelOut = parcel.outTrackingId !== undefined;

    if (isParcelIn) {
      this.selectedParcel = parcel;
      this.dialog.open(this.parcelInDialogTemplate, {
        data: parcel,
      });
    } else if (isParcelOut) {
      this.selectedParcel = parcel;
      this.dialog.open(this.parcelOutDialogTemplate, {
        data: parcel,
      });
    } else {
      console.error('Unknown parcel type');
    }
  }

  editInParcel(parcelData: any) {
     this.dialog.closeAll();
    this.historyService.setParcelData(parcelData);
    this.router.navigate(['/dispatchEmployee/parcelEdit']);
  }

  editOutParcel(parcelData: any) {
    this.dialog.closeAll();
    this.historyService.setParcelData(parcelData);
    this.router.navigate(['/dispatchEmployee/parcelOutEdit']);
  }

  onChangeStatus(parcel:any) {
    // Determine whether the tracking ID is for ParcelIn or ParcelOut
    this.deletedParcel=parcel;
    const isParcelIn = this.deletedParcel.inTrackingId ;
    const isParcelOut = this.deletedParcel.outTrackingId;

    if (isParcelIn) {
      this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
        data: { type: 'in', trackingId: this.deletedParcel.inTrackingId },
      });
    } else if (isParcelOut) {
      this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
        data: { type: 'out', trackingId:this.deletedParcel.outTrackingId },
      });
    } else {
      console.error('Tracking ID does not match the selected parcel');
    }
  }

  deleteParcel(type: string, trackingId:number) {
    this.dialogRef.close();
    if (type === 'in') {
      this.parcelInService.deleteParcelIn(trackingId).subscribe({
        next: () => {
          this.loadParcelInData(); // Refresh the Parcel In data
          this.snackBar.open('inParcel  deleted successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error deleting Parcel In:', err);
          this.snackBar.open('inParcel  deleted successfully!', 'Close', {
            duration: 3000,
          });
        }
      });
    } else if (type === 'out') {
      this.parcelOutService.deleteParcelOut(trackingId).subscribe({
        next: () => {
          this.loadParcelOutData(); // Refresh the Parcel Out data
          this.snackBar.open('outParcel  deleted successfully!', 'Close', {
            duration: 3000,  // Duration in milliseconds
          });
        },
        error: (err) => {
          console.error('Error deleting Parcel Out:', err);
          this.snackBar.open('Error deleting outParcel. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      console.error('Unknown parcel type');
    }
  }
  onClose(): void {
    this.dialog.closeAll();  // Close the dialog
  }

}


