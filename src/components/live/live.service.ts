import {
    Injectable,
    HttpService,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { map } from 'rxjs/operators';
@Injectable()
export class LiveService {
    constructor(private readonly httpService: HttpService) {}
    /**
     * URL of live streamming server
     *
     */
    private url = process.env.URL_LIVE;

    /**
     * Username and Password to login live streamming server
     *
     */
    private data: any = {
        email: process.env.EMAIL_LIVE,
        password: process.env.PASSWORD_LIVE
    };

    /**
     * Options for request
     *
     */
    private options: any = {};

    public async getLiveList(): Promise<any> {
        try {
            return this.httpService
                .post(this.url, this.data, this.options)
                .pipe(map((resp) => resp.data.streamKey));
        } catch (error) {
            return {
                code: 80002,
                data: false,
                message: 'Get list live failed'
            };
        }
    }
}
