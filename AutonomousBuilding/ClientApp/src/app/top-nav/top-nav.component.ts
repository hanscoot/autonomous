import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../Services/navbar.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestData } from '../Pages/people/people.component';
import { AuthenticationService } from '../Services/authentication.Service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {

  currentUser: TestData;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public nav: NavbarService, private route: ActivatedRoute) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
