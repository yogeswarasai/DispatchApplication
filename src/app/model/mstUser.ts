export class MstUser {
    locCode: string;
    userId: string;
    userName: string;
    mobileNumber:number; 
    password: string;
    roleId: string;
    status: string;
    createdBy: string;
    createdDate: Date;
    deptCode: string;
    constructor(data:any)
    {
      this.locCode=data.locCode;
      this.userId=data.userId;
      this.userName=data.userName;
      this.mobileNumber=data.mobileNumber
      this.password=data.password;
      this.roleId=data.roleId;
      this.status=data.status;
      this.createdBy=data.createdBy;
      this.createdDate=data.createdDate;
      this.deptCode=data.deptCode;
    }
  }
  