import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GetFruitsService } from './services/get-fruits.service';
import { GlobalErrorHandler } from './services/global-error.event';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    providers: [
        GetFruitsService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
