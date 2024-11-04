export class MstLocation {
    locCode: string;
    locName: string;
    stateOfficeCode: string;
    regionOfficeCode: string;
    locAddress: string;
    locState: string;
    locPin: string;
    constructor(data:any)
    {
      this.locCode=data.locCode;
      this.locName=data.locName;
      this.stateOfficeCode=data.stateOfficeCode;
      this.regionOfficeCode=data.regionOfficeCode;
      this.locAddress=data.locAddress;
      this.locState=data.locState;
      this.locPin=data.locPin;
    }
  }
  