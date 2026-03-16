import * as XLSX from 'xlsx';
import { Draw, Purchase, TwoDigitSummary, ThreeDigitSummary, DrawReport } from '@/types';
import { formatUtils } from './format';

export const excelExportUtils = {
  // Export 2-digit summary to Excel
  exportTwoDigitSummary(draw: Draw, summary: TwoDigitSummary[]): void {
    const data = summary.map((item) => ({
      เลข: item.number,
      'จำนวนคนซื้อ': item.buyerCount,
      'ยอดรวมเงิน(บาท)': item.totalAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'สรุปเลข 2 ตัว');

    const filename = `${draw.name}_เลข2ตัว_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  // Export 3-digit summary to Excel
  exportThreeDigitSummary(draw: Draw, summary: ThreeDigitSummary[]): void {
    const data = summary.map((item) => ({
      เลข: item.number,
      'จำนวนคนซื้อ': item.buyerCount,
      'ยอดรวมเงิน(บาท)': item.totalAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'สรุปเลข 3 ตัว');

    const filename = `${draw.name}_เลข3ตัว_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  // Export purchases to Excel
  exportPurchases(draw: Draw, purchases: Purchase[]): void {
    const data = purchases.map((purchase) => ({
      'ชื่อลูกค้า': purchase.customerName,
      'ประเภทเลข': formatUtils.getNumberTypeLabel(purchase.numberType),
      เลข: purchase.numberValue,
      'จำนวนเงิน(บาท)': purchase.amount,
      'วันที่บันทึก': formatUtils.formatDate(purchase.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'รายการซื้อ');

    const filename = `${draw.name}_รายการซื้อ_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  // Export draw report to Excel
  exportDrawReport(report: DrawReport): void {
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      { 'รายการ': 'ชื่องวด', 'รายละเอียด': report.draw.name },
      { 'รายการ': 'วันที่งวด', 'รายละเอียด': formatUtils.formatDate(report.draw.drawDate) },
      { 'รายการ': 'ยอดรวมทั้งหมด(บาท)', 'รายละเอียด': report.totalAmount },
      {
        'รายการ': 'จำนวนรายการซื้อ',
        'รายละเอียด': report.purchaseCount,
      },
      {
        'รายการ': 'จำนวนผู้ซื้อไม่ซ้ำ',
        'รายละเอียด': report.uniqueCustomerCount,
      },
      { 'รายการ': 'เลขที่มียอดสูงสุด', 'รายละเอียด': report.highestAmountNumber },
      { 'รายการ': 'ยอดเงินสูงสุด(บาท)', 'รายละเอียด': report.highestAmountValue },
      {
        'รายการ': 'เลขที่มีจำนวนผู้ซื้อสูงสุด',
        'รายละเอียด': report.highestCountNumber,
      },
      {
        'รายการ': 'จำนวนผู้ซื้อสูงสุด',
        'รายละเอียด': report.highestCountValue,
      },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'สรุปทั่วไป');

    // 2-digit summary sheet
    const twoDigitData = report.twoDigitSummary.map((item) => ({
      เลข: item.number,
      'จำนวนคนซื้อ': item.buyerCount,
      'ยอดรวมเงิน(บาท)': item.totalAmount,
    }));
    const twoDigitSheet = XLSX.utils.json_to_sheet(twoDigitData);
    XLSX.utils.book_append_sheet(workbook, twoDigitSheet, 'สรุปเลข 2 ตัว');

    // 3-digit summary sheet
    const threeDigitData = report.threeDigitSummary.map((item) => ({
      เลข: item.number,
      'จำนวนคนซื้อ': item.buyerCount,
      'ยอดรวมเงิน(บาท)': item.totalAmount,
    }));
    const threeDigitSheet = XLSX.utils.json_to_sheet(threeDigitData);
    XLSX.utils.book_append_sheet(workbook, threeDigitSheet, 'สรุปเลข 3 ตัว');

    const filename = `${report.draw.name}_รายงาน_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },
};
