import {
    HttpInterceptor, HttpHandler, HttpHeaderResponse, HttpProgressEvent,
    HttpSentEvent, HttpRequest, HttpUserEvent, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class Requesthttpinceptor implements HttpInterceptor {
    // tslint:disable-next-line:max-line-length
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        // tslint:disable-next-line:prefer-const
        let tokenController = JSON.parse(localStorage.getItem('tokenController'));
        if (tokenController != null) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${tokenController.token}`
                }
            });
        }
        // logging the updated Parameters to browser's console
        console.log('Before making api call : ', req);
        return next.handle(req).pipe(
            tap(
                event => {
                    // logging the http response to browser's console in case of a success
                    if (event instanceof HttpResponse) {
                        console.log('api call success :', event);
                    }
                },
                error => {
                    // logging the http response to browser's console in case of a failuer
                    if (event instanceof HttpResponse) {

                        console.log('api call error :', event);
                    }
                }
            )
        );
    }
}

