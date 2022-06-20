import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host:string="https://localhost:8443";
  public authenticated: boolean;
  public authenticatedUser;
  private users=[
    {username:"admin", password:"1234",roles:['USER','ADMIN']},
    {username:"user1", password:"1234",roles:['USER']},
    {username:"user2", password:"1234",roles:['USER']}
  ]
  constructor() { }
  login(username:string,password:string){
    let user;
    this.users.forEach(u=>{
      if(u.username===username && u.password===password){
        user=u;
      }
    })
    if(user){
      this.authenticated=true;
      this.authenticatedUser=user;
      localStorage.setItem("authenticatedUser"/*authenticatedUser c'est auth token*/,btoa(JSON.stringify(this.authenticatedUser)));
    }
    else{
      this.authenticated=false;
    }
  }
  loadUser(){
    let user=localStorage.getItem('authenticatedUser');
    if(user){
      this.authenticatedUser=JSON.parse(atob(user));
      this.authenticated=true;
    }
  }
  isAdmin(){
    if(this.authenticatedUser){
      return this.authenticatedUser.roles.indexOf("ADMIN")>-1;
    }
    else return false;
  }
  isUser(){
    if(this.authenticatedUser){
      return this.authenticatedUser.roles.indexOf("USER")>-1;
    }
    else return false;
  }
  logout(){
    this.authenticated=false;
    this.authenticatedUser=undefined;
    localStorage.removeItem('authenticatedUser');
  }
}
