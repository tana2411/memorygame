import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card } from '../../Cart.model';
import { CommonModule } from '@angular/common';
import { interval, Subject, take, takeUntil } from 'rxjs';
import { GameService } from '../game.service';
@Component({
  standalone: true,
  selector: 'app-board',
  imports: [CardComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  isPlaying: boolean = false;

  cards: Card[] = [];
  selectedCards: Card[] = [];
  disabledDeck = false;
  totalPairs = 4;
  matchCount = 0;

  isVisible = false;
  result = '';
  resultBtn = '';
  currentScore: number = 0;

  timeLeft = 60;
  gameOver = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.currentScore = this.gameService.getScore();

    const savedPairs = localStorage.getItem('totalPairs');
    if (savedPairs) {
      this.totalPairs = +savedPairs;
    }
  }
  constructor(private gameService: GameService) {}
  isGameStarted() {
    this.isPlaying = true;
    this.startGame();
  }
  startGame(): void {
    this.shuffleCards();

    this.matchCount = 0;
    this.selectedCards = [];
    this.disabledDeck = false;
    this.timeLeft = 60;
    this.gameOver = false;
    this.isVisible = false;
    localStorage.setItem('totalPairs', this.totalPairs.toString());

    interval(1000)
      .pipe(take(this.timeLeft), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.timeLeft--;
          if (this.timeLeft === 0) {
            this.endGame(false);
          }
        },
      });
  }

  shuffleCards(): void {
    const base = Array.from({ length: this.totalPairs }, (_, i) => i + 1);
    let arr = base.concat(base).sort(() => Math.random() - 0.5);
    this.cards = arr.map((num, index) => ({
      id: index,
      image: `image/img-${num}.png`,
      flipped: false,
      matched: false,
    }));
  }

  onCardClick(card: Card): void {
    if (this.disabledDeck || card.flipped || card.matched) return;
    card.flipped = true;
    this.selectedCards.push(card);
    if (this.selectedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch(): void {
    this.disabledDeck = true;
    const [cardOne, cardTwo] = this.selectedCards;
    if (cardOne.image === cardTwo.image) {
      cardOne.matched = cardTwo.matched = true;
      this.matchCount++;
      this.returnTurn();
      if (this.matchCount === this.totalPairs) {
        this.endGame(true);
      }
    } else {
      setTimeout(() => {
        cardOne.flipped = false;
        cardTwo.flipped = false;
        this.returnTurn();
      }, 1000);
    }
  }

  returnTurn(): void {
    this.selectedCards = [];
    this.disabledDeck = false;
  }

  nextLevel(): void {
    this.startGame();
  }

  endGame(win: boolean): void {
    this.disabledDeck = false;
    this.gameOver = true;
    this.isVisible = true;
    this.destroy$.next();

    if (win) {
      this.gameService.addPoint(10);
      this.currentScore = this.gameService.getScore();
      this.result = ' Complete';
      this.totalPairs += 2;
      this.resultBtn = 'Next Level';
    } else {
      this.gameService.reset();
      this.currentScore = this.gameService.getScore();

      this.result = ' Out of time';
      this.totalPairs = 4;
      this.resultBtn = 'Retry';
    }
  }
}
