import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private parcelData: any;

  setParcelData(data: any) {
    this.parcelData = data;
  }

  getParcelData() {
    return this.parcelData;
  }

  clearParcelData() {
    this.parcelData = null;
  }
}
