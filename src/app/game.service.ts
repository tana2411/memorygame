import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  getScore(): number {
    return Number(localStorage.getItem('score')) || 0;
  }
  addPoint(points: number = 1): void {
    const newScore = this.getScore() + points;
    localStorage.setItem('score', newScore.toString());
  }

  // reset điểm
  reset(): void {
    localStorage.removeItem('score');
  }
}
