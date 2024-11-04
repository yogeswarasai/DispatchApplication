import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { routes } from '../../../app.routes';
import { RouterModule,Router} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from '../home/home.component';
import { NgIf } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardTitleGroup } from '@angular/material/card';
import { DisEmpVerOtpService } from '../../../login/services/dis-emp-ver-otp.service';
import { MatMenuModule } from '@angular/material/menu'; 
@Component({
  selector: 'app-dispatch-employee',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    MatSidenavModule,
    HomeComponent,
    NgIf,
    MatLabel,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatMenuModule
  ],
  templateUrl: './dispatch-employee.component.html',
  styleUrl: './dispatch-employee.component.css'
})
export class DispatchEmployeeComponent {
  searchQuery: string = '';
  profile:any;

  showReports: boolean = false;

  toggleReports() {
    this.showReports = !this.showReports;
  }
  
  constructor(private router: Router,private verOtp:DisEmpVerOtpService) {
     // Access profile data from router state
    //  const navigation = this.router.getCurrentNavigation();
    //  if (navigation?.extras.state) {
    //    this.profile = navigation.extras.state['profile'];
    //  }
  }
  ngOnInit(): void {
    // Retrieve the profile data from the service
    this.profile = this.verOtp.getProfileData();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
  isMenuOpened = true;

  toggleSidenav(sidenav: any) {
    this.isMenuOpened = !this.isMenuOpened;
    sidenav.toggle();
  }
  

  onSearch() {
    // Handle the search functionality here
    console.log('Searching for:', this.searchQuery);
  }
  logout(): void {
    this.verOtp.logout().subscribe({
      next: () => {
        // Handle successful logout, e.g., navigate to the login page
        console.log("user logout success ")
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Handle logout error if necessary
        console.error('Logout failed', err);
      }
    });
  }

}
