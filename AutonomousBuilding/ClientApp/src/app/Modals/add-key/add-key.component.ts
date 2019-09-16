
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { KeyData, PK } from '../../Models/Models';

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
    "1 - QR Code",
    "2 - Barcode"
  ]
  //Reads what is selected from the dropdown
  selectedItem: string = '';
  select(event: any) {
    this.selectedItem = event.target.value;
  }
  //Adds Item to Database
  Data: KeyData;
  Add() {
    let Data: KeyData = new KeyData();
    this.selectedItem = this.selectedItem.slice(0,1)
    Data.typeID = Number(this.selectedItem);
    Data.content = Guid.raw();
    console.log(Data.content)
    this.http.post<KeyData[]>('/api/keys/test', Data, httpOptions).subscribe(() => this.activeModal.close());
  }
}
