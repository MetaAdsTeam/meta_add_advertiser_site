import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AppService} from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected appService: AppService,
              protected router: Router) { }

  async canActivate(next: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Promise<boolean> {

    await this.appService.user$
      .subscribe(value => {
        if (!value) {
          this.router.navigate(['']);
        }
      });

    return true;
  }
}
