import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class GardDetailsPluginGuard implements CanActivate {
  constructor(private routeService: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const params: number = +route.url[2].path;
    if (!isNaN(params) || params < 0) {
      alert('Attention ! Veillez ne pas injecté des données dans URL');
      this.routeService.navigate(['/appPlugin']);
      return false;
    }
    return true;
  }
}
