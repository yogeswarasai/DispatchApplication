import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisEmpVerOtpService {
  private baseUrl = 'http://localhost:8182/api/v1/dispatch'; 
  private profileData: any;

  constructor(private http: HttpClient) {}

  login(mobileNumber: string, otp: number): Observable<any> {
    const params = new HttpParams()
      .set('mobileNumber', mobileNumber)
      .set('otp', otp.toString());

    return this.http.post(`${this.baseUrl}/login`, {}, { params, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }
    setProfileData(data: any) {
      this.profileData = data;
    }
  
    getProfileData() {
      return this.profileData;
    }
    getParcelTotalsByDate(date?: string): Observable<any> {
      let params = new HttpParams();
  
      if (date) {
        params = params.set('date', date);
      }
      return this.http.get(`${this.baseUrl}/totalsByDate`, { params, withCredentials: true })
        .pipe(
          catchError(this.handleError)
        );
    }
    private handleError(error: any) {
      console.error('An error occurred:', error);
      return throwError(error);
    }
    logout(): Observable<any> {
      return this.http.post(`${this.baseUrl}/logout`, {withCredentials: true } ,{ responseType: 'text' });
    }
}
