import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocks, QR } from '../Models/Models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { TimingSerivce } from '../Services/timing.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: string = '';

  @Input() public items;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient, public str: TopNavComponent) { }

  ngOnInit() {
    this.getlocks()
  }

  
  //get all keys for that lock
  //get all keys for that user from those keys
  //gets lock key data correspoonding to the lock clicked
  server: UserLocks[] = []
  list: QR[] = [];
  item: QR
  count = 0
  getlocks() {
    if (this.str.currentUser.temp === false) {
      this.http.get<UserLocks[]>(`/api/account/locks/${this.items.lockID}`).subscribe(data => {//gets key data
        this.server = data;
        for (let i of this.server) {
          let url = `/api/account/keys/${i.keyID}`
          this.http.get<QR>(url).subscribe(data => {
            this.item = data;
            if (this.item.personID === this.str.currentUser.personId) {
              this.list.push(this.item)
              this.value = this.item.content;
            }
          })
        }
      })
    }
    else {
      let url = `/api/account/keys/${this.items.keyID}`
      this.http.get<QR>(url).subscribe(data => {
        this.item = data;
        if (this.item.personID === this.str.currentUser.personId) {
          this.list.push(this.item)
          this.value = this.item.content;
        }
      })
    }
    
  } 
}
