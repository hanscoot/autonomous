import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Log } from './Pages/logs/logs.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.gets()
  }

  public shortlog: Log[] = [];
  public LOG: Log[] = [];
  //gets
  gets() {
    this.http.get<Log[]>('/api/log/data').subscribe(data => {
      this.LOG = data;
      this.LOG.sort(this.compare)
      this.shortlog = this.LOG.slice(0, 15);
    })
  }


  //removes all log data visially
  clear() {
    this.http.get<Log[]>('/api/log/data').subscribe(data => {
      this.LOG = data;
      this.LOG.sort(this.compare)
      this.shortlog = this.LOG.slice(0, 15);
      for (let i of this.shortlog) {
        this.shortlog = this.shortlog.filter(k => k !== i);
      }
    })
  }

  //sorts in descending order
  compare(a, b) {
    if (a.logID > b.logID) {
      return -1;
    }
    if (a.logID < b.logID) {
      return 1;
    }
    return 0;
  }

  hide = true
  //shows/hides scroll button
  //scrolls to the top of the page   
  function() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
