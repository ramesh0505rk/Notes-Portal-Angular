import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotesService } from '../Services/notes.service';

interface Note {
  title: string;
}

interface NotesResponse {
  data: {
    noteTitles: Note[];
  };
}

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.scss'
})
export class SuggestionsComponent {
  private _userId = ''
  @Input()
  set userId(value: string) {
    if (value && value !== this._userId) {
      this._userId = value;
      this.fetchSuggestions();
    }
  }

  get userId(): string {
    return this._userId;
  }

  @Input() searchTerm: string = ''
  suggestions: string[] = []

  constructor(private notesService: NotesService) { }

  fetchSuggestions() {
    try {
      this.notesService.getNoteTitle(this.userId).subscribe((result: NotesResponse) => {
        this.suggestions = result.data.noteTitles.map(note => note.title)
      })
    }
    catch (e) {
      console.error(e)
    }
  }

  get filteredSuggestions(): string[] {
    return this.suggestions.filter(suggestion => {
      const match = suggestion.toLowerCase().includes(this.searchTerm.toLocaleLowerCase())
      return match
    })
  }
}
