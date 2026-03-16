import { Draw } from '@/types';

export const formatUtils = {
  // Format currency with Thai Baht symbol
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  },

  // Format date to Thai format (DD/MM/YYYY)
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  },

  // Format date to ISO format (YYYY-MM-DD)
  formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Format draw name with date
  formatDrawName(draw: Draw): string {
    const date = this.formatDate(draw.drawDate);
    return `${draw.name} (${date})`;
  },

  // Get Thai status label
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      open: 'เปิดรับ',
      closed: 'ปิดงวด',
    };
    return labels[status] || status;
  },

  // Format number with leading zeros (for display)
  formatNumber(value: string, type: '2-digit' | '3-digit'): string {
    if (type === '2-digit') {
      return value.padStart(2, '0');
    }
    return value.padStart(3, '0');
  },

  // Get Thai number type label
  getNumberTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      '2-digit': 'เลข 2 ตัว',
      '3-digit': 'เลข 3 ตัว',
    };
    return labels[type] || type;
  },

  // Format for Excel filename
  formatExcelFilename(drawName: string, type: string): string {
    const timestamp = new Date().getTime();
    return `${drawName}_${type}_${timestamp}.xlsx`;
  },

  // Get Thai month name
  getMonthName(monthIndex: number): string {
    const months = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];
    return months[monthIndex] || '';
  },
};
