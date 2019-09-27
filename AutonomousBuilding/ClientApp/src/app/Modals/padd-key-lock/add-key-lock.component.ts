
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { LK, KeyData, LockData, UserName } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-key-lock',
  templateUrl: './add-key-lock.component.html',
  styleUrls: ['./add-key-lock.component.scss']
})
export class AddKeyLockComponent implements OnInit {

  @Input() public items;

  public serverData: LK[] = [];
  public keys: KeyData[] = [];
  public key: KeyData;
  data: LockData;
  public list: UserName;
  public username: object;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.get()
  }

  //Reads input from the select (dropdown)
  selectedItem: string = "";
  selects(event: any) {
    this.selectedItem = event.target.value;
  }

  //Adds new key to specific lock
  it: LK
  add() {
    let it: LK = new LK();
    it.lockID = this.items
    var item = this.selectedItem.split(" ")
    let thing = Number(item[0])    
    it.keyID = thing
    this.http.post<LK[]>(`/api/lk/test`, it, httpOptions).subscribe(() => this.activeModal.close())
  }

  //Gets key information for specific lock
  get() {
    let url = `/api/file/notlockkey/${this.items}`
    this.http.post(url, httpOptions).subscribe(data => { this.username = data })
  }
}
