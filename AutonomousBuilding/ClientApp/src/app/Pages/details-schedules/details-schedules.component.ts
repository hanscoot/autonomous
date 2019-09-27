import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarService } from '../../Services/navbar.Service';
import { Observable } from 'rxjs';
import { AddKeyScheduleComponent } from '../../Modals/padd-key-schedule/add-key-schedule.component';
import { EditScheduleComponent } from '../../Modals/edit-schedule/edit-schedule.component';
import { SK, ScheduleData, UserName } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-details-schedules',
  templateUrl: './details-schedules.component.html',
  styleUrls: ['./details-schedules.component.scss']
})
export class DetailsSchedulesComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal,
    private route: ActivatedRoute, private router: Router, public nav: NavbarService) { }

  public schedule: ScheduleData
  public not: ScheduleData;
  public serverData: SK[] = [];
  public list: UserName;
  public username: object;

  ngOnInit() {
    this.getschedule().subscribe(data => { this.schedule = data })
    this.getschedules()
    this.nav.show()
  }
  
  id = this.route.snapshot.paramMap.get('id')
  //gets schedule's data corresponding to the schedule clicked
  getschedule(): Observable<ScheduleData> {
    let url = `/api/schedule/${this.id}`
    return this.http.get<ScheduleData>(url)
  }
  //gets schedule key data correspoonding to the schedule clicked
  count = 0
  getschedules() {
    let url = `/api/file/schedulekey/${this.id}`
    this.http.post(url, httpOptions).subscribe(data => {this.username = data })
  }

  //deletes person's key from schedule key data
  item: SK
  removal(item: UserName) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let link = `/api/sk/get/sk/${item.keyID}`
      this.http.get<SK>(link).subscribe(data => {
        this.item = data;
        let urll = `/api/schedule/${this.item.scheduleID}`
        this.http.get<ScheduleData>(urll).subscribe(data => {
          this.not = data
          this.not.number = this.not.number - 1
          this.http.put<ScheduleData>(urll, this.not, httpOptions).subscribe()
        })
        let url = `/api/sk/${this.item.scheduleKeyID}`
        this.http.delete<SK[]>(url).subscribe();
        setTimeout(() => { this.getschedules() }, 100)
      })
    }
  }

  //opens modal to add key to specific schedule
  open() {
    const modalRef = this.modalServices.open(AddKeyScheduleComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.getschedule()
      this.username = [];
      this.getschedules()
    });
  }
  //opens modal to edit schedule
  openedit() {
    const modalRef = this.modalServices.open(EditScheduleComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.getschedule()
      this.username = [];
      this.getschedules()
    });
  }
  //toggles whether table is seen depending on person key data
  public show: boolean = true;
  //deletes selected schedule
  delete() {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/schedule/${this.id}`
      this.http.delete<ScheduleData[]>(url).subscribe();
      this.router.navigateByUrl('/Schedules');
    }
  }

  
}
