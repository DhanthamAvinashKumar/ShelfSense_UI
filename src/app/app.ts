import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./components/dashboard/sidebar/sidebar";
import { CategoryVoiceComponent } from './category-voice/category-voice';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar,CategoryVoiceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ShelfSense_UI');
}
