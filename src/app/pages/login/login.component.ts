import { GoogleAuthProvider } from '@angular/fire/auth';
import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  toastrService = inject(ToastrService);

  constructor(private router: Router, private authService: AuthService){
}

  handleSignInWithGoogle() {
    this.authService.signInWithGoogle().then( (result) => {
      const credintial = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;

      this.authService.addUserdata(user, null);
      this.authService.setCurrentUser(user);
      this.router.navigateByUrl('');
    })
  }
}
