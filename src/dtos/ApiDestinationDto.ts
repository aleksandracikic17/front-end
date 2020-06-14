export default interface ApiDestinationDto {
    id: number;
    name: string;
    available: number;
    reserved: number;
    date: Date;
    active: boolean;
}