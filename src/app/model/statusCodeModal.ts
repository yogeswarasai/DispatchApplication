export class StatusCodeModal {
    status: string;
    status_code: number;
    constructor(data:any){
      this.status=data.status,
      this.status_code=data.status_code
    }
  }
 