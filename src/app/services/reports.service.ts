import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private baseUrl = 'http://localhost:8182/api/v1/dispatch';
  constructor(private http: HttpClient) { }

  getHistoryByDate(fromDate: string, toDate: string, type: string): Observable<any[]> {
    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('type', type);
   // return this.http.get<any[]>(this.baseUrl, { params,withCredentials:true});
    return this.http.get<any[]>(`${this.baseUrl}/history/all`, { params,withCredentials:true});
}

getDisHistoryByDaily(type: string): Observable<any[]> {
  let params = new HttpParams()
    .set('type', type);
  return this.http.get<any[]>(`${this.baseUrl}/daily/report`, { params,withCredentials:true});
}

getDisHistoryByMonthly(type: string): Observable<any[]> {
  let params = new HttpParams()
    .set('type', type);
  return this.http.get<any[]>(`${this.baseUrl}/monthly/report`, { params,withCredentials:true});
}



}