import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavbarService } from '../../Services/navbar.Service';
import { AppComponent } from '../../app.component';
import { Log } from '../../Models/Models';
import { MobileService } from '../../Services/mobile.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  constructor(private http: HttpClient, public nav: NavbarService, public log: AppComponent, public mode: MobileService) { }

  ngOnInit() {
    this.getlog().subscribe(data => {
      this.LOG = data;
      this.LOG.sort(this.compare)
      this.shortlog = this.LOG.slice(0, 15);
    })
    this.nav.show();
  }

  public shortlog: Log[] = [];
  //gets log data
  public LOG: Log[] = []
  getlog(): Observable<Log[]> {
    return this.http.get<Log[]>('/api/log/data')
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
  //removes all log data permanantly
  dellog() {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      this.getlog().subscribe(data => {
        this.LOG = data;
        for (let i of this.LOG) {
          this.LOG = this.LOG.filter(k => k !== i);
          let url = `/api/log/${i.logID}`
          this.http.delete<Log>(url).subscribe()
          this.log.gets()
        }
      })
    }
  }
 
}
