import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from "../dashboard/sidebar/sidebar";
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Navbar],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {}
