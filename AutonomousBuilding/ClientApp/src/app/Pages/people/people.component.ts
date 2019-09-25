import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddPersonComponent } from '../../Modals/add-person/add-person.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../Services/navbar.Service';
import { MobileService } from '../../Services/mobile.service';
import { TestData } from '../../Models/Models';
import { OneTimeComponent } from '../../Modals/one-time/one-time.component';
import { TopNavComponent } from '../../top-nav/top-nav.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal, public nav: NavbarService, public mode: MobileService, public str: TopNavComponent) { }

  ngOnInit() {
    this.nav.show()
    this.get()
  }

  public serverData: TestData[] = [];
  //gets people data
  get() {
    this.http.get<TestData[]>('/api/values/testdata').subscribe(data => this.serverData = data)
  }
  //opens modal to add person
  open() {
    const modalRef = this.modalServices.open(AddPersonComponent);
    modalRef.result.then(() => {
      this.get()
    })
  }
  //opens modal to add one-time user
  user() {
    const modalRef = this.modalServices.open(OneTimeComponent);
    modalRef.result.then(() => {
      this.get()
    })
  }
}


