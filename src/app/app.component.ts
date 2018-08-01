import { Component, OnInit } from '@angular/core';
import { GetFruitsService } from './services/get-fruits.service';

const API_URL = 'http://api.ngbook.net/fruit/';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    data: any;
    constructor(private fruitReq: GetFruitsService) { }
    ngOnInit() {
        // request list
        this.request(API_URL);
        // request 500 error
        this.request(API_URL + 'error');
        // request error code
        this.request(API_URL + 'error-code/1001');
    }

    private request(url) {
        this.fruitReq.request(url, null)
            .subscribe((rsp) => {
                if (rsp) {
                    this.data = JSON.stringify(rsp.data);
                }
            });
    }
}
