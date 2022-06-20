import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services/authentication.service';
import {Router} from '@angular/router';

declare var $ :any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthenticationService, 
    private router:Router) { }

  ngOnInit(): void {
    
  }
  onLogin(dataForm:any){
    this.authService.login(dataForm.username,dataForm.password);
    if(this.authService.authenticated){
      
      this.router.navigateByUrl('');
    }
  }
 openLoginModal(){
    this.showLoginForm();
    setTimeout(function(){
      // $(modal-selector).modal('show');
        $('#loginModal').modal('show');    
    }, 230);
    
}
 openRegisterModal(){
    this.showRegisterForm();
    setTimeout(function(){
      // $(modal-selector).modal('show');
        $('#loginModal').modal('show');    
    }, 230);
    
}
 showRegisterForm(){
  $('.loginBox').fadeOut('fast',function(){
      $('.registerBox').fadeIn('fast');
      $('.login-footer').fadeOut('fast',function(){
          $('.register-footer').fadeIn('fast');
      });
      $('.modal-title').html('Register with');
  }); 
  $('.error').removeClass('alert alert-danger').html('');
     
}
 showLoginForm(){
  $('#loginModal .registerBox').fadeOut('fast',function(){
      $('.loginBox').fadeIn('fast');
      $('.register-footer').fadeOut('fast',function(){
          $('.login-footer').fadeIn('fast');    
      });
      
      $('.modal-title').html('Login with');
  });       
   $('.error').removeClass('alert alert-danger').html(''); 
}
 loginAjax(){
  /*   Remove this comments when moving to server
  $.post( "/login", function( data ) {
          if(data == 1){
              window.location.replace("/home");            
          } else {
               shakeModal(); 
          }
      });
  */

/*   Simulate error message from the server   */
 if(this.authService.authenticated==false){
   this.shakeModal();
 }
}

 shakeModal(){
  $('#loginModal .modal-dialog').addClass('shake');
           $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
           $('input[type="password"]').val('');
           setTimeout( function(){ 
              $('#loginModal .modal-dialog').removeClass('shake'); 
  }, 1000 ); 
}
showEditor() {
  $("#EditModal").modal("show");
  $("#EditModal").appendTo("body");
}

ngOnDestroy(){
  $("body>#EditModal").remove();
}
 }
