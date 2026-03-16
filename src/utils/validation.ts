import { CreatePurchaseInput, NumberType } from '@/types';

export const validationUtils = {
  // Validate 2-digit number
  validateTwoDigitNumber(value: string): boolean {
    const num = parseInt(value, 10);
    return /^\d{2}$/.test(value) && num >= 0 && num <= 99;
  },

  // Validate 3-digit number
  validateThreeDigitNumber(value: string): boolean {
    const num = parseInt(value, 10);
    return /^\d{3}$/.test(value) && num >= 0 && num <= 999;
  },

  // Validate number based on type
  validateNumber(value: string, type: NumberType): boolean {
    if (type === '2-digit') {
      return this.validateTwoDigitNumber(value);
    }
    return this.validateThreeDigitNumber(value);
  },

  // Validate amount
  validateAmount(amount: number): boolean {
    return amount > 0 && !isNaN(amount);
  },

  // Validate customer name
  validateCustomerName(name: string): boolean {
    return name.trim().length > 0;
  },

  // Validate purchase input
  validatePurchaseInput(input: CreatePurchaseInput): { valid: boolean; error?: string } {
    if (!this.validateCustomerName(input.customerName)) {
      return { valid: false, error: 'ชื่อลูกค้าไม่ถูกต้อง' };
    }

    if (!this.validateNumber(input.numberValue, input.numberType)) {
      if (input.numberType === '2-digit') {
        return { valid: false, error: 'เลข 2 ตัวต้องอยู่ในช่วง 00-99' };
      }
      return { valid: false, error: 'เลข 3 ตัวต้องอยู่ในช่วง 000-999' };
    }

    if (!this.validateAmount(input.amount)) {
      return { valid: false, error: 'จำนวนเงินต้องมากกว่า 0' };
    }

    return { valid: true };
  },
};
