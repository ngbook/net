
import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler implements ErrorHandler {

    constructor() {
        window.onerror = (msg, url, line, col, error) => {
            let extra = !col ? '' : '\ncolumn: ' + col;
            extra += !error ? '' : '\nerror: ' + error;
            // You can view the information in an alert to see things working like this:
            const errMsg = 'Error: ' + msg + '\nline: ' + line + extra;
            console.warn(errMsg);
        };
    }

    public handleError(error) {
        console.warn('-->', error);
    }
}
