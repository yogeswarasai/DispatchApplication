import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { environment } from '../Environment';


@Injectable({
  providedIn: 'root'
})
export class CourierhistoryService {

  // private courierUrl = 'http://localhost:8182/api/couriers'; // Replace with your API endpoint
  // private contractUrl = 'http://localhost:8182/api/courier-contracts'; // Replace with your API endpoint
  private courierUrl = `${environment.apiUrl}/api/couriers`; // Replace with your API endpoint
  private contractUrl = `${environment.apiUrl}/api/courier-contracts`; // Replace with your API endpoint
  
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
  // updateCourierRate(
  //   courierContNo: string,
  //   updatedRate: any,
  //   fromWtGms?: number,
  //   toWtGms?: number,
  //   fromDistanceKm?: number,
  //   toDistanceKm?: number
  // ): Observable<any> {
  //   const url = `${this.contractUrl}/update-rate/${courierContNo}`;
  
    
  //   let params = new HttpParams();
  //   if (fromWtGms !== undefined) params = params.set('fromWtGms', fromWtGms.toString());
  //   if (toWtGms !== undefined) params = params.set('toWtGms', toWtGms.toString());
  //   if (fromDistanceKm !== undefined) params = params.set('fromDistanceKm', fromDistanceKm.toString());
  //   if (toDistanceKm !== undefined) params = params.set('toDistanceKm', toDistanceKm.toString());
  
  //   return this.http.put<any>(url,updatedRate, {params, withCredentials: true });
  // }
  updateCourierRate(
    courierContNo: string,
    updatedRate: any,
    fromWtGms: number,
    toWtGms: number,
    fromDistanceKm: number,
    toDistanceKm: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('fromWtGms', fromWtGms.toString())
      .set('toWtGms', toWtGms.toString())
      .set('fromDistanceKm', fromDistanceKm.toString())
      .set('toDistanceKm', toDistanceKm.toString());
  
    return this.http.put(`${this.contractUrl}/update-rate/${courierContNo}`, updatedRate, {
      params,
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        console.error('Error updating rate:', error);
        if (error.status === 200 && typeof error.error === 'string' && error.error.startsWith('<!DOCTYPE html>')) {
          console.error('Received HTML instead of JSON:', error.error);
          return throwError(() => new Error('Unexpected HTML response.'));
        }
        return throwError(() => error); // Rethrow other errors
      })
    );
  }
  
  
  updateCourierDiscount(
    courierContNo: string,
    updatedDiscount: any,
    fromMonthlyAmt: number,
    toMonthlyAmt: number
  ): Observable<any> {
    // Initialize HttpParams
    let params = new HttpParams();
    
    // Set parameters if they are defined
    if (fromMonthlyAmt !== undefined) {
      params = params.set('fromMonthlyAmt', fromMonthlyAmt.toString());
    }
    if (toMonthlyAmt !== undefined) {
      params = params.set('toMonthlyAmt', toMonthlyAmt.toString());
    }
  
    // Log the parameters to verify the correct query parameters
    console.log('Query Params for Discount Update:', params);
  
    // Send the HTTP PUT request with the updated discount data and query parameters
    return this.http.put(`${this.contractUrl}/update-discount/${courierContNo}`, updatedDiscount, {
      params,        // Pass the query parameters with the request
      withCredentials: true,  // Include credentials with the request
    }).pipe(
      catchError((error) => {
        console.error('Error updating discount:', error);
        // Handle the case when HTML is received instead of JSON
        if (error.status === 200 && typeof error.error === 'string' && error.error.startsWith('<!DOCTYPE html>')) {
          console.error('Received HTML instead of JSON:', error.error);
          return throwError(() => new Error('Unexpected HTML response.'));
        }
        return throwError(() => error); // Rethrow other errors
      })
    );
  }
  
  
  deleteContractRateDiscount(
    courierContNo: string,
    fromWtGms?: number,
    toWtGms?: number,
    fromDistanceKm?: number,
    toDistanceKm?: number,
  ): Observable<any> {
    let params = new HttpParams();
    
    // Add query parameters only if they are provided
    if (fromWtGms !== undefined) params = params.set('fromWtGms', fromWtGms.toString());
    if (toWtGms !== undefined) params = params.set('toWtGms', toWtGms.toString());
    if (fromDistanceKm !== undefined) params = params.set('fromDistanceKm', fromDistanceKm.toString());
    if (toDistanceKm !== undefined) params = params.set('toDistanceKm', toDistanceKm.toString());
    // Construct the endpoint URL using the contract number as a path variable
    const url = `${this.contractUrl}/delete/rate/${courierContNo}`;
    
    // Make the DELETE request with the parameters
    return this.http.delete(url, { responseType: 'text' as 'json', params,withCredentials:true });
  }


  deleteContractDiscount(
    courierContNo: string,
    fromMonthlyAmt?: number,
    toMonthlyAmt?: number
  ): Observable<any> {
    let params = new HttpParams();
    
    // Add query parameters only if they are provided
   
    if (fromMonthlyAmt !== undefined) params = params.set('fromMonthlyAmt', fromMonthlyAmt.toString());
    if (toMonthlyAmt !== undefined) params = params.set('toMonthlyAmt', toMonthlyAmt.toString());

    // Construct the endpoint URL using the contract number as a path variable
    const url = `${this.contractUrl}/delete/discount/${courierContNo}`;
    
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
