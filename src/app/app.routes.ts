import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login/login.component';
 import { DisEmpReqOtpComponent } from './login/components/dis-emp-req-otp/dis-emp-req-otp.component';
import { IoclEmpComponent } from './login/components/iocl-emp/iocl-emp.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './dispatchEmp/components/home/home.component';
import { ParcelInComponent } from './dispatchEmp/components/parcel-in/parcel-in.component';
import { ParcelOutComponent } from './dispatchEmp/components/parcel-out/parcel-out.component';
import { DispatchEmployeeComponent } from './dispatchEmp/components/dispatch-employee/dispatch-employee.component';
import { ProfileComponent } from './dispatchEmp/components/profile/profile.component';
import { IoclEmployeeComponent } from './ioclEmp/components/iocl-employee/iocl-employee.component';
import { DashboardComponent } from './ioclEmp/components/dashboard/dashboard.component';
import { DisEmpVerOtpComponent } from './login/components/dis-emp-ver-otp/dis-emp-ver-otp.component';
import { HistoryComponent } from './dispatchEmp/components/history/history.component';
import { EmpHistoryComponent } from './ioclEmp/components/emp-history/emp-history.component';
import { EmpReportsComponent } from './ioclEmp/components/emp-reports/emp-reports.component';
import { ReportsComponent } from './dispatchEmp/components/reports/reports.component';
import { ParcelEditComponent } from './dispatchEmp/components/parcel-edit/parcel-edit.component';
import { ParcelOutEditComponent } from './dispatchEmp/components/parcel-out-edit/parcel-out-edit.component';
import { LocImplementationComponent } from './ioclEmp/components/loc-implementation/loc-implementation.component';
import { LocAdminComponent } from './ioclEmp/components/loc-admin/loc-admin.component';
import { EmpProfileComponent } from './ioclEmp/components/emp-profile/emp-profile.component';
import { DispatchComponent } from './ioclEmp/components/dispatch/dispatch.component';
import { UserEditComponent } from './ioclEmp/components/user-edit/user-edit.component';
import { AddLocAdminComponent } from './ioclEmp/components/add-loc-admin/add-loc-admin.component';
import { AddRefSeqComponent } from './ioclEmp/components/add-ref-seq/add-ref-seq.component';
import { AddDisUserComponent } from './ioclEmp/components/add-dis-user/add-dis-user.component';
import { DisUserEditComponent } from './ioclEmp/components/dis-user-edit/dis-user-edit.component';
import { DailyReportsComponent } from './ioclEmp/components/daily-reports/daily-reports.component';
import { MonthlyReportsComponent } from './ioclEmp/components/monthly-reports/monthly-reports.component';
import { DisDailyReportComponent } from './dispatchEmp/components/dis-daily-report/dis-daily-report.component';
import { DisMonthlyReportsComponent } from './dispatchEmp/components/dis-monthly-reports/dis-monthly-reports.component';
import { DispatchDetailsComponent } from './dispatchEmp/components/dispatch-details/dispatch-details.component';
import { EmpDispatchDetailsComponent } from './ioclEmp/components/emp-dispatch-details/emp-dispatch-details.component';
import { MstCouriercontractComponent } from './ioclEmp/components/mst-couriercontract/mst-couriercontract.component';
import { CourierHistoryComponent } from './ioclEmp/components/courier-history/courier-history.component';
import { CourierContractEditComponent } from './ioclEmp/components/courier-contract-edit/courier-contract-edit.component';
import { DisEmpComponent } from './login/components/dis-emp/dis-emp.component';
export const routes: Routes = [
  { path: "login", component: LoginComponent },
  //  { path: "disEmpReqOtp", component: DisEmpReqOtpComponent },  // otp based login remove comments
   // { path: "disEmpVerOtp", component: DisEmpVerOtpComponent },   // otp based login remove comments
  {path:"disEmpsignin",component:DisEmpComponent},//  with username and password remove comments
  { path: "ioclEmp", component: IoclEmpComponent },
  // {path:"ioclEmp",component:IoclEmpComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{path:'',redirectTo:'disEmpVerOtp',pathMatch:'full'},
  {
    path: 'dispatchEmployee',
    component: DispatchEmployeeComponent,

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'parcelIn', component: ParcelInComponent },
      { path: 'parcelOut', component: ParcelOutComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'parcelEdit', component: ParcelEditComponent },
      { path: 'parcelOutEdit', component: ParcelOutEditComponent },
     
      // {
      //   path:'reports/dailyReports',component:DisDailyReportComponent
      // },
      { path:'reports/Dispatch-Details', component:DispatchDetailsComponent}
      
      // {path:'reports/monthlyReports',component:DisMonthlyReportsComponent}
    ]
  },
  //  {path:'',redirectTo:'ioclEmployee/loc-admin',pathMatch:'full'},
  // {path:'',redirectTo:'ioclEmployee/dispatch',pathMatch:'full'},
  {
    path: 'ioclEmployee',
    component: IoclEmployeeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      //  { path:'profile', component:ProfileComponent},
      // { path: 'dashboard', component: DashboardComponent },
      { path: 'loc-implementation', component: LocImplementationComponent },
      { path: 'loc-admin', component: LocAdminComponent },
      { path: 'history', component: EmpHistoryComponent },
   //   { path: 'reportsparent', component: EmpReportsComponent },

      { path: 'reportsparent/reports', component: EmpDispatchDetailsComponent },
      { path: 'reports/monthly', component: MonthlyReportsComponent },
      { path: 'profile', component: EmpProfileComponent },
      { path: 'dispatch', component: DispatchComponent },
      { path: 'userEdit', component: UserEditComponent },
      { path: 'addLocAdmin', component: AddLocAdminComponent },
      { path: 'addRefSeq', component: AddRefSeqComponent },
      { path: 'addDisUser', component: AddDisUserComponent },
      { path: 'disUserEdit', component: DisUserEditComponent },
      {path:'courier',component:MstCouriercontractComponent},
      {path:'courierHistory',component:CourierHistoryComponent},
      { path: 'contractEdit/:courierContNo', component: CourierContractEditComponent } // Added parameter

      // { path: '', redirectTo: '/loc-admin', pathMatch: 'full' } // Default route
    ]
  }
];
