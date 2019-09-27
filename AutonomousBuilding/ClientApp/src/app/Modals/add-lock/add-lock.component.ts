
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LockData, LockType } from '../../Models/Models';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-add-lock',
  templateUrl: './add-lock.component.html',
  styleUrls: ['./add-lock.component.scss']
})
export class AddLockComponent implements OnInit {

  public serverData: LockData[] = [];
  public Dsata: LockType[] = [];
  public Lock: LockData[] = [];
  data: LockData;

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.getall().subscribe(item => { this.serverData = item })
  }

  getall(): Observable<LockData[]> {
    return this.http.get<LockData[]>('/api/locks/testdata')
  }
  //DROPDOWN LOCKTYPE SELECTOR
  //gets available locktype information
  gets() {
    this.http.get<LockType[]>('/api/locktype/testdata').subscribe(data => {
      this.Dsata = data;
      this.getall().subscribe(data => {
        this.Lock = data;
        for (let i of this.Dsata) {
          for (let j of this.Lock) {
            if (i.lockTypeID === j.lockTypeID) {
              this.Dsata = this.Dsata.filter(k => k != i)
            }
          }
        }
      })
    })
  }
  //CUSTOM LOCKTYPE SELECTOR
  add(item: string, one: string, two: string, three: string,f:string, ff:string, fff:string, four: string) {
    let One = this.name(item)
    let Two = this.type(one)
    let Three = this.ip(two)
    let Four = this.port(three)
    let Five = this.delay(four)
    if ((One === true) && (Two === true) && (Three === true) && (Four === true) && (Five === true)) {
      let le: LockType = new LockType();
      le.outputType = one.trim()
      le.outputIP = two.trim()
      le.outputPort = Number(three.trim())
      le.inputType = f.trim()
      le.inputIP = ff.trim()
      le.inputPort = Number(fff.trim())
      le.delay = Number(four.trim()) * 1000
      this.http.post('/api/locktype/test', le, httpOptions).subscribe()
      setTimeout(() => {
        this.http.get<LockType[]>('/api/locktype/testdata').subscribe(data => {
          this.Dsata = data;
          this.getall().subscribe(data => {
            this.Lock = data;
            for (let i of this.Dsata) {
              for (let j of this.Lock) {
                if (i.lockTypeID === j.lockTypeID) {
                  this.Dsata = this.Dsata.filter(k => k != i)
                }
              }
            }
            let identity = this.Dsata[0].lockTypeID
            let Data: LockData = new LockData();
            Data.name = item;
            Data.lockTypeID = identity
            this.http.post<LockData[]>('/api/locks/test', Data, httpOptions).subscribe(() => this.activeModal.close());

          })
        })
      }, 500)}
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
      var element = document.getElementById("name");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("demo");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {
      if (total === 0) {
        document.getElementById("demo").innerHTML = "Invalid Input - Name can't be left blank"
      } else {
        document.getElementById("demo").innerHTML = "Invalid Input - There is already a lock registered with that name"
      }
      var element = document.getElementById("name");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("demo");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether type is valid
  type(item: string) {
    item = item.trim()
    if ((item !== "")) {
      var element = document.getElementById("type");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("one");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {
      document.getElementById("one").innerHTML = "Invalid Input - Type can't be left blank"
      var element = document.getElementById("type");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("one");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether ip is valid
  ip(item: string) {
    item = item.trim()
    if ((item !== "")) {
      var element = document.getElementById("ip");
      element.classList.add("green");
      element.classList.remove("red");
      var text = document.getElementById("two");
      text.classList.add("text-success")
      text.classList.remove("text-danger")
      text.innerHTML = "Looking Good!"
      return true
    }
    else {
      document.getElementById("two").innerHTML = "Invalid Input - IP can't be left blank"
      var element = document.getElementById("ip");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("two");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether port is valid
  port(item) {
    item = item.trim()
    item = Number(item)
    var num = item.toString();
    if (num !== "NaN") {
      if ((num === "0")) {
        document.getElementById("three").innerHTML = "Invalid Input - Port can't be left blank"
        var element = document.getElementById("output");
        element.classList.add("red");
        element.classList.remove("green");
        var text = document.getElementById("three");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        return false
      }
      if ((item !== 0)) {
        var element = document.getElementById("output");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("three");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = "Looking Good!"
        return true
      }
    } else {
      document.getElementById("three").innerHTML = "Invalid Input - You must enter a number!"
      var element = document.getElementById("output");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("three");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }

  //Checks whether delay is valid
  delay(item) {
    item = item.trim()
    item = Number(item)
    var num = item.toString();
    if (num !== "NaN") {
      if ((num === "0")) {
        document.getElementById("four").innerHTML = "Invalid Input - Delay can't be left blank"
        var element = document.getElementById("delay");
        element.classList.add("red");
        element.classList.remove("green");
        var text = document.getElementById("four");
        text.classList.add("text-danger")
        text.classList.remove("text-success")
        return false
      }
      if ((item !== 0)) {
        var element = document.getElementById("delay");
        element.classList.add("green");
        element.classList.remove("red");
        var text = document.getElementById("four");
        text.classList.add("text-success")
        text.classList.remove("text-danger")
        text.innerHTML = "Looking Good!"
        return true
      }
    } else {
      document.getElementById("four").innerHTML = "Invalid Input - You must enter a number!"
      var element = document.getElementById("delay");
      element.classList.add("red");
      element.classList.remove("green");
      var text = document.getElementById("four");
      text.classList.add("text-danger")
      text.classList.remove("text-success")
      return false
    }
  }



}
