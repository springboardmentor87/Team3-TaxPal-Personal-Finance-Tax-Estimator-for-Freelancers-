import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:5000/api/auth';

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  signup(
    name: string,
    email: string,
    password: string,
    country: string
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/signup`,
      {
        name,
        email,
        password,
        country
      },
      {
        withCredentials: true
      }
    );
  }

  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    );
  }

  logout(): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }

  getCurrentUser(): Observable<AuthResponse> {

    return this.http.get<AuthResponse>(
      `${this.API_URL}/me`,
      {
        withCredentials: true
      }
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}