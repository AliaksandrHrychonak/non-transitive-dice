import { IPlayerService } from '@core/player/interfeces';
import { EncryptedValueDto } from '@common/helper/dtos';
import { IHelperEncryptionService } from '@common/helper/interfaces';

export class PlayerService implements IPlayerService {
    constructor(private readonly helperEncryptionService: IHelperEncryptionService) {}

    public createEncryptionValue(choice: number): EncryptedValueDto {
        return this.helperEncryptionService.encryptValue(choice);
    }
}
