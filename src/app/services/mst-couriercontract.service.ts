import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MstCouriercontractService {

  private apiUrl = 'http://localhost:8182/api/courier-contracts'; // Replace with your backend API endpoint

  constructor(private http: HttpClient) { }

  // createContract(contractData: any): Observable<string> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post<string>(this.apiUrl, contractData, { headers ,withCredentials: true});
  // }

  createContract(contractData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, contractData, { headers, withCredentials: true, responseType: 'text' as 'json' });
}

}
