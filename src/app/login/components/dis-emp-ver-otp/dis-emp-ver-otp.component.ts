import { Component,NgModule,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray,Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';

import { NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { DisEmpVerOtpService } from '../../services/dis-emp-ver-otp.service';
@Component({
  selector: 'app-dis-emp-ver-otp',
  standalone: true,
  imports:[
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './dis-emp-ver-otp.component.html',
  styleUrl: './dis-emp-ver-otp.component.css'
})
export class DisEmpVerOtpComponent implements OnInit {
  loginForm: FormGroup;
  otpControls: FormControl[] = [];
  captchaText: string = '';

  constructor(private fb: FormBuilder,private verOtp:DisEmpVerOtpService,private router: Router) {
    
      this.loginForm = this.fb.group({
          phoneNumber: [{value: '8185964025', disabled: true}, Validators.required],
          otp: this.fb.array([]),
          captcha: ['', Validators.required],
      });
      // Initialize OTP controls
      for (let i = 0; i < 6; i++) {
          const control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
          this.otpControls.push(control);
      }
      
  }
 
   
  
  ngOnInit(): void {
       this.generateCaptcha();
  }

  onOtpInput(event: Event, index: number): void {
      const input = event.target as HTMLInputElement;
      if (input.value && index < this.otpControls.length - 1) {
          const nextInput = input.nextElementSibling as HTMLInputElement;
          nextInput?.focus();
      }
  }

  generateCaptcha(): void {
      //this.captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.captchaText = result;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
        const mobileNumber = this.loginForm.get('phoneNumber')?.value;
        const otp = this.otpControls.map(control => control.value).join('');

        // Call the login method without passing CAPTCHA
        this.verOtp.login(mobileNumber, parseInt(otp))
            .subscribe(response => {
                console.log('Login successful', response);
                 // Assuming the response contains the user profile data
                // const profile = response.profile;
                // Navigate to the profile page with profile data
               // this.router.navigate(['/dispatchEmployee'], { state: { profile } });
                // Save the response in the ProfileService
              this.verOtp.setProfileData(response);
              this.router.navigate(['/dispatchEmployee']);

            }, error => {
                console.error('Login failed', error);
            });
    }
  }

  changeMobileNumber(): void {
      // Ha
      this.router.navigate(['/disEmpReqOtp']);
      
  }

  resendOtp(): void {
      // Handle resending OTP
      this.generateCaptcha();
  }
}