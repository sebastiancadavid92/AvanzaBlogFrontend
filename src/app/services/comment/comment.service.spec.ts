import { TestBed } from '@angular/core/testing';
import{environment} from '../../../environments/environment'
import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CommentService', () => {
  let service: CommentService;
  let controller:HttpTestingController;
  const id:number=1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[CommentService]
    });

    service = TestBed.inject(CommentService);
    controller= TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list comments', () => {
    let data=[{content:'comment1'},{content:'comment2'}]
    let response:any;
    const url=`${environment.URLAPI}comments/?post=1`
    service.listComments(id).subscribe((result)=>{
      response=result
    })

    let req=controller.expectOne(url)
    req.flush(data)
    expect(req.request.method).toEqual('GET')
    expect(req.request.withCredentials).toBeTrue()
    expect(response).toEqual(data)
  });

  it('should list comments by page', () => {
    let data=[{content:'comment1'},{content:'comment2'}]
    let response:any;
    const url=`${environment.URLAPI}comments/?post=1&page=1`
    service.listCommentsPage(url).subscribe((result)=>{
      response=result
    })

    let req=controller.expectOne(url)
    req.flush(data)
    expect(req.request.method).toEqual('GET')
    expect(req.request.withCredentials).toBeTrue()
    expect(response).toEqual(data)
  });



});
