import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddKeyComponent } from '../../Modals/add-key/add-key.component';
import { NavbarService } from '../../Services/navbar.Service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MobileService } from '../../Services/mobile.service';
import { KPD, KeyData, Locks, UserSchedules, OneTime, LockType } from '../../Models/Models';
import { LogService } from '../../Services/log.Service';
import { FileService } from '../../Services/file.service';
import { map, first } from 'rxjs/operators';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';

  constructor(private http: HttpClient, private modalServices: NgbModal, public nav: NavbarService, public mode: MobileService, public log: LogService, public file: FileService) { }

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




  //for content checks whether key is valid for lock and current date time
  //input provides lock and key content
  //check lock data allocated to the key has the lock availible
  item: any
  check(value) {
    var dt = this.log.time()
    var day = new Date().getDay(); //day of the week 
    this.file.get(value, day, dt).subscribe();
  }
  chec() {
    this.http.post('/api/tests/test', httpOptions).subscribe(data => { console.log(data)})
  }
  
}

