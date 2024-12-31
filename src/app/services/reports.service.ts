import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environment';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // private baseUrl = 'http://localhost:8182/api/v1/dispatch';
  private baseUrl = `${environment.apiUrl}/api/v1/dispatch`;
  constructor(private http: HttpClient) { }

// downloadPdf(blob: Blob, fileName: string): void {
//   const link = document.createElement('a');
//   const url = window.URL.createObjectURL(blob);
//   link.href = url;
//   link.download = fileName;
//   link.click();
//   window.URL.revokeObjectURL(url); // Cleanup the URL object
// }



// getHistoryByDate(
//   fromDate: string,
//   toDate: string,
//   parcelType: string,
//   exportPdf: boolean = false,
//   exportExcel: boolean = false,
//   senderLocCode: string = '',
//   senderDepartment: string = '',
//   searchBy: string = ''
// ): Observable<any> {
//   let params = new HttpParams()
//     .set('fromDate', fromDate)
//     .set('toDate', toDate)
//     .set('type', parcelType)
//     .set('exportPdf', exportPdf.toString())
//     .set('exportExcel', exportExcel.toString());

//   if (senderLocCode) {
//     params = params.set('senderLocCode', senderLocCode);
//   }
//   if (senderDepartment) {
//     params = params.set('senderDepartment', senderDepartment);
//   }
//   if (searchBy) {
//     params = params.set('searchBy', searchBy);
//   }
  

//   if (exportPdf || exportExcel) {
//     // If export is requested, return file (PDF/Excel) as a Blob
//     return this.http.get(`${this.baseUrl}/history/all`, {
//       params,
//       responseType: 'blob', // For file downloads
//       withCredentials: true
//     });
//   }

//   // Default behavior when export flags are false
//   return this.http.get<any[]>(`${this.baseUrl}/history/all`, {
//     params,
//     withCredentials: true
//   });
// }
getHistoryByDate(
  fromDate: string,
  toDate: string,
  parcelType: string,
  exportPdf: boolean,
  exportExcel: boolean,
  senderLocCode?: string,
  senderDepartment?: string,
  searchBy?: string,
  sortBy?: string,
  sortOrder: string = 'asc'
): Observable<any> {
  let params = new HttpParams()
    .set('fromDate', fromDate)
    .set('toDate', toDate)
    .set('type', parcelType)
    .set('exportPdf', exportPdf.toString())
    .set('exportExcel', exportExcel.toString())
    .set('sortOrder', sortOrder);

  if (senderLocCode) {
    params = params.set('senderLocCode', senderLocCode);
  }

  if (senderDepartment) {
    params = params.set('senderDepartment', senderDepartment);
  }

  if (searchBy) {
    params = params.set('searchBy', searchBy);
  }

  if (sortBy) {
    params = params.set('sortBy', sortBy);
  }

  if (exportPdf || exportExcel) {
    // Request for exporting data as a file
    return this.http.get(`${this.baseUrl}/history/all`, {
      params,
      responseType: 'blob',
      withCredentials: true,
    });
  } else {
    // Request for JSON response
    return this.http.get<any[]>(`${this.baseUrl}/history/all`, {
      params,
      withCredentials: true,
    });
  }
}



getDisHistoryByDaily(type: string): Observable<any[]> {
  let params = new HttpParams()
    .set('type', type);
  return this.http.get<any[]>(`${this.baseUrl}/daily/report`, { params,withCredentials:true});
}

getDisHistoryByMonthly(type: string): Observable<any[]> {
  let params = new HttpParams()
    .set('type', type);
  return this.http.get<any[]>(`${this.baseUrl}/monthly/report`, { params,withCredentials:true});
}



}