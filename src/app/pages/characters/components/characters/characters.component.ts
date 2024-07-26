import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { AsyncPipe } from '@angular/common';
import { CharacterService, IFilter } from '../../services/character.service';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { ICharacter } from '../../interfaces/character.interface';
import { IPageInfo } from '../../interfaces/page-info.interface';
import { IApiResponse } from '../../interfaces/api-response.interface';
import { SubSink } from 'subsink';

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
})
export class CharactersComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  @Input() routeData!: any;
  title: 'Inicio' | 'Favoritos' = 'Inicio';
  characters!: Array<ICharacter>;
  pageInfo!: IPageInfo | null;
  searchControl = new FormControl();
  errorMessage: string | null = null;
  filter: IFilter = { page: 1, params: [{ key: 'name', value: '' }] };
  buttonNotification!: {
    showButton: boolean;
    buttonText?: string;
    buttonRedirect?: string;
  };

  constructor(
    private _characterService: CharacterService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _favoriteService: FavoriteService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._subs.add(
      this._route.data.subscribe((data) => {
        this.routeData = data['characters'];
      })
    );
    this.loadPageData();
  }

  loadPageData() {
    this._notificationService.clear();
    if (this.routeData === 'favorites') {
      this.characters = [];
      this.getAllFavorites();
      this.title = 'Favoritos';
    } else {
      this.title = 'Inicio';
      this.getCharacters();
      this.filterByName();
    }
  }

  getCharacters() {
    this._subs.add(
      this._characterService
        .filterCharacters(this.filter)
        .subscribe((res: IApiResponse) => {
          this.pageInfo = res.info;
          this.characters = res.results;
        })
    );
  }

  skipPage(event: any) {
    this.filter.page = event.pageNumber;
    this.getCharacters();
  }

  filterByName() {
    this._subs.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((query) => {
            this._notificationService.clear();
            if (this.filter.params) this.filter.params[0].value = query;
            this.filter.page = 1;
            return this._characterService.filterCharacters(this.filter).pipe(
              catchError((error) => {
                this.buttonNotification = {
                  showButton: false,
                };
                this._notificationService.showNotFound(
                  'Nada foi encontrado',
                  'Tente realizar uma nova busca.'
                );
                return of([]);
              })
            );
          })
        )
        .subscribe((results: IApiResponse) => {
          this.pageInfo = results.info;
          this.characters = results.results;
        })
    );
  }

  getAllFavorites() {
    const favorites = this._favoriteService.favorites;
    if (favorites && favorites.length > 0) {
      this._subs.add(
        this._characterService
          .getCharactersById(favorites)
          .subscribe((res: Array<ICharacter>) => {
            this.pageInfo = null;
            this.characters = res;
          })
      );
    } else {
      this.showNotFoundFavorite();
    }
  }

  removeCardFavorite(event: any) {
    if (this.routeData === 'favorites') {
      this.characters = this.characters.filter(
        (character: ICharacter) => character !== event.character
      );
      if (this.characters.length === 0) this.showNotFoundFavorite();
    }
  }

  showNotFoundFavorite() {
    this.buttonNotification = {
      showButton: true,
      buttonText: 'Voltar ao início',
    };
    this._notificationService.showNotFound(
      'Parece que você ainda não tem favoritos',
      'Volte à página inicial e escolha os melhores para você.'
    );
  }
  redirectToHome() {
    this._router.navigate(['/home']);
  }
  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
