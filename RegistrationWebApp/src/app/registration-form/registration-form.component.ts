import {User} from '../user'
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../services/database.service';
import { AngularFirestore } from'angularfire2/firestore';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, FormGroup,FormControl, FormBuilder ,Validators,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent{
  private userTypes;
  private user : User;
  private userform: FormGroup;
  signUpError=false;

  ngOnInit() {
    this.validateForm()
  }

  constructor(public db : DatabaseService,private auth: AuthService, private router: Router){
    this.userTypes = ['תלמיד', 'מורה'];
    this.user = new User(false, this.userTypes[0]);
  }

    // register user to DB
  public registerUser(){
    if (this.userform.valid){
      this.signUpError=false;
      this.auth.emailSignUp(this.user.email,this.user.password)
      .catch(error => {
        if (error.code == 'auth/email-already-in-use') { // in case that email already in use
        alert("כתובת המייל כבר בשימוש באתר");
        this.signUpError=true;
        }
      })
    .then((res) => {
      if (this.signUpError==true)// condition to prevent error
        return;
      this.user.uid=res.uid;
      this.db.addUserToDB(this.user);
      this.router.navigate(['loginScreen'])
    })
  }
  else{ this.signUpError= true; }
  }

  public validateForm(){
    // Limitations on fields in the registration form
    this.userform = new FormGroup({
      'firstname': new FormControl(this.user.firstName, [
        //first name is required, must be in Hebrew, at least 2 letters.
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("[א-ת]+")
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
      'phone' : new FormControl("", [
        //phone number is required, must be 8-11 digits (only numbers).
        Validators.pattern("[0-9]*"),
        Validators.minLength(6),
      ]),
      'password' : new FormControl("", [
        //password is required, must at least 6 letters.
        Validators.minLength(6),
        Validators.required
      ]),
      'confimpassword' : new FormControl("", [
        //confim password is required, must be the same as password.
        Validators.required
        ]),
        'birthday' : new FormControl("", [
          //birthday is required
          Validators.required
          ]),
        'gender' : new FormControl("", [
          //gender is required
          Validators.required
          ])
    });
  }

  // gets - link the formControls to html
  get firstname() { return this.userform.get('firstname'); }
  get lastname() { return this.userform.get('lastname'); }
  get email() { return this.userform.get('email'); }
  get engfname() { return this.userform.get('engfname'); }
  get phone() { return this.userform.get('phone'); }
  get password() { return this.userform.get('password'); }
  get confimpassword() { return this.userform.get('confimpassword'); }
  get birthday() { return this.userform.get('birthday'); }
  get gender() { return this.userform.get('gender'); }



}

