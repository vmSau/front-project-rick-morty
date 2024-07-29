import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [NgClass],
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() pagesInfo: any;
  @Output() skipPage = new EventEmitter();

  public currentPage: number = 1;
  numberOfpage: number[] = [0];
  maxPaginationLegth = 15;

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pagesInfo']) {
      const currentValue = changes['pagesInfo'].currentValue;
      let previousValue;
      if (changes['pagesInfo'].previousValue)
        previousValue = changes['pagesInfo'].previousValue;
      if (previousValue && currentValue.pages !== previousValue.pages) {
        this.addPagination();
      }
    }
  }

  ngOnInit(): void {
    if(this._route.queryParams)
    this._route.queryParams.subscribe((params) => {
      this.currentPage = Number(params['page']);
      this.changePage(this.currentPage, 'current') 

    });
  }

  addPagination() {
    if (this.pagesInfo && this.pagesInfo.pages < this.maxPaginationLegth) {
      this.numberOfpage = Array.from(
        { length: this.pagesInfo.pages },
        (v, k) => k + 1
      );
    } else {
      this.numberOfpage = Array.from(
        { length: this.maxPaginationLegth },
        (v, k) => k + 1
      );
    }
  }

  changePage(pageSelected: number, pagechange: 'next' | 'prev' | 'current') {
    this.skipPage.emit({ skip: pagechange, pageNumber: pageSelected });
    this.currentPage = pageSelected;
    this.updateRoute(pageSelected);
    switch (pagechange) {
      case 'next':
        if (pageSelected > this.maxPaginationLegth) {
          this.numberOfpage.shift();
          this.numberOfpage.push(
            this.numberOfpage[this.numberOfpage.length - 1] + 1
          );
        }
        break;
      case 'prev':
        if (pageSelected > this.maxPaginationLegth) {
          this.numberOfpage.pop();
          this.numberOfpage.unshift(this.numberOfpage[0] - 1);
        }
        break;
      case 'current':
        this.numberOfpage = this.generateRangePage(pageSelected);
        break;
      default:
        this.addPagination();
        break;
    }
  }

  generateRangePage(page: number): number[] {
    const previousValues: number[] = [];
    const nextValues: number[] = [];

    if (page > 7) {
      for (let i = page - 7; i < page; i++) {
        previousValues.push(i);
      }
    } else {
      for (let i = 1; i < page; i++) {
        previousValues.push(i);
      }
    }


    if (this.pagesInfo &&(this.pagesInfo.pages - page <= 8)) {
      for (let i = page + 1; i < this.pagesInfo.pages + 1; i++) {
        nextValues.push(i);
      }
    } else {
      for (let i = page + 1; i < page + 7; i++) {
        nextValues.push(i);
      }
    }

    return [...previousValues, page, ...nextValues];
  }

  updateRoute(pageNumber: number) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
