import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestData } from '../Models/Models';
import { NavbarService } from './navbar.Service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({ providedIn: 'root' })
export class FileService {


  constructor(private http: HttpClient) { }

  item: any
  get(content: string, day: number, date: string) {
    let request : any = { content: content, day: day, date: date }
    return this.http.post<any>(`/api/file/get`, request, httpOptions).pipe(map(user => {
      return user;
    }))
  }


}
