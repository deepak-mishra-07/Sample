import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(public authService: Auth) {}
}
