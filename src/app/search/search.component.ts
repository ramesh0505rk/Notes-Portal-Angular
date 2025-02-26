import { Component, EventEmitter, Output, output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  @Output() isSearchOnClick = new EventEmitter<boolean>()

  onSearchClick() {
    this.isSearchOnClick.emit(true)
    console.log(true)
  }
}
