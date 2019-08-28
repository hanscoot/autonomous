
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { KeyData } from '../../Pages/keys/keys.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss']
})
export class AddKeyComponent implements OnInit {

  public serverData: KeyData[] = [];
  data: KeyData;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }
  //Standard Settings Times
  public types = [
    "1 ",
    "2 "
  ]
  //Reads what is selected from the dropdown
  selectedItem: number = null;
  select(event: any) {
    this.selectedItem = event.target.value;
  }
  //Adds Item to Database
  Data: KeyData;
  Add() {
    let Data: KeyData = new KeyData();
    Data.typeID = this.selectedItem;
    Data.content = Guid.raw();
    console.log(Data.content)
    this.http.post<KeyData[]>('/api/keys/test', Data, httpOptions).subscribe(() => this.activeModal.close());
  }
}
