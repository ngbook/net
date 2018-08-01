import {
    Http, Response,
    Headers, RequestOptions
} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestBase } from './net-base';

@Injectable()
export class GetFruitsService extends RequestBase {

    request(url): Observable<any> {
        return this.post(url).pipe(
            map((rsp) => {
                // 对body做相应的处理，比如数据的格式化等
                // ...
                return rsp.body;
            })
        );
    }
}
