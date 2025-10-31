import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-category-voice',
  templateUrl: './category-voice.html',
  styleUrls: ['./category-voice.css'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  standalone: true
})
export class CategoryVoiceComponent {
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder, private categoryService:CategoryService ) {
    this.categoryForm = this.fb.group({
      name: [''],
      description: [''],
      includeImage: [false]
    });
  }

  startVoiceInput() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.parseVoiceCommand(transcript);
    };

    recognition.start();
  }

  parseVoiceCommand(transcript: string) {
    const nameMatch = transcript.match(/category called (\w+)/);
    const descMatch = transcript.match(/description is (.+?)(?:\.|$)/);
    const imageMatch = transcript.includes('no image') ? false : transcript.includes('image');

    if (nameMatch) this.categoryForm.patchValue({ name: nameMatch[1] });
    if (descMatch) this.categoryForm.patchValue({ description: descMatch[1] });
    this.categoryForm.patchValue({ includeImage: imageMatch });
  }

  submitCategory() {
    const form = this.categoryForm.value;
    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.includeImage ? 'https://yourcdn.com/default.jpg' : null
    };

    this.categoryService.createCategory(payload).subscribe(() => {
      alert('Category created!');
      this.categoryForm.reset();
    });
  }
}
