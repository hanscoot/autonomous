
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AddKeyLockComponent } from '../../Modals/padd-key-lock/add-key-lock.component';
import { EditLockComponent } from '../../Modals/edit-lock/edit-lock.component';
import { AppComponent } from '../../app.component';
import { NavbarService } from '../../Services/navbar.Service';
import { LockType, LK, LockData, Log, UserName, LockKeyName } from '../../Models/Models';
import { TopNavComponent } from '../../top-nav/top-nav.component';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-details-locks',
  templateUrl: './details-locks.component.html',
  styleUrls: ['./details-locks.component.scss']
})
export class DetailsLocksComponent implements OnInit {

  public server: LK[] = [];
  data: LK;
  public lock: LockData;
  public serverData: LockType[] = [];
  public one: boolean = false;
  public tex: string = "Locked";
  public list: UserName;
  public username: UserName[] = [];

  constructor(private http: HttpClient, private modalServices: NgbModal,
    private route: ActivatedRoute, private router: Router,
    private datepipe: DatePipe, public log: AppComponent,
    public nav: NavbarService, public str: TopNavComponent
  ) { }

  ngOnInit() {
    this.lockname().subscribe(data => this.name = data)
    this.nav.show()
    this.getlock().subscribe(data => { this.lock = data })
    this.getlocks();
    this.getall().subscribe(item => { this.serverData = item });
    document.getElementById("status").innerHTML = this.tex;
  }

  //getname
  name: LockData;
  lockname(): Observable<LockData> {
    let url = `/api/locks/${this.id}`
    return this.http.get<LockData>(url)
  }



  //LOGS ************************************************************
  //gets current date-time
  dateNow: Date
  date: string
  time() {
    this.dateNow = new Date();
    this.date = this.datepipe.transform(this.dateNow, 'dd/MM/yyyy HH:mm')
    return this.date
  }

  //posts information back to logs
  logs: Log;
  lg() {
    let logs: Log = new Log()
    logs.time = this.time()
    logs.name = this.str.currentUser.name
    this.getlock().subscribe(data => {
      this.lock = data;
      logs.lockName = this.lock.name
      logs.status = "S"
      this.http.post<Log>('/api/log/test', logs, httpOptions).subscribe()
      this.LOG.unshift(logs)
      this.log.gets()
    })
  }
  public LOG: Log[] = []
  //gets information from logs
  getlog(): Observable<Log[]> {
    return this.http.get<Log[]>('/api/log/data')
  }


  //LOCK **********************************************************
  //get locktype data
  getall(): Observable<LockType[]> {
    return this.http.get<LockType[]>('/api/locktype/testdata')
  }
  //finds lock data for lock
  Data: LockType[] = []
  //turn on light
  on() {
    this.getall().subscribe(item => {
      this.serverData = item
      for (let i of this.serverData) {
        if (i.lockTypeID !== this.lock.lockTypeID) {
          this.serverData = this.serverData.filter(k => k !== i)
        }
      }
      this.http.post('/api/test/0', this.serverData[0], httpOptions).subscribe()
      this.one = true
      var text = document.getElementById("status");
      text.innerHTML = "Unlocked"
      setTimeout(() => {
        this.one = false;
        document.getElementById("status").innerHTML = this.tex;
      }, (this.serverData[0].delay + 1000))
      setTimeout(() => {
        this.http.post('/api/test/1', this.serverData[0], httpOptions).subscribe()
      }, this.serverData[0].delay)
      this.lg()
    })
  }

  id = this.route.snapshot.paramMap.get('id')
  //gets lock data corresponding to the lock clicked
  getlock():  Observable<LockData> {
    let url = `/api/locks/${this.id}`
    return this.http.get<LockData>(url)
  }
  //gets lock key data correspoonding to the lock clicked
  count = 0
  getlocks() {
    let url = `/api/lk/testdata`
    this.http.get<LK[]>(url).subscribe(data => {
    this.server = data;
      for (let i of this.server) {
        if (i.lockID.toString() !== this.id) {
          this.server = this.server.filter(k => k !== i)
        }
      }
      for (let l of this.server) {//gets user information for the key
        let urlkey = `/api/account/name/${l.keyID}`
        this.http.get<UserName>(urlkey).subscribe(data => {
          this.list = data;
          if (this.list !== null) {
            this.username.push(this.list)//remove key from other list if key is assigned to a user
            this.server = this.server.filter(k => k.keyID !== l.keyID)
          }
        })
      }
    });
  } 
  //deletes lock's key from lock key data
  remove(item: LK) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/lk/${item.lockKeyID}`
      this.http.delete<LK[]>(url).subscribe();
      this.server = this.server.filter(k => k !== item)
    }
  }
  //deletes lock's key from lock key data
  ids: LockKeyName;
  removal(item: UserName) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let urlf = `/api/lk/lock/${item.keyID}`
      this.http.get<LockKeyName>(urlf).subscribe(data => {
        this.ids = data;
        let url = `/api/lk/${this.ids.lockKeyID}`
        this.http.delete<LK[]>(url).subscribe();
        this.username = this.username.filter(k => k.keyID !== item.keyID)
      })
    }
  }
  //opens modal to add key to specific lock
  open() {
    const modalRef = this.modalServices.open(AddKeyLockComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.lockname()
      this.getlock();
      this.username = [];
      this.getlocks();
    });
  }
  //opens modal to edit specific lock
  edit() {
    const modalRef = this.modalServices.open(EditLockComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.lockname()
      this.getlock();
      this.username = [];
      this.getlocks();
    });
  }
  //toggles whether table is seen depending on lock key data
  public show: boolean = true;
  toggle() {
    this.show = !this.show
  }
  item: LockData
  //deletes lock
  delete() {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/locks/${this.id}`
      this.http.get<LockData>(url).subscribe(data => {
        this.item = data
        let p = this.item.lockTypeID
        let urrl = `/api/locktype/${p}`
        this.http.delete<LockType>(urrl).subscribe()
      })
      this.http.delete<LockData[]>(url).subscribe();
      this.router.navigateByUrl('/Locks');
    }
  }

  
}






