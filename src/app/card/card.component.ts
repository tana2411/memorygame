import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../Cart.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() card!: Card;
  @Output() cardClicked = new EventEmitter<void>();

  onClick() {
    this.cardClicked.emit();
  }
}
