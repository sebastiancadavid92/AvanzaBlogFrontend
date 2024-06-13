import { HttpInterceptorFn } from '@angular/common/http';
import { getCookie} from 'typescript-cookie'
export const httInterceptor: HttpInterceptorFn = (req, next) => {
  
  const csrftoken=getCookie('csrftoken');
  const clonedRequest=req.clone({
    setHeaders:{
      'X-CSRFToken':csrftoken? csrftoken:''
    }
  })
  return next(clonedRequest);
};
