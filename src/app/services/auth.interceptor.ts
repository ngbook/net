import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // 拦截
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 添加 auth token
        const authToken = localStorage.getItem('auth') || '';
        const modified = req.clone({
            setHeaders: {
                Authorization: authToken
            }
        });
        return next.handle(modified);
    }
}
