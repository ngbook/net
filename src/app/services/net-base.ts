/**
 * author: jsongo
 * desc: angular 请求模块的基类，建一个新的请求时，继承它就可以调用 get/post/delete 等方法
 */
import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpResponse,
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
        const options: any = {
            headers,
            observe: 'response',
        };

        const observe = this.http.post<HttpResponse<Response>>(
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
        if (error.error instanceof ErrorEvent) {
            // 网络错误，或浏览器引起的错误（不包含跨域）
            console.error('发生网络异常...', error.error.message);
            return Observable.of({
                code: 1000,
                data: {
                    status: error.status,
                    // 通过statusText返回的信息
                    msg: error.statusText
                }
            });
        } else { // 服务端返回的错误
            // 返回的 body 里可能有相关的信息
            console.error(`服务端返回错误码： ${error.status}`);
            const body = error.error;
            if (body && body.code) {
                return Observable.of(this.processRsp(body));
            }
        }
    }

    private processRsp(rsp: HttpResponse<Response>) {
        console.log('- 处理返回 -', rsp);
        const body = rsp.body;
        const code = body && body.code;
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
        return body;
    }

    private obj2urlParam(data: Object): string {
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '='
                + encodeURIComponent(data[key]);
        }).join('&');
    }
}
