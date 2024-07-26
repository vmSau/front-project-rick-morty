import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  favorites: Array<number> = JSON.parse(localStorage.getItem('favorites') || '[]');
  private favoriteCount = new BehaviorSubject<number>(0);
  favoriteCount$ = this.favoriteCount.asObservable();
  constructor() {}

  checkIfFavorited(characterId: number): boolean {
    const isFavorited = this.favorites.includes(characterId);
    this.updateFavoriteCount(this.favorites);
    return isFavorited;
  }

  addToFavorites(characterId: number) {
    this.favorites.push(characterId);
    this.updateFavoriteCount(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  removeFromFavorites(characterId: number) {
    this.favorites = this.favorites.filter((id: number) => id !== characterId);
    this.updateFavoriteCount(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  updateFavoriteCount(favorites: any) {
    this.favoriteCount.next(favorites.length);
  }
}
