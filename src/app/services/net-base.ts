/**
 * author: jsongo
 * desc: angular 请求模块的基类，建一个新的请求时，继承它就可以调用 get/post/delete 等方法
 */
import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpResponse,
    // HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const API_BASE_URL = 'https://api.ngbook.net/';

@Injectable()
export class RequestBase {

    constructor(protected http: HttpClient) { }

    /**
     * Post 请求
     */
    protected post(urlWithoutDomain: string,
        data?: any): Observable<any> {
        const url = API_BASE_URL + urlWithoutDomain;
        return this.makeRequest('post', url, data);
    }

    /**
     * Get 请求
     */
    protected get(urlWithoutDomain: string,
        params: string | Object): Observable<any> {
        if (typeof params === 'object') {
            params = this.obj2urlParam(params);
        }
        const url = API_BASE_URL + urlWithoutDomain + '?' + params;
        return this.makeRequest('get', url);
    }

    /**
     * delete 请求
     */
    protected delete(urlWithoutDomain: string,
        param: string = ''): Observable<any> {
        const url = API_BASE_URL + urlWithoutDomain + '?' + param;
        return this.makeRequest('delete', url);
    }

    /**
     * 创建真正的请求，并发送
     */
    private makeRequest(reqMethod: string,
        url: string, data?: any): Observable<any> {
        console.log('requesting...');
        const headers = this.wrapHeader();
        const options: any = {
            headers,
            observe: 'response',
        };

        let observe: Observable<HttpResponse<Object>> | Observable<Object>;
        if (reqMethod === 'post') {
            options.headers = {
                ...headers,
                'Content-Type': 'application/json'
            };
            observe = this.http.post<HttpResponse<Object>>(
                url, data, options);
        } else if (reqMethod === 'delete') {
            observe = this.http.delete(url, options);
        } else { // 默认用get请求
            observe = this.http.get<HttpResponse<Object>>(
                url, options);
        }
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

    private processRsp(rsp: any) {
        console.log('- 处理返回 -');
        const body = rsp.body;
        // const header = rsp.header;
        const code = body && body.code;
        // 对共同code做处理。case里如果没必要做下一步处理的，直接return就行
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
