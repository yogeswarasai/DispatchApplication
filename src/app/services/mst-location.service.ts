import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstLocation } from '../model/mstLocation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MstLocationService {

  private apiUrl = 'http://localhost:8182/locations';

  constructor(private http: HttpClient) { }

  getAllLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/locCodes`);
  }
  
}
