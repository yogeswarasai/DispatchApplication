import { Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReqOtpService } from '../../services/req-otp.service';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';

import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dis-emp-req-otp',
  standalone: true,
  imports:[
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './dis-emp-req-otp.component.html',
  styleUrl: './dis-emp-req-otp.component.css'
})
export class DisEmpReqOtpComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage:string='';
  constructor(private fb: FormBuilder, private reqOtp:ReqOtpService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const phoneNumber = this.loginForm.value.phoneNumber;
      this.reqOtp.sendOtp(phoneNumber).subscribe(
        response => {
          console.log('OTP sent successfully', response);
          this.errorMessage = '';  // Clear any previous errors
        },
        error => {
          if (error.status === 404) {
            this.errorMessage = 'Not a valid user';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }
      );
    }
  }
}
