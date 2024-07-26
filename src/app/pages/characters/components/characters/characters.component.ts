import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { AsyncPipe } from '@angular/common';
import { CharacterService, IFilter } from '../../service/character.service';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FavoriteService } from '../../service/favorite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    CardComponent,
    PaginatorComponent,
    AsyncPipe,
    ReactiveFormsModule,
    NotificationComponent,
  ],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent implements OnInit, OnDestroy {
  @Input() routeData!: any;
  title: 'Inicio' | 'Favoritos' = 'Inicio';
  characters!: any;
  pageInfo!: any;
  searchControl = new FormControl();
  errorMessage: string | null = null;
  filter: IFilter = { page: 1 , params: [{key:"name", value:""}]};

  constructor(
    private _characterService: CharacterService,
    private _route: ActivatedRoute,
    private _favoriteService: FavoriteService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.routeData = data['characters'];
    });
    this.loadPageData();
  }

  loadPageData() {
    if (this.routeData === 'favorites') {
      this.getAllFavorites();
      this.title = 'Favoritos';
    } else {
      this.title = 'Inicio';
      this.getCharacters();
      this.filterByName();
    }
  }

  getCharacters() {
    this._characterService
      .filterCharacters(this.filter)
      .subscribe((res: any) => {
        this.pageInfo = res.info;
        this.pageInfo.page = res.info;
        this.characters = res.results;
      });
  }

  skipPage(event: any) {
    this.filter.page = event.pageNumber;
    this.getCharacters();
  }

  filterByName() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this._notificationService.clear()
          if(this.filter.params)
            this.filter.params[0].value = query;
          this.filter.page = 1;
          return this._characterService.filterCharacters(this.filter).pipe(
            catchError((error) => {
              this._notificationService.showNotFound(error);
              return of([]);
            })
          );
        })
      )
      .subscribe((results: any) => {
        this.pageInfo = results.info;
        this.characters = results.results;
      });
  }

  getAllFavorites() {
    const favorites = this._favoriteService.favorites;
    this._characterService
      .getCharactersById(favorites)
      .subscribe((res: any) => {
        this.pageInfo = [];
        this.characters = res;
      });
  }

  removeCardFavorite(event: any) {
    if (this.routeData === 'favorites') {
      this.characters = this.characters.filter(
        (character: any) => character !== event.character
      );
    }
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
