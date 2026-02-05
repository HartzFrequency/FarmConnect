export interface Request {
    itemType: 'Feed' | 'Medicine';
    itemId: string;
    userId: string;
    species: string;
    quantity: number;
    status?: string;
    requestDate?: string;
}
