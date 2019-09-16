
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ScheduleData } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {

  @Input() public items;

  public schedule: ScheduleData[] = [];
  public serverData: ScheduleData[] = [];


  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.getall().subscribe(item => { this.serverData = item })
    this.get()
  }
  //gets data
  getall(): Observable<ScheduleData[]> {
    return this.http.get<ScheduleData[]>('/api/schedule/testdata')
  }
  //Gets data for specific schedule
  get() {
    let url = `/api/schedule/${this.items}`
    this.http.get<ScheduleData[]>(url).subscribe(data => { this.schedule = data })
  }
  //Switches between standard and custom times/days
  buttonName = "Custom Times/Days"
  public show: boolean = false
  toggle() {
    this.show = !this.show
    if (this.show) {
      this.buttonName = "Standard Times/Days"
    } else {
      this.buttonName = "Custom Times/Days"
    }
  }
  //Refresh window after adding
  refresh() {
    this.activeModal.close()
  }
  //Standard Settings Days
  public days = [
    "Mon-Fri",
    "Mon-Sun"
  ]
  //Custom Days
  public day = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ]
  //Standard Settings Times
  public times = [
    "07:00-19:00",
    "00:00-23:59"
  ]
  //Reads input from the select day (dropdown)
  selectedItem: string = '';
  selects(event: any) {
    this.selectedItem = event.target.value;
  }
  //Reads input from the select times (dropdown)
  selecteItem: string = '';
  select(event: any) {
    this.selecteItem = event.target.value;
  }
  //Reads input from start time
  starttime: string = '';
  write(e) {
    this.starttime = e.target.value
  }
  //Reads input from end time
  endtime: string = '';
  writ(w) {
    this.endtime = w.target.value
  }
  //Reads input from the selected days (checkboxes)
  marked = false;
  m = ""
  tu = ""
  w = ""
  th = ""
  f = ""
  s = ""
  su = ""
  check(day, e) {
    this.marked = e.target.checked
    if (day === "Mon" && this.marked === true) {
      this.m = day + ', '  
    }
    if (day === "Mon" && this.marked === false) {
      this.m = ""
    }
    if (day === "Tue" && this.marked === true) {
      this.tu = day + ', '
    }
    if (day === "Tue" && this.marked === false) {
      this.tu = ""
    }
    if (day === "Wed" && this.marked === true) {
      this.w = day + ', '
    }
    if (day === "Wed" && this.marked === false) {
      this.w = ""
    }
    if (day === "Thu" && this.marked === true) {
      this.th = day + ', '
    }
    if (day === "Thu" && this.marked === false) {
      this.th = ""
    }
    if (day === "Fri" && this.marked === true) {
      this.f = day + ', '
    }
    if (day === "Fri" && this.marked === false) {
      this.f = ""
    }
    if (day === "Sat" && this.marked === true) {
      this.s = day + ', '
    }
    if (day === "Sat" && this.marked === false) {
      this.s = ""
    }
    if (day === "Sun" && this.marked === true) {
      this.su = day + ', '
    }
    if (day === "Sun" && this.marked === false) {
      this.su = ""
    }
  }
  //Edits new schedule to database 
  sch: ScheduleData
  add() {
    if (this.selectedItem === "") {
      var text = document.getElementById("result5");
      text.classList.remove("text-success")
      text.classList.add("text-danger")
      text.innerHTML = "No dates were selected"
    }
    if (this.selectedItem !== "") {
      var text = document.getElementById("result5");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
    }
    if (this.selecteItem === "") {
      var text = document.getElementById("result4");
      text.classList.remove("text-success")
      text.classList.add("text-danger")
      text.innerHTML = "No times were selected"
    }
    if (this.selecteItem !== "") {
      var text = document.getElementById("result4");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
    }
    if ((this.selecteItem !== "") && (this.selectedItem !== "")) {
      let sch: ScheduleData = new ScheduleData();
      sch.days = this.selectedItem;
      sch.times = this.selecteItem;
      sch.scheduleID = this.items
      let addurl = `/api/schedule/${this.items}`
      this.http.put<ScheduleData>(addurl, sch, httpOptions).subscribe()
      this.refresh()
    }
  }
  //Edits custom schedule to database 
  sc: ScheduleData
  addit() {
    let sc: ScheduleData = new ScheduleData();
    if (this.dayselected() === true) {
      var k = this.m + this.tu + this.w + this.th + this.f + this.s + this.su;
      sc.days = k.slice(0, -2)
    }
    if (this.time() === true) {
      this.endtime = this.endtime
    }
    if (this.startime() === true) {
      this.starttime = this.starttime
    }
    if ((this.startime() === true) && (this.time() === true)) {
      sc.times = this.starttime + "-" + this.endtime;
    }
    sc.number = 0
    if ((this.dayselected() === true) && ((this.startime() === true) && (this.time() === true))) {
      sc.scheduleID = this.items
      let adddurl = `/api/schedule/${this.items}`
      this.http.put<ScheduleData>(adddurl, sc, httpOptions).subscribe()
      this.refresh()
    }
    
  }
  //validation for starttime
  startime() {
    if (this.starttime === "") {
      var text = document.getElementById("result1");
      text.classList.remove("text-success")
      text.classList.add("text-danger")
      text.innerHTML = "No start time was selected"
      return false
    }
    else {
      var text = document.getElementById("result1");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
  }
  //validation for endtime
  time() {
    if (this.endtime === "") {
      var text = document.getElementById("result2");
      text.classList.remove("text-success")
      text.classList.add("text-danger")
      text.innerHTML = "No end time was selected"
      return false
    }
    else {
      var text = document.getElementById("result2");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
  }
  //validation for days
  dayselected() {
    var k = this.m + this.tu + this.w + this.th + this.f + this.s + this.su;
    k = k.slice(0, -2)
    if (k === "") {
      var text = document.getElementById("result3");
      text.classList.remove("text-success")
      text.classList.add("text-danger")
      text.innerHTML = "No days were selected"
      return false
    }
    else {
      var text = document.getElementById("result3");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
  }


}
