import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpostlistComponent } from './bpostlist.component';

describe('BpostlistComponent', () => {
  let component: BpostlistComponent;
  let fixture: ComponentFixture<BpostlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpostlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BpostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
