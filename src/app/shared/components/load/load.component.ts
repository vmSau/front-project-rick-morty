import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-load',
  standalone: true,
  imports: [ NgClass],
  templateUrl: './load.component.html',
})
export class LoadComponent implements OnInit {

  @Input() isLoading: boolean = false;
 
  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
  }

}
