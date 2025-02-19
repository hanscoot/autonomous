
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarService } from '../../Services/navbar.Service';
import { Observable } from 'rxjs';
import { AddKeyPersonComponent } from '../../Modals/padd-key-person/add-key-person.component';
import { EditPersonComponent } from '../../Modals/edit-person/edit-person.component';
import { PK, TestData } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-details-people',
  templateUrl: './details-people.component.html',
  styleUrls: ['./details-people.component.scss']
})
export class DetailsPeopleComponent implements OnInit {

  public serverData: PK;
  data: PK;
  public person: TestData;
  public item: TestData
  private _api = '/api/pk';

  constructor(private http: HttpClient, private modalServices: NgbModal,
    private route: ActivatedRoute, private router: Router,
    private location: Location, public nav: NavbarService) { }

  ngOnInit() {
    this.nav.show();
    this.getperson().subscribe(data => { this.person = data });
    this.getpeople();
    this.check();
  }


  //PERSON ************************************************
  //gets person data corresponding to the person clicked
  getperson(): Observable<TestData> {
    let url = `/api/values/${this.id}`
    return this.http.get<TestData>(url)
  }
  //gets person key data correspoonding to the person clicked
  show: boolean;
  id = this.route.snapshot.paramMap.get('id')
  getpeople() {
    let url = `/api/pk/${this.id}`
    this.http.get<PK>(url).subscribe(data => {
      this.serverData = data;
      if (this.serverData === null) {
        this.show = false;
      }
      else {
        this.show = true;
      }
    });
  } 
  //deletes person's key from person key data
  remove(id) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/pk/${id}`
      this.http.delete<PK[]>(url).subscribe();
      setTimeout(() => { this.getpeople() }, 100)
      var e = document.getElementById("demo")
      e.removeAttribute('disabled');
    }
  }
  //opens modal to add key to specific person
  open() {
    if (this.serverData === null) {
      const modalRef = this.modalServices.open(AddKeyPersonComponent)
      modalRef.componentInstance.items = this.id;
      modalRef.result.then(() => {
        this.getperson();
        this.getpeople();
        this.check()
      });
    }
  }

  //opens edit window
  openEdit() {
    const modalRef = this.modalServices.open(EditPersonComponent);
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.getperson();
      this.getpeople();  
    });
  }
  //deletes person
  delete() {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      let url = `/api/values/${this.id}`
      this.http.delete<TestData[]>(url).subscribe();
      this.router.navigateByUrl('/People');
    }
  }

  //keycheck
  check() {
    let url = `/api/values/${this.id}`
    this.http.get<TestData>(url).subscribe(data => {
      this.item = data
      if (this.serverData === null) {
        var e = document.getElementById("demo")
        e.removeAttribute('disabled');
      }
      else {
        var e = document.getElementById("demo")
        e.setAttribute('disabled', 'disabled');
      }
    })    
  }
  
}


