import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { CharactersComponent } from './pages/characters/components/characters/characters.component';
import { AsyncPipe } from '@angular/common';
import { NotificationComponent } from './shared/components/notification/notification.component';

import {
  RouterModule,
  Router,
  NavigationEnd,
} from '@angular/router';
import { FavoriteService } from './pages/characters/service/favorite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NgClass,
    CharactersComponent,
    AsyncPipe,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent  implements OnInit {
  title = 'front-project-rick-morty';
  routeData: 'home' | 'favorites' = 'home';
  favoriteCount: number = 0;

  constructor(private _router: Router, private favoriteService: FavoriteService,private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      this.routeData = event.url.slice(1) as typeof this.routeData;
      }
    });
    this.favoriteService.favoriteCount$.subscribe(count => {
      this.favoriteCount = count;
      this.cdr.detectChanges(); 
    });
  }
  
  navigateTo(path: 'home' | 'favorites') {
    this._router.navigate([path]);
  }
}
