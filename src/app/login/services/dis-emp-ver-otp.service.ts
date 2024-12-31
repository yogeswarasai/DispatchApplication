import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../Environment';
@Injectable({
  providedIn: 'root'
})
export class DisEmpVerOtpService {
  // private baseUrl = 'http://localhost:8182/api/v1/dispatch'; 
  private baseUrl = `${environment.apiUrl}/api/v1/dispatch`; 

  private profileData: any;

  constructor(private http: HttpClient) {}

  login(mobileNumber: string, otp: number): Observable<any> {
    const params = new HttpParams()
      .set('mobileNumber', mobileNumber)
      .set('otp', otp.toString());

    return this.http.post(`${this.baseUrl}/login`, {}, { params, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }
    // setProfileData(data: any) {
    //   this.profileData = data;
    // }
  
    // getProfileData() {
    //   return this.profileData;
    // }

    setProfileData(data: any) {
      this.profileData = data;
      // Optionally, persist the profile data in localStorage (if desired)
      localStorage.setItem('profileData', JSON.stringify(data));
    }
  
    getProfileData() {
      if (!this.profileData) {
        const storedData = localStorage.getItem('profileData');
        this.profileData = storedData ? JSON.parse(storedData) : null;
      }
      return this.profileData;
    }
    getParcelTotalsByDate(date?: string): Observable<any> {
      let params = new HttpParams();
  
      if (date) {
        params = params.set('date', date);
      }
      return this.http.get(`${this.baseUrl}/totalsByDate`, { params, withCredentials: true })
        .pipe(
          catchError(this.handleError)
        );
    }
    private handleError(error: any) {
      console.error('An error occurred:', error);
      return throwError(error);
    }
    logout(): Observable<any> {
      return this.http.post(`${this.baseUrl}/logout`, {withCredentials: true } ,{ responseType: 'text' });
    }





// export class DisEmpVerOtpService {
//   private baseUrl = 'http://localhost:8182/api/v1/dispatch';
//   private profileKey = 'profileData'; // Key for storing profile in localStorage

//   constructor(private http: HttpClient) {}

//   // Login API
//   login(mobileNumber: string, otp: number): Observable<any> {
//     const params = new HttpParams()
//       .set('mobileNumber', mobileNumber)
//       .set('otp', otp.toString());

//     return this.http.post(`${this.baseUrl}/login`, {}, { params, withCredentials: true }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // // Set profile data and persist to localStorage
//   // setProfileData(data: any): void {
//   //   if (data && typeof data === 'object') {
//   //     try {
//   //       const dataString = JSON.stringify(data);
//   //       localStorage.setItem(this.profileKey, dataString); // Save to localStorage
//   //       console.log('Profile data set successfully:', data);
//   //     } catch (error) {
//   //       console.error('Error saving profile data to localStorage:', error);
//   //     }
//   //   } else {
//   //     console.warn('Invalid profile data:', data);
//   //   }
//   // }

//   // // Get profile data from localStorage with better error handling
//   // getProfileData(): any {
//   //   const profileString = localStorage.getItem(this.profileKey);
//   //   if (profileString) {
//   //     try {
//   //       const parsedProfile = JSON.parse(profileString); // Attempt to parse the JSON data
//   //       console.log('Profile data retrieved from localStorage:', parsedProfile);
//   //       return parsedProfile; // Return the parsed profile or null if invalid
//   //     } catch (error) {
//   //       console.error('Error parsing profile data from localStorage:', error);
//   //       localStorage.removeItem(this.profileKey); // Remove invalid data from localStorage
//   //       return null;
//   //     }
//   //   }
//   //   console.warn('No profile data found in localStorage.');
//   //   return null;
//   // }

//   // Set profile data and persist to localStorage
//   setProfileData(data: any): void {
//     console.log(`[DEBUG] Attempting to set profile data:`, data);
  
//     if (data && typeof data === 'object') {
//       try {
//         const dataString = JSON.stringify(data);
//         localStorage.setItem(this.profileKey, dataString);
//         console.log(`[INFO] Profile data set successfully:`, data);
//       } catch (error) {
//         console.error(`[ERROR] Could not save profile data to localStorage.`, error);
//       }
//     } else {
//       console.warn(`[WARNING] Invalid profile data provided.`, data);
//     }
//   }
  
//   getProfileData(): any {
//     console.log(`[DEBUG] Retrieving profile data from localStorage.`);
  
//     const profileString = localStorage.getItem(this.profileKey);
//     if (profileString) {
//       try {
//         const parsedProfile = JSON.parse(profileString);
//         console.log(`[INFO] Profile data retrieved successfully:`, parsedProfile);
//         return parsedProfile;
//       } catch (error) {
//         console.error(`[ERROR] Failed to parse profile data.`, error);
//         localStorage.removeItem(this.profileKey);
//       }
//     } else {
//       console.warn(`[WARNING] No profile data found in localStorage.`);
//     }
  
//     return null;
//   }
  
  
//   // API to fetch parcel totals by date
//   getParcelTotalsByDate(date?: string): Observable<any> {
//     let params = new HttpParams();
//     if (date) {
//       params = params.set('date', date);
//     }
//     return this.http.get(`${this.baseUrl}/totalsByDate`, { params, withCredentials: true }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Handle API errors
//   private handleError(error: any): Observable<never> {
//     console.error('API error occurred:', error);
//     return throwError(error);
//   }

//   // Logout API and clear profile from localStorage
//   logout(): Observable<any> {
//     try {
//       localStorage.removeItem(this.profileKey); // Clear profile data from localStorage
//       console.log('Profile data removed from localStorage');
//     } catch (error) {
//       console.error('Error removing profile data from localStorage:', error);
//     }
    
//     return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true, responseType: 'text' as 'json' }).pipe(
//       catchError(this.handleError)
//     );
//   }
 }
