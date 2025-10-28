import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ToastrModule
  ]
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoadingOverlay = false;
  showPassword = false;
  showSplash = true;
  showLogin = false;
  splashImage: string = '/img.png';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Choose a splash image from candidates (first that loads)
    this.pickSplashImage();

    // Keep splash visible for 1s before the shrink animation starts (animation is 2.5s)
    // Total visible time = 1s delay + 2.5s animation = 3500ms
    setTimeout(() => {
      this.showSplash = false;
      this.showLogin = true;
    }, 3500);
  }

  private pickSplashImage(): void {
    const candidates = ['/splash.png', '/img.png', '/splash1.png', '/assets/img.png'];
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        this.splashImage = '/img.png';
        return;
      }
      const url = candidates[idx++];
      const img = new Image();
      img.onload = () => { this.splashImage = url; };
      img.onerror = () => { tryNext(); };
      img.src = url;
    };
    tryNext();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoadingOverlay = true;

      const credentials = {
        email: this.loginForm.get('email')?.value ?? '',
        password: this.loginForm.get('password')?.value ?? ''
      };

      this.authService.login(credentials).subscribe({
        next: (res) => {
          this.authService.storeToken(res.token);
          this.authService.storeRefreshToken(res.refreshToken);

          const role = this.authService.getUserRole()!;
          this.toastr.success(`Welcome back! Role: ${role}`, 'Login Successful');

          setTimeout(() => {
            if (['admin', 'manager', 'staff'].includes(role)) {
              // Navigate to root so Layout loads and the default home animation child is shown
              this.router.navigate(['/']);
            } else {
              this.toastr.error('Unauthorized role detected.', 'Access Denied');
              this.router.navigate(['/login']);
            }

            this.loginForm.reset();
            this.isLoadingOverlay = false;
          }, 1500); // ⏳ Delay to show spinner
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Login failed. Try again.', 'Error');
          this.isLoadingOverlay = false;
        }
      });
    } else {
      this.toastr.error('Please correct the highlighted errors.', 'Validation Failed');
    }
  }

  handleRegisterClick(event: Event): void {
    event.preventDefault();
    this.toastr.info('Please login first to access registration.', 'Info');
  }

  get f() {
    return this.loginForm.controls;
  }
}
