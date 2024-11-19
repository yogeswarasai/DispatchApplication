import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';



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
      
    });

    return this.http.get<any[]>(`${this.contractUrl}`, { headers, withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getContractsBasedOnCourierCode(courierCode: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.contractUrl}/${courierCode}`,{withCredentials: true });
  }

  getContractRateDiscountBasedOnCourierContNo(courierContNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.contractUrl}/rates/discounts/${courierContNo}`,{withCredentials: true });
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
  deleteContract(courierContNo: string): Observable<string> {
    return this.http.delete<string>(`${this.contractUrl}/${courierContNo}`,{ responseType: 'text' as 'json', withCredentials: true });
  }
  
  getContractByContNo(courierContNo: string): Observable<any> {
    const url = `${this.contractUrl}/${courierContNo.trim()}`;
    console.log('Requesting data from URL:', url);
  
    return this.http.get<any>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }).pipe(
      tap((response) => console.log('Response received:', response)), // Verify response data
      catchError(this.handleError)
    );
  }
  
  
  deleteContractRateDiscount(
    courierContNo: string,
    fromWtGms?: number,
    toWtGms?: number,
    fromDistanceKm?: number,
    toDistanceKm?: number,
    fromMonthlyAmt?: number,
    toMonthlyAmt?: number
  ): Observable<any> {
    let params = new HttpParams();
    
    // Add query parameters only if they are provided
    if (fromWtGms !== undefined) params = params.set('fromWtGms', fromWtGms.toString());
    if (toWtGms !== undefined) params = params.set('toWtGms', toWtGms.toString());
    if (fromDistanceKm !== undefined) params = params.set('fromDistanceKm', fromDistanceKm.toString());
    if (toDistanceKm !== undefined) params = params.set('toDistanceKm', toDistanceKm.toString());
    if (fromMonthlyAmt !== undefined) params = params.set('fromMonthlyAmt', fromMonthlyAmt.toString());
    if (toMonthlyAmt !== undefined) params = params.set('toMonthlyAmt', toMonthlyAmt.toString());

    // Construct the endpoint URL using the contract number as a path variable
    const url = `${this.contractUrl}/delete/${courierContNo}`;
    
    // Make the DELETE request with the parameters
    return this.http.delete(url, { responseType: 'text' as 'json', params,withCredentials:true });
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

  
// updateContract(courierContNo: string, updatedContract: any): Observable<any> {
//   return this.http.put(`${this.contractUrl}/${courierContNo}`, updatedContract, { responseType: 'text',withCredentials: true });
// }


updateContract(courierContNo: string, updatedContract: any): Observable<any> {
  console.log('Updating contract with:', updatedContract); // Log the updated contract
  const trimmedCourierContNo = courierContNo.trim();

  return this.http.put(`${this.contractUrl}/${trimmedCourierContNo}`, updatedContract, { responseType: 'text', withCredentials: true }).pipe(
    tap(response => {
      console.log('Update response:', response); // Log the response for confirmation
    }),
    catchError((error) => {
      console.error('Error occurred while updating contract:', error);
      return throwError(error);
    })
  );
}
updateCourier(courierCode: string, courierData: any): Observable<any> {
  return this.http.put<any>(`${this.courierUrl}/${courierCode}`, courierData, {withCredentials: true });
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
