import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../Services/navbar.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LockData, LockType, UserKeys, UserLocks, UserSchedules, Locks, Calss, Log, OneTime } from '../../Models/Models';
import { Observable } from 'rxjs';
import { TopNavComponent } from '../../top-nav/top-nav.component';
import { QrcodeComponent } from '../../qrcode/qrcode.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogService } from '../../Services/log.Service';
import { AppComponent } from '../../app.component';
import { MobileService } from '../../Services/mobile.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private nav: NavbarService, private http: HttpClient, public str: TopNavComponent,
    private modalServices: NgbModal, private log: LogService, private app: AppComponent, private mode: MobileService) { }

  ngOnInit() {
    this.nav.show()
    this.getlockdata()
    this.getone()
  }

  //get onetimeuser info
  tempuser: OneTime[] = []
  getone() {
    this.http.get<OneTime[]>(`/api/onetime/${this.str.currentUser.personId}`).subscribe(data => { this.tempuser = data })
  }

  //write function which checks current time and changes the functionality of the buttons if outside of scheduled hours

  open(item: Calss) {
    const modalRef = this.modalServices.open(QrcodeComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-light', centered: true, size: 'sm' })
    modalRef.componentInstance.items = item;
  }
  group: Calss;
  list: Calss[] =[]
  serverData: LockData[] = [];
  server: LockData[] = [];
  public keys: UserKeys[] = [];
  public locks: Locks[] = [];
  public lock: Locks[] = [];
  public sch: UserSchedules;
  //gets all lock data
  getlockdata() {
    if (!this.str.currentUser.temp) {
      this.http.get<LockData[]>('/api/locks/testdata').subscribe(data => {
        this.server = data;
        let id = this.str.currentUser.personId
        let key_url = `/api/account/key/${id}`
        this.http.get<UserKeys[]>(key_url).subscribe(data => {//gets key data
          this.keys = data;
          for (let i of this.keys) {
            let lock_url = `/api/account/lockkey/${i.keyID}`
            this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
              this.lock = data;
              for (let j of this.lock) {
                var count = 0
                for (let k of this.locks) {
                  if (j.name === k.name) {
                    count += 1
                  }
                }
                if (count === 0) {
                  this.locks.push(j)
                }
              }
              for (let m of this.server) {
                for (let n of this.locks) {
                  if (m.name === n.name) {
                    this.serverData.push(m)
                  }
                }
              }
              //edit this so it gets schedule data associated with the key/locks
            })
            let sch_url = `/api/account/schedule/${i.keyID}`
            this.http.get<UserSchedules>(sch_url).subscribe(data => {
              this.sch = data;
              for (let a of this.locks) {
                if (a.keyID === i.keyID) {
                  let group: Calss = new Calss()
                  group.keyID = a.keyID
                  group.lockID = a.lockID
                  group.lockTypeID = a.lockTypeID
                  group.name = a.name
                  group.days = this.sch.days
                  group.times = this.sch.times
                  this.list.push(group)
                }
              }
            })
          }
        })
      })
    }
    else {
      //write function which retrieves lock data, 
      console.log(1)
    }
  }

  Data: LockType[] = []
  //opens/closes lock
  public one: boolean = false;
  func(i, thing: Calss) {
    var time = this.log.time()
    var k = (time.split(" "))[1]
    var l = (thing.times).split("-")
    if ((k >= l[0]) && (k <= l[1])) {
      this.getall().subscribe(item => {
        this.Data = item
        for (let i of this.Data) {
          if (i.lockTypeID !== thing.lockTypeID) {
            this.Data = this.Data.filter(k => k !== i)
          }
        }
        this.http.post('/api/test/0', this.Data[0], httpOptions).subscribe()//turns on light
        var e = document.getElementById(i)
        e.setAttribute('disabled', 'disabled');//disables button
        var f = document.getElementById("demo" + i)
        f.innerHTML = "Unlocked"
        setTimeout(() => {
          e.removeAttribute("disabled");//enables button
          f.innerHTML = ""
        }, (this.Data[0].delay + 1000))
        setTimeout(() => {
          this.http.post('/api/test/1', this.Data[0], httpOptions).subscribe()//turns off light
        }, this.Data[0].delay)
        //log successful attempt
        let logs: Log = new Log()
        logs.time = this.log.time()
        logs.name = this.str.currentUser.name
        logs.lockName = thing.name
        logs.status = "Success"
        this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
      })
    }
    else {
      var e = document.getElementById(i)
      e.classList.add("cancelled")
      var f = document.getElementById("demo" + i)
      f.innerHTML = "Out of hours"
      //log unsuccessful attempt
      let logs: Log = new Log()
      logs.time = this.log.time()
      logs.name = this.str.currentUser.name
      logs.lockName = thing.name
      logs.status = "Outside hours"
      this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
    }
  }
  //function for unlocking door using buttons
  funct(one, two) {
    console.log(1)
  }
  //function for opening modal

  //get locktype data
  getall(): Observable<LockType[]> {
    return this.http.get<LockType[]>('/api/locktype/testdata')
  }
}
