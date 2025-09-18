import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardComponent, BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'memoryGame';
}
