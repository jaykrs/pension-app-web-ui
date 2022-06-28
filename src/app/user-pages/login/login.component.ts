import { Component, OnInit } from '@angular/core';
import State from "src/app/State.json"
import Cities from "src/app/City.json"
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  State: any = [];
  City: any = [];
  constructor() { }

  ngOnInit() {
    sessionStorage.setItem("State", JSON.stringify(State));
        sessionStorage.setItem("Cities", JSON.stringify(Cities));
        this.State = JSON.parse(sessionStorage.getItem("State"));
        this.City = JSON.parse(sessionStorage.getItem("Cities"));
  }

}
