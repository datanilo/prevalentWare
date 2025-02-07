interface MonthlyMovement {
  month: string;
  total: number;
}

interface FinancialReport {
  monthlyMovements: MonthlyMovement[];
}

interface Data {
  financialReport: FinancialReport;
}

export const generateCSV = (data: Data) => {
  if (!data || !data.financialReport || !data.financialReport.monthlyMovements) return;

  const headers = "Month,Total\n";
  const rows = data.financialReport.monthlyMovements
    .map((item: MonthlyMovement) => `${item.month},${item.total}`)
    .join("\n");

  const csvContent = headers + rows;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "reporte_movimientos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  