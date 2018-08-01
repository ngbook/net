import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
    // 拦截
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const method = req.method;
        let modified: HttpRequest<any>;
        // 给 POST 请求加上 Content-Type 定制
        if (method === 'POST') {
            modified = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
        }
        return next.handle(modified);
    }
}
