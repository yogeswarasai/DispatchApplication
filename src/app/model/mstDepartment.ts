export class MstDepartment {
  locCode: string;
  deptCode: string;
  deptName: string;
  constructor(data: any){
    this.locCode=data.locCode;
    this.deptCode=data.deptCode;
    this.deptName=data.deptName;
  }
}
