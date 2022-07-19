import { Component, OnInit } from '@angular/core';
import State from "src/app/State.json"
import Cities from "src/app/City.json"
import SD from "src/app/SD.json"
import { Router } from '@angular/router';
import axios from 'axios'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  State: any;
  StatesDistrict: any;
  StateFilter: any;
  CityFilter: any;
  District: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // sessionStorage.setItem("State", JSON.stringify(State));
    // sessionStorage.setItem("Cities", JSON.stringify(Cities));
    // sessionStorage.setItem("StatesDistrict", JSON.stringify(SD));
    // this.State = JSON.parse(sessionStorage.getItem("State"));
    axios.get('http://demo.armscert.com/api/Pensioner/GetState').then((response)=>{
//console.log(response.data)
this.State=response.data;
//console.log(this.State)
    }).catch((err)=>{
//console.log(err)
    })
    axios.get('http://demo.armscert.com/api/Pensioner/GetDistrict').then((response)=>{
//console.log(response)
this.District=response.data;
//console.log(this.State)
    }).catch((err)=>{
//console.log(err)
    })
   
    this.StatesDistrict = JSON.parse(sessionStorage.getItem("StatesDistrict"));
   
  }
  onChangeState(value)
  {
    this.State=value;
    // for (let index = 0; index < this.StatesDistrict[0].states.length; index++) {
    //  if(this.StatesDistrict[0].states[index].state===value)
    //  {
    //   this.District=this.StatesDistrict[0].states[index].districts
    //  }
     
      
    // }
    // //console.log(this.District)
  }
  onChangeCity(value)
  {
    this.CityFilter=value;
  }
  naviagte(){
    
    
    axios.get(`http://demo.armscert.com/api/Pensioner/GetPensionerByStateDistrict?State=${this.State}&District=${this.CityFilter}`).then((response) => {

      response.data.length === 0?alert("Nothing Found"):(sessionStorage.setItem("PData",JSON.stringify(response.data)))
      if(response.data.length>0){
        this.router.navigateByUrl('/dashboard');
      }
    }).catch((error) => {
//console.log(error)
    })
    // this.router.navigateByUrl('/register');
  }
}
