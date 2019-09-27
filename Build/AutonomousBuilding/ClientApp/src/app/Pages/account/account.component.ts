import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from '../../Services/navbar.Service';
import { EditAccountComponent } from '../../Modals/edit-account/edit-account.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopNavComponent } from '../../top-nav/top-nav.component';
import { UserInfo, UserKeys, UserLocks, UserSchedules, OneTime } from '../../Models/Models';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(public nav: NavbarService, public str: TopNavComponent,
    private http: HttpClient, private modalServices: NgbModal, public item: AppComponent)
  {
    this.nav.show();
    this.getuserinfo().subscribe(data => {this.users = data })
    this.get();
    this.getuser();
    this.getone().subscribe(data => { this.tempuser = data })
  }

  public users: UserInfo;
  public user: UserInfo;
  public keys: UserKeys
  public lock: UserLocks[] = [];
  public schedule: UserSchedules[] = [];

  getuserinfo(): Observable<UserInfo> {
    let id = this.str.currentUser.personId
    let url = `/api/account/user/${id}`
    return this.http.get<UserInfo>(url)
  }
  //get onetimeuser info
  tempuser: OneTime;
  getone(): Observable<OneTime> {
    return this.http.get<OneTime>(`/api/onetime/${this.str.currentUser.personId}`)
  }
  //open edit-account modal
  account() {
    const modalRef = this.modalServices.open(EditAccountComponent);
    modalRef.result.then(() => {
      this.get()
      this.getuser()
      this.item.getlog()
    })
  }
  //gets user data for the user logged in
  getuser() {
    let id = this.str.currentUser.personId
    let url = `/api/account/user/${id}`
    this.http.get<UserInfo>(url).subscribe(data => {
      this.user = data;
    })
  }
  //gets key,lock and schedule data for the user logged in
  get() {
    let id = this.str.currentUser.personId
    let key_url = `/api/account/key/${id}`
    this.http.get<UserKeys>(key_url).subscribe(data => {//gets key data
      this.keys = data;
      let lock_url = `/api/account/lock/${this.keys.keyID}`
      this.http.get<UserLocks[]>(lock_url).subscribe(data => {//gets lock data
        this.lock = data;
      })
      let schedule_url = `/api/account/schedules/${this.keys.keyID}`
      this.http.get<UserSchedules[]>(schedule_url).subscribe(data => {//gets schedule data
        this.schedule = data;
      })
    })
  }
}
