import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.scss'
})
export class AddNoteComponent {
  @Output() closeAddNote = new EventEmitter<Boolean>()
  onClose() {
    this.closeAddNote.emit(true)
  }
  onSaveNote() {

  }
}
