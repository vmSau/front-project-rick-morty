import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pagination on init', () => {
    component.pagesInfo = { pages: 15 };
    component.ngOnInit();
    expect(component.numberOfpage.length).toBe(15);
  });

  it('should update pagination on input changes', () => {
    component.pagesInfo = { pages: 10 };
    component.ngOnInit();
    component.ngOnChanges({
      pagesInfo: new SimpleChange(null, { pages: 10 }, false),
    });
    expect(component.numberOfpage.length).toBe(10);

    component.pagesInfo = { pages: 20 };
    component.ngOnChanges({
      pagesInfo: new SimpleChange({ pages: 10 }, { pages: 20 }, false),
    });
    expect(component.numberOfpage.length).toBe(15);
  });

  it('should emit event and change page on changePage', () => {
    spyOn(component.skipPage, 'emit');
    component.pagesInfo = { pages: 30 };
    component.changePage(2, 'current');
    expect(component.skipPage.emit).toHaveBeenCalledWith({
      skip: 'current',
      pageNumber: 2,
    });
    expect(component.currentPage).toBe(2);
  });

  it('should change page to next page after arrow click', () => {
    expect(component.currentPage).toBe(1);
    component.pagesInfo = { pages: 30, next:"https://rickandmortyapi.com/api/character?page=2" };
    component.ngOnInit();

    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('#next')).nativeElement;
    expect(nextButton).not.toBeNull();
    nextButton.click();
    component.changePage(2, 'next');
    expect(component.currentPage).toBe(2);
    expect(component.numberOfpage.length).toBe(15);
    expect(component.numberOfpage.at(14)).toBe(15);
    
    fixture.detectChanges();
  });

  it('should change range to next page after arrow click', () => {
    component.pagesInfo = { pages: 15, next:"https://rickandmortyapi.com/api/character?page=11" };
    component.currentPage = 10;

    component.ngOnInit();
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('#next')).nativeElement;

    expect(nextButton).not.toBeNull();
    nextButton.click();
    component.changePage(16, 'next');
    expect(component.currentPage).toBe(16);
    expect(component.numberOfpage.length).toBe(15);
    expect(component.numberOfpage.at(0)).toBe(2);
    expect(component.numberOfpage.at(14)).toBe(16);
    
    fixture.detectChanges();
  });

  it('should change page to previous page after arrow click', () => {
    component.pagesInfo = { pages: 30, previous:"https://rickandmortyapi.com/api/character?page=1" };
    component.currentPage = 2;
    expect(component.pagesInfo.prev).not.toBeNull();
    
    component.ngOnInit();
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('#prev')).nativeElement;
    expect(prevButton).not.toBeNull();
    prevButton.click();

    component.changePage(1, 'prev');
    expect(component.currentPage).toBe(1);
    expect(component.numberOfpage.length).toBe(15);
    expect(component.numberOfpage.at(0)).toBe(1);
    
    fixture.detectChanges();
  });

  it('should change range to previous page after arrow click', () => {
    component.pagesInfo = { pages: 15, next:"https://rickandmortyapi.com/api/character?page=11" };
    component.currentPage = 10;

    component.ngOnInit();
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('#next')).nativeElement;

    expect(nextButton).not.toBeNull();
    nextButton.click();
    component.changePage(16, 'next');
    expect(component.currentPage).toBe(16);
    expect(component.numberOfpage.length).toBe(15);
    expect(component.numberOfpage.at(0)).toBe(2);
    expect(component.numberOfpage.at(14)).toBe(16);
    
    fixture.detectChanges();
  });

  it('should generate the correct range of pages', () => {
    component.pagesInfo = { pages: 30 };
    const range = component.generateRangePage(15);
    expect(range.length).toBeGreaterThan(1);
    expect(range.includes(15)).toBeTrue();
  });
});