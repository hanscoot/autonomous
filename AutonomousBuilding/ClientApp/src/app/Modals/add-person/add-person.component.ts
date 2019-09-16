
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestData } from '../../Models/Models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {

  public serverData: TestData[] = [];
  data: TestData;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.getall().subscribe(item => { this.serverData = item})
  }
  //gets data
  getall(): Observable<TestData[]> {
    return this.http.get<TestData[]>('/api/values/testdata')
  }
  //checbkox
  marked = false;
  check(e) {
    this.marked = e.target.checked
  }


  //Adds Item to Database after validation checks
  Data: TestData;
  Add(item: string, item2: string, item3) {
    let Data: TestData = new TestData();
    if (this.name(item) === true) {
      Data.name = item;
    }
    if (this.email(item2) === true) {
      Data.email = item2 + "@nomuda.com";
    }
    if (this.number(item3) === true) {
      Data.number = item3;
    }
    Data.password = "nomuda";
    Data.clear = this.marked;
    if ((this.number(item3) === true) && (this.email(item2) === true) && (this.name(item) === true)) {
      this.http.post<TestData[]>('/api/values/test', Data, httpOptions).subscribe(() => this.activeModal.close());
    }
  }

  //Checks whether name is valid
  name(item: string) {
    var total = 0
    item = item.trim()
    for (let i of this.serverData) {
      if (item.toLowerCase() === i.name.toLowerCase()) {
        total = total + 1
      }
    }
    if ((item !== "") && (total === 0)) {
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
      if (total === 0) {
        document.getElementById("result1").innerHTML = "Invalid Input - Name can't be left blank"
      } else {
        document.getElementById("result1").innerHTML = "Invalid Input - There is already a person registered with that name"
      }
      var element = document.getElementById("input1");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("result1");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }
  //Checks whether email is valid
  email(item: string) {
    var total = 0
    item = item.trim()
    var ting = item
    item = item + "@nomuda.com";
    for (let i of this.serverData) {
      if (item.toLowerCase() === i.email.toLowerCase()) {
        total = total + 1
      }
    }
    if ((ting !== "") && (total === 0)) {
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
      if (total === 0) {
        document.getElementById("result2").innerHTML = "Invalid Input - Email can't be left blank"
      } else {
        document.getElementById("result2").innerHTML = "Invalid Input - There is already a person registered with that email"
      }
      var element = document.getElementById("input2");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("result2");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }
  //Checks whether number is valid
  number(item) {
    var total = 0
    item = item.trim()
    item = Number(item)
    var num = item.toString();
    if (num !== "NaN") {
      for (let i of this.serverData) {
        if (item === i.number) {
          total = total + 1
        }
      }
      if ((item !== null) && (total === 0)) {
        var element = document.getElementById("input3");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("result3");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = "Looking Good!"
        return true
      }
      else {
        if (total === 0) {
          document.getElementById("result3").innerHTML = "Invalid Input - Phone number can't be left blank"
        } else {
          document.getElementById("result3").innerHTML = "Invalid Input - There is already a person registered with that phone number"
        }
        var element = document.getElementById("input3");
        element.classList.add("red")
        element.classList.remove("greem")
        var text = document.getElementById("result3");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        return false
      }
    } else {
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
