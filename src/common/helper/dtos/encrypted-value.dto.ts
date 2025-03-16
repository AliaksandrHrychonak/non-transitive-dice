export class EncryptedValueDto {
    constructor(
        public readonly number: number,
        public readonly key: string,
        public readonly hmac: string
    ) {
        this.number = number;
        this.key = key;
        this.hmac = hmac;
    }
}
