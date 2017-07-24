import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-qc-results',
  templateUrl: './qc-results.component.html',
  styleUrls: ['./qc-results.component.css']
})
export class QcResultsComponent implements OnInit {
  commentsArray: any[];
  @Input()
taskId:string;

taskCommentsObservable: FirebaseListObservable<any[]>;
database:any;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase,private authService:AuthService, private auth: AngularFireAuth) { 
      this.database=db;
  }
inputsForm:FormGroup;
chat:string;
user:string;
  ngOnInit() {
  let user;
       this.auth.authState.subscribe((auth)=>{
          this.user= auth.email;
          this.setUser(auth.email)
       })

     this.inputsForm=this.fb.group({
       chat:this.chat
     });
          this.taskCommentsObservable=this.database.list(`${this.taskId}/comments`);
        this.taskCommentsObservable.subscribe((comment)=>{
          this.commentsArray=comment;
        });
  }
      setUser(user:string){
        this.user=user;
      }
submitComment(){
  console.log(this.chat)
 this.taskCommentsObservable.push({chat:this.chat});
}

}
