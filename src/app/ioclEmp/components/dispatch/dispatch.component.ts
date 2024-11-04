import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MstUser } from '../../../model/mstUser';
import { MstUserService } from '../../../services/mst-user.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dispatch',
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
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.css'
})
export class DispatchComponent {

  @ViewChild('userDialogTemplate') userDialogTemplate!: TemplateRef<any>;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  displayedColumns: string[] = ['locCode', 'userId', 'userName', 'mobileNumber', 'roleId', 'status','view'];
  originalData: MstUser[] = [];
 // filteredData= new MatTableDataSource<MstUser>([]);
 filteredData = new MatTableDataSource<MstUser>();  // Use MatTableDataSource
  //empNameFilter: string = '';  // Model for the loc_code filter
  deletedUser:any='';
  public dialogRef!: MatDialogRef<any>; // Declare MatDialogRef
  
  constructor(
    private mstUserService: MstUserService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar:MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.fetchAllUsers();
  }
  
  // fetchAllUsers(page:number=0,size:number=5): void {
  //   fetchAllUsers(): void {
  //   this.mstUserService.getDispatchUsers().subscribe(data => {
  //     this.originalData = data;
  //     this.filteredData.data = data; 
  //     //this.filteredData.data = data.content;  // Initialize filteredData with the full data
  //     // this.paginator.length=data.totalElements;
  //    // this.applyFilter();
  //   }, error => {
  //     console.error('Error fetching users', error);
  //   });
  // }
  fetchAllUsers(): void {
    this.mstUserService.getDispatchUsers().subscribe((data: MstUser[]) => {
      console.log(data);  // Add this line to log the response
      this.originalData = data;
      this.filteredData.data = data;  // Assign the data to MatTableDataSource
    }, error => {
      console.error('Error fetching users', error);
    });
  }
  
  // onPageChange(event: PageEvent) {
  //   this.fetchAllUsers(event.pageIndex, event.pageSize);
  // }
  
  // applyFilter() {
  //   this.filteredData.filter = this.empNameFilter.trim().toLowerCase();
  // }
  
  
  openViewDialog(user: MstUser): void {
    const dialogRef = this.dialog.open(this.userDialogTemplate, {
      width: '400px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after dialog is closed, if needed
    });
  }
  
  // applyFilter(): void {
  //   if (this.empNameFilter) {
  //     this.filteredData = this.originalData.filter(user =>
  //       user.userName.toLowerCase().includes(this.empNameFilter.toLowerCase())
  //     );
  //   } else {
  //     this.filteredData = [...this.originalData];  // Reset to original data
  //   }
  // }
  
  // clearFilter(): void {
  //   this.empNameFilter = '';
  //   this.applyFilter();  // Reset to original data
  // }
  
  editUser(userData: MstUser): void {
    this.dialog.closeAll();
    this.mstUserService.setUserData(userData);
    this.router.navigate(['/ioclEmployee/disUserEdit']);
  }
  
  // deleteUser(user: MstUser): void {
  //   // const confirmDelete = confirm(`Are you sure you want to delete the user ${user.userName}?`);
  //   // if (confirmDelete) {
  //   //   // Call the delete service method here
  //   //   this.mstUserService.deleteUser(user.userId).subscribe(() => {
  //   //     this.fetchAllUsers();  // Refresh the user list after deletion
  //   //   }, error => {
  //   //     console.error('Error deleting user', error);
  //   //   });
  //   // }
  // }
  
  addNew(): void {
    this.router.navigate(['/ioclEmployee/addDisUser']);
  }
  
  onClose(): void {
    this.dialog.closeAll();  // Closes the currently open dialog
  }
  
  onChangeStatus(user: any) {
    // Store the selected user details
    this.deletedUser = user;
  
    // Ensure that locCode and empCode are available
    const hasLocCode = this.deletedUser.locCode;
    const hasEmpCode = this.deletedUser.userId;
  
    if (hasLocCode && hasEmpCode) {
        // Open the dialog with a confirmation prompt
        this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
            data: {
                locCode: this.deletedUser.locCode,
                userId: this.deletedUser.userId
            },
        });
    } else {
        console.error('Location Code and Employee Code are required to delete the user');
    }
  }
  
  deleteUser(locCode: string, userId: string) {
    // Close the confirmation dialog
    this.dialogRef.close();
  
    // Call the service to delete the user based on locCode and empCode
    this.mstUserService.deleteUser(locCode, userId).subscribe({
        next: () => {
            // Refresh the user data (you might want to implement a method to reload the user list)
            this.fetchAllUsers();
            this.snackBar.open('User deleted successfully!', 'Close', {
                duration: 3000,
            });
            this.dialog.closeAll(); 
            this.router.navigate(['/ioclEmployee/dispatch']);
        },
        error: (err) => {
            console.error('Error deleting user:', err);
            this.snackBar.open('Failed to delete user!', 'Close', {
                duration: 3000,
            });
        }
    });
  }
  
  }