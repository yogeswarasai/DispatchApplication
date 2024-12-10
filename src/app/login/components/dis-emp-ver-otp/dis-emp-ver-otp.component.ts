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
  otpError: string = ''; // Variable to hold OTP error message


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

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const previousInput = input.previousElementSibling as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
        previousInput.value = ''; // Optional: clear the value of the previous input
        this.otpControls[index - 1].setValue(''); // Clear the value in the form control
      }
    }
  }
  
  generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    console.log('Generated CAPTCHA:', this.captchaText); // For debugging
  }
  
  validateCaptcha(): boolean {
    const enteredCaptcha = this.loginForm.get('captcha')?.value;
    console.log('Entered CAPTCHA:', enteredCaptcha);
    console.log('Generated CAPTCHA:', this.captchaText);
    return enteredCaptcha === this.captchaText;
  }
  
  onSubmit(): void {
    if (!this.validateCaptcha()) {
      this.otpError = 'Invalid captcha. Please try again.';
      this.loginForm.get('captcha')?.reset();
      this.generateCaptcha(); // Generate a new CAPTCHA
      return;
    }
  
    if (this.loginForm.valid) {
      const mobileNumber = this.loginForm.get('phoneNumber')?.value;
      const otp = this.otpControls.map((control) => control.value).join('');
  
      this.verOtp.login(mobileNumber, parseInt(otp)).subscribe(
        (response) => {
          console.log('Login successful', response);
  
          // Clear error message
          this.otpError = '';
          const profile = response.profile;
  
          // Save profile data and navigate
          this.verOtp.setProfileData(response);
          this.router.navigate(['/dispatchEmployee'], { state: { profile } });
        },
        (error) => {
          console.error('Login failed', error);
  
          if (error.status === 400) {
            this.otpError = 'Invalid OTP. Please try again.';
            this.clearOtpFields(); // Clear OTP fields if invalid
          } else {
            this.otpError = 'An error occurred. Please try again later.';
          }
        }
      );
    }
  }
  
clearOtpFields(): void {
  this.otpControls.forEach((control) => control.reset());
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