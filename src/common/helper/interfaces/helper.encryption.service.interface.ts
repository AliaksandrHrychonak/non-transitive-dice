import { EncryptedValueDto } from '@common/helper/dtos';

export interface IHelperEncryptionService {
    generateRandomKey(): string;

    hmacEncrypt(number: number, key: string): string;

    hmacDecrypt(encryptedChoice: EncryptedValueDto): boolean;

    encryptValue(value: number): EncryptedValueDto;

    randomInt(min: number, max: number): number;
}
