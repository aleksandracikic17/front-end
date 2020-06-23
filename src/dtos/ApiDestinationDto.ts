export default interface ApiDestinationDto {
    id: number;
    name: string;
    country: string;
    available: number;
    reserved: number;
    date: Date;
    active: boolean;
}