import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private okatAuth: OktaAuth) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return from(this.handelAccess(req, next));
  }

  private async handelAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    //only add aceess tiokedn for securoty end points

    const endPoint = environment.baseBackEndUrl + '/orders';
    const securedEndPoints = [endPoint];

    if(securedEndPoints.some(url => req.urlWithParams.includes(url))){

      const accessToken = this.okatAuth.getAccessToken();
      console.log(`accessToken: ${accessToken}`);

      //clone the req as the req is immutable

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next.handle(req));

  }
}
