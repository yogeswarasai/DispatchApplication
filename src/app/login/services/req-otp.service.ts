import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReqOtpService {

  private baseUrl = 'http://localhost:8182/api/v1/dispatch'; 
  

  constructor(private http: HttpClient) { }

  sendOtp(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sendotp`, null, { params: { mobileNumber: phoneNumber } })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
 
 
}
