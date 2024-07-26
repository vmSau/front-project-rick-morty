import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FavoriteService } from '../../service/favorite.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges {

  @Input() character!: any;
  @Input() flip: boolean = false;
  @Output() removeFromFavorites = new EventEmitter();

  isFavorited: boolean = false;
  
  constructor(private _favoriteService: FavoriteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isFavorited = this._favoriteService.checkIfFavorited(this.character.id);
  }

  toggleFavorite() {
    if (this.isFavorited) {
      this._favoriteService.removeFromFavorites(this.character.id);
      this.removeFromFavorites.emit({character: this.character})

    } else {
      this._favoriteService.addToFavorites(this.character.id);
    }
    this.isFavorited = !this.isFavorited;
  }
}
