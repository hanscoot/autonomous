import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';



@Injectable({ providedIn: 'root' })
export class LogService {
  private currentUserSubject: BehaviorSubject<string[]>;
  public currentLog: Observable<string[]>;

  constructor(private http: HttpClient, private datepipe: DatePipe) {
    this.currentUserSubject = new BehaviorSubject<string[]>(JSON.parse(localStorage.getItem('currentLog')));
    this.currentLog = this.currentUserSubject.asObservable();
  }

  get() {
    return JSON.parse(localStorage.getItem('currentLog'))
  }

  start(input) {
    // store details in local storage to keep user logs between page refreshes
    localStorage.setItem('currentLog', JSON.stringify(input));
    this.currentUserSubject.next(input);
  }

  logout() {
    // remove log from local storage when user logs out
    localStorage.removeItem('currentLog');
    this.currentUserSubject.next(null);
  }

  dateNow: Date
  date: string
  time() {
    this.dateNow = new Date();
    this.date = this.datepipe.transform(this.dateNow, 'dd/MM/yyyy HH:mm')
    return this.date
  }

}
