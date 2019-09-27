
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TestData } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent implements OnInit {

  @Input() public items;

  constructor( private http: HttpClient,
    public activeModal: NgbActiveModal ) { }

  ngOnInit() {
    this.getall().subscribe(item => { this.data = item })
    this.get()
  }

  public data: TestData[] = [];
  public serverData: TestData;

  //get item data
  get() {
    let url = `/api/values/${this.items}`
    this.http.get<TestData>(url).pipe(take(1)).subscribe(data => this.serverData = data); 
  }
  //get person data
  getall(): Observable<TestData[]> {
    return this.http.get<TestData[]>('/api/values/testdata')
  }
  //edit person
  Data: TestData
  edit(one: string, two: string, three: number, four: string) {
    let url = `/api/values/user/${this.items}`
    this.http.get<TestData>(url).subscribe(data => {
      this.Data = data;
      let ping: TestData = new TestData();
      ping = this.Data
      if (this.name(one) === true) {
        ping.name = one;
      }
      if (this.email(two) === true) {
        ping.email = two + "@nomuda.com";
      }
      if (this.number(three) === true) {
        ping.number = three;
      }
      if (this.testpassword(four) === true) {
        ping.password = four;
      }
      if (((this.name(one) === true) || (this.name(one) === "one"))
        && ((this.email(two) === true) || (this.email(two) === "one"))
        && ((this.number(three) === true) || (this.number(three) === "one"))
        && ((this.testpassword(four) === true) || (this.testpassword(four) === "one"))) {
        ping.clear = this.marked;
        let url = `/api/values/${ping.personId}`
        this.http.put<TestData[]>(url, ping, httpOptions).subscribe(() => this.activeModal.close())
      }
    })   
  }
  //checkbox
  marked = false;
  check(e) {
    this.marked = e.target.checked
  }

  //Checks whether password is valid
  testpassword(item) {
    item = item.trim()
    item = item.toString();
    if (item === '') {//password unchanged
      return 'one'
    }
    if (item.length >= 8) {//password changed to input
      var element = document.getElementById("input4");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("result4");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {//password must be re-entered
      document.getElementById("result4").innerHTML = "Your password wasn't long enough! (min length 8)"
      var element = document.getElementById("input4");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("result4");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether name is valid
  name(item: string) {
    var total = 0
    item = item.trim()
    for (let i of this.data) {
      if (item.toLowerCase() === i.name.toLowerCase()) {
        total = total + 1
      }
    }
    if ((item !== "") && (total === 0)) {//name 
      var element = document.getElementById("input1");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("result1");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {
      if (total === 0) {//name stays the same
        var element = document.getElementById("input1");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("result1");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = `${this.serverData.name}`
        return "one"
      } else {//name must be re-entered
        var element = document.getElementById("input1");
        element.classList.add("red");
        element.classList.remove("green");
        var text = document.getElementById("result1");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        text.innerHTML = "Invalid Input - There is already a person registered with that name"
        return false
      }
    }
  }
  //Checks whether email is valid
  email(item: string) {
    var total = 0
    item = item.trim()
    var ting = item
    item = item + "@nomuda.com";
    for (let i of this.data) {
      if (item.toLowerCase() === i.email.toLowerCase()) {
        total = total + 1
      }
    }
    if ((ting !== "") && (total === 0)) {//email changed to input
      var element = document.getElementById("input2");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("result2");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {
      if (total === 0) {//email stays the same
        var element = document.getElementById("input2");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("result2");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = `${this.serverData.email}`
        return "one"
      } else {//email must be re-entered
        var element = document.getElementById("input2");
        element.classList.add("red");
        element.classList.remove("green");
        var text = document.getElementById("result2");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        text.innerHTML = "Invalid Input - There is already a person registered with that email"
        return false
      }
    }
  }
  //Checks whether number is valid
  number(item) {
    var total = 0
    item = item.trim()
    item = Number(item)
    var num = item.toString();
    if (num !== "NaN") {
      for (let i of this.data) {
        if (item === i.number) {
          total = total + 1
        }
      }
      if (item === 0) {//number unchanged
        return "one"
      }
      if (total === 0) {//number changed to input
        var element = document.getElementById("input3");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("result3");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = "Looking Good!"
        return true
      }
      else {//number must be re-entered
        var element = document.getElementById("input3");
        element.classList.add("red")
        element.classList.remove("greem")
        var text = document.getElementById("result3");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        text.innerHTML = "Invalid Input - There is already a person registered with that phone number"
        return false
      }
    } else {//number must be re-entered
      document.getElementById("result3").innerHTML = "You didn't enter a number!"
      var element = document.getElementById("input3");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("result3");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }
}
