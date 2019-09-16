import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestData } from '../Models/Models';
import { NavbarService } from './navbar.Service';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<TestData>;
  public currentUser: Observable<TestData>;

  constructor(private http: HttpClient, private nav: NavbarService) {
    this.currentUserSubject = new BehaviorSubject<TestData>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): TestData {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`/api/users/authenticate`, { email, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.nav.visible = true
        }

        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentLog');
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.nav.visible = false;
    this.currentUserSubject.next(null);
  }
}
