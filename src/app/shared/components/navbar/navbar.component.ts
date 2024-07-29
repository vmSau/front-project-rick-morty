import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { FavoriteService } from '../../../pages/characters/services/favorite.service';
import { NgClass } from '@angular/common';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgClass, ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  routeData: 'home' | 'favorites' = 'home';
  favoriteCount: number = 0;
  private _subs = new SubSink();

  constructor(
    private _router: Router,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._subs.add(
      this._router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
        console.log(event)

          this.routeData = event.url.slice(1) as typeof this.routeData;
        }
      }),
      this.favoriteService.favoriteCount$.subscribe((count) => {
        this.favoriteCount = count;
        this.cdr.detectChanges();
      })
    );
  }

  navigateTo(path: 'home' | 'favorites') {
    this._router.navigate([path]);
  }
  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
