import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { PreviousRouteService } from '../previous-route.service';
import { NavbarService } from '../navbar.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EditAccountComponent } from '../Modals/edit-account/edit-account.component';
import { TestData } from '../Pages/people/people.component';
import { LockData } from '../Pages/locks/locks.component';


@Component({
  selector: 'app-home-nonadmin',
  templateUrl: './home-nonadmin.component.html',
  styleUrls: ['./home-nonadmin.component.scss']
})
export class HomeNonadminComponent implements OnInit {

  constructor(private http: HttpClient, private modalService: NgbModal,
    private previousRouteService: PreviousRouteService, private nav: NavbarService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.nav.show();
    this.ge().subscribe(data => {
      this.person = data;
      this.length = this.person.password.length
      this.repeat('*', this.length)
    })
    this.gek()
    this.gel()
    this.ges()
  }

  function() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  length: number

  repeatedString = "";
  repeat(string, times) {
    while (times > 0) {
      this.repeatedString += string;
      times--;
    }
  }

  id = this.route.snapshot.paramMap.get('id')
  //ACCOUNT **************************************************
  public person: TestData
  ge(): Observable<TestData> {
    let url = `/api/values/${this.id}`
    return this.http.get<TestData>(url)
  }
  public key: PK[] = [];
  gek() {
    this.http.get<PK[]>('/api/pk/testdata').subscribe(data => {
      this.key = data
      for (let i of this.key) {
        if (i.personID.toString() !== this.id) {
          this.key = this.key.filter(k => k !== i)
        }
      }
    })
  }
  public hmm: LK[] = []
  public lock: LockData
  public locks: LockData[] = []
  gel() {
    var count = 0
    this.http.get<PK[]>('/api/pk/testdata').subscribe(data => {
      this.key = data
      for (let i of this.key) {
        if (i.personID.toString() !== this.id) {
          this.key = this.key.filter(k => k !== i)
        }
      }
      this.http.get<LK[]>('/api/lk/testdata').subscribe(data => {
        this.hmm = data;
        for (let i of this.hmm) {
          for (let j of this.key) {
            if (j.keyID === i.keyID) {
              let url = `/api/locks/${i.lockID}`
              this.http.get<LockData>(url).subscribe(data => {
                this.lock = data
                this.locks[count] = this.lock
                count += 1
              })
            }
          }
        }
      })
    })
  }
  public sch: ScheduleKeyData[] = []
  public schedule: ScheduleKeyData
  ges() {
    var count = 0
    this.http.get<PK[]>('/api/pk/testdata').subscribe(data => {
      this.key = data
      for (let i of this.key) {
        if (i.personID.toString() !== this.id) {
          this.key = this.key.filter(k => k !== i)
        }
      }
      //iterate over keys to find if schedule has corresponding key
      for (let i of this.key) {
        let url = `/api/sk/sch/${i.keyID}`
        this.http.get<ScheduleKeyData>(url).subscribe(data => {
          this.schedule = data
          this.sch[count] = this.schedule
          count += 1
        })
      }
    })
  }
  account() {
    const modalRef = this.modalService.open(EditAccountComponent);
    modalRef.componentInstance.items = this.id;
    modalRef.result.then(() => {
      this.nav.show();
      this.ge().subscribe(data => {
        this.person = data;
        this.length = this.person.password.length
        this.repeat('*', this.length)
      })
      this.gek()
      this.gel()
      this.ges()
    });
  }
}


export class PK {
  personKeyID: number;
  personID: number;
  keyID: number;
}

export class LK {
  lockKeyID: number;
  lockID: number;
  keyID: number;
}

export class LockKeyName {
  lockKeyID: number;
  name: string;
  keyID: number;
}

export class ScheduleKeyData {
  scheduleKeyID: number;
  keyID: number;
  Times: string;
  Days: string;
}
