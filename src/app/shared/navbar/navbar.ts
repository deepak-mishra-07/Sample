import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(
    public authService: Auth,
    private router: Router
  ) {}

  onSignout(): void {
    this.authService.signout();
    this.router.navigate(['/signin']);
  }
}
