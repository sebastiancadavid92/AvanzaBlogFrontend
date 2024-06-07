import { HttpInterceptorFn } from '@angular/common/http';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({withCredentials:true});
  console.log(clonedReq);
  return next(clonedReq);
};
