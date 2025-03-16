import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  @Output() closeHelp = new EventEmitter<boolean>()

  onClose() {
    this.closeHelp.emit(false)
  }
}
