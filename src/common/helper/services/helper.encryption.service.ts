import { createHmac, randomBytes, randomInt } from 'crypto';
import { IHelperEncryptionService } from '../interfaces';
import { EncryptedValueDto } from '../dtos';

export class HelperEncryptionService implements IHelperEncryptionService {
    generateRandomKey(): string {
        return randomBytes(32).toString('hex');
    }

    hmacEncrypt(number: number, key: string): string {
        const hmac = createHmac('sha3-256', Buffer.from(key, 'hex'));
        hmac.update(number.toString());
        return hmac.digest('hex');
    }

    hmacDecrypt(encryptedValue: EncryptedValueDto): boolean {
        const calculatedHmac = this.hmacEncrypt(encryptedValue.number, encryptedValue.key);

        return calculatedHmac === encryptedValue.hmac;
    }

    encryptValue(value: number): EncryptedValueDto {
        const key = this.generateRandomKey();
        const hmac = this.hmacEncrypt(value, key);
        return new EncryptedValueDto(value, key, hmac);
    }

    randomInt(min: number, max: number): number {
        return randomInt(min, max);
    }
}
