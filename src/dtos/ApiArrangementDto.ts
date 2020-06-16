export default interface ApiArrangementDto {
    id: number;
    destinationId: number;
    destinationName: string;
    clientId: number;
    clientName: string;
    canceled: boolean;
}