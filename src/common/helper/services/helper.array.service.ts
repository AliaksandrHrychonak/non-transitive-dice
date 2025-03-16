import { IHelperArrayService } from '../interfaces';

export class HelperArrayService implements IHelperArrayService {
    public parseCommaSeparatedNumbers(input: string): number[] {
        return input.split(',').map((i) => parseFloat(i.trim().toLowerCase()));
    }
}
