import { messageConfig } from './message.config';
import { diceConfig } from './dice.config';
import { gameConfig } from './game.config';
import { managerConfig } from './manager.config';
import { tableConfig } from './table.config';

export const Config = {
    messages: messageConfig,
    dice: diceConfig,
    game: gameConfig,
    manager: managerConfig,
    table: tableConfig,
};

export type Config = typeof Config;
