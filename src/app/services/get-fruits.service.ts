import {
    Http, Response,
    Headers, RequestOptions
} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty';

import { RequestBase } from './net-base';

@Injectable()
export class GetFruitsService extends RequestBase {

    request(url, data): Observable<any> {
        return this.post(url).map((rsp) => {
            // 对body做相应的处理，比如数据的格式化等
            // ...
            return rsp.body;
        });
    }
}
