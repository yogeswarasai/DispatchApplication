// page.model.ts
export class Page<T> {
    content: T[];           // The actual data for the current page
    totalElements: number;  // Total number of elements available
    totalPages: number;     // Total number of pages
    size: number;           // Number of elements per page
    number: number;         // Current page number
    constructor(data:any)
    {
        this.content=data.content,
        this.totalElements=data.totalElements,
        this.totalPages=data.totalPages,
        this.size=data.size,
        this.number=data.number
    }
  }
  