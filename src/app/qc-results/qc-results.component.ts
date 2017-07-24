import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
  constructor(private fb:FormBuilder, private db: AngularFireDatabase) { 
      this.database=db;
  }
inputsForm:FormGroup;
chat:string;

  ngOnInit() {
     this.inputsForm=this.fb.group({
       chat:this.chat
     });
          this.taskCommentsObservable=this.database.list(`${this.taskId}/comments`);
        this.taskCommentsObservable.subscribe((comment)=>{
          this.commentsArray=comment;
        });
  }
submitComment(){
  console.log(this.chat)
 this.taskCommentsObservable.push({chat:this.chat});
}

}
