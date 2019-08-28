import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddLockComponent } from '../../Modals/add-lock/add-lock.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-locks',
  templateUrl: './locks.component.html',
  styleUrls: ['./locks.component.scss']
})
export class LocksComponent implements OnInit {

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.get()
  }

  public serverData: LockData[] = []
  //gets lock data
  get() {
    this.http.get<LockData[]>('/api/locks/testdata').subscribe(data => this.serverData = data)
  }
  //open modal to add new lock
  open() {
    const modalRef = this.modalService.open(AddLockComponent);
    modalRef.result.then(() => {
      this.get()
    });
  }
}


export class LockData {
  lockID: number;
  name: string;
  lockTypeID: number;
}
