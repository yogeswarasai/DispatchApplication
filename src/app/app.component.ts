import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IoclEmpComponent } from './login/components/iocl-emp/iocl-emp.component';
import { LoginComponent } from './login/components/login/login.component';
import { ProfileComponent } from './dispatchEmp/components/profile/profile.component';
import { ParcelInComponent } from './dispatchEmp/components/parcel-in/parcel-in.component';
import { ParcelOutComponent } from './dispatchEmp/components/parcel-out/parcel-out.component';
import { DispatchEmployeeComponent } from './dispatchEmp/components/dispatch-employee/dispatch-employee.component';
import { HttpClientModule } from '@angular/common/http';
import { DisEmpReqOtpComponent } from './login/components/dis-emp-req-otp/dis-emp-req-otp.component';
import { DisEmpVerOtpComponent } from './login/components/dis-emp-ver-otp/dis-emp-ver-otp.component';
import { HistoryComponent } from './dispatchEmp/components/history/history.component';
import { ReportsComponent } from './dispatchEmp/components/reports/reports.component';
import { ParcelEditComponent } from './dispatchEmp/components/parcel-edit/parcel-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmpHistoryComponent } from './ioclEmp/components/emp-history/emp-history.component';
import { EmpReportsComponent } from './ioclEmp/components/emp-reports/emp-reports.component';
import { LocAdminComponent } from './ioclEmp/components/loc-admin/loc-admin.component';
import { LocImplementationComponent } from './ioclEmp/components/loc-implementation/loc-implementation.component';
import { EmpProfileComponent } from './ioclEmp/components/emp-profile/emp-profile.component';
import { DispatchComponent } from './ioclEmp/components/dispatch/dispatch.component';
import { UserEditComponent } from './ioclEmp/components/user-edit/user-edit.component';
import { AddLocAdminComponent } from './ioclEmp/components/add-loc-admin/add-loc-admin.component';
import { AddRefSeqComponent } from './ioclEmp/components/add-ref-seq/add-ref-seq.component';
import { DailyReportsComponent } from './ioclEmp/components/daily-reports/daily-reports.component';
import { MonthlyReportsComponent } from './ioclEmp/components/monthly-reports/monthly-reports.component';
import { DisDailyReportComponent } from './dispatchEmp/components/dis-daily-report/dis-daily-report.component';
import { DisMonthlyReportsComponent } from './dispatchEmp/components/dis-monthly-reports/dis-monthly-reports.component';
import { MstCouriercontractComponent } from './ioclEmp/components/mst-couriercontract/mst-couriercontract.component';
import { CourierHistoryComponent } from './ioclEmp/components/courier-history/courier-history.component';
import { CourierContractEditComponent } from './ioclEmp/components/courier-contract-edit/courier-contract-edit.component';
import { DisEmpComponent } from './login/components/dis-emp/dis-emp.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    IoclEmpComponent,
    DisEmpReqOtpComponent,
    DisEmpVerOtpComponent,
    LoginComponent,
    ProfileComponent,
    ParcelInComponent,
    ParcelOutComponent,
    HistoryComponent,
    ReportsComponent,
    DispatchEmployeeComponent,
    HttpClientModule,
    ParcelEditComponent,
    ParcelOutComponent,
    MatPaginatorModule,
    EmpHistoryComponent,
    EmpReportsComponent,
    LocAdminComponent,
    LocImplementationComponent,
    EmpProfileComponent,
    DispatchComponent,
    UserEditComponent,
    AddLocAdminComponent,
    AddRefSeqComponent,
    DailyReportsComponent,
    MonthlyReportsComponent,
    DisDailyReportComponent,
    DisMonthlyReportsComponent,
    MstCouriercontractComponent,
    CourierHistoryComponent,
    CourierContractEditComponent,
    DisEmpComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DispatchApp';
}
