import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserECM } from '../Models/modelApi';
import { UserService } from './user.Service';

@Injectable()
export class InterceptorReqService implements HttpInterceptor {
  userECMcmp: UserECM = {
    TK: '',
    userIdFB: '',
    userIdMG: '',
  };
  constructor(private userService: UserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Recuperation du token
    this.userECMcmp.TK =
      this.userService.VerifyTokenAndUserIdLocaleStorage().TK;

    const newReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.userECMcmp.TK),
    });
    return next.handle(newReq);
  }
}
