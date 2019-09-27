import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../Services/navbar.Service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LockData, LockType, UserKeys, UserLocks, UserSchedules, Locks, Calss, Log, OneTime, TestData, KeyData, KPD } from '../../Models/Models';
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
import { FileService } from '../../Services/file.service';

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
    public authenticationService: AuthenticationService, public file: FileService
  ) { }

  ngOnInit() {
    this.nav.show()
    this.getone()
    this.functions()
    this.inter()
    this.get()
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
  }
    //iterate over temp users and remove those which time has expired

          //delete person data
         
          //delete onetime user date

    //write function which checks current time and changes the functionality of the buttons if outside of scheduled hours
  func() {
    var dt = this.log.time()
    var day = new Date().getDay(); //day of the week
    let url = `/api/pk/${this.str.currentUser.personId}`
    this.http.get<KPD>(url).subscribe(data => {
      this.file.get(data.content, day, dt).subscribe();
    })
  }

  public list: object;
  get() {
    var id = this.str.currentUser.personId
    let url = `/api/file/account/${id}`
    this.http.post(url, httpOptions).subscribe(data => { this.list = data; console.log(this.list)})
  }
  //function
  //gets key data for current user
  //gets all locks associated with current user
  //gets schedule data for key
  
  //function for opening modal
  open(item: Calss) {
    const modalRef = this.modalServices.open(QrcodeComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-light', centered: true, size: 'sm' })
    modalRef.componentInstance.items = item;
  }
  //get locktype data
  getall(): Observable<LockType[]> {
    return this.http.get<LockType[]>('/api/locktype/testdata')
  }
}
