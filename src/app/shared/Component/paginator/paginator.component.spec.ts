import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initItem, finalItem, and totalItem correctly', () => {
    component.initItem = 1;
    component.finalItem = 10;
    component.totalItem = 100;
    fixture.detectChanges();

    const pageInfo = debugElement.query(By.css('p')).nativeElement;
    expect(pageInfo.textContent).toContain('1-10 of 100');
  });

  it('should emit back event when back button is clicked', () => {
    spyOn(component.back, 'emit');

    component.previousPage = 'somePreviousPage';
    fixture.detectChanges();

    const backButton = debugElement.query(By.css('button')).nativeElement;
    backButton.click();
    expect(component.back.emit).toHaveBeenCalled();
  });

  it('should emit next event when next button is clicked', () => {
    spyOn(component.next, 'emit');

    component.nextPage = 'someNextPage';
    fixture.detectChanges();

    const nextButton = debugElement.queryAll(By.css('button'))[0].nativeElement;
    nextButton.click();
    expect(component.next.emit).toHaveBeenCalled();
  });

  it('should not show back button if previousPage is empty', () => {
    component.previousPage = '';
    fixture.detectChanges();

    const backButton = debugElement.query(By.css('.pr-3 button'));
    expect(backButton).toBeNull();
  });

  it('should not show next button if nextPage is empty', () => {
    component.nextPage = '';
    fixture.detectChanges();

    const nextButton = debugElement.query(By.css('.pl-3 button'));
    expect(nextButton).toBeNull();
  });
});