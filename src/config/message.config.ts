export const messageConfig = {
    game: {
        determineFirstMove: () => "Let's determine who makes the first move.",
        determineFirstMoveGuessPrompt: () => 'Try to guess my selection.',

        moveVerificationHmac: (
            range: {
                min: number | string;
                max: number | string;
            },
            hmac: string
        ) => `I selected a random value in the range ${range.min}..${range.max} (HMAC=${hmac})`,
        moveVerificationKey: (value: number, key: string) => `My selection ${value} (KEY=${key})`,

        personSelection: () => `Your selection: `,

        computerDiceSelection: (dice: string, isPersonFirst: boolean) =>
            `I make the ${!isPersonFirst ? 'first' : 'second'} move and choose the ${dice} dice.`,

        chooseDice: () => `Choose your dice:`,

        personDiceSelection: (dice: string) => `You choose the ${dice} dice.`,

        timeThrow: (result: number | string, isPersonFirst: boolean) =>
            `${isPersonFirst ? 'You' : 'My'} throw is ${result}.`,

        throw: (isPersonFirst: boolean) => `It's time for ${isPersonFirst ? 'you' : 'my'} throw.`,

        addPlayerNumber: (module: number | string) => `Add your number modulo ${module}.`,

        resultCalculate: (
            personValue: number | string,
            computerValue: number | string,
            result: number | string,
            module: number | string
        ) => `The result is ${personValue} + ${computerValue} = ${result} (mod ${module})`,

        win: (personValue: number | string, computerValue: number | string, isPersonWin: boolean) =>
            `You ${isPersonWin ? 'win' : 'lose'} (${personValue} > ${computerValue})!`,

        deadHeat: (personValue: number | string, computerValue: number | string) =>
            `Wow! We have a draw! (${personValue} = ${computerValue})`,

        titleProbabilityTable: () => `Probability Table`,

        rules: () => `
Rules and Stages of Non-transitive Dice Game:
Rules and Stages of Non-transitive Dice Game:
        
Main Rule:
            
Computer and user choose different dice, make throws, and whoever rolls the higher number wins.
            
Game Stages:
            
1. Determining the first move through fair random number generation.
2. First player chooses a die from available options.
3. Second player chooses another die (cannot choose the same die as the first player).
4. Each player makes a throw using "fair" random number generation (order of throws doesn't matter).
5. Winner is determined by the higher rolled number.
`,
    },
    errors: {
        gameCancelled: (reason: string) => `Game cancelled: ${reason}`,

        tooFewDice: (required: number | string, current: number | string, needed: number | string) =>
            `Not enough dice. Required: ${required}, current count: ${current}. Need to add ${needed} more dice.`,
        tooManyDice: (max: number | string, current: number | string, excess: number | string) =>
            `Too many dice. Maximum allowed: ${max}, current count: ${current}. Need to remove ${excess} dice.`,

        tooFewFacesDice: (
            dice: number | string,
            required: number | string,
            current: number | string,
            needed: number | string
        ) =>
            `Not enough faces on the ${dice}. Required: ${required}, current count: ${current}. Need to add ${needed} more faces.`,
        tooManyFacesDice: (
            dice: number | string,
            max: number | string,
            current: number | string,
            excess: number | string
        ) =>
            `Too many faces on the ${dice}. Maximum allowed: ${max}, current count: ${current}. Need to remove ${excess} faces.`,

        invalidFacesDice: (dice: number | string, invalidValues: number | string) =>
            `Invalid face values detected on the ${dice}: ${invalidValues}`,
        invalidFaceIndexDice: (dice: number | string, index: number | string, validRange: number | string) =>
            `Invalid face index on the ${dice}: ${index}. Valid range: ${validRange}`,

        invalidValueDice: (
            value: number | string,
            range: {
                min: number | string;
                max: number | string;
            },
            dice: number | string
        ) => `Invalid ${dice} configuration: Face value must be between ${range.min} and ${range.max}, got: ${value}`,

        invalidValueTypeDice: (dice: number | string, value: number | string) =>
            `Invalid ${dice} configuration: Face value must be a positive integer, got: ${value}`,

        readlineValue: (value: number | string) =>
            `The value ${value} is not allowed, please enter a value from the allowed ones:`,
    },
};
