import { User } from '../user'
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  userTypes; //array of user types
  user: User; // User Object - Contains all fields. Will be uploaded as a Jason object to server
  userform: FormGroup; // tracks the value and validity state of a group of FormControl
  signUpError: boolean; //if true -> there is an error in the registration form
  userPasswordValidation : string; // will contain the password verification

  ngOnInit() {
    this.validateForm()
  }

  constructor(public db: DatabaseService, public auth: AuthService, public router: Router) {
    this.userTypes = ['תלמיד', 'מורה'];
    this.user = new User(false, this.userTypes[0]); //deafult type is student
    this.signUpError=false; // default- no registration form errors
  }

  // add new user to Database
  public registerUser() {
    if (this.user.type === 'מורה') { // in case its teacher--> birthday is not required
      this.userform.get('birthday').clearValidators();
      this.userform.get('birthday').updateValueAndValidity(); //now teacher can register
    }
    if (!this.validatePassword()) { // condition to prevent confirm password
      this.signUpError = true;
      alert("אימות הסיסמא אינו זהה לסיסמא המקורית");
      return;
    }
    if (this.userform.valid) { // no validate errors
      this.signUpError = false;
      this.auth.emailSignUp(this.user.email, this.user.password) // sign up User
        .catch(error => {
          this.signUpError = true;
          if (error.code == 'auth/email-already-in-use') { // in case that email already in use
            alert("כתובת המייל כבר בשימוש באתר. נא התחבר או השתמש בכתובת מייל אחרת");// error message
          }
          else { alert("כתובת דואר אלקטרוני אינה תקינה") }
        })
        .then((res) => {
          if (this.signUpError == true)// condition to prevent error
            return;
          //successfully registered:
          this.user.uid = res.uid; // sets the uid value in the attribute
          this.db.addUserToDB(this.user); // add user to database
          this.router.navigate(['loginScreen'])// go to the login screen
        })
    }
    else { // validate error
      this.signUpError = true;
    }
  }

  public validateForm() {
    // Limitations on fields in the registration form
    this.userform = new FormGroup({
      'firstname': new FormControl(this.user.firstName, [
        //first name is required, must be in Hebrew, at least 2 letters.
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("[א-ת ]+")
      ]),
      'lastname': new FormControl(this.user.lastName, [
        //last name is required, must be in Hebrew, at least 2 letters.
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("[א-ת ]+")
      ]),
      'email': new FormControl(this.user.email, [
        //Email is required, must be in email format
        Validators.required,
        Validators.email
      ]),
      'engfname': new FormControl(this.user.engFname, [
        //English First Name. Must have only English letters
        Validators.pattern("[a-zA-Z ]*")
      ]),
      'englname': new FormControl(this.user.engFname, [
        //English First Name. Must have only English letters
        Validators.pattern("[a-zA-Z ]*")
      ]),
      'phone': new FormControl("", [
        //phone number is required, must be 9-13 digits (only numbers).
        Validators.pattern("[0-9-]*"),
        Validators.minLength(9),
        Validators.maxLength(13)
      ]),
      'password': new FormControl("", [
        //password is required, must at least 6 letters.
        Validators.minLength(6),
        Validators.required
      ]),
      'confimpassword': new FormControl("", [
        //confim password is required, (must be the same as password - implements in another function).
        Validators.required
      ]),
      'birthday': new FormControl("", [
        //birthday is required
        Validators.required
      ]),
      'gender': new FormControl("", [
        //gender is required
        Validators.required
      ])
    });
  }

  //function to display fields from student or teacher registration
  public isUserStudent() {
    if (this.user.type == 'מורה')
      return false;
    else
      return true;
  }

  //check if a field is empty
  public CheckIfEmptyField(field: string) {
    if (field == '')
      return true; // field is empty
    else
      return false;
  }

  // compares the password field to the password verification field
  public validatePassword() {
    if (this.user.password == this.userPasswordValidation)
      return true; // Password is verified
    return false;
  }

  // gets - link the formControls to html
  get firstname() { return this.userform.get('firstname'); }
  get lastname() { return this.userform.get('lastname'); }
  get email() { return this.userform.get('email'); }
  get engfname() { return this.userform.get('engfname'); }
  get englname() { return this.userform.get('englname'); }
  get phone() { return this.userform.get('phone'); }
  get password() { return this.userform.get('password'); }
  get confimpassword() { return this.userform.get('confimpassword'); }
  get birthday() { return this.userform.get('birthday'); }
  get gender() { return this.userform.get('gender'); }
}

