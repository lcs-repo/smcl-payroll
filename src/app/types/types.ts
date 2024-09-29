// types.ts
export interface Employee {
    id: number;
    name: string;
    role: string;
    salary: number;
    bonuses?: number;
    deductions?: number;
  }
  
  export interface Payroll {
    employeeId: number;
    payPeriod: string;
    totalPay: number;
  }
  