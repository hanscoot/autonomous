
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { PK, KeyData, TestData } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-key-person',
  templateUrl: './add-key-person.component.html',
  styleUrls: ['./add-key-person.component.scss']
})
export class AddKeyPersonComponent implements OnInit {

  @Input() public items;

  public serverData: PK[] = [];
  public keys: object;
  data: TestData;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.get()
  }

  //Reads input from the select (dropdown)
  selectedItem: number = null;
  selects(event: any) {
    this.selectedItem = event.target.value;
  }

  //Adds new key to specific person
  k: PK
  add() {
    let k: PK = new PK();
    k.personID = this.items
    k.keyID = this.selectedItem
    this.http.post<PK[]>(`/api/pk/test`, k, httpOptions).subscribe(() => this.activeModal.close())
  }

  //Gets key information for specific person
  get() {
    this.http.post('/api/file/notpersonkey', httpOptions).subscribe(data => { this.keys = data; console.log(this.keys) })
  }
}
