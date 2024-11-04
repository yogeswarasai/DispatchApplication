export class MstEmployee {
  empCode: number;
  empIni: string;
  empName: string;
  designation: string;
  currCompCode: string;
  currComp: string;
  paCode: string;
  pa: string;
  psaCode: string;
  psa: string;
  locCode: string;
  locName: string;
  emailId: string;
  empStatusCode: string;
  empStatus: string;
  constructor(data: any) {
    this.empCode = data.empCode;
    this.empIni = data.empIni;
    this.empName = data.empName;
    this.designation = data.designation;
    this.currCompCode = data.currCompCode;
    this.currComp = data.currComp;
    this.paCode = data.paCode;
    this.pa = data.pa;
    this.psaCode = data.psaCode;
    this.psa = data.psa;
    this.locCode = data.locCode;
    this.locName = data.locName;
    this.emailId = data.emailId;
    this.empStatusCode = data.empStatusCode;
    this.empStatus = data.empStatus;
  }
}
