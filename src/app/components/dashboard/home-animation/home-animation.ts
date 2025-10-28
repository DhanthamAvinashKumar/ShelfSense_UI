import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from '../reviews/reviews';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-home-animation',
  standalone: true,
  imports: [CommonModule, ReviewsComponent],
  templateUrl: './home-animation.html',
  styleUrls: ['./home-animation.css']
})
export class HomeAnimation {
  constructor(private router: Router, private el: ElementRef) {}

  getStarted() {
    // navigate to product shelf as starting point
    this.router.navigate(['/product-Shelf']);
  }

  exploreFeatures() {
    const el = this.el.nativeElement.querySelector('.card-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
