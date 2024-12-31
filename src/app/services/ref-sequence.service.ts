import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { environment } from '../Environment';
import { RefSequence } from '../model/refSequence';
import { StatusCodeModal } from '../model/statusCodeModal';

@Injectable({
  providedIn: 'root'
})
export class RefSequenceService {

  // private apiUrl = 'http://localhost:8182/sequences';
  private apiUrl = `${environment.apiUrl}/sequences`;


  constructor(private http: HttpClient) { }
  getAllSequences(page: number = 0, size: number = 8): Observable<Page<RefSequence>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
       // Make HTTP GET request with pagination parameters
    return this.http.get<Page<RefSequence>>(this.apiUrl, {
      params: params,
      withCredentials: true
    });
    
  }

  checkLocationExists(locCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/locCode/${locCode}/exists`);
  }

  createSequence(refSequence: RefSequence): Observable<StatusCodeModal> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<StatusCodeModal>(this.apiUrl, refSequence, { headers });
  }

}

  