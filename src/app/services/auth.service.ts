import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private authState = new BehaviorSubject<boolean>(this.hasToken());

  isAdmin = new BehaviorSubject<boolean>(false);
  tokenAdmin: any;

  checkLoginStatus() {
    console.log("save token: " + this.getToken());
    this.authState.next(this.hasToken()); // ✅ Verifica si hay sesión activa
    if ( localStorage.getItem("token") == this.tokenAdmin ) {
      this.isAdmin.next(true);
    } else {
      this.isAdmin.next(false);
    }
  }

  constructor(private router: Router) {}

  saveToken(token: string) {
    console.log("save token: " + this.getToken());
    localStorage.setItem("token",token);
    this.authState.next(true);
  }

  saveTokenAdmin() {
    this.tokenAdmin = localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }

  isLoggedIn() {
    return this.authState;
  }

  isAdminLogged() {
    return this.isAdmin;
  }

  logout() {
    console.log("[logout] token = " + this.getToken()?.length);
    localStorage.removeItem("token");
    this.tokenAdmin = null;
    this.authState.next(false);
    this.isAdmin.next(false);
    this.router.navigate(['/admin/login']);
  }
}

