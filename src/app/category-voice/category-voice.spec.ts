import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryVoice } from './category-voice';

describe('CategoryVoice', () => {
  let component: CategoryVoice;
  let fixture: ComponentFixture<CategoryVoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryVoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryVoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
