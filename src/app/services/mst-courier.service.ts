import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstCourier } from '../model/mstCourier';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MstCourierService {

  private apiUrl = 'http://localhost:8080/parcels-in/api/couriers';

  constructor(private http: HttpClient) { }

  getAllCouriers(): Observable<MstCourier[]> {
    return this.http.get<MstCourier[]>(this.apiUrl);
  }
  addCourier(courierData: { courierCode: string; courierName: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl, courierData, { headers });
  }
}
