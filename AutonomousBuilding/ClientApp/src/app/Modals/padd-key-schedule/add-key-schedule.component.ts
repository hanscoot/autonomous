import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { SK } from '../../Pages/details-schedules/details-schedules.component';
import { ScheduleData } from '../../Pages/schedules/schedules.component';
import { KeyData } from '../../Pages/keys/keys.component';

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

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal, ) { }

  ngOnInit() {
    this.get()
  }

  //Reads input from the select (dropdown)
  selectedItem: number = null;
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
    k.keyID = this.selectedItem
    this.http.post<SK[]>(`/api/sk/test`, k, httpOptions).subscribe(() => this.activeModal.close());

  }

  //Gets key information for specific person
  get() {
    this.http.get<SK[]>(`/api/sk/testdata`).pipe(take(1)).subscribe(data => {//gets key information for everyone
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
