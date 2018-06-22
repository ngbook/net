import { Component, OnInit } from '@angular/core';
import { GetFruitsService } from './services/get-fruits.service';

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
        this.request('fruit');
        // request 500 error
        this.request('fruit/error');
        // request error code
        this.request('fruit/error-code/1001');
    }

    private request(url) {
        this.fruitReq.request(url, null)
            .subscribe((rsp) => {
                if (rsp && rsp.data) {
                    this.data = rsp.data;
                }
            });
    }
}
