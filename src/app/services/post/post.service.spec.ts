import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing'
import { PostService } from './post.service';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { httInterceptor } from '../../interceptors/htt.interceptor';
import {environment} from '../../../environments/environment'
import { Comment, newPost } from '../../shared/models/post';

describe('PostService', () => {
  let service: PostService;
  let controller:HttpTestingController;
  const data:newPost={
    title: 'test tittle',
    content:'Content test',
    html:'html content',
    permission: {
        PUBLIC: 'EDIT',
        AUTHOR:'EDIT',
        TEAM:'NONE',
        AUTHENTICATED:'NONE'
    }
  }
  const comment={content:'this is a comment test'}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[PostService]
    });
    service = TestBed.inject(PostService);
    controller=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('get a post', (doneFn)=>{
    const url=`${environment.URLAPI}post/1`

    let postSent:any|null;
  
    service.getPost(1).subscribe((result)=>{
      postSent=result
      expect(postSent).toEqual(data)
      doneFn()
    })
    let request=controller.expectOne(url)
    expect(request.request.withCredentials).toBeTrue()
    expect(request.request.method).toEqual('GET')
    request.flush(data)

  })

  it('create a post', ()=>{
    const url=`${environment.URLAPI}post/`
    const data:newPost={
      title: 'test tittle',
      content:'Content test',
      html:'html content',
      permission: {
          PUBLIC: 'EDIT',
          AUTHOR:'EDIT',
          TEAM:'NONE',
          AUTHENTICATED:'NONE'
      }
    }

    let postSent:any|null;
  
    service.newPost(data).subscribe((result)=>{
      postSent=result
     

    })
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('POST')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data) 
    expect(postSent).toEqual(data)

  })

  it('update a post', ()=>{
    const url=`${environment.URLAPI}post/3/`

    let postSent:any|null;
  
    service.updatePost(data,3).subscribe((result)=>{
      postSent=result
    })
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('PATCH')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('list posts', ()=>{
    const url=`${environment.URLAPI}post/`

    let postSent:any|null;
  
    service.listPost().subscribe((result)=>{
      postSent=result
    })
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('GET')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('go to a list page', ()=>{
    const url="www.thisisatesturl.com"

    let postSent:any|null;
  
    service.listPostPage(url).subscribe((result)=>{
      postSent=result
    })
    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('GET')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })


  it('like a post', ()=>{
    const url=`${environment.URLAPI}post/1/like/`

    let postSent:any|null;
  
    service.like(1).subscribe((result)=>{
      postSent=result
    })

    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('POST')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('dislike a post', ()=>{
    const url=`${environment.URLAPI}post/1/like/`

    let postSent:any|null;
  
    service.dislike(1).subscribe((result)=>{
      postSent=result
    })

    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('DELETE')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('delete a post', ()=>{
    const url=`${environment.URLAPI}post/1/`

    let postSent:any|null;
  
    service.deletePost(1).subscribe((result)=>{
      postSent=result
    })

    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('DELETE')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('comment a post', ()=>{
    const url=`${environment.URLAPI}post/1/comment/`
    let postSent:any|null;
  
    service.commentPost(1,comment)?.subscribe((result)=>{
      postSent=result
    })

    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('POST')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('comment a undefined post', ()=>{
    const url=`${environment.URLAPI}post/1/comment/`
    let postSent:any|null=null;
    const postId=undefined;
  
    service.commentPost(postId,comment)?.subscribe((result)=>{
      postSent=result
    })
    let request=controller.expectNone(url)
    expect(postSent).toEqual(null)
  })

  it('delete comment from a post', ()=>{
    const url=`${environment.URLAPI}post/1/comment/1/`
    let postSent:any|null;
  
    service.deleteCommentfromPost(1,1)?.subscribe((result)=>{
      postSent=result
    })

    let request=controller.expectOne(url)
    expect(request.request.method).toEqual('DELETE')
    expect(request.request.withCredentials).toBeTrue()
    request.flush(data)
    expect(postSent).toEqual(data)
  })

  it('delete comment from a undefined post', ()=>{
    const url=`${environment.URLAPI}post/1/comment/1`
    let postSent:any|null=null;
    const postId=undefined;
  
    service.deleteCommentfromPost(postId,1)?.subscribe((result)=>{
      postSent=result
    })
    controller.expectNone(url)
    expect(postSent).toEqual(null)
  })


});
