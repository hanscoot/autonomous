import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddScheduleComponent } from '../../Modals/add-schedule/add-schedule.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../Services/navbar.Service';
import { ScheduleData } from '../../Models/Models';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal, private nav: NavbarService) { }

  ngOnInit() {
    this.get()
    this.nav.show()
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
    this.http.get<ScheduleData[]>('/api/schedule/testdata').subscribe(data =>
      this.serverData = data)
  }
}

