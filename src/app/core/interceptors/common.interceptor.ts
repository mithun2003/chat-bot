import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';

/**
 * Common HTTP Interceptor for Token Authorization
 *
 * This interceptor adds the authentication token to the headers of outgoing HTTP requests
 * if a token is present. It also handles loading indicators through the HeaderService.
 *
 * @implements HttpInterceptor
 */
@Injectable()
export class CommonInterceptorInterceptor implements HttpInterceptor {
  private token!: string;

  // private headerService = inject(HeaderService);
  private localStorageService = inject(LocalStorageService);
  /**
   * Intercept HTTP requests and add authorization token if available.
   *
   * @param request - The outgoing HTTP request
   * @param next - The next HTTP handler
   * @returns An Observable of the HTTP event
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.token = '';
    let req = request;
    if (this.token) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      });
    }

    if (
      // environment.isItDev &&
      this.localStorageService.getItem('tempBaseRootUrl')
    ) {
      req = req.clone({
        url: `${this.localStorageService.getItem('tempBaseRootUrl')}${request.url.split(environment.baseUrl)[1]}`
      });
    }
    return next.handle(req).pipe(
      finalize(() => {
      })
    );

  }
}
