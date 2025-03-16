import { ConfigService } from './common/config/services';
import { Config } from './config';
import {
    HelperArrayService,
    HelperEncryptionService,
    HelperNumberService,
    HelperProbabilityService,
} from './common/helper/services';
import { MessageService } from './common/message/services';
import { ManagerService } from './common/manager/services';
import { GameService } from './core/game/services';
import { PlayerService } from './core/player/services';
import { GameController } from './core/game/controller';
import { DiceTableService } from './core/dice-table/services';
import { DiceValidatorService } from './core/dice/services';

if (require.main === module) {
    const configService = ConfigService.getInstance(Config);
    
    const helperArrayService = new HelperArrayService();
    const helperEncryptionService = new HelperEncryptionService();
    const helperProbabilityService = new HelperProbabilityService();
    const helperNumberService = new HelperNumberService();

    const messageService = new MessageService(configService);
    const managerService = new ManagerService(configService, helperNumberService, helperArrayService, messageService);
    const diceValidatorService = new DiceValidatorService(
        configService,
        helperArrayService,
        managerService,
        messageService
    );
    const diceTableService = new DiceTableService(configService, helperProbabilityService);
    const playerService = new PlayerService(helperEncryptionService);
    const gameService = new GameService(
        configService,
        helperEncryptionService,
        messageService,
        managerService,
        playerService,
        diceTableService
    );

    const gameController = new GameController(gameService, diceValidatorService);

    const args = process.argv.slice(2);

    gameController.start(args);
}
