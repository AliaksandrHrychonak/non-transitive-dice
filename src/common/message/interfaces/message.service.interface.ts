export interface IMessageService {
    getMessage(path: string, params?: Record<string, unknown>): string;
}
