import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AppService} from './services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private appService: AppService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.appService.isSigned();
  }
}
