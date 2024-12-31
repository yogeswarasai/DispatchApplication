import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstLocation } from '../model/mstLocation';
import { Observable } from 'rxjs';
import { environment } from '../Environment';
@Injectable({
  providedIn: 'root'
})
export class MstLocationService {

  // private apiUrl = 'http://localhost:8182/locations';
  private apiUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) { }

  getAllLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/locCodes`);
  }
  
}
