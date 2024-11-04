import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class CourierhistoryService {

  private courierUrl = 'http://localhost:8182/api/couriers'; // Replace with your API endpoint
  private contractUrl = 'http://localhost:8182/api/courier-contracts'; // Replace with your API endpoint
  
  constructor(private http: HttpClient) {}

  // Define headers directly in the get request
  getCourierContracts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Include Authorization token if needed
      // 'Authorization': 'Bearer ' + token 
    });

    return this.http.get<any[]>(`${this.contractUrl}/history`, { headers, withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getCouriers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.courierUrl}/all`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  changeCourierStatus(courierCode: string): Observable<any> {
    const url = `${this.courierUrl}/${courierCode}`; // URL to delete the courier
    return this.http.delete<any>(url, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  changeContractStatus(courierContNo: string): Observable<string> {
    const url = `${this.contractUrl}/${courierContNo}`;
    return this.http.delete<string>(url, { responseType: 'text' as 'json', withCredentials: true }).pipe(
      catchError((error) => {
        console.error("Error changing contract status:", error);
        return of('Error changing status');
      })
    );
  }
  
  getContractByContNo(courierContNo: string): Observable<any> {
    const url = `${this.contractUrl}/${courierContNo.trim()}`;
    console.log('Requesting data from URL:', url);
  
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }).pipe(
      tap((response) => console.log('Response received:', response)), // Verify response data
      catchError(this.handleError)
    );
  }
  
  


  // Update contract details
  // updateContract(courierContNo: string, updatedContract: any): Observable<any> {
  //   const url = `${this.contractUrl}/${courierContNo.trim()}`; // Construct the URL
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.put<any>(url, updatedContract, { headers, withCredentials: true }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

//   updateContract(courierContNo: string, updatedContract: any): Observable<any> {
//     return this.http.put<any>(`http://localhost:8182/api/courier-contracts/${courierContNo}`, updatedContract, {
//         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),withCredentials: true 
//     }).pipe(
//         catchError((error) => {
//             console.error('Error occurred while updating contract:', error);
//             return throwError(error);
//         })
//     );
// }

  
updateContract(courierContNo: string, updatedContract: any): Observable<any> {
  return this.http.put(`/api/contracts/${courierContNo}`, updatedContract, { responseType: 'text',withCredentials: true });
}


  

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(`Server-side error: ${error.status} ${error.message}`);
      if (typeof error.error === 'string' && error.error.includes('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON. Check your API response.");
      }
    }
    return throwError('Something went wrong; please try again later.');
  }
}
