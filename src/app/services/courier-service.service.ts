import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  private baseUrl = `http://localhost:8182/api/couriers`;  // Replace with actual backend URL in production

  constructor(private http: HttpClient) {}

 
  addCourier(courierData: { courierCode: string; courierName: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Make a POST request to the API with the courier data
    return this.http.post<any>(this.baseUrl, courierData, {
      headers,
      withCredentials: true // Ensure credentials are included if needed
    });
  }

  
  checkCourierExists(courierCode: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/courierCode/${courierCode}/exists`,
      { withCredentials: true } // Correct placement inside an options object
    );
  }
  
}
