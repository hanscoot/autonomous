
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { KeyData } from '../../Pages/keys/keys.component';
import { LockData } from '../../Pages/locks/locks.component';
import { LK } from '../../Pages/details-locks/details-locks.component';

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

  //Adds new key to specific lock
  it: LK
  add() {
    let it: LK = new LK();
    it.lockID = this.items
    it.keyID = this.selectedItem
    this.http.post<LK[]>(`/api/lk/test`, it, httpOptions).subscribe(() => this.activeModal.close())
  }

  //Gets key information for specific lock
  get() {
    this.http.get<LK[]>(`/api/lk/testdata`).pipe(take(1)).subscribe(data => {
      this.serverData = data
      for (let i of this.serverData) { //gets key data for specific lock
        if (i.lockID.toString() !== this.items) {
          this.serverData = this.serverData.filter(k => k !== i)
          console.log(this.serverData)
        }
      }//edits keys list to only include the keys which the lock hasn't already got
      this.http.get<KeyData[]>('/api/keys/testdata').pipe(take(1)).subscribe(data => {
        this.keys = data
        for (let i of this.serverData) {
          for (let j of this.keys) {
            if (i.keyID === j.keyID) {
              this.keys = this.keys.filter(k => k !== j)
            }
          }   
        }
      })    
    })
  }
}
