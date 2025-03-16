export interface IManagerService {
    promptSingleValue(
        choices: {
            title: string;
            value: string;
        }[],
        config: {
            messagePrompt: string;
            messageHelp: string;
        }
    ): Promise<number>;

    showError(error: string): void;

    showHint(hint: string): void;

    exit(): void;

    createManagerOptionArray(input: number | number[] | number[][]): { value: string; title: string }[];
}
