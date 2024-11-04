// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Menu } from '../models/menu';

// @Injectable({
//   providedIn: 'root'
// })
// export class MenuService {

//   private menuUrl='http://localhost:8182/api/menus/role';
//   constructor(private http:HttpClient) { }
//   getMenusByRole(roleId: string): Observable<Menu[]> {
//     return this.http.get<Menu[]>(`${this.menuUrl}/${roleId}`,{withCredentials: true});
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MstMenu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuUrl='http://localhost:8182/api/menus/role';
  constructor(private http:HttpClient) { }
  getMenusByRole(roleId: string): Observable<MstMenu[]> {
    return this.http.get<MstMenu[]>(`${this.menuUrl}/${roleId}`,{withCredentials: true});
  }
}