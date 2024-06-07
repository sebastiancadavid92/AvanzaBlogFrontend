import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpostComponent } from './bpost.component';

describe('BpostComponent', () => {
  let component: BpostComponent;
  let fixture: ComponentFixture<BpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
