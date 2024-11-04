export class TrnParcelOut {
  senderLocCode: string;
  outTrackingId: number;
  consignmentNumber?: string;
  consignmentDate?: Date;
  senderDepartment?: string;
  senderName?: string;
  recipientLocCode?: string;
  recipientDepartment?: string;
  recipientName?: string;
  courierName?: string;
  weight?: number;
  unit?: string;
  recordStatus: string = "A";
  createdBy?: string;
  createdDate?: Date;
  lastUpdatedDate?: Date;
  constructor(data: Partial<TrnParcelOut> = {}) {
    this.senderLocCode = data.senderLocCode || '';
    this.outTrackingId = data.outTrackingId || 0;
    this.consignmentNumber = data.consignmentNumber;
    this.consignmentDate = data.consignmentDate;
    this.senderDepartment = data.senderDepartment;
    this.senderName = data.senderName;
    this.recipientLocCode = data.recipientLocCode;
    this.recipientDepartment = data.recipientDepartment;
    this.recipientName = data.recipientName;
    this.courierName = data.courierName;
    this.weight = data.weight;
    this.unit = data.unit;
    this.recordStatus = data.recordStatus || 'A';
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.lastUpdatedDate = data.lastUpdatedDate;
  }
}
