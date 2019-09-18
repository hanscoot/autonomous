import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { RouterModule, Routes } from '@angular/router';
import { OneTimeComponent } from './Modals/one-time/one-time.component';
import { EditPersonComponent } from './Modals/edit-person/edit-person.component';
import { AddPersonComponent } from './Modals/add-person/add-person.component';
import { AddKeyComponent } from './Modals/add-key/add-key.component';
import { AddLockComponent } from './Modals/add-lock/add-lock.component';
import { DetailsPeopleComponent } from './Pages/details-people/details-people.component';
import { DetailsLocksComponent } from './Pages/details-locks/details-locks.component';
import { AddKeyLockComponent } from './Modals/padd-key-lock/add-key-lock.component';
import { AddKeyPersonComponent } from './Modals/padd-key-person/add-key-person.component';
import { DetailsSchedulesComponent } from './Pages/details-schedules/details-schedules.component';
import { AddScheduleComponent } from './Modals/add-schedule/add-schedule.component';
import { AddKeyScheduleComponent } from './Modals/padd-key-schedule/add-key-schedule.component';
import { EditScheduleComponent } from './Modals/edit-schedule/edit-schedule.component';
import { EditLockComponent } from './Modals/edit-lock/edit-lock.component';
import { EditAccountComponent } from './Modals/edit-account/edit-account.component';
import { SchedulesComponent } from './Pages/schedules/schedules.component';
import { LocksComponent } from './Pages/locks/locks.component';
import { KeysComponent } from './Pages/keys/keys.component';
import { PeopleComponent } from './Pages/people/people.component';
import { LogsComponent } from './Pages/logs/logs.component';
import { AccountComponent } from './Pages/account/account.component';
import { LoginComponent } from './login/login.component';
import { NavbarService } from './Services/navbar.Service';
import { AuthenticationService } from './Services/authentication.Service';
import { LogService } from './Services/log.Service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthGuard } from './Guards/auth.guard';
import { AccountGuard } from './Guards/account.guard';
import { MobileService } from './Services/mobile.service';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { QrcodeComponent } from './qrcode/qrcode.component';

const routes: Routes = [
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AccountGuard] },
  { path: 'Account', component: AccountComponent, canActivate: [AccountGuard] },
  { path: 'Keys', component: KeysComponent, canActivate: [AuthGuard] },
  { path: 'Locks', component: LocksComponent, canActivate: [AuthGuard] },
  { path: 'Logs', component: LogsComponent, canActivate: [AuthGuard] },
  { path: 'People', component: PeopleComponent, canActivate: [AuthGuard] },
  { path: 'Schedules', component: SchedulesComponent, canActivate: [AuthGuard] },
  { path: 'people/:id', component: DetailsPeopleComponent, canActivate: [AuthGuard] },
  { path: 'lock/:id', component: DetailsLocksComponent, canActivate: [AuthGuard] },
  { path: 'schedule/:id', component: DetailsSchedulesComponent, canActivate: [AuthGuard] },
  { path: 'land', component: LandingComponent},
  { path: '', redirectTo: 'Schedules', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    EditPersonComponent,
    AddPersonComponent,
    AddKeyComponent,
    AddLockComponent,
    DetailsPeopleComponent,
    DetailsLocksComponent,
    OneTimeComponent,
    AddKeyPersonComponent,
    AddKeyLockComponent,
    DetailsSchedulesComponent,
    AddScheduleComponent,
    AddKeyScheduleComponent,
    EditScheduleComponent,
    EditLockComponent,
    EditAccountComponent,
    SchedulesComponent,
    LocksComponent,
    KeysComponent,
    PeopleComponent,
    LogsComponent,
    AccountComponent,
    LoginComponent,
    LandingComponent,
    DashboardComponent,
    QrcodeComponent,

  ],
  imports: [
    BrowserModule,
    NgxQRCodeModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgbModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFontAwesomeModule,
    DeviceDetectorModule.forRoot(),
  ],
  providers: [NgbActiveModal, DetailsPeopleComponent, DetailsLocksComponent, DetailsSchedulesComponent,
    NavbarService, AuthenticationService, LogService, MobileService, AppComponent, DatePipe, AccountComponent, KeysComponent, LocksComponent,
    LogsComponent, PeopleComponent, SchedulesComponent, TopNavComponent, LandingComponent, DashboardComponent,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditPersonComponent, AddPersonComponent, TopNavComponent, AddKeyComponent, EditLockComponent,
    AddLockComponent, AddKeyPersonComponent, AddKeyLockComponent, AddScheduleComponent, QrcodeComponent,
    AddKeyScheduleComponent, EditScheduleComponent, EditAccountComponent, OneTimeComponent, LoginComponent]
})
export class AppModule { }
