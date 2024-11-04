import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { ParcelTotals } from '../model/parcelTotals';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  //private apiUrl = 'http://localhost:8182/api/v1/dispatch/totalsByDate';

  private apiUrl = 'http://localhost:8182/api/v1/dispatch/totalsByDate';

  constructor(private http: HttpClient) {}

  getParcelTotals(): Observable<ParcelTotals> {
    const token = this.getTokenFromCookies();
    if (!token) {
      console.error("JWT token is missing or empty.");
      return throwError("JWT token is missing or empty.");
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<ParcelTotals>(this.apiUrl, { headers });
  }

  private getTokenFromCookies(): string | null {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
}

