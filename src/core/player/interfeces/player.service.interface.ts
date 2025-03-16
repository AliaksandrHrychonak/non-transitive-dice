import { EncryptedValueDto } from '@common/helper/dtos';

export interface IPlayerService {
    createEncryptionValue(choice: number): EncryptedValueDto;
}
