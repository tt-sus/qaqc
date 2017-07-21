import { Component, OnInit,Input  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  query_id: any;
  timelineToShow: any;
  projectId: number;
  database:any;
  projectToShow;
  sub:any;
  id:any;
  inputsForm:FormGroup;
  taskListObs: FirebaseListObservable<any[]>;
  taskList:any[]=[];
  constructor(
              private location: Location,
              private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private fb: FormBuilder
            ) { 
                this.database=db;
           
              }
//modelling inputs
taskName:string;
category:string;
assigned_to:string;
startDate:Date;
dueDate:Date;
timeline_key:string;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
     
    });  
   this.database.object('projects/'+this.id ).subscribe((res)=>{
         this.projectToShow=res;
         this.getTimeline(this.projectToShow.timeline_key)
      });  
        
       
        this.inputsForm=this.fb.group({
          taskName:[this.taskName],
          category:[this.category],
          assigned_to:[this.assigned_to],
          startDate:[this.startDate],
          dueDate:[this.dueDate]
        })
      
  }
     getTimeline(id){
      this.query_id=id;
      this.database.object('projecttimeline/'+this.query_id).subscribe((res)=>{
        this.timelineToShow=res;
       
        this.timeline_key=this.timelineToShow.$key;
        this.taskListObs=this.database.list(`projecttimeline/${this.timeline_key}/tasks`)
        this.taskListObs.subscribe(res => {
        this.taskList=res;
       
         })
      });

     }
addTask(){
  this.edit=false;
  this.taskListObs.push({
    task_name:this.taskName,
    category:this.category,
    assigned_to:this.assigned_to,
    start_date:this.startDate,
    due_date:this.dueDate,
    qaqc:[{task_name:this.taskName}]
  })
 
}

taskId:any;
edit:boolean=false;
getTask(taskKey){
  this.edit=true;
  this.taskId=taskKey;
}
editTask(){
  let taskToEdit;
  let taskToEditObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
  taskToEditObs.subscribe(task=>{
  taskToEdit=task;
 });
 taskToEditObs.update({
    task_name:this.taskName,
    category:this.category,
    assigned_to:this.assigned_to,
    start_date:this.startDate,
    due_date:this.dueDate
 })
}
deleteTask(){
  let taskToDelete;
  let taskToDeleteObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
  taskToDeleteObs.subscribe(task=>{
  taskToDelete=task;
 });
 taskToDeleteObs.remove();
}

}