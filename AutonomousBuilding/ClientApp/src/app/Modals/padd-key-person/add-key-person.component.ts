
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { KeyData } from '../../Pages/keys/keys.component';
import { TestData } from '../../Pages/people/people.component';
import { PK } from '../../Pages/details-people/details-people.component';

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
  public keys: KeyData[] = [];
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
    this.http.get<PK[]>(`/api/pk/testdata`).pipe(take(1)).subscribe(data => {//gets key information for everyone
      this.serverData = data//edits keys list to only include the keys which nobody has
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
