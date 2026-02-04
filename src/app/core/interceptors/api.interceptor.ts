import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  let request = req;

  if (!(req.body instanceof FormData)) {
    request = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  return next(request).pipe(
    catchError(error => {
      
      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
};
