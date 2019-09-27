
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LockData, LockType } from '../../Models/Models';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-edit-lock',
  templateUrl: './edit-lock.component.html',
  styleUrls: ['./edit-lock.component.scss']
})
export class EditLockComponent implements OnInit {

  @Input() public items;

  public serverData: LockData;
  public data: LockData[] = [];
  public lock: LockType;
  public thing: LockData;
 

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.get().subscribe(data => this.serverData = data)
    this.gettype()
  }
  //Get lock information from database
  get(): Observable<LockData> {
    let url = `/api/locks/${this.items}`
    return this.http.get<LockData>(url)
  }
  gettype() {
    let url = `/api/locks/${this.items}`
    this.http.get<LockData>(url).subscribe(data => {
      this.thing = data
      let url = `/api/locktype/${this.thing.lockTypeID}`
      this.http.get<LockType>(url).subscribe(data => this.lock = data)
    })
  }

  //Adds Item to Database
  Data: LockData;
  Tings: LockType;
  Add(item: string, one: string, two: string, three: string, four: string) {
    if (this.name(item) === true) {
      let url = `/api/locks/${this.thing.lockID}`
      let Data: LockData = new LockData();
      Data = this.thing
      Data.name = item.trim()
      this.http.put<LockData>(url, Data, httpOptions).subscribe()
    }
    let url = `/api/locktype/${this.thing.lockTypeID}`
    let Tings: LockType = new LockType();
    Tings = this.lock
    if (this.type(one) === true) {
      Tings.outputType = one.trim()
    }
    if (this.ip(two) === true) {
      Tings.outputIP = two.trim()
    }
    if (this.output(three) === true) {
      Tings.outputPort = Number(three.trim())
    }
    if (this.delay(four) === true) {
      Tings.delay = Number(four.trim()) * 1000
    }
    if ((this.type(one) === true) || (this.ip(two) === true) || (this.output(three) === true) || (this.delay(four) === true)) {
      this.http.put<LockType>(url, Tings, httpOptions).subscribe(() => this.activeModal.close());
    }
    if ((this.type(one) === false) && (this.ip(two) === false) && (this.output(three) === false) && (this.delay(four) === false)) {
      this.activeModal.close();
    }
  }

  //Check whether type is valid
  type(one: string) {
    one.trim()
    if (one != "") {
      if (one != this.lock.outputType) {
        return true
      }
      else {//unchanged
        return false
      }
    }
    else {//empty
      return false
    }
  }
  //Check whether ip is valid
  ip(one: string) {
    one.trim()
    if (one != "") {
      if (one != this.lock.outputIP) {
        return true
      }
      else {//unchanged
        return false
      }
    }
    else {//empty
      return false
    }
  }
  //Check whether output is valid
  output(one: string) {
    one.trim()
    if (one != "") {
      if (one != (this.lock.outputPort).toString()) {
        return true
      }
      else {//unchanged
        return false
      }
    }
    else {//empty
      return false
    }
  }
  //Check whether delay is valid
  delay(one: string) {
    one.trim()
    if (one != "") {
      if (one != (this.lock.delay).toString()) {
        return true
      }
      else {//unchanged
        return false
      }
    }
    else {//empty
      return false
    }
  }
  //Check whether name is valid
  name(item: string) {
    item = item.trim()
    if (item != "") {
      if (item !== this.thing.name) {
        return true
      }
      else {//unchanged
        return false
      }
    }
    else {//empty
      return false
    }
  }

}
