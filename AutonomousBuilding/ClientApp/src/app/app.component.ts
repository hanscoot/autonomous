import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from './Services/navbar.Service';
import { TopNavComponent } from './top-nav/top-nav.component';
import { MobileService } from './Services/mobile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { TestData, Log, OneTime, KeyData } from './Models/Models';
import { LogService } from './Services/log.Service';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: TestData
  navShown = true;

  constructor(private http: HttpClient, public nav: NavbarService, public log: LogService,
    public str: TopNavComponent, public mode: MobileService, private modalServices: NgbModal) {
  }

  ngOnInit() {
    this.set()
  }

  public shortlog: Log[] = [];
  public LOG: Log[] = [];

  set() {
    if (this.str.currentUser === null) {
      const modalRef = this.modalServices.open(LoginComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-primary', centered: true });
      modalRef.result.then(() => {
        this.gets()
        this.getlog()
        this.check()
        this.set()
      })
    }
    else {
      this.gets()
      this.getlog()
      this.check()
    }
  }

  test: OneTime[] = []
  check() {
    let currentDate = ((this.log.time()).split(" "))[0]
    //iterate over temp users and remove those which time has expired
    var q = []
    var r = []
    var time = this.log.time()
    var k = (time.split(" "))[1]
    this.http.get<OneTime[]>('/api/onetime/testdata').subscribe(data => {
      this.test = data;
      for (let c of this.test) {
        var o = c.time.split("-")
        for (let i of o) {
          var p = i.split(":")
          for (let i of p) {
            var s = Number(i)
            q.push(s)
          }
        }
        var v = k.split(":")
        for (let i of v) {
          var t = Number(i)
          r.push(t)
        }
        if ((c.date === currentDate) && ((q[2] < r[0]) || ((q[2] === r[0]) && (q[3] <= r[1])))) {//current date time is larger or equal to end date-time
          var d = c.keyID
          var b = c.personID
          //delete person data
          let p_url = `/api/values/${b}`
          this.http.delete<TestData[]>(p_url).subscribe();
          //delete onetime user data
          let o_url = `/api/onetime/${b}`
          this.http.delete<OneTime[]>(o_url).subscribe();
          //delete key data
          setTimeout(() => {
            let k_url = `/api/keys/${d}`
            this.http.delete<KeyData[]>(k_url).subscribe();
          }, 100)
        }
      }
    })
  }

  //gets non-authorised logdata
  logs: string[] = []
  getlog() {
    this.logs = this.log.get()
  }

  //removes all log data visially
  clears() {
    this.logs = []
  }

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


  /*
    dark() {
      var element = document.getElementById("example1")
      element.classList.add("bg-dark")
      var item = document.getElementById("example2")
      item.classList.add("text-light")
      var thing = document.getElementById("example3")
      thing.classList.add("text-light", "bg-dark", "thing")
      var object = document.getElementById("example5")
      object.classList.add("bg-dark")
      var entity = document.getElementById("example6")
      entity.classList.add("bg-dark", "ent")
      var entity = document.getElementById("example7")
      entity.classList.add("bg-dark", "ent")
      var entity = document.getElementById("example8")
      entity.classList.add("bg-dark", "ent")
      var entity = document.getElementById("example9")
      entity.classList.add("bg-dark", "ent")
      var entity = document.getElementById("example11")
      entity.classList.add("bg-dark", "ent")
      var entity = document.getElementById("example12")
      entity.classList.add("bg-dark", "ent")
    }
    light() {
      var element = document.getElementById("example1")
      element.classList.remove("bg-dark")
      var item = document.getElementById("example2")
      item.classList.remove("text-light")
      var thing = document.getElementById("example3")
      thing.classList.remove("text-light", "bg-dark", "thing")
      var object = document.getElementById("example5")
      object.classList.remove("bg-dark")
      var entity = document.getElementById("example6")
      entity.classList.remove("bg-dark", "ent")
      var entity = document.getElementById("example7")
      entity.classList.remove("bg-dark", "ent")
      var entity = document.getElementById("example8")
      entity.classList.remove("bg-dark", "ent")
      var entity = document.getElementById("example9")
      entity.classList.remove("bg-dark", "ent")
      var entity = document.getElementById("example11")
      entity.classList.remove("bg-dark", "ent")
      var entity = document.getElementById("example12")
      entity.classList.remove("bg-dark", "ent")
    }*/
   
}
