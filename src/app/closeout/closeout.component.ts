import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ProjectService } from '../home/project.service';
@Component({
  selector: 'app-closeout',
  templateUrl: './closeout.component.html',
  styleUrls: ['./closeout.component.css']
})
export class CloseoutComponent implements OnInit {
  @Output() onComplete = new EventEmitter<boolean>();
  @Input()
  isManager:string;
  @Input()
projectId:string;

database: AngularFireDatabase;
inputsForm:FormGroup;

  projectArray: any[];

  constructor(private fb:FormBuilder, private projectService:ProjectService) { 
  }
  closeOut:{
    projectBackground:string,
    contract:string,
    Information:string,
    Issues:string,
    Performance:string,
    Scope:string,
    Lessons:string,
    Business:string,
    PR:string,
    add:boolean
  }
   close(bool) {
    this.onComplete.emit(bool);
  }
  ngOnInit() {
    console.log(this.projectId)
    this.closeOut={
        projectBackground:"",
        contract:"",
        Information:"",
        Issues:"",
        Performance:"",
        Scope:"",
        Lessons:"",
        Business:"",
        PR:"",
        add:true
    }
 this.inputsForm=this.fb.group({
   projectBackground:this.closeOut.projectBackground,
   contract:this.closeOut.contract,
   Information:this.closeOut.Information,
   Issues:this.closeOut.Issues,
   Performance:this.closeOut.Performance,
   Scope:this.closeOut.Scope,
   Lessons:this.closeOut.Lessons,
   Business:this.closeOut.Business,
  PR:this.closeOut.PR,
  add:true
 })
 this.projectService.getCloseout(this.projectId)
   .subscribe((closeOut)=>{
    if(closeOut[Object.keys(closeOut)[0]]==null){
      this.closeOut=this.closeOut;
    }
    else{
      this.closeOut=closeOut;
    }
   })
  }
key="";
submitProjectCloseout(bool){
  this.projectService.closeProject(this.projectId,{
    projectBackground:this.closeOut.projectBackground,
    contract:this.closeOut.contract,
    Information:this.closeOut.Information,
    Issues:this.closeOut.Issues,
    Performance:this.closeOut.Performance,
    Scope:this.closeOut.Scope,
    Lessons:this.closeOut.Lessons,
    Business:this.closeOut.Business,
    PR:this.closeOut.PR,
    add:false
  })
this.close(bool);
}
reOpen(bool){
  this.close(bool);
}
editProjectCloseout(){
  this.projectService.editCloseOut(this.projectId,{
    projectBackground:this.closeOut.projectBackground,
    contract:this.closeOut.contract,
    Information:this.closeOut.Information,
    Issues:this.closeOut.Issues,
    Performance:this.closeOut.Performance,
    Scope:this.closeOut.Scope,
    Lessons:this.closeOut.Lessons,
    Business:this.closeOut.Business,
    PR:this.closeOut.PR,
    add:false
  })
}
}
