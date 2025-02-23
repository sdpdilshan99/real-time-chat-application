import { Component, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  standalone:true
})
export class SearchInputComponent {
  @Output() search: EventEmitter<string> = new EventEmitter();

  handleSearch($event: any){
    this.search.emit($event.target.value);
  }
}
