import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { TrnParcelIn } from '../model/trnParcelIn';
import { TrnParcelOut } from '../model/trnParcelOut';

@Injectable({
  providedIn: 'root'
})
export class IoclEmpServiceService {
  private baseUrl = 'http://localhost:8182/api/v1/employee';
  private disUrl = 'http://localhost:8182/api/v1/dispatch';

  empData: any = '';
  userHistory: any = '';

  constructor(private http: HttpClient) { }

  // Service method for login
  authenticateUser(id: string, password: string, captcha_value: string): Observable<any> {
    const loginRequest = { id, password, captcha_value };
    return this.http.post(`${this.baseUrl}/signin`, loginRequest, { withCredentials: true });
  }

  // Service method to get captcha
  getCaptcha(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-captcha`);
  }

  checkCaptcha(captchaValue: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/check-captcha/${captchaValue}`);
  }
  setEmpData(data: any) {
    this.empData = data;
  }
  getEmpData() {
    return this.empData;
  }
  signOut(): Observable<any> {
    return this.http.post(`${this.baseUrl}/signout`, { withCredentials: true }, { responseType: 'text' });
  }

  getMyIncomingParcelsToday(page: number = 0, size: number = 5): Observable<Page<TrnParcelIn>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelIn>>(`${this.baseUrl}/my-incoming-parcels/today`, {
      params: params,
      withCredentials: true
    });
  }

  getMyOutgoingParcelsToday(page: number = 0, size: number = 5): Observable<Page<TrnParcelOut>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelOut>>(`${this.baseUrl}/my-outgoing-parcels/today`, {
      params: params,
      withCredentials: true
    });
  }

  getMyIncomingParcels(page: number = 0, size: number = 5): Observable<Page<TrnParcelIn>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelIn>>(`${this.baseUrl}/my-incoming-parcels`, {
      params: params,
      withCredentials: true
    });
  }

  getMyOutgoingParcels(page: number = 0, size: number = 5): Observable<Page<TrnParcelOut>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelOut>>(`${this.baseUrl}/my-outgoing-parcels`, {
      params: params,
      withCredentials: true
    });
  }

  getHistoryByDate(fromDate: string, toDate: string, type: string): Observable<any[]> {
    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('type', type);
    return this.http.get<any[]>(`${this.baseUrl}/history/employee`, { params, withCredentials: true });
  }


  getHistoryByDaily(type: string): Observable<any[]> {
    let params = new HttpParams()
      .set('type', type);
    return this.http.get<any[]>(`${this.baseUrl}/employee/daily/report`, { params, withCredentials: true });
  }



  getHistoryByMonthly(month: number, year: number, type: string): Observable<any[]> {
    let params = new HttpParams()
      .set('month', month)
      .set('year', year)
      .set('type', type);
    return this.http.get<any[]>(`${this.baseUrl}/employee/monthly/report`, { params, withCredentials: true });
  }

  getEmployeeCodes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/empCodes`);
  }

  getLocationNames(): Observable<string> {
    return this.http.get<string>(`${this.disUrl}/locNames`);
  }

  getAllLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locNames`);
  }

  getEmployeesByLoc(locCode: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names/${locCode}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/roles`, { withCredentials: true });
  }

  getEmpCodesByLocCode(locCode: string): Observable<string[]> {
    const params = new HttpParams().set('locCode', locCode);
    return this.http.get<string[]>(`${this.baseUrl}/empCodesByLocCode`, { params });
  }

  getUserNameByUserId(userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<string>(`${this.baseUrl}/userNameByUserId`, { params, responseType: 'text' as 'json' },);
  }

  getEmpCodesBylogUserLocCode(): Observable<string[]> {
    //const params = new HttpParams().set('locCode', locCode);
    return this.http.get<string[]>(`${this.baseUrl}/empCodesByloguserLocCode`, { withCredentials: true });
  }

}
