import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddKeyComponent } from '../../Modals/add-key/add-key.component';
import { NavbarService } from '../../Services/navbar.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MobileService } from '../../Services/mobile.service';
import { KPD, KeyData } from '../../Models/Models';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  constructor(private http: HttpClient, private modalServices: NgbModal, private nav: NavbarService, private mode: MobileService) { }

  ngOnInit() {
    this.nav.show()
    this.get();
  }

  public serverData: KeyData[] = [];
  public keypersonData: KPD[] = [];

  //gets key data (and person data)
  get() {
    this.http.get<KPD[]>('/api/pk/data').subscribe(data => {
      this.keypersonData = data;
      this.http.get<KeyData[]>('/api/keys/testdata').subscribe(item => {
        this.serverData = item;
        for (let i of this.serverData) {
          for (let j of this.keypersonData) {
            if (i.keyID === j.keyID) {
              this.serverData = this.serverData.filter(k => k !== i)
            }
          }
        }
      })
    })
  }
  //opens add key modal
  open() {
    let modalRef = this.modalServices.open(AddKeyComponent);
    modalRef.result.then(() => {
      this.get()
    });
  }
  //deletes key
  del(item: KeyData) {
    var m = confirm("Are you sure you want to delete this?")
    if (m === true) {
      this.serverData = this.serverData.filter(i => i !== item);
      let url = `/api/keys/${item.keyID}`
      this.http.delete<KeyData[]>(url).subscribe();
    }
  }
}
