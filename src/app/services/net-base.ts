/**
 * author: jsongo
 * desc: angular 请求模块的基类，建一个新的请求时，继承它就可以调用 get/post/delete 等方法
 */
import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const API_BASE_URL = 'https://api.ngbook.net/';

export interface Response {
    code: number;
    data?: any;
    msg?: string; // additional message
}

@Injectable()
export class RequestBase {

    constructor(protected http: HttpClient) { }

    /**
     * Post 请求
     */
    protected post(urlWithoutDomain: string,
        data?: any): Observable<any> {
        const url = API_BASE_URL + urlWithoutDomain;
        const headers = this.wrapHeader();
        const options = {
            headers,
        };

        const observe = this.http.post<Response>(
            url, data, options);
        return observe.map(this.processRsp.bind(this))
            .catch(error => this.handleError(error));
    }

    /**
     * 定制请求头等 通用请求部分
     */
    private wrapHeader() {
        const authToken = localStorage.getItem('auth') || '';
        const headers = {
            'Authorization': authToken,
            'Content-Type': 'application/json',
        };
        return headers;
    }

    /**
     * 处理异常
     */
    private handleError(error: HttpErrorResponse) {
        console.log('handleError - 出现错误: ', error);
        if (error instanceof HttpErrorResponse) {
            // 有时会遇到：虽然返回状态非200，但也有返回结果，则把它抽出来经 processRsp 再处理一次
            const body = error.error;
            if (body) {
                return Observable.of(this.processRsp(body));
            }
        }
        return Observable.of(error);
    }

    private processRsp(rsp: Response) {
        console.log('- 处理返回 -');
        if (rsp instanceof Event) { // ProgressEvent
            return {
                code: 1001
            };
        }
        const code = rsp && rsp.code;
        // 对共同code做处理
        // case里如果没必要做下一步处理的，直接return就行
        switch (code) {
            case 1001: // 未知错误
                console.log('...未知错误');
                break;
            case 1005: // token已过期
                // 提示错误，可能还要跳到登录页
                break;
            // ... other cases
            default:
                // default handler...
                break;
        }
        return rsp;
    }

    private obj2urlParam(data: Object): string {
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '='
                + encodeURIComponent(data[key]);
        }).join('&');
    }
}
