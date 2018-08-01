import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response {
    code: number;
    data?: any;
    msg?: string; // additional message
}

@Injectable()
export class GetFruitsService {

    constructor(protected http: HttpClient) { }

    request(url, data): Observable<any> {
        const authToken = localStorage.getItem('auth') || '';
        const headers = new HttpHeaders({
            'Authorization': authToken,
            'Content-Type': 'application/json'
        });
        const options = { headers };

        return this.http.post<Response>(url, data, options)
            .pipe(
                map((rsp) => {
                    if (this.handleCommonErr(rsp)) {
                        // 无通用错误时才会进入
                        // ... 处理正常的response
                        return rsp;
                    }
                }),
                catchError((error) => {
                    console.warn('error', error);
                    // ... 处理错误信息
                    if (error instanceof HttpErrorResponse) {
                        console.log('...', error);
                    }
                    return empty();
                })
            );
    }
    private handleCommonErr(rsp: Response) {
        if (rsp.code === 0) {
            return true;
        } else {
            switch (rsp.code) {
                case 1001: // 通用错误
                    // alert('服务器繁忙');
                    console.log('未知错误');
                    break;
                case 1005: // token已过期
                    // 提示错误，可能还要跳到登录页
                    break;
                // ...
                default:
                    break;
            }
            return false;
        }
    }
}
