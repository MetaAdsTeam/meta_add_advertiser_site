import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService, NearService, PopupService} from '../services';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NotAuthorizedInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private nearService: NearService,
    private popupService: PopupService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        tap(
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // console.log('event', event)
            }
          },
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.popupService
                  .popupMessage('Your login session has expired', 'OK')
                  .subscribe(() => {
                    this.nearService.nearSignOut();
                    this.authService.logOut();
                    window.location.reload();
                  });
              }
            }
          }
        )
      )
  }
}
