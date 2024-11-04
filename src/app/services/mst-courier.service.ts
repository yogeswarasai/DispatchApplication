import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstCourier } from '../model/mstCourier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MstCourierService {

  private apiUrl = 'http://localhost:8080/parcels-in/api/couriers';

  constructor(private http: HttpClient) { }

  getAllCouriers(): Observable<MstCourier[]> {
    return this.http.get<MstCourier[]>(this.apiUrl);
  }
}
