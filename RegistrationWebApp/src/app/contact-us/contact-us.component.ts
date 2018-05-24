import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../services/message.service'
import { DatabaseService } from '../services/database.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;
  msg: Message;
  date: Date = new Date();
  today;

  constructor(private fb: FormBuilder,private msgService: MessageService,private cookieService: CookieService,
    public db: DatabaseService) {this.createForm();}

  ngOnInit() {
    this.db.loggedInUserUID = this.cookieService.get('User uid');
    this.db.loggedIn = this.cookieService.get('User login status');
  }

  createForm() { //this function build the form and check input validation
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {//this method take the user input and save the input in an object
    const {name, email, message} = this.form.value;
    const date = Date();
    const html = `
      <div>From: ${name}</div>
      <div>Email: <a href="mailto:${email}">${email}</a></div>
      <div>Date: ${date}</div>
      <div>Message: ${message}</div>
    `;//an html string so the admin could view the user's message detailes.
    let formRequest = { name, email, message, date, html };
    this.today = this.date.getDate().toString()+"/"+(this.date.getMonth()+1).toString()+"/"+this.date.getFullYear().toString();
    
    this.msg = new Message(name,message,this.today); 
    this.msgService.addMsgToUser(email,this.msg);
   // console.log(formRequest);
    this.form.reset();
  }//NOT FINISHED YET!!!--need to ask rony!


}


