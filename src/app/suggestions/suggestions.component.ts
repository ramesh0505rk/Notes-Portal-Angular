import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss'
})
export class SuggestionsComponent {
  @Input() searchTerm: string = ''
  suggestions: string[] = ['First', 'Second', 'Third', 'Test', 'New', 'Newest', 'First notes', 'Note']

  get filteredSuggestions(): string[] {
    return this.suggestions.filter(suggestion => {
      const match = suggestion.toLowerCase().includes(this.searchTerm.toLocaleLowerCase())
      // console.log(suggestion.toLowerCase().includes(this.searchTerm.toLocaleLowerCase()) + 'ramz')
      return match
    })
  }
}
