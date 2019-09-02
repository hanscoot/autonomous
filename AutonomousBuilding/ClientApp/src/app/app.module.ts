import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { RouterModule, Routes } from '@angular/router';
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
import { NavbarService } from './navbar.service';
import { EditAccountComponent } from './Modals/edit-account/edit-account.component';
import { HomeNonadminComponent } from './home-nonadmin (template only)/home-nonadmin.component';
import { SchedulesComponent } from './Pages/schedules/schedules.component';
import { LocksComponent } from './Pages/locks/locks.component';
import { KeysComponent } from './Pages/keys/keys.component';
import { PeopleComponent } from './Pages/people/people.component';
import { LogsComponent } from './Pages/logs/logs.component';
import { AccountComponent } from './Pages/account/account.component';

const routes: Routes = [
  { path: 'Account', component: AccountComponent },
  { path: 'Keys', component: KeysComponent },
  { path: 'Locks', component: LocksComponent },
  { path: 'Logs', component: LogsComponent },
  { path: 'People', component: PeopleComponent },
  { path: 'Schedules', component: SchedulesComponent },
  { path: 'people/:id', component: DetailsPeopleComponent },
  { path: 'lock/:id', component: DetailsLocksComponent },
  { path: 'schedule/:id', component: DetailsSchedulesComponent },
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
    AddKeyPersonComponent,
    AddKeyLockComponent,
    DetailsSchedulesComponent,
    AddScheduleComponent,
    AddKeyScheduleComponent,
    EditScheduleComponent,
    EditLockComponent,
    EditAccountComponent,
    HomeNonadminComponent,
    SchedulesComponent,
    LocksComponent,
    KeysComponent,
    PeopleComponent,
    LogsComponent,
    AccountComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgbModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [NgbActiveModal, DetailsPeopleComponent, DetailsLocksComponent, DetailsSchedulesComponent,
    NavbarService, HomeNonadminComponent, DatePipe, AccountComponent, KeysComponent, LocksComponent,
    LogsComponent, PeopleComponent, SchedulesComponent],
  bootstrap: [AppComponent],
  entryComponents: [EditPersonComponent, AddPersonComponent, AddKeyComponent, EditLockComponent,
    AddLockComponent, AddKeyPersonComponent, AddKeyLockComponent, AddScheduleComponent,
    AddKeyScheduleComponent, EditScheduleComponent, EditAccountComponent]
})
export class AppModule { }
