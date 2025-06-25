import { AuthGuard } from './../../services/auth.guard';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

    isLoggedIn: boolean = false;
    isAdmin: boolean = false;

    constructor(public authService: AuthService, public authGuard: AuthGuard) {}

    ngOnInit() {
      this.authService.checkLoginStatus();
      this.authService.isLoggedIn().subscribe(status => {
        this.isLoggedIn = status;
      });
      this.authService.isAdminLogged().subscribe(status => {
        this.isAdmin = status;
      })
    }

    logout() {
      console.log("LOGOUT");
      this.authService.logout();
      this.isLoggedIn = false;
      window.location.reload();
    }

}
