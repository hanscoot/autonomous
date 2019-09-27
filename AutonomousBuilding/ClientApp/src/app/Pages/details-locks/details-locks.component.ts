
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
  public username: Object;

  constructor(private http: HttpClient, private modalServices: NgbModal,
    private route: ActivatedRoute, private router: Router,
    private datepipe: DatePipe, public log: AppComponent,
    public nav: NavbarService, public str: TopNavComponent
  ) { }

  ngOnInit() {
    this.lockname().subscribe(data => { this.item = data})
    this.nav.show()
    this.getlock().subscribe(data => { this.lock = data })
    this.getlocks();
    this.getall().subscribe(item => { this.serverData = item });
    document.getElementById("status").innerHTML = this.tex;
  }

  //getname
  item: LockData;
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
    this.http.post('/api/file/light/1', httpOptions).subscribe()
    this.lg()
  }

  id = this.route.snapshot.paramMap.get('id')
  //gets lock data corresponding to the lock clicked
  getlock():  Observable<LockData> {
    let url = `/api/locks/${this.id}`
    return this.http.get<LockData>(url)
  }
  //gets lock key data corresponding to the lock clicked
  getlocks() {
    let url = `/api/file/lockkey/${this.id}`
    this.http.post(url, httpOptions).subscribe(data => { this.username = data })
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
        setTimeout(() => { this.getlocks()}, 100)
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
  th: LockData
  //deletes lock
  delete() {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/locks/${this.id}`
      this.http.get<LockData>(url).subscribe(data => {
        this.th = data
        let p = this.th.lockTypeID
        let urrl = `/api/locktype/${p}`
        this.http.delete<LockType>(urrl).subscribe()
      })
      this.http.delete<LockData[]>(url).subscribe();
      this.router.navigateByUrl('/Locks');
    }
  }

  
}






