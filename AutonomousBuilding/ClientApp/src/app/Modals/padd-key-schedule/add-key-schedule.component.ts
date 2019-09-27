import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { SK, KeyData, ScheduleData, UserName } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-key-schedule',
  templateUrl: './add-key-schedule.component.html',
  styleUrls: ['./add-key-schedule.component.scss']
})
export class AddKeyScheduleComponent implements OnInit {

  @Input() public items;

  public serverData: SK[] = [];
  public keys: KeyData[] = [];
  public schedule: ScheduleData;
  public list: UserName;
  public username: object;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal, ) { }

  ngOnInit() {
    this.get()
  }

  //Reads input from the select (dropdown)
  selectedItem: string = null;
  selects(event: any) {
    this.selectedItem = event.target.value;
  }

  //Adds new key to specific schedule
  k: SK
  add() {
    //increases the schedules' key count 
    let url = `/api/schedule/${this.items}`
    this.http.get<ScheduleData>(url).subscribe(data => {
      this.schedule = data
      this.schedule.number = this.schedule.number + 1
      this.http.put<ScheduleData>(url, this.schedule, httpOptions).subscribe()
    })
    //adds new key
    let k: SK = new SK();
    k.scheduleID = this.items
    let item = this.selectedItem.split(" ")
    k.keyID = Number(item[0])
    this.http.post<SK[]>(`/api/sk/test`, k, httpOptions).subscribe(() => this.activeModal.close());

  }

  //Gets available key information 
  get() {
    this.http.post('/api/file/notschedulekey', httpOptions).subscribe(data => {this.username = data})
  }

}
