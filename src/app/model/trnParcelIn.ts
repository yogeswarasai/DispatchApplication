export class TrnParcelIn {
  recipientLocCode: string;
  inTrackingId: number;
  consignmentNumber?: string;
  consignmentDate?: Date;
  receivedDate?: Date;
  senderLocCode: string = '';
  senderDepartment?: string;
  senderName?: string;
  recipientDepartment?: string;
  recipientName?: string;
  courierName?: string;
  recordStatus: string = 'A';
  createdBy?: string;
  createdDate?: Date;
  lastUpdatedDate?: Date;

  constructor(data: Partial<TrnParcelIn> = {}) {
      this.recipientLocCode = data.recipientLocCode || '';
      this.inTrackingId = data.inTrackingId || 0;
      this.consignmentNumber = data.consignmentNumber;
      this.consignmentDate = data.consignmentDate;
      this.receivedDate = data.receivedDate;
      this.senderLocCode = data.senderLocCode || '';
      this.senderDepartment = data.senderDepartment;
      this.senderName = data.senderName;
      this.recipientDepartment = data.recipientDepartment;
      this.recipientName = data.recipientName;
      this.courierName = data.courierName;
      this.recordStatus = data.recordStatus || 'A';
      this.createdBy = data.createdBy;
      this.createdDate = data.createdDate;
      // this.lastUpdatedDate = data.lastUpdatedDate;
      this.lastUpdatedDate = data.lastUpdatedDate ? new Date(data.lastUpdatedDate) : undefined;
  }
}