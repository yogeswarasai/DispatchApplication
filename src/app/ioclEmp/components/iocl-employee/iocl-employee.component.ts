import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MstMenu } from '../../models/menu';
import { MenuService } from '../../services/menu.service';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-iocl-employee',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    MatSidenavModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatMenuModule
    
  ],
  templateUrl: './iocl-employee.component.html',
  styleUrl: './iocl-employee.component.css'
})
export class IoclEmployeeComponent {
  searchQuery: string = '';
  isMenuOpened = true;
  menus: MstMenu[] = [];
  empData:any='';
  expandedMenus: string[] = []; // Array to track expanded menus
  openIndex: number | null = null; // Track the open parent menu

  constructor(private router: Router,
    private ioclEmpService:IoclEmpServiceService,
    private menuService:MenuService) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  toggleSidenav(sidenav: any) {
    this.isMenuOpened = !this.isMenuOpened;
    sidenav.toggle();
  }

  onSearch() {
    console.log('Searching for:', this.searchQuery);
  }
  
  ngOnInit(): void {

      this.empData=this.ioclEmpService.getEmpData();
     // const roleId = params['role']; // Get role from query params
      this.menuService.getMenusByRole(this.empData.role).subscribe((menus: MstMenu[]) => {
        console.log('Menus data:', menus);

        this.menus = this.buildMenuHierarchy(menus);
        console.log('Hierarchical menus data:', this.menus);
      });
      
  }

  buildMenuHierarchy(menuList: MstMenu[]): MstMenu[] {
    const menuMap: { [key: string]: MstMenu } = {};
    const roots: MstMenu[] = [];

    // Map all menus by their ID for easy access
    menuList.forEach(menu => {
      menuMap[menu.menuId] = menu;
    });
     // Assign child menus and build the hierarchy
     menuList.forEach(menu => {
      if (menu.parentMenuId === '#') {
        roots.push(menu); // Root menus (parentMenuId as "#")
      } else {
        if (menuMap[menu.parentMenuId]) {
          menuMap[menu.parentMenuId].childMenus.push(menu); // Add to the parent's childMenus list
        }
      }
    });
   

    return roots; // Return only root menus (parentMenuId = "#")
  }

 

  // Function to toggle submenus
  toggleSubmenu(index: number): void {
    // If the clicked index is already open, close it by setting openIndex to null
    if (this.openIndex === index) {
      this.openIndex = null;
    } else {
      // Otherwise, set the openIndex to the clicked menu
      this.openIndex = index;
    }
  }


  // filterChildMenus(menuId: number) {
  //   return this.menus.filter((m) => m.parentMenuId !== undefined && m.parentMenuId === menuId);
  // }
  // isMenuExpanded(menuId: string): boolean {
  //   return this.expandedMenus.includes(menuId);
  // }

  // // Toggle the submenu visibility
  // toggleSubMenu(menuId: string) {
  //   const index = this.expandedMenus.indexOf(menuId);
  //   if (index > -1) {
  //     this.expandedMenus.splice(index, 1); // If already expanded, collapse it
  //   } else {
  //     this.expandedMenus.push(menuId); // If collapsed, expand it
  //   }
  // }

  logout(): void {
    this.ioclEmpService.signOut().subscribe({
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


