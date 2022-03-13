import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';

  constructor(private route: Router, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  public login(){
    let body = {
      username: this.username,
      password: this.password
    }
    this.apiService.login(body).subscribe( res => {
      if (res.message){
        window.alert(res.message);
      }
      else {
        localStorage.setItem('User', JSON.stringify(res));
        this.route.navigate(['./home']);
      }
    })
  }

}
