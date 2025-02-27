import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  @Output() isSearchOnClick = new EventEmitter<boolean>()
  @Output() searchChange = new EventEmitter<string>()
  searchQuery: string = ''


  onSearchClick() {
    this.isSearchOnClick.emit(true)
  }
  onSearchChange() {
    this.searchChange.emit(this.searchQuery)
  }
}
