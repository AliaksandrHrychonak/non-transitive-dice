import { IHelperNumberService } from '../interfaces';

export class HelperNumberService implements IHelperNumberService {
    validateRange(value: string, maxRange: number): boolean {
        if (!value || !/^\d+$/.test(value)) {
            return false;
        }

        const numericValue = parseInt(value, 10);

        if (maxRange <= 0) {
            return false;
        }

        return numericValue >= 0 && numericValue < maxRange;
    }
}
