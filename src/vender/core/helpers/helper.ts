import { Injectable } from '@nestjs/common';

@Injectable()
export class Helper {
    public isNullOrUndefined<T>(object: T | undefined | null): object is T {
        return <T>object !== undefined && <T>object !== null;
    }
}
