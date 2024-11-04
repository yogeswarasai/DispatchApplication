import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DisEmpVerOtpComponent } from '../../../login/components/dis-emp-ver-otp/dis-emp-ver-otp.component';
import { DisEmpVerOtpService } from '../../../login/services/dis-emp-ver-otp.service';
import { HomeService } from '../../../services/home.service';
import { formatDate } from '@angular/common'; // Import for formatting date
import { ParcelTotals } from '../../../model/parcelTotals';
@Component({
  selector: 'app-home',
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
    MatToolbarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // userId:string='';
  // constructor(private route: ActivatedRoute) { }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.userId = params['ioclId'];
  //   });
  // }
  profile: any;
  displayedColumns: string[] = ['totalParcels','ParcelIn','ParcelOut'];
  dataSource = new MatTableDataSource<any>();
  constructor(private verOtp:DisEmpVerOtpService,private home:HomeService) {}
  ngOnInit(): void {
    // Retrieve the profile data from the service
    this.profile = this.verOtp.getProfileData();
    // this.home.getParcelTotals()
    //   .subscribe((data: ParcelTotals) => {
    //     this.dataSource.data = [data]; // Note the use of 'data' as an array here
    //   });
    this.fetchParcelTotals();
}
fetchParcelTotals(): void {
  this.verOtp.getParcelTotalsByDate()
    .subscribe(data => {
      console.log('Parcel data:', data); // Log the data to check
      this.dataSource.data = [data];
    }, error => {
      console.error('Error fetching parcel totals', error);
    });
}
}
