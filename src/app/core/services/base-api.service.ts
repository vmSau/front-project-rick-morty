import { environment } from './../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IFilter } from '../../pages/characters/service/character.service';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export abstract class BaseApiService {
  private _apiUrl: string = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  get<T>(
    endpoint: string,
    filter?: IFilter,
    urlParam: string = ''
  ): Observable<T> {
    let url = `${this._apiUrl}/${endpoint}`;
    if (urlParam) url += `/${urlParam}`;
    let httpParams = new HttpParams();
    if (filter && filter.params) {
      httpParams = httpParams.set('page', filter.page);
      filter.params.forEach((param) => {
        httpParams = httpParams.set(param.key, param.value);
      });
    }

    return this.http.get<T>(url, { params: httpParams, responseType: 'json' });
  }
}
