import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  apiBaseUrl = 'https://localhost:44354/api'

  @Input() userName: string = ''
  @Input() userEmail: string = ''
  @Input() userId: string = ''
  notesCount: any

  @Output() closeProfile = new EventEmitter<boolean>()

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchNotesCount()
  }
  onClose() {
    this.closeProfile.emit(false)
  }

  fetchNotesCount() {
    this.http.get(`${this.apiBaseUrl}/notes/count/${this.userId}`).subscribe({
      next: (res) => {
        this.notesCount = res
      }
    })
  }
}
