import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// import { AuthService } from '../../modules/auth/service/auth.service';
import { AlertService } from '../../shared/alert/service/alert.service';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  // private authService = inject(AuthService);
  private alertService = inject(AlertService);

  /**
   * @description Identifies and handles a given HTTP request.
   * @param request - HttpRequest, every http request going out from application
   * @param next - HttpHandler
   * @returns
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: HttpErrorResponse) => {
          this.onHandleErrors(err);
        }
      )
    );
  }

  /**
   * @description Opens Warning Alert modal.
   * @returns
   */
  openWarningAlert(content: string) {
    this.alertService.alertMessage('warning', {
      content,
      timeout: 5000,
      isOk: true,
      close: true
    });
  }

  /**
   * @description Getting an error and request object that got an error. and this is the function that takes appropriate actions for each error according to error codes.
   * @param error - HttpErrorResponse
   * @param request - HttpRequest
   * @returns
   */
  onHandleErrors(error: HttpErrorResponse): void {
    switch (error.status) {
      /**
       * @description 400
       */
      case 400:
        this.openWarningAlert(error.error.detail);
        break;

      /**
       * @description 401 Logged Out
       */
      case 401:
        this.openWarningAlert(error.error.detail);
        // this.authService.logout();
        break;

      /**
       * @description 403.
       */
      case 403:
        this.openWarningAlert(error.error.detail);
        break;

      /**
       * @description 404. Not Found.
       */
      case 404:
        this.openWarningAlert(error.error.detail);
        break;

      /**
       * @description 405. Method not allowed.
       */
      case 405:
        this.openWarningAlert(error.error.detail);
        break;

      /**
       * @description 408. Request Timeout.
       */
      case 408:
        this.openWarningAlert(error.error.detail);
        break;

      /**
       * @description 422.
       */
      case 422:
        if (error.error.detail) {
          const errorMessage: string[] = [];
          const validationErrors = error.error.detail;
          validationErrors.forEach(
            (validationError: { loc: string[]; msg: string }) => {
              const fieldPath = validationError.loc[1];
              const message = validationError.msg;
              errorMessage.push(`${fieldPath}: ${message}`);
            }
          );
          this.openWarningAlert(`Validation error for ${errorMessage}`);
        } else {
          this.openWarningAlert(
            'Unprocessable Entity. Please check the request.'
          );
        }
        break;

      /**
       * @description 429 Too Many attempts
       */
      case 429:
        this.openWarningAlert('Too Many Attempts..Please try after 30 minutes');
        break;

      case 500:
        this.openWarningAlert(error.error.detail);
        break;

      default:
        break;
    }
  }
}
