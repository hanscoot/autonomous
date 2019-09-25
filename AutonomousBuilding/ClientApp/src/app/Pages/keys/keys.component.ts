import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddKeyComponent } from '../../Modals/add-key/add-key.component';
import { NavbarService } from '../../Services/navbar.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MobileService } from '../../Services/mobile.service';
import { KPD, KeyData, Locks, UserSchedules, OneTime, LockType } from '../../Models/Models';
import { LogService } from '../../Services/log.Service';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';

  constructor(private http: HttpClient, private modalServices: NgbModal, public nav: NavbarService, public mode: MobileService, public log: LogService) { }

  ngOnInit() {
    this.nav.show()
    this.get();
  }

  public serverData: KeyData[] = [];
  public keypersonData: KPD[] = [];

  //gets key data (and person data)
  get() {
    this.http.get<KPD[]>('/api/pk/data').subscribe(data => {
      this.keypersonData = data;
      this.http.get<KeyData[]>('/api/keys/testdata').subscribe(item => {
        this.serverData = item;
        for (let i of this.serverData) {
          for (let j of this.keypersonData) {
            if (i.keyID === j.keyID) {
              this.serverData = this.serverData.filter(k => k !== i)
            }
          }
        }
      })
    })
  }
  //opens add key modal
  open() {
    let modalRef = this.modalServices.open(AddKeyComponent);
    modalRef.result.then(() => {
      this.get()
    });
  }
  //deletes key
  del(item: KeyData) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      this.serverData = this.serverData.filter(i => i !== item);
      let url = `/api/keys/${item.keyID}`
      this.http.delete<KeyData[]>(url).subscribe();
    }
  }




  //for content checks whether key is valid for lock and current date time
  //input provides lock and key content
  //check lock data allocated to the key has the lock availible
  time: OneTime
  Data: LockType
  contentkey: KeyData
  sch: UserSchedules
  lock: Locks[] = [];
  public day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  check(value) {
    let days = new Date().getDay();
    var q = []
    var r = []
    var time = this.log.time()
    let currentDate = ((this.log.time()).split(" "))[0]
    var k = (time.split(" "))[1]
    //gets key data for the key tapped
    var url = `/api/keys/ct/${value}`
    this.http.get<KeyData>(url).subscribe(data => {
      this.contentkey = data
      var e = document.getElementById("test")
      if (this.contentkey !== null) { // key data
        //gets all lock data for the key tapped
        let lock_url = `/api/account/lockkey/${this.contentkey.keyID}`
        this.http.get<Locks[]>(lock_url).subscribe(data => {//gets lock data
          this.lock = data;
          if (this.lock !== null) { // lock data
            //gets schedule data for the key tapped
            let sch_url = `/api/account/schedule/${this.contentkey.keyID}`
            this.http.get<UserSchedules>(sch_url).subscribe(data => {
              this.sch = data;
              if (this.sch !== null) { // schedule data
                //check whether valid for current date time
                var l = (this.sch.times).split("-")
                if ((k >= l[0]) && (k <= l[1])) {//time within the interval
                  if ((this.sch.days === "Mon-Sun") || ((this.sch.days === "Mon-Fri") && (days === 1 || days === 2 || days === 3 || days === 4 || days === 5))) {
                    //enabled
                    let url = `/api/locktype/1`
                    this.http.get<LockType>(url).subscribe(data => {
                      this.Data = data;
                      this.http.post('/api/test/0', this.Data, httpOptions).subscribe()//turns on light
                      setTimeout(() => {
                      }, (this.Data.delay + 1000))
                      setTimeout(() => {
                        this.http.post('/api/test/1', this.Data, httpOptions).subscribe()//turns off light
                      }, this.Data.delay)
                    })
                    let string = ''
                    for (let i of this.lock) {
                      string = string + " " + i.name
                    }
                    e.innerHTML = this.contentkey.content + " " + this.sch.days + " " + this.sch.times + " " + string
                  }
                  else {
                    var tot = 0
                    var x = this.sch.days.split(", ")
                    for (let k of x) {
                      var y = this.day.indexOf(k)
                      if (days === (y + 1)) {
                        tot += 1
                        //enabled
                        let url = `/api/locktype/1`
                        this.http.get<LockType>(url).subscribe(data => {
                          this.Data = data;
                          this.http.post('/api/test/0', this.Data, httpOptions).subscribe()//turns on light
                          setTimeout(() => {
                          }, (this.Data.delay + 1000))
                          setTimeout(() => {
                            this.http.post('/api/test/1', this.Data, httpOptions).subscribe()//turns off light
                          }, this.Data.delay)
                        })
                        //log entry attempt (success)
                        let string = ''
                        for (let i of this.lock) {
                          string = string + " " + i.name
                        }
                        e.innerHTML = this.contentkey.content + " " + this.sch.days + " " + this.sch.times + " " + string
                      }
                    }
                    if (tot = 0) {
                      e.innerHTML = "Outside of hours" //Access denied
                      //log entry attempt (failed - out of permissible times)
                    }
                  }
                }
                else {
                  e.innerHTML = "Outside of hours" //Access denied
                  //log entry attempt (failed - out of permissible times)
                }
              }
              else { // no schedule data
                //gets onetime user data for key tapped
                let url = `/api/onetime/ct/${this.contentkey.keyID}`
                this.http.get<OneTime>(url).subscribe(data => {
                  this.time = data
                  if (this.time !== null) { //temp schedule data
                    //check whether valid for current date time
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
                    if ((q[0] < r[0]) || ((q[0] === r[0]) && (q[1] <= r[1]))) {//time later than the start interval
                      if ((q[2] > r[0]) || ((q[2] === r[0]) && (q[3] >= r[1]))) {//time sooner than the end interval
                        if ((this.time.date === currentDate)) {
                          let url = `/api/locktype/1`
                          this.http.get<LockType>(url).subscribe(data => {
                            this.Data = data;
                            this.http.post('/api/test/0', this.Data, httpOptions).subscribe()//turns on light
                            setTimeout(() => {
                            }, (this.Data.delay + 1000))
                            setTimeout(() => {
                              this.http.post('/api/test/1', this.Data, httpOptions).subscribe()//turns off light
                            }, this.Data.delay)
                          })
                          //log entry attempt (success)
                          //Allow access
                          let string = ''
                          for (let i of this.lock) {
                            string = string + " " + i.name
                          }
                          e.innerHTML = this.contentkey.content + " " + this.time.date + " " + this.time.time + " " + string
                        }
                      }
                    }
                    else {
                      e.innerHTML = "Outside of hours" //Access denied
                      //log entry attempt (failed - out of permissible times)
                    }
                  }
                  else {// no schedule data
                    e.innerHTML = "No schedule found for " + this.contentkey.content //Access denied
                    //log entry attempt (failed - out of permissible times)
                  }
                })                                                                                                                                                                                                                                                                                                                                                          
              }
            })
          }           
          else {// no lock data
            e.innerHTML = "No locks found for " + this.contentkey.content //Access denied
            //log entry attempt (failed - not authorised [lock not authorised])
          }
        })
      }
      else {// no key data
        e.innerHTML = "No key found" //Access denied
        //log entry attempt (failed - not authorised [invalid key])
      }
    }) 
  }
  
}

