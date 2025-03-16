export interface IHelperArrayService {
    parseCommaSeparatedNumbers(input: string): number[];

    generateNumberArray(input: number): Array<{ value: string; title: string }>;

    generateOptionArray(arr: number[]): Array<{ value: string; title: string }>;
}
