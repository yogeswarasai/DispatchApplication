import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MstLocation } from '../../model/mstLocation';
import { MstDepartment } from '../../model/mstDepartment';
import { MstUser } from '../../model/mstUser';
import { MstCourier } from '../../model/mstCourier';
import { MstEmployee} from '../../model/mstEmployee';
import { TrnParcelIn } from '../../model/trnParcelIn';
import { StatusCodeModal } from '../../model/statusCodeModal';
import { Page } from '../../model/page';
import { HttpParams } from '@angular/common/http';
import { ParcelOutResponse } from '../components/parcel-in/parcel-in.component';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TrnParcelInService {

  private baseUrl = 'http://localhost:8182/api/v1/dispatch';
  private parcelInUrl='http://localhost:8182/parcels-in';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locNames`);
  }

  getDepartmentsByLocationName(locName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/departments/by-name/${locName}`);
  }
  
  getSenderNameByLocCodeAndPsa(locName: string, psa: string): Observable<string[]> {
    const url = `${this.baseUrl}/namesBy/${locName}/${psa}`;
    return this.http.get<string[]>(url);
  }

  getRecipientNameByDept(dept: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names/${dept}`,{ withCredentials: true });
  }

  getAllEmployees(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names/by/all-loc`);
  }

  getRecipientDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/departments-by-loccode`, {withCredentials: true });
  }

  getAllCouriers(): Observable<MstCourier[]> {
    // const headers = new HttpHeaders({
    //     'Content-Type': 'application/json',
    // });
    return this.http.get<MstCourier[]>('http://localhost:8182/api/couriers/names', { withCredentials: true });
}
  createParcel(parcelIn: TrnParcelIn): Observable<any> {
    return this.http.post<any>(`${this.parcelInUrl}`, parcelIn, { withCredentials: true });
  }
  getParcelInData(page: number = 0, size: number = 8): Observable<Page<TrnParcelIn>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Make HTTP GET request with pagination parameters
    return this.http.get<Page<TrnParcelIn>>(`${this.parcelInUrl}/get-in-parcelsbyloccode`, {
      params: params,
      withCredentials: true
    });
  }
  updateParcelIn(recipientLocCode: string, inTrackingId: number, parcelIn: TrnParcelIn): Observable<any> {
    const url = `${this.parcelInUrl}/${recipientLocCode}/${inTrackingId}`;
   return this.http.put(url, parcelIn);
  }
  // TrnParcelInService
  deleteParcelIn(inTrackingId: number): Observable<any> {
  return this.http.delete<any>(`${this.parcelInUrl}/${inTrackingId}`,{ withCredentials: true });
}

// getParcelOutByConsignmentNumber(consignmentNumber: string): Observable<ParcelOutResponse> {
//   return this.http.get<ParcelOutResponse>(`/parcels-out/out/${consignmentNumber}`);
// }
getParcelOutByConsignmentNumber(consignmentNumber: string): Observable<ParcelOutResponse> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // Include Authorization token if needed
    // 'Authorization': 'Bearer ' + token 
  });

  return this.http.get<ParcelOutResponse>(`http://localhost:8182/parcels-out/out/${consignmentNumber}`, {
      headers
  });
}


}
