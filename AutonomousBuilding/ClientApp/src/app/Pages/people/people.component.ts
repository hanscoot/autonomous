import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddPersonComponent } from '../../Modals/add-person/add-person.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../Services/navbar.Service';
import { MobileService } from '../../Services/mobile.service';
import { TestData } from '../../Models/Models';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal, private nav: NavbarService, private mode: MobileService) { }

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
}


