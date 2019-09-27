import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavbarService {

  public visible = false

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

}
