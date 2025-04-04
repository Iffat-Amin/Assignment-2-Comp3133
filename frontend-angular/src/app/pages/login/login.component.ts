import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    }).subscribe({
      next: (result: any) => {
        const token = result.data.login;
        if (token) {
          this.authService.setToken(token);
          this.router.navigate(['/employees']);
        } else {
          this.error = 'Invalid credentials';
        }
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
      }
    });
  }
}
