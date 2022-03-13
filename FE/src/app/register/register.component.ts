import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  password: string = '';
  repeatPassword: string = '';

  constructor(private route: Router, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  public register(){
    if (this.password !== this.repeatPassword) {
      window.alert('Repeat password was wrong')
    }
    else {
      let body = {
        username: this.username,
        password: this.password
      }
      this.apiService.register(body).subscribe( res => {
        if (res.message){
          window.alert(res.message);
        }
        else {
          window.alert('Register successfully');
          this.route.navigate(['./login']);
        }
      })
    }
  }

}
