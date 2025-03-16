import { ConfigService } from './common/config/services';
import { Config } from './config';
import {
    HelperArrayService,
    HelperEncryptionService,
    HelperNumberService,
    HelperProbabilityService,
    HelperStringService,
} from './common/helper/services';
import { MessageService } from './common/message/services';
import { ManagerService } from './common/manager/services';
import { GameService } from './core/game/services';
import { PlayerService } from './core/player/services';
import { GameController } from './core/game/controller';
import { DiceTableService } from './core/dice-table/services';

if (require.main === module) {
    const configService = ConfigService.getInstance(Config);

    const helperStringService = new HelperStringService();
    const helperArrayService = new HelperArrayService();
    const helperEncryptionService = new HelperEncryptionService();
    const helperProbabilityService = new HelperProbabilityService();
    const helperNumberService = new HelperNumberService();

    const messageService = new MessageService(helperStringService, configService);
    const managerService = new ManagerService(configService, helperNumberService, messageService);
    const diceTableService = new DiceTableService(helperProbabilityService);
    const playerService = new PlayerService(helperEncryptionService);
    const gameService = new GameService(
        messageService,
        managerService,
        helperArrayService,
        helperEncryptionService,
        playerService,
        diceTableService,
        configService
    );

    const gameController = new GameController(gameService, configService);

    const args = process.argv.slice(2);

    gameController.start(args);
}
