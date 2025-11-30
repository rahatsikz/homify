export const calculateDueAmount = (rent: {
  houseRent: number;
  waterBill: number;
  electricityBill?: number | null;
  gasBill: number;
  utilityBill?: number | null;
  paidAmount: number;
}) => {
  const total =
    rent.houseRent +
    rent.waterBill +
    (rent.electricityBill || 0) +
    rent.gasBill +
    (rent.utilityBill || 0);
  return total - rent.paidAmount;
};
