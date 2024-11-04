import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstUser } from '../model/mstUser';
import { Observable } from 'rxjs';
import { MstUserDTO } from '../model/mstUserDto';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class MstUserService {

  private apiUrl = 'http://localhost:8182/users';
  userDetails:any='';

  constructor(private http: HttpClient) { }

 getUserById(userId: string): Observable<MstUser> {
   return this.http.get<MstUser>(`${this.apiUrl}/${userId}`);
 }
  getAllUsers(page: number = 0, size: number = 5): Observable<Page<MstUser>> {
    // Create query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
       // Make HTTP GET request with pagination parameters
    return this.http.get<Page<MstUser>>(this.apiUrl, {
      params: params,
      withCredentials: true
    });
    
  }


  setUserData(data:MstUser)
  {
    this.userDetails=data;
  }
  getUserData(){
    return this.userDetails;
  }
  clearUserData() {
    this.userDetails = null;
  }
  createLocAdmin(mstUserdto:MstUserDTO): Observable<any> {
    return this.http.post(this.apiUrl, mstUserdto,{withCredentials: true});
  }
  
  updateUser(locCode: string, empCode: string, userUpdatedData: MstUser): Observable<any> {
    const url = `${this.apiUrl}/${locCode}/${empCode}`;
   return this.http.put(url,userUpdatedData);
  }

  deleteUser(locCode: string, empCode: string): Observable<any> {
    const url = `${this.apiUrl}/${locCode}/${empCode}`;
    return this.http.delete(url,{withCredentials: true});
}

getDispatchUsers(): Observable<MstUser[]> {
  return this.http.get<MstUser[]>(`${this.apiUrl}/dispatch`,{withCredentials:true});
}
 
}
