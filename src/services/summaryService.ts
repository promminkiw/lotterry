import { Purchase, TwoDigitSummary, ThreeDigitSummary, DrawReport, Draw } from '@/types';

export const summaryService = {
  // Generate 2-digit number summary
  generateTwoDigitSummary(purchases: Purchase[]): TwoDigitSummary[] {
    const summaryMap = new Map<string, { customers: Set<string>; amount: number }>();

    // Initialize all numbers 00-99
    for (let i = 0; i <= 99; i++) {
      const number = String(i).padStart(2, '0');
      summaryMap.set(number, { customers: new Set<string>(), amount: 0 });
    }

    // Fill in data from purchases
    purchases.forEach((purchase) => {
      if (purchase.numberType === '2-digit') {
        const data = summaryMap.get(purchase.numberValue);
        if (data) {
          data.customers.add(purchase.customerName);
          data.amount += purchase.amount;
        }
      }
    });

    // Convert to array
    return Array.from(summaryMap.entries())
      .map(([number, data]) => ({
        number,
        buyerCount: data.customers.size,
        totalAmount: data.amount,
      }))
      .sort((a, b) => a.number.localeCompare(b.number));
  },

  // Generate 3-digit number summary
  generateThreeDigitSummary(purchases: Purchase[]): ThreeDigitSummary[] {
    const summaryMap = new Map<string, { customers: Set<string>; amount: number }>();

    // Initialize all numbers 000-999
    for (let i = 0; i <= 999; i++) {
      const number = String(i).padStart(3, '0');
      summaryMap.set(number, { customers: new Set<string>(), amount: 0 });
    }

    // Fill in data from purchases
    purchases.forEach((purchase) => {
      if (purchase.numberType === '3-digit') {
        const data = summaryMap.get(purchase.numberValue);
        if (data) {
          data.customers.add(purchase.customerName);
          data.amount += purchase.amount;
        }
      }
    });

    // Convert to array
    return Array.from(summaryMap.entries())
      .map(([number, data]) => ({
        number,
        buyerCount: data.customers.size,
        totalAmount: data.amount,
      }))
      .sort((a, b) => a.number.localeCompare(b.number));
  },

  // Generate draw report
  generateDrawReport(draw: Draw, purchases: Purchase[]): DrawReport {
    const twoDigitSummary = this.generateTwoDigitSummary(purchases);
    const threeDigitSummary = this.generateThreeDigitSummary(purchases);

    const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
    const purchaseCount = purchases.length;
    const uniqueCustomers = new Set(purchases.map((p) => p.customerName));
    const uniqueCustomerCount = uniqueCustomers.size;

    // Find highest amount number (2-digit and 3-digit combined)
    let highestAmountNumber = '';
    let highestAmountValue = 0;
    [...twoDigitSummary, ...threeDigitSummary].forEach((item) => {
      if (item.totalAmount > highestAmountValue) {
        highestAmountValue = item.totalAmount;
        highestAmountNumber = item.number;
      }
    });

    // Find highest count number (2-digit and 3-digit combined)
    let highestCountNumber = '';
    let highestCountValue = 0;
    [...twoDigitSummary, ...threeDigitSummary].forEach((item) => {
      if (item.buyerCount > highestCountValue) {
        highestCountValue = item.buyerCount;
        highestCountNumber = item.number;
      }
    });

    return {
      draw,
      totalAmount,
      purchaseCount,
      uniqueCustomerCount,
      highestAmountNumber,
      highestAmountValue,
      highestCountNumber,
      highestCountValue,
      twoDigitSummary,
      threeDigitSummary,
    };
  },
};
