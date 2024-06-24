import { HttpInterceptorFn } from '@angular/common/http';
import { getCookie} from 'typescript-cookie'
export const httInterceptor: HttpInterceptorFn = (req, next) => {
  
  const csrftoken=getCookie('csrftoken');
  let headersReq = req.headers;
  if(csrftoken){
    headersReq = headersReq.append('X-CSRFToken', csrftoken)
  }
  const clonedRequest=req.clone({
    headers: headersReq
  })

  return next(clonedRequest);
};
