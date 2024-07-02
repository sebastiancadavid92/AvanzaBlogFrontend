import { TestBed } from '@angular/core/testing';

import { LikeService } from './like.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import{environment} from '../../../environments/environment'
describe('LikeService', () => {
  let service: LikeService;
  let controller:HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[LikeService]
    });
    service = TestBed.inject(LikeService);
    controller=TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should list comments', () => {
    let data=[{content:'like1'},{content:'like2'}]
    let response:any;
    const url=`${environment.URLAPI}likes/?post=1&page=1`
    service.listLikes(1).subscribe((result)=>{
      response=result
    })

    let req=controller.expectOne(url)
    req.flush(data)
    expect(req.request.method).toEqual('GET')
    expect(req.request.withCredentials).toBeTrue()
    expect(response).toEqual(data)
  });

  it('should list comments by page', () => {
    let data=[{content:'like1'},{content:'like2'}]
     let response:any;
    const url=`${environment.URLAPI}likes/?post=1&page=1`
    service.listLikePage(url).subscribe((result)=>{
      response=result
    })

    let req=controller.expectOne(url)
    req.flush(data)
    expect(req.request.method).toEqual('GET')
    expect(req.request.withCredentials).toBeTrue()
    expect(response).toEqual(data)
  });
});
