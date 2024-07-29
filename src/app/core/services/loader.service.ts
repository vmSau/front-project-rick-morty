import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private waitingResponse = signal(false);

  update(){
    this.waitingResponse.update((value) => !value);
  }

  getLoading(): boolean {
    return this.waitingResponse();
  }
}
