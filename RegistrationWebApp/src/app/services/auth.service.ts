import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app'
import '@firebase/auth'
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as firebase2 from 'firebase';

@Injectable()
export class AuthService {
  currentUser: firebase.User = null; //a variable that hold the current loggeed in user data.
  emailError = false;//this variable handle errors.
  secondaryApp;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
  }

  signIn(email, password) //this method allow to an registered user to login.
  {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  emailSignUp(email: string, password: string, isManager: boolean) //this method allows user to signup to the web-app with provided email and password.
  {
    if (isManager) {
      if (this.secondaryApp == undefined) {
        this.secondaryApp = firebase2.initializeApp(environment.firebase, "Secondary");
      }

      return this.secondaryApp.auth().createUserWithEmailAndPassword(email, password);
    } else {
      return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
    }
  }

  resetPassword(email: string) //this method allow an registered user to reset his password
  {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)//this line send email to the user email address.
      .catch(error => {
        if (error.code == 'auth/user-not-found') { // in case that email not found in firebase server.
          this.emailError = true
        }
        else
          this.emailError = true //email valitation.
      })
  }

  isLoggedIn() // this method return true in case the user is logged in, and false otherwise
  {
    if (this.currentUser == null)
      return false;
    else
      return true;
  }

  LogOut() //this method allow a register user to logout from the website.
  {
    this._firebaseAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['loginScreen'])
      })
      .catch((err) =>
        console.log(err + "")
      );
  }

}
