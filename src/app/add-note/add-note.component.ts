import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
export class AddNoteComponent implements OnInit {

  noteForm: FormGroup
  isAuthenticated: Boolean = false
  user: any
  userId: string = ''

  @Output() closeAddNote = new EventEmitter<Boolean>()

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

  onClose() {
    this.closeAddNote.emit(true)
  }
  onSaveNote() {
    const { title, content } = this.noteForm.value
    try {
      this.notesService.addNote(this.userId,title,content).subscribe(result=>{
        
      })
    }
    catch (e) {
      console.error(e)
    }
  }
}
