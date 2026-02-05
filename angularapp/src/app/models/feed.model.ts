export interface Feed {
    feedName: string,
    type: string,
    description: string,
    unit: string,
    availableUnits: number,
    pricePerUnit: number,
    supplierId: string;
}
