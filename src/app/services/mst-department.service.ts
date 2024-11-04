import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstDepartment } from '../model/mstDepartment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MstDepartmentService {

  private apiUrl = 'http://localhost:8080/parcels-in/api/departments';

  constructor(private http: HttpClient) { }

  getAllDepartments(): Observable<MstDepartment[]> {
    return this.http.get<MstDepartment[]>(this.apiUrl);
  }
}
