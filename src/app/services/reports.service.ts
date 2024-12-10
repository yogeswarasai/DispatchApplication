import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private baseUrl = 'http://localhost:8182/api/v1/dispatch';
  constructor(private http: HttpClient) { }

//   getHistoryByDate(fromDate: string, toDate: string, type: string): Observable<any[]> {
//     let params = new HttpParams()
//       .set('fromDate', fromDate)
//       .set('toDate', toDate)
//       .set('type', type);
//    // return this.http.get<any[]>(this.baseUrl, { params,withCredentials:true});
//     return this.http.get<any[]>(`${this.baseUrl}/history/all`, { params,withCredentials:true});
// }

// getHistoryByDate(fromDate: string, toDate: string, type: string, exportPdf: boolean = false): Observable<any> {
//   let params = new HttpParams()
//     .set('fromDate', fromDate)
//     .set('toDate', toDate)
//     .set('type', type)
//     .set('exportPdf', exportPdf.toString());

//   if (exportPdf) {
//     // If exporting as PDF, use responseType 'blob' to handle binary data
//     return this.http.get(`${this.baseUrl}/history/all`, { params,withCredentials: true , responseType: 'blob' as 'json' });
//   }

//   // Normal API request
//   return this.http.get<any[]>(`${this.baseUrl}/history/all`, { params, withCredentials: true });
// }
// getHistoryByDate(
//   fromDate: string,
//   toDate: string,
//   type: string,
//   exportPdf: boolean = false,
//   senderLocCode?: string,
//   senderDepartment?: string
// ): Observable<any> {
//   let params = new HttpParams()
//     .set('fromDate', fromDate)
//     .set('toDate', toDate)
//     .set('type', type)
//     .set('exportPdf', exportPdf.toString());

//   // Apply filters if provided
//   if (senderLocCode) {
//     params = params.set('senderLocCode', senderLocCode);
//   }
  
//   if (senderDepartment) {
//     params = params.set('senderDepartment', senderDepartment);
//   }

//   if (exportPdf) {
//     // If exporting as PDF, use responseType 'blob' to handle binary data (PDF)
//     return this.http.get(`${this.baseUrl}/history/all`, { params, withCredentials: true, responseType: 'blob' as 'json' });
//   }

//   // Normal API request, fetch filtered records if filters are applied
//   return this.http.get<any[]>(`${this.baseUrl}/history/all`, { params, withCredentials: true });
// }

downloadPdf(blob: Blob, fileName: string): void {
  const link = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url); // Cleanup the URL object
}

// getHistoryByDate(
//   fromDate: string,
//   toDate: string,
//   parcelType: string,
//   exportPdf: boolean = false,
//   senderLocCode: string = '',
//   senderDepartment: string = ''
// ): Observable<any> {
//   let params = new HttpParams()
//     .set('fromDate', fromDate)
//     .set('toDate', toDate)
//     .set('type', parcelType)
//     .set('exportPdf', exportPdf.toString());

//   if (senderLocCode) {
//     params = params.set('senderLocCode', senderLocCode);
//   }
//   if (senderDepartment) {
//     params = params.set('senderDepartment', senderDepartment);
//   }

//   if (exportPdf) {
//     return this.http.get(`${this.baseUrl}/history/all`, {
//       params,
//       responseType: 'blob' as 'json', // Ensure the response is handled as a blob for PDF download
//       withCredentials: true
//     });
//   }

//   return this.http.get<any[]>(`${this.baseUrl}/history/all`, {
//     params,
//     withCredentials: true
//   });
// }

// getHistoryByDate(
//   fromDate: string,
//   toDate: string,
//   parcelType: string,
//   // exportPdf: boolean = false,
//   exportExcel: boolean = false,

//   senderLocCode: string = '',
//   senderDepartment: string = '',
//   consignmentNumber: string = '' // Add this parameter
// ): Observable<any> {
//   let params = new HttpParams()
//     .set('fromDate', fromDate)
//     .set('toDate', toDate)
//     .set('type', parcelType)
//     // .set('exportPdf', exportPdf.toString());
//     .set('exportExcel', exportExcel.toString());

//   if (senderLocCode) {
//     params = params.set('senderLocCode', senderLocCode);
//   }
//   if (senderDepartment) {
//     params = params.set('senderDepartment', senderDepartment);
//   }

//   if (consignmentNumber) {
//     params = params.set('consignmentNumber', consignmentNumber); // Add consignment number filter
//   }

//   // if (exportPdf) {
//   //   return this.http.get(`${this.baseUrl}/history/all`, {
//   //     params,
//   //     responseType: 'blob' as 'json', // Ensure the response is handled as a blob for PDF download
//   //     withCredentials: true
//   //   });
//   // }
//   if (exportExcel) {
//     return this.http.get(`${this.baseUrl}/history/all`, {
//       params,
//       responseType: 'blob' as 'json', // Ensure the response is handled as a blob for PDF download
//       withCredentials: true
//     });
//   }

//   return this.http.get<any[]>(`${this.baseUrl}/history/all`, {
//     params,
//     withCredentials: true
//   });
// }


getHistoryByDate(
  fromDate: string,
  toDate: string,
  parcelType: string,
  exportPdf: boolean = false,
  exportExcel: boolean = false,
  senderLocCode: string = '',
  senderDepartment: string = '',
  consignmentNumber: string = ''
): Observable<any> {
  let params = new HttpParams()
    .set('fromDate', fromDate)
    .set('toDate', toDate)
    .set('type', parcelType)
    .set('exportPdf', exportPdf.toString())
    .set('exportExcel', exportExcel.toString());

  if (senderLocCode) {
    params = params.set('senderLocCode', senderLocCode);
  }
  if (senderDepartment) {
    params = params.set('senderDepartment', senderDepartment);
  }
  if (consignmentNumber) {
    params = params.set('consignmentNumber', consignmentNumber);
  }

  if (exportPdf || exportExcel) {
    // If export is requested, return file (PDF/Excel) as a Blob
    return this.http.get(`${this.baseUrl}/history/all`, {
      params,
      responseType: 'blob', // For file downloads
      withCredentials: true
    });
  }

  // Default behavior when export flags are false
  return this.http.get<any[]>(`${this.baseUrl}/history/all`, {
    params,
    withCredentials: true
  });
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