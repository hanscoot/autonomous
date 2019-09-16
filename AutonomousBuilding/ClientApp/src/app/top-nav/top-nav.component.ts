import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../Services/navbar.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.Service';
import { MobileService } from '../Services/mobile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { TestData } from '../Models/Models';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {

  currentUser: TestData;

  constructor(
    private router: Router, private mode: MobileService, private modalServices: NgbModal,
    private authenticationService: AuthenticationService,
    public nav: NavbarService, private route: ActivatedRoute)
  {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.nav.hide()
    this.router.navigate(['/land']);
    const modalRef = this.modalServices.open(LoginComponent, { backdrop: 'static', keyboard: false, backdropClass: 'bg-primary', centered: true })
  }

  /*darkness() {
    var element = document.getElementById("example");
    element.classList.add("navbar-dark","bg-dark","item");
    element.classList.remove("navbar-light","bg-light");
  }

  light() {
    var element = document.getElementById("example");
    element.classList.remove("navbar-dark","bg-dark","item");
    element.classList.add("navbar-light","bg-light")
  }*/
}
