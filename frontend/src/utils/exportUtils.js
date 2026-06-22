import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'transactions') => {
    if(!data || data.length === 0) {
        alert("No data to export!");
        return;
    }
}