import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DisEmpVerOtpService } from '../../../login/services/dis-emp-ver-otp.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButtonModule,MatCardModule,FormsModule,ReactiveFormsModule,NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    NgFor,
    MatToolbarModule,
    CommonModule,
    MatToolbarModule,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  // profile = {
  //   name: 'John Doe',
  //   role: 'Dispatcher',
  //   email: 'john.doe@example.com',
  //   phone: '123-456-7890',
  //   address: '123 Main St, Anytown, USA'
  // };

  // constructor() { }

  // ngOnInit(): void {
  // }

  // editProfile(): void {
  //   // Logic to edit profile
  //   console.log('Edit Profile Clicked');
  // }
  profile: any;

  constructor(private verOtp: DisEmpVerOtpService) {}

  ngOnInit(): void {
    this.profile = this.verOtp.getProfileData();
  }

}
