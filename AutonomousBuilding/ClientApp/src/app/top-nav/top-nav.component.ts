import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../navbar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor(public nav: NavbarService, private route: ActivatedRoute) { }

  ngOnInit() {
  }
}
