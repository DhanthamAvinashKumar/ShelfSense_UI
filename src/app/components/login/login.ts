import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ToastrModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm;
  isLoadingOverlay = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoadingOverlay = true;

      const credentials = {
        email: this.loginForm.get('email')!.value!,
        password: this.loginForm.get('password')!.value!
      };

      this.authService.login(credentials).subscribe({
        next: (res) => {
          this.authService.storeToken(res.token);
          this.authService.storeRefreshToken(res.refreshToken);

          const role = this.authService.getUserRole()!;
          this.toastr.success(`Welcome back! Role: ${role}`, 'Login Successful');

          setTimeout(() => {
            if (['admin', 'manager', 'staff'].includes(role)) {
              this.router.navigate(['/landing']);
            } else {
              this.toastr.error('Unauthorized role detected.', 'Access Denied');
              this.router.navigate(['/login']);
            }

            this.loginForm.reset();
            this.isLoadingOverlay = false;
          }, 1000);
        },
        error: (err: { error: { message: any } }) => {
          this.toastr.error(err.error?.message || 'Login failed. Try again.', 'Error');
          this.isLoadingOverlay = false;
        }
      });
    } else {
      this.toastr.error('Please correct the highlighted errors.', 'Validation Failed');
    }
  }

  handleRegisterClick(event: Event): void {
  event.preventDefault(); // ⛔ Prevent default navigation
  this.toastr.info('Please login first to access registration.', 'Info');
}


  get f() {
    return this.loginForm.controls;
  }
}
