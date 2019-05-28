import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  public displayWaitingMessage: boolean;
  public waitingMessage: string;
  
  constructor(
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.authService.logout();
    }
  }

  public LoginButtonClicked = (): void => {
    let dateNow = new Date();
    console.log('LogoutComponent LoginButtonClicked started at: ' + dateNow);

    this.waitingMessage = 'Logging in... Please wait';
    this.displayWaitingMessage = true;

    this.authService.login();

    dateNow = new Date();
    console.log('LogoutComponent LoginButtonClicked completed at: ' + dateNow);
  }
}