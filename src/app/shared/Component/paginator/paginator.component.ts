import { Component, EventEmitter,Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {

  @Input({required:true}) initItem:number=0;
  @Input({required:true}) finalItem:number=0;
  @Input({required:true}) totalItem:number=0;
  @Input({required:true}) nextPage:string='';
  @Input({required:true}) previousPage:string='';

  @Output() next= new EventEmitter();
  @Output() back=new EventEmitter();


  backHandler(){
    this.back.emit()

  }

  nextHandler(){
    this.next.emit()

  }

}
