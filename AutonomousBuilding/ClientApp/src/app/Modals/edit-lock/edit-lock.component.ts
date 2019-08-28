
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LockData } from '../../Pages/locks/locks.component';

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
 

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.get()
    this.getall().subscribe(item => { this.data = item })
  }
  //Get lock information from database
  get() {
    let url = `/api/locks/${this.items}`
    this.http.get<LockData>(url).pipe(take(1)).subscribe(data => this.serverData = data);
  }
  //get lock data
  getall(): Observable<LockData[]> {
    return this.http.get < LockData[]>('/api/locks/testdata')
  }
  //Adds Item to Database
  Data: LockData;
  Add(item: string) {
    var total = 0
    item = item.trim()
    for (let i of this.data) {
      if (item.toLowerCase() === i.name.toLowerCase()) {
        total += 1
      }
    }
    if (item === "") {
      this.activeModal.close()
    }
    if ((item !== "") && (total === 0)) {
      let Data: LockData = new LockData();
      Data = this.serverData;
      Data.name = item;
      let url = `/api/locks/${this.items}`
      this.http.put<LockData[]>(url, Data, httpOptions).subscribe(() => this.activeModal.close());
    }
    else {
      document.getElementById("demo").innerHTML = "Invalid Input - There is already a lock registered with that name"
      var element = document.getElementById("id");
      element.classList.add("red");
    }
  }
}
