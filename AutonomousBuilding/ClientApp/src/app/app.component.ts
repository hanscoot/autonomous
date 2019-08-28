import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from './navbar.service';
import { Log } from './Pages/logs/logs.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private nav: NavbarService) { }

  ngOnInit() {
    this.getlog().subscribe(data => {
      this.LOG = data;
      this.LOG.sort(this.compare)
      this.shortlog = this.LOG.slice(0, 15);
    })
  }

  public shortlog: Log[] = [];
  //removes all log data visially
  clear() {
    this.getlog().subscribe(data => {
      this.LOG = data;
      this.LOG.sort(this.compare)
      this.shortlog = this.LOG.slice(0, 15);
      for (let i of this.shortlog) {
        this.shortlog = this.shortlog.filter(k => k !== i);
      }
    })
  }
  //sort
  compare(a, b) {
    if (a.logID > b.logID) {
      return -1;
    }
    if (a.logID < b.logID) {
      return 1;
    }
    return 0;
  }
  //gets log data
  public LOG: Log[] = []
  getlog(): Observable<Log[]> {
    return this.http.get<Log[]>('/api/log/data')
  }

  //scrolls to the top of the page   
  function() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
