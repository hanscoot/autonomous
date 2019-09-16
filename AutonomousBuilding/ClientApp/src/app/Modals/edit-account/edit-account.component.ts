import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TopNavComponent } from '../../top-nav/top-nav.component';
import { Observable } from 'rxjs';
import { UserInfo, TestData } from '../../Models/Models';
import { LogService } from '../../Services/log.Service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

  constructor(private http: HttpClient, public activeModal: NgbActiveModal, private str: TopNavComponent, private log: LogService) { }

  ngOnInit() {
    this.getuser().subscribe(data => { this.user = data })
  }

  public serverData: TestData;
  public Data: TestData;

  public user: UserInfo;
  //gets current user data
  getuser(): Observable<UserInfo> {
    let id = this.str.currentUser.personId
    let url = `/api/account/user/${id}`
    return this.http.get<UserInfo>(url)
  }

  //updates data with checks
  add(one, two, three) {
    let url = `/api/values/user/${this.str.currentUser.personId}`
    this.http.get<TestData>(url).subscribe(data => {
      this.Data = data;
      let serverData: TestData = new TestData();
      serverData = this.Data
      var item = this.log.get()
      this.log.logout()
      if (this.testemail(one) === true) {
        serverData.email = one + "@nomuda.com"
        item.push("Updated email - " + this.log.time())
      }
      if (this.testpassword(three) === true) {
        serverData.password = three
        item.push("Updated password - " + this.log.time())
      }
      if (this.testnumber(two) === true) {
        serverData.number = Number(two)
        item.push("Updated number - " + this.log.time())
      }
      if (((this.testnumber(two) === "one") || (this.testnumber(two) === true)) && ((this.testnumber(two) === true) || (this.testnumber(two) === "one"))) {
        let thisurl = `/api/values/${this.str.currentUser.personId}`
        this.log.start(item)
        this.http.put<TestData>(thisurl, serverData, httpOptions).subscribe(() => this.activeModal.close())
      }
    })
  }

  //Checks whether password is valid
  testpassword(item) {
    item = item.trim()
    item = item.toString();
    if (item === null) {//password unchanged
      return 'one'
    }
    if (item.length >= 8) {//password changed to input
      var element = document.getElementById("input3");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("result3");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {//password must be re-entered
      document.getElementById("result3").innerHTML = "Your password wasn't long enough! (min length 8)"
      var element = document.getElementById("input3");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("result3");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether email is valid
  testemail(item) {
    item = item.trim()
    item = item.toString();
    var email = item + "@nomuda.com"
    if (email === "@nomuda.com" || email === this.user.email) {//email unchanged
      return false
    }
    else {//email changed to input
      var element = document.getElementById("input3");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("result3");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
  }

  //Checks whether number is valid
  testnumber(item) {
    item = item.trim()
    item = Number(item)
    var num = item.toString();
    if (num !== "NaN") {
      if (item === 0 || item === this.user.number) {//number unchanged
        return 'one'
      }
      else {//number changed to input
        var element = document.getElementById("input3");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("result3");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = "Looking Good!"
        return true
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

