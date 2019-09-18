
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbCalendar, NgbAccordion, NgbDateStruct, NgbDatepickerConfig, NgbTimeStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OneTime, TestData, KeyData, PK, LK, LockData } from '../../Models/Models';
import { Guid } from 'guid-typescript';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-one-time',
  templateUrl: './one-time.component.html',
  styleUrls: ['./one-time.component.scss']
})
export class OneTimeComponent implements OnInit {

  model: NgbDateStruct;
  stime: NgbTimeStruct;
  etime: NgbTimeStruct;
  date: string;
  time: string;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
    public config: NgbDatepickerConfig,
    public configs: NgbTimepickerConfig,
    public calendar: NgbCalendar
  ) { }

  ngOnInit() {
    this.configs.seconds = false;
    this.configs.spinners = false;
    this.config.minDate = this.calendar.getToday();
    this.get()
    this.getlock()
  }
  //gets all onetime users
  serverData: OneTime
  get() {
    this.http.get<OneTime>('/api/onetime/testdata').subscribe(data => { this.serverData = data;})
  }

  //gets all locks availible
  locks: LockData[] =[]
  getlock() {
    this.http.get<LockData[]>('/api/locks/testdata').subscribe(data => { this.locks = data; console.log(this.locks)})
  }

  else() {
    //time picking authentication
    if (this.stime.hour <= this.etime.hour) {
      if (this.stime.hour = this.etime.hour) {
        if (this.stime.minute < this.etime.minute) {
          // successful
        }
        else {
          //unsuccessful
        }
      }
      //successful
    } else {
      //unsuccessful
    }

    //formatting the time
    this.time = this.stime.hour + ':' + this.stime.minute + "-" + this.etime.hour + ':' + this.etime.minute;
    //formatting the date
    this.date = this.model.day + "-" + this.model.month + "-" + this.model.year;
  }

  //formatting of locks
  list = []
  //lock picking
  marked = false;
  check(place, e) {
    this.marked = e.target.checked
    console.log(this.list)
    if (this.marked === true) {
      this.list.push(place)
      console.log(this.list)
    }
    if (this.marked === false) {
      this.list = this.list.filter(k => k !== place)
      console.log(this.list)
    }
    this.marked = false
  }


  userid: TestData
  keyid: KeyData
  lockids: string
  //creates the one-time user
  add(one, two , three) {
    //check validity
    var e = document.getElementById("vspe")
    e.setAttribute('disabled', 'disabled');
    //disables button
    //create person 
    let user: TestData = new TestData()
    user.name = one
    user.email = two + "@nomuda.com"
    user.number = three
    user.password = "nomuda"
    user.clear = false
    user.temp = true
    this.http.post<TestData>('/api/values/test', user, httpOptions).subscribe()
    //create key
    let key: KeyData = new KeyData()
    key.typeID = 1
    key.content = Guid.raw();
    this.http.post<KeyData>('/api/keys/test', key, httpOptions).subscribe()
    //get person id for person added
    setTimeout(() => {
      var e = document.getElementById("vspe")
      e.removeAttribute("disabled")
      this.http.get<TestData[]>(`/api/values/testdata`).subscribe(data => {
        this.userid = data[data.length - 1]
        //get key id for key created
        this.http.get<KeyData[]>('/api/keys/testdata').subscribe(data => {
          this.keyid = data[data.length - 1]
          //add key to person
          let userkey: PK = new PK();
          userkey.personID = this.userid.personId
          userkey.keyID = this.keyid.keyID
          this.http.post<PK[]>(`/api/pk/test`, userkey, httpOptions).subscribe()
          //add key to lock(s)
          for (var i = 0; i < this.list.length; i++) {
            let lockkey: LK = new LK();
            lockkey.lockID = (this.list[i]).lockID
            lockkey.keyID = this.keyid.keyID
            this.http.post<LK[]>(`/api/lk/test`, lockkey, httpOptions).subscribe()
          }
          //add user to one-time us
          for (var i = 0; i < this.list.length; i++) {
            this.list[i] = (this.list[i]).lockID
            if (i === 0) {
              this.lockids = this.list[i]
            }
            else {
              this.lockids = this.lockids + "," + this.list[i]
            }
          }
          let onetimeuser: OneTime = new OneTime();
          onetimeuser.personID = this.userid.personId
          onetimeuser.keyID = this.keyid.keyID
          onetimeuser.lockID = this.lockids
          onetimeuser.date = this.model.day + "/" + this.model.month + "/" + this.model.year //this.date
          onetimeuser.time = this.stime.hour + ':' + this.stime.minute + "-" + this.etime.hour + ':' + this.etime.minute //this.time
          this.http.post<OneTime[]>('/api/onetime/test', onetimeuser, httpOptions).subscribe(() => this.activeModal.close())
        })
      })
    }, 3000)    
  }
}
