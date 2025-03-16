import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotesService } from '../Services/notes.service';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.scss'
})
export class AddNoteComponent implements OnInit, OnChanges {

  noteForm: FormGroup
  isAuthenticated: Boolean = false
  user: any
  userId: string = ''

  @Input() title: string = ''
  @Input() content: string = ''
  @Input() noteId: any
  @Input() action: string = ''

  @Output() closeAddNote = new EventEmitter<Boolean>()
  @Output() noteSaved = new EventEmitter<Boolean>()

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth, private notesService: NotesService) {
    this.noteForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    })
  }
  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated()
    if (this.isAuthenticated) {
      this.user = await this.oktaAuth.getUser()
      this.userId = this.user.sub
    }
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['title'] || changes['content']) {
      this.noteForm.patchValue({
        title: this.title,
        content: this.content
      })
    }
  }

  onClose() {
    this.closeAddNote.emit(true)
  }
  onSaveNote() {
    const { title, content } = this.noteForm.value
    const escapedContent = content.replace(/\n/g, '\\n');
    try {
      this.notesService.addNote(this.userId, title, escapedContent).subscribe(result => {
        this.noteSaved.emit(true)
      })
    }
    catch (e) {
      console.error(e)
    }
  }
  onUpdateNote() {
    const { title, content } = this.noteForm.value
    const escapedContent = content.replace(/\n/g, '\\n');
    console.log(title, ' ', content, ' ', this.noteId)

    try {
      this.notesService.updateNote(this.noteId, title, escapedContent).subscribe(result => {
        console.log(result)
        this.noteSaved.emit(true)
      })
    }
    catch (e) {
      console.error(e)
    }
  }
}
