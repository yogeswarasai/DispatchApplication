import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { RouterModule ,Router} from '@angular/router';
import { IoclEmployeeComponent } from '../../../ioclEmp/components/iocl-employee/iocl-employee.component';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';

@Component({
  selector: 'app-iocl-emp',
  standalone: true,
  imports: [
    IoclEmployeeComponent,
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
  templateUrl: './iocl-emp.component.html',
  styleUrl: './iocl-emp.component.css'
})
export class IoclEmpComponent {
  loginForm: FormGroup;
  hide = true;
  captchaText: string='';

  constructor(private fb: FormBuilder,
    private router: Router,
    private ioclEmpService:IoclEmpServiceService
  ) 
  {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      captchaInput: ['', Validators.required]
    });
    // this.generateCaptcha();
  }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const { userId, password, captchaInput } = this.loginForm.value;
  //     if (captchaInput === this.captchaText) {
  //       // Handle successful login
  //       console.log(`Logging in with IOCL ID: ${userId}, Password: ${password}`);
  //       this.router.navigate(['/ioclEmployee']);

  //     } else {
  //       // Handle captcha validation failure
  //       alert('Invalid captcha. Please try again.');
  //       this.reloadCaptcha();
  //     }
  //   }
  // }
  generateCaptcha() {
    this.ioclEmpService.getCaptcha().subscribe({
      next: (res: any) => {
        console.log('Captcha response:', res);
        this.captchaText = res.captchaValue;
      },
      error: (err) => {
        console.error('Captcha generation error:', err);
      }
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const { userId, password, captchaInput } = this.loginForm.value;
      console.log('Submitting captcha:', captchaInput);
      this.ioclEmpService.checkCaptcha(captchaInput).subscribe({
        next: (res: any) => {
          console.log('Captcha check response:', res);
      
          if (res.status === 'valid') {
            console.log("Captcha valid");
            // Proceed with login 
            this.ioclEmpService.authenticateUser(userId, password, captchaInput).subscribe({
              next: (response: any) => {
                const role = response.role;               
                console.log('Login successful:', response);
                this.ioclEmpService.setEmpData(response);
                this.router.navigate(['/ioclEmployee']);
              },
              error: (err) => {
                console.error('Login failed:', err);
                alert('Login failed. Please check your credentials.');
              }
            });
          } else {
            alert('Invalid captcha. Please try again.');
            this.reloadCaptcha();
          }
        },
        error: (err) => {
          console.error('Captcha validation error:', err);
          alert('Captcha validation failed. Please try again.');
          this.reloadCaptcha();
        }
      });
      
      
    }
  }
  

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  // generateCaptcha() {
  //   this.ioclEmpService.getCaptcha().subscribe({
  //     next: (res: any) => {
  //       this.captchaText =res.captchaValue
  //     },
  //     error: (err) => {
  //       console.error('Captcha generation failed:', err);
  //     }
  //   });
  // }

  reloadCaptcha() {
    this.generateCaptcha();
  }

}
