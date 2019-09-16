import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../Services/authentication.Service';
import { NavbarService } from '../Services/navbar.Service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MobileService } from '../Services/mobile.service';
import { LogService } from '../Services/log.Service';



@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationServices: AuthenticationService,
    private nav: NavbarService,
    private activeModal: NgbActiveModal,
    private mode: MobileService,
    private user: LogService,
  ) { }

  ngOnInit() {
    this.nav.hide()
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationServices.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationServices.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          let item = []
          item[0] = "Logged in  - " + this.user.time()
          this.user.start(item)
          this.router.navigate([this.returnUrl]);
          this.activeModal.close()
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
