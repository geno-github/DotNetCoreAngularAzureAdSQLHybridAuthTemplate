import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public displayWaitingMessage: boolean;
  public waitingMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    const returnLink = this.route.snapshot.queryParams['returnLink'] || '/';

    if (this.authService.isAuthenticated) {
      // redirect
      if (returnLink) {
        if (returnLink == "/") {
          this.router.navigate(['/home']);
        }
        else {
          this.router.navigate([returnLink]);
        }
      }
      else {
        this.router.navigate(['/home']);
      }
    } else {
      this.authService.login();
    }
  }

  public LoginButtonClicked = (): void => {
    let dateNow = new Date();
    console.log('LoginComponent LoginButtonClicked started at: ' + dateNow);

    this.waitingMessage = 'Logging in... Please wait';
    this.displayWaitingMessage = true;

    this.authService.login();

    dateNow = new Date();
    console.log('LoginComponent LoginButtonClicked completed at: ' + dateNow);
  }
}