import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PageGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const page = route.queryParams['page'];
    if (!page || isNaN(+page) || +page <= 0) {
      this.router.navigate(['/home'], { queryParams: { page: 1 }, replaceUrl: true });
      return false;
    }
    return true;
  }
}