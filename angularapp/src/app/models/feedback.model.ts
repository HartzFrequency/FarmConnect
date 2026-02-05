export interface Feedback {
    _id?: string;
    reviewText: string;
    category: string;
    rating: number;
    itemId: string;
    supplierId: string;
    userId: string;
}
