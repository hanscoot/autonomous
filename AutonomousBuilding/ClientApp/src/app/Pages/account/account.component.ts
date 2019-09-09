import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from '../../Services/navbar.Service';
import { TopNavComponent } from '../../top-nav/top-nav.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(public nav: NavbarService, public str: TopNavComponent, private http: HttpClient) {
    this.nav.show();
    this.get()
  }

  public keys: UserKeys[] = [];
  public locks: UserLocks[] = [];
  public schedules: UserSchedules[] = [];
  public lock: UserLocks[] = [];
  public schedule: UserSchedules[] = [];

  //gets key,lock and schedule data for the user logged in
  get() {
    let id = this.str.currentUser.personId
    let key_url = `/api/account/key/${id}`
    this.http.get<UserKeys[]>(key_url).subscribe(data => {//gets key data
      this.keys = data;
      for (let i of this.keys) {
        let lock_url = `/api/account/lock/${i.keyID}`
        this.http.get<UserLocks[]>(lock_url).subscribe(data => {//gets lock data
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
        })
        let schedule_url = `/api/account/schedule/${i.keyID}`
        this.http.get<UserSchedules[]>(schedule_url).subscribe(data => {//gets schedule data
          this.schedule = data;
          for (let j of this.schedule) {
            var count = 0
            for (let k of this.schedules) {
              if (j.scheduleID === k.scheduleID) {
                count += 1
              }
            }
            if (count === 0) {
              this.schedules.push(j)
            }
          }
        })
      }
    })
  }

}

export class UserKeys {
  personId: number;
  keyID: number;
}
export class UserLocks {
  keyID: number;
  name: string;
}
export class UserSchedules {
  keyID: number;
  scheduleID: number;
  times: string;
  days: string;
}
