import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarService } from '../../navbar.service';
import { Observable } from 'rxjs';
import { AddKeyScheduleComponent } from '../../Modals/padd-key-schedule/add-key-schedule.component';
import { EditScheduleComponent } from '../../Modals/edit-schedule/edit-schedule.component';
import { ScheduleData } from '../schedules/schedules.component';
import { Log } from '../logs/logs.component';

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

  constructor(private http: HttpClient, private modalService: NgbModal,
    private route: ActivatedRoute, private router: Router, private nav: NavbarService) { }

  public schedule: ScheduleData[] = [];
  public not: ScheduleData;
  public serverData: SK[] = []

  ngOnInit() {
    this.getschedule()
    this.getschedules()
    this.nav.show()
  }
  
  id = this.route.snapshot.paramMap.get('id')
  //gets schedule's data corresponding to the schedule clicked
  getschedule() {
    let url = `/api/schedule/${this.id}`
    this.http.get<ScheduleData[]>(url).subscribe(data => { this.schedule = data })
  }
  //gets schedule key data correspoonding to the schedule clicked
  count = 0
  getschedules() {
    let url = `/api/sk/testdata`
    this.http.get<SK[]>(url).subscribe(data => {
    this.serverData = data;
      for (let i of this.serverData) {
        if (i.scheduleID.toString() !== this.id) {
          this.serverData = this.serverData.filter(k => k !== i)
        }
        else {
          this.count += 1
        }
      }
      if (this.count === 0) { }
    });
  }
  //deletes person's key from schedule key data
  remove(item: SK) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let urll = `/api/schedule/${item.scheduleID}`
      this.http.get<ScheduleData>(urll).subscribe(data => {
        this.not = data
        this.not.number = this.not.number - 1
        this.http.put<ScheduleData>(urll, this.not, httpOptions).subscribe()
        console.log(this.not)
      })
      let url = `/api/sk/${item.scheduleKeyID}`
      this.http.delete<SK[]>(url).subscribe();
      this.serverData = this.serverData.filter(k => k !== item)
      if (this.serverData.length === 0) {
      }
    }
  }
  //opens modal to add key to specific schedule
  open() {
    const modalRef = this.modalService.open(AddKeyScheduleComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.getschedule()
      this.getschedules()
    });
  }
  //opens modal to edit schedule
  openedit() {
    const modalRef = this.modalService.open(EditScheduleComponent)
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.getschedule()
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


export class SK {
  scheduleKeyID: number;
  scheduleID: number;
  keyID: number;
}

export class KP {
  name: string;
  keyID: number
}
