import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from './Services/navbar.Service';
import { TopNavComponent } from './top-nav/top-nav.component';
import { MobileService } from './Services/mobile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { take, distinctUntilChanged } from 'rxjs/operators';
import { TestData, Log } from './Models/Models';
import { LogService } from './Services/log.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: TestData
  navShown = true;

  constructor(private http: HttpClient, private nav: NavbarService, private log: LogService,
    public str: TopNavComponent, private mode: MobileService, private modalServices: NgbModal) {
  }

  ngOnInit() {
    this.set()
    this.gets()
    this.getlog()
  }

  public shortlog: Log[] = [];
  public LOG: Log[] = [];

  set() {
    if (this.str.currentUser === null) {
      const modalRef = this.modalServices.open(LoginComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-primary', centered: true });
      modalRef.result.then(() => {
        this.gets()
        this.set()
      })
    }
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
