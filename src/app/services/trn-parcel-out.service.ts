import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MstCourier } from '../model/mstCourier';
import { TrnParcelOut } from '../model/trnParcelOut';
import { StatusCodeModal } from '../model/statusCodeModal';
import { Page } from '../model/page';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TrnParcelOutService {

  private baseUrl = 'http://localhost:8182/api/v1/dispatch';
  private parcelOutUrl='http://localhost:8182/parcels-out';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locNames`);
  }

  getDepartmentsByLocationName(locName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/departments/by-name/${locName}`);
  }

  getAllEmployees(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names/by/all-loc`);
  }

  getRecipientNamesByLocCodeAndPsa(locName: string, psa: string): Observable<string[]> {
    const url = `${this.baseUrl}/namesBy/${locName}/${psa}`;
    return this.http.get<string[]>(url);
  }

  getSenderDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/departments-by-loccode`, {withCredentials: true });
  }

  getSenderNameByDept(dept: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names/${dept}`,{ withCredentials: true });
  }
  getAllCouriers(): Observable<MstCourier[]> {
    // const headers = new HttpHeaders({
    //     'Content-Type': 'application/json',
    // });
    return this.http.get<MstCourier[]>('http://localhost:8182/api/couriers/names', { withCredentials: true });
}

  createParcel(parcelOut: TrnParcelOut): Observable<any> {
    return this.http.post<any>(`${this.parcelOutUrl}`, parcelOut, { withCredentials: true });
  }
  getParcelOutData(page: number = 0, size: number = 8): Observable<Page<TrnParcelOut>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelOut>>(`${this.parcelOutUrl}/get-out-parcelsbyloccode`, {
      params: params,
      withCredentials: true
    });
  }
  updateParcelOut(senderLocCode: string, outTrackingId: number, parcelOut: TrnParcelOut): Observable<any> {
    const url = `${this.parcelOutUrl}/${senderLocCode}/${outTrackingId}`;
   return this.http.put(url,parcelOut);
  }
  deleteParcelOut(outTrackingId: number): Observable<any> {
    return this.http.delete<any>(`${this.parcelOutUrl}/${outTrackingId}`,{withCredentials: true});
  }
}


