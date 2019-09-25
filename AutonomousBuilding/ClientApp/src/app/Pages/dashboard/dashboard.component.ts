import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../Services/navbar.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LockData, LockType, UserKeys, UserLocks, UserSchedules, Locks, Calss, Log, OneTime, TestData, KeyData } from '../../Models/Models';
import { Observable } from 'rxjs';
import { TopNavComponent } from '../../top-nav/top-nav.component';
import { QrcodeComponent } from '../../qrcode/qrcode.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogService } from '../../Services/log.Service';
import { AppComponent } from '../../app.component';
import { MobileService } from '../../Services/mobile.service';
import { LoginComponent } from '../../login/login.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.Service';

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

  constructor(public nav: NavbarService, private http: HttpClient, public str: TopNavComponent, private router: Router, 
    private modalServices: NgbModal, public log: LogService, public app: AppComponent, public mode: MobileService,
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.nav.show()
    this.getlockdata()
    this.getone()
    this.functions()
    this.inter()
  }
  
  //get onetimeuser info
  tempuser: OneTime[] = []
  getone() {
    this.http.get<OneTime[]>(`/api/onetime/${this.str.currentUser.personId}`).subscribe(data => { this.tempuser = data })
  }

  inter() {
    var self = this
    setInterval(function () {
      self.functions()
    }, 5000)
  }

  test: OneTime[] = []
  public day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  public pastdate = [0, 0]
  functions() {
    let days = new Date().getDay();
    let currentDate = ((this.log.time()).split(" "))[0]
    let currentHour = new Date().getHours();
    let currentMin = new Date().getMinutes();
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
    if ((currentHour > this.pastdate[0]) || ((currentHour === this.pastdate[0]) && (currentMin > this.pastdate[1]))) {
      this.pastdate = [currentHour, currentMin]
      setTimeout(() => {
        //check current time
        var time = this.log.time()
        var k = (time.split(" "))[1]
        if (this.str.currentUser.temp === false) {//not temp users
          let id = this.str.currentUser.personId
          let key_url = `/api/account/key/${id}`
          this.http.get<UserKeys>(key_url).subscribe(data => {//gets key data
            this.keys = data;
            let sch_url = `/api/account/schedule/${this.keys.keyID}`
            this.http.get<UserSchedules>(sch_url).subscribe(data => {
              this.sch = data;
              let lock_url = `/api/account/lockkey/${this.keys.keyID}`
              this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
                this.lock = data;
                for (let i of this.lock) {
                  var l = (this.sch.times).split("-")
                  if ((k >= l[0]) && (k <= l[1])) {//time within the interval
                    if ((this.sch.days === "Mon-Sun") || ((this.sch.days === "Mon-Fri") && (days === 1 || days === 2 || days === 3 || days === 4 || days === 5 ))) {
                      //enabled
                      var e = document.getElementById("demo" + i.name)
                      e.classList.remove("cancelled")
                      var f = document.getElementById(i.name)
                      f.innerHTML = ""
                    }
                    else {
                      var tot = 0
                      var x = this.sch.days.split(", ")
                      for (let k of x) {
                        var y = this.day.indexOf(k)
                        if (days === (y + 1)) {
                          tot += 1
                          //enabled
                          var e = document.getElementById("demo" + i.name)
                          e.classList.remove("cancelled")
                          var f = document.getElementById(i.name)
                          f.innerHTML = ""
                        }
                      }
                      if (tot = 0) {
                        //disabled
                        var e = document.getElementById("demo" + i.name)
                        e.classList.add("cancelled")
                        var f = document.getElementById(i.name)
                        f.innerHTML = "Out of hours"
                      }
                    }
                  }
                  else {
                    //disabled
                    var e = document.getElementById("demo" + i.name)
                    e.classList.add("cancelled")
                    var f = document.getElementById(i.name)
                    f.innerHTML = "Out of hours"
                  }
                }
              })
            })
          })
        }
        else {//temp users
          var q = []
          var r = []
          let id = this.str.currentUser.personId
          let key_url = `/api/account/key/${id}`
          this.http.get<UserKeys>(key_url).subscribe(data => {//gets key data
            this.keys = data;
            let lock_url = `/api/account/lockkey/${this.keys.keyID}`
            this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
              this.lock = data;
              let url = `/api/onetime/${id}`
              this.http.get<OneTime>(url).subscribe(data => {
                this.time = data;
                var o = this.time.time.split("-")
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
                for (let i of this.lock) {
                  if ((this.time.date === currentDate) && ((q[2] < r[0]) || ((q[2] === r[0]) && (q[3] <= r[1])))) {//current date time is larger or equal to end date-time
                    console.log("bye")
                    var d = this.time.keyID
                    //delete person data
                    let p_url = `/api/values/${this.str.currentUser.personId}`
                    this.http.delete<TestData[]>(p_url).subscribe();
                    //delete onetime user data
                    let o_url = `/api/onetime/${this.str.currentUser.personId}`
                    this.http.delete<OneTime[]>(o_url).subscribe();
                    //delete key data
                    setTimeout(() => {
                      let k_url = `/api/keys/${d}`
                      this.http.delete<KeyData[]>(k_url).subscribe();
                    }, 100)
                    setTimeout(() => {
                      this.authenticationService.logout();
                      this.nav.hide()
                      this.router.navigate(['/land']);
                      const modalRef = this.modalServices.open(LoginComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-primary', centered: true })
                    })
                    //log user out, redirect to landing page and open login modal
                  }
                  if ((q[0] < r[0]) || ((q[0] === r[0]) && (q[1] <= r[1]))) {//time later than the start interval
                    if ((q[2] > r[0]) || ((q[2] === r[0]) && (q[3] >= r[1]))) {//time sooner than the end interval
                      if ((this.time.date === currentDate)) {
                        //enabled
                        var e = document.getElementById("demo" + i.name)
                        e.classList.remove("cancelled")
                        var f = document.getElementById(i.name)
                        f.innerHTML = ""
                      }
                      else {
                        //disabled
                        var e = document.getElementById("demo" + i.name)
                        e.classList.add("cancelled")
                        var f = document.getElementById(i.name)
                        f.innerHTML = "Out of hours"
                      }
                    }
                    else {
                      //disabled
                      var e = document.getElementById("demo" + i.name)
                      e.classList.add("cancelled")
                      var f = document.getElementById(i.name)
                      f.innerHTML = "Out of hours"
                    }
                  }
                  else {
                    //disabled
                    var e = document.getElementById("demo" + i.name)
                    e.classList.add("cancelled")
                    var f = document.getElementById(i.name)
                    f.innerHTML = "Out of hours"
                  }
                }
              })
            })
          })
        }
      }, 200)  
    }
    else {
      this.pastdate = [currentHour, currentMin]
    }
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
  public keys: UserKeys;
  public locks: Locks[] = [];
  public lock: Locks[] = [];
  public sch: UserSchedules;
  public time: OneTime;
  //gets all lock data
  getlockdata() {
    if (this.str.currentUser.temp === false) {
      this.http.get<LockData[]>('/api/locks/testdata').subscribe(data => {
        this.server = data;
        let id = this.str.currentUser.personId
        let key_url = `/api/account/key/${id}`
        this.http.get<UserKeys>(key_url).subscribe(data => {//gets key data
          this.keys = data;
          let lock_url = `/api/account/lockkey/${this.keys.keyID}`
          this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
            this.lock = data;
            for (let m of this.server) {
              for (let n of this.lock) {
                if (m.name === n.name) {
                  this.serverData.push(m)
                }
              }
            }
            let sch_url = `/api/account/schedule/${this.keys.keyID}`
            this.http.get<UserSchedules>(sch_url).subscribe(data => {
              this.sch = data;
              for (let a of this.lock) {
                let group: Calss = new Calss()
                group.keyID = a.keyID
                group.lockID = a.lockID
                group.lockTypeID = a.lockTypeID
                group.name = a.name
                group.days = this.sch.days
                group.times = this.sch.times
                this.list.push(group)
              }
            }) 
          })          
        })
      })
    }
    else {
      //write function which retrieves lock data, 
      this.http.get<LockData[]>('/api/locks/testdata').subscribe(data => {
        this.server = data;
        let id = this.str.currentUser.personId
        let key_url = `/api/account/key/${id}`
        this.http.get<UserKeys>(key_url).subscribe(data => {//gets key data
          this.keys = data;
          let lock_url = `/api/account/lockkey/${this.keys.keyID}`
          this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
            this.lock = data;
            for (let m of this.server) {
              for (let n of this.lock) {
                if (m.name === n.name) {
                  this.serverData.push(m)
                }
              }
            }
            let one_url = `/api/onetime/${id}`
            this.http.get<OneTime>(one_url).subscribe(data => {
              this.time = data;
              for (let a of this.lock) {
                let group: Calss = new Calss()
                group.keyID = a.keyID
                group.lockID = a.lockID
                group.lockTypeID = a.lockTypeID
                group.name = a.name
                group.days = this.time.date
                group.times = this.time.time
                this.list.push(group)
              }
            })
          })          
        })
      })
    }
  }

  Data: LockType[] = []
  string: number[] = []
  sting: number[] =[]
  //opens/closes lock
  public one: boolean = false;
  func(thing: Calss) {
    var time = this.log.time()
    var k = (time.split(" "))[1]
    var l = (thing.times).split("-")
    if (this.str.currentUser.temp === false) {
      if ((k >= l[0]) && (k <= l[1])) {
        this.getall().subscribe(item => {
          this.Data = item
          for (let i of this.Data) {
            if (i.lockTypeID !== thing.lockTypeID) {
              this.Data = this.Data.filter(k => k !== i)
            }
          }
          this.http.post('/api/test/0', this.Data[0], httpOptions).subscribe()//turns on light
          var e = document.getElementById("demo"+thing.name)
          e.setAttribute('disabled', 'disabled');//disables button
          var f = document.getElementById(thing.name)
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
          logs.status = "S"
          this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
        })
      }
      else {
        var e = document.getElementById("demo" + thing.name)
        e.classList.add("cancelled")
        var f = document.getElementById(thing.name)
        f.innerHTML = "Out of hours"
        //log unsuccessful attempt
        let logs: Log = new Log()
        logs.time = this.log.time()
        logs.name = this.str.currentUser.name
        logs.lockName = thing.name
        logs.status = "OT"
        this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
      }
    }
    else {//for temp users
      for (let i of l) {
        var num = i.split(":")
        for (let j of num) {
          var p = Number(j)
          this.string.push(p)
        }
      }
      var n = k.split(":")
      for (let i of n) {
        var m = Number(i)
        this.sting.push(m)
      }
      if ((this.string[0] < this.sting[0]) || ((this.string[0] === this.sting[0]) && (this.string[1] <= this.sting[1]))) {//time later than the start interval
        if ((this.string[2] > this.sting[0]) || ((this.string[2] === this.sting[0]) && (this.string[3] >= this.sting[1]))) {//time sooner than the end interval
          this.getall().subscribe(item => {
            this.Data = item
            for (let i of this.Data) {
              if (i.lockTypeID !== thing.lockTypeID) {
                this.Data = this.Data.filter(k => k !== i)
              }
            }
            this.http.post('/api/test/0', this.Data[0], httpOptions).subscribe()//turns on light
            var e = document.getElementById("demo"+thing.name)
            e.setAttribute('disabled', 'disabled');//disables button
            var f = document.getElementById(thing.name)
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
            logs.status = "S"
            this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
          })
        }
        else {
          var e = document.getElementById("demo"+thing.name)
          e.classList.add("cancelled")
          var f = document.getElementById(thing.name)
          f.innerHTML = "Out of hours"
          //log unsuccessful attempt
          let logs: Log = new Log()
          logs.time = this.log.time()
          logs.name = this.str.currentUser.name
          logs.lockName = thing.name
          logs.status = "OT"
          this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
        }
      }
      else {
        var e = document.getElementById("demo"+thing.name)
        e.classList.add("cancelled")
        var f = document.getElementById(thing.name)
        f.innerHTML = "Out of hours"
        //log unsuccessful attempt
        let logs: Log = new Log()
        logs.time = this.log.time()
        logs.name = this.str.currentUser.name
        logs.lockName = thing.name
        logs.status = "OT"
        this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe(() => this.app.gets())
      }
      
    }
  }
  
  //function for opening modal

  //get locktype data
  getall(): Observable<LockType[]> {
    return this.http.get<LockType[]>('/api/locktype/testdata')
  }
}
