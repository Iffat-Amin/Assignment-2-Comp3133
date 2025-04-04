import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
// import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  success: string = '';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
  
    const { username, email, password } = this.registerForm.value;
  
    this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: { username, email, password }
    }).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
  
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 2-second delay before redirect
      },
      error: (err) => {
        this.error = err.message || 'Registration failed';
      }
    });
  }
}