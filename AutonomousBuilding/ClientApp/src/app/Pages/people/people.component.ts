import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddPersonComponent } from '../../Modals/add-person/add-person.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../Services/navbar.Service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal, private nav: NavbarService) { }

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

export class TestData {
  personId: number;
  name: string;
  email: string;
  number: number;
  password: string;
  clear: boolean;
  token: string;
}
