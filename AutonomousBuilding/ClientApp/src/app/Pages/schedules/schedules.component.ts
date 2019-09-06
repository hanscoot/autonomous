import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddScheduleComponent } from '../../Modals/add-schedule/add-schedule.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal) { }

  ngOnInit() {
    this.get()
  }

  public serverData: ScheduleData[] = [];
  //open add new schedule modal
  open() {
    let modalRef = this.modalServices.open(AddScheduleComponent)
    modalRef.result.then(() => {
      this.get();
    });
  }
  //gets schedules
  get() {
    this.http.get<ScheduleData[]>('/api/schedule/testdata').subscribe(data => this.serverData = data)
  }
}

export class ScheduleData {
  scheduleID: number;
  times: string;
  days: string;
  number: number;
}
