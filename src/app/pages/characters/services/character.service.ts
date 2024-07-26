import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { BaseApiService } from '../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService extends BaseApiService {
  endpoint: string = 'character';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getAllCharacters() {
    return this.get<any>(this.endpoint);
  }
  
  pageChange(filter: IFilter) {
    return this.get<any>(this.endpoint, filter);
  }

  getCharactersById(ids: number[]): Observable<any> {
    let idParams = '';
    if(ids.length > 0)
    idParams = JSON.stringify(ids);
    return this.get<any>(this.endpoint, {page: 1}, idParams);
  }
  
  filterCharacters(filter: IFilter) {
    return this.get<any>(this.endpoint, filter);
  }
}

export interface IFilter {
    page: number;
    params?: [{ key: string; value: string }];
}
