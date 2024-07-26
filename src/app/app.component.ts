import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { CharactersComponent } from './pages/characters/components/characters/characters.component';
import { AsyncPipe } from '@angular/common';
import { NotificationComponent } from './shared/components/notification/notification.component';

import {
  RouterModule,
} from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
