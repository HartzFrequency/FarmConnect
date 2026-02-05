export interface Medicine {
    medicineName: string,
    type: string,
    description: string,
    dosage: string,
    pricePerUnit: number,
    unit: string,
    availableUnits: number;
    manufacturer: string,
    expiryDate: Date,
    supplierId: string
}