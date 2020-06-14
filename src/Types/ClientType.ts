export default class ClientType {
    clientId?: number;
    name?: string;
    lastname?: string;
    mail?: string;
    phone?: string;
    arrangements?: {
        arrangementId: string;
    }[]
}