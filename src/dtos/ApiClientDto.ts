export default interface ApiClientDto {
    id: number;
    name: string;
    lastname: string;
    mail: string;
    phone: string;
    arrangements: {
        arrangementId: string;
    }[]
}