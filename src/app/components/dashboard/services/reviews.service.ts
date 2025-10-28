import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Review { name:string; role:string; statement:string; stars:number; photo:string }

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor() {}

  getReviews(): Observable<Review[]>{
    // static sample data; replace with HTTP call to fetch real reviews
    const data: Review[] = [
      { name:'Priya R.', role:'Store Manager', statement:'ShelfSense cut our stockouts by 40% within the first month. Simple, reliable and fast.', stars:5, photo:'assets/img.png' },
      { name:'Miguel L.', role:'Operations', statement:'Automated alerts keep our shelves full — the team loves the quick actions.', stars:4, photo:'assets/img.png' },
      { name:'Asha K.', role:'Inventory Lead', statement:'Easy to adopt and powerful reporting. Great support from the team.', stars:4, photo:'assets/img.png' }
    ];
    return of(data);
  }
}
