import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  reviews = [
    { name: 'Alice', role: 'Store Manager', statement: 'Amazing experience! Reduced stockouts and improved shelf clarity.', stars: 5, photo: '/splash.png' },
    { name: 'Bob', role: 'Operations', statement: 'Loved the UI and flow. Team adapted in days.', stars: 4, photo: '/splash.png' },
    { name: 'Charlie', role: 'Inventory Lead', statement: 'Very intuitive and clean.', stars: 5, photo: '/splash.png' },
    { name: 'Diana', role: 'Floor Supervisor', statement: 'Great onboarding and fast results!', stars: 4, photo: '/splash.png' }
  ];
  splashImage: string = '/img.png';
  active = 0;
  private intervalId: any;

  ngOnInit(): void {
    // auto-advance every 4 seconds
    this.intervalId = setInterval(() => this.next(), 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  prev(): void {
    if (!this.reviews.length) return;
    this.active = (this.active - 1 + this.reviews.length) % this.reviews.length;
  }

  next(): void {
    if (!this.reviews.length) return;
    this.active = (this.active + 1) % this.reviews.length;
  }

  go(i: number): void {
    if (i >= 0 && i < this.reviews.length) this.active = i;
  }
}
