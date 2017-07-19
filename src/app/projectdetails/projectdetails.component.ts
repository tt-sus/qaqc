import { Component, OnInit } from '@angular/core';
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
       console.log(this.id + "from details")
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
        console.log(this.taskList)
  }
     getTimeline(id){
      this.query_id=id;
      this.database.object('projecttimeline/'+this.query_id).subscribe((res)=>{
        this.timelineToShow=res;
        console.log(this.timelineToShow)
        this.timeline_key=this.timelineToShow.$key;
        this.taskListObs=this.database.list(`projecttimeline/${this.timeline_key}/tasks`)
        this.taskListObs.subscribe(res => {
        this.taskList=res;
        console.log(this.taskList)
         })
      });

     }
addTask(){
<<<<<<< HEAD
 
 
=======
  this.edit=false;
>>>>>>> 04f3a36d4b355a59a01bce9bdfd12ec019c2b66d
  this.taskListObs.push({
    task_name:this.taskName,
    category:this.category,
    assigned_to:this.assigned_to,
    start_date:this.startDate,
    due_date:this.dueDate
  })
  console.log(this.taskList);
<<<<<<< HEAD
  // this.database.object('projecttimeline/'+this.query_id).push({
  //   task:{
  //     task_name:this.taskName,
  //     category:this.category,
  //     assigned_to:this.assigned_to,
  //     start_date:this.startDate,
  //     due_date:this.dueDate
  //   }
   
  // });

  //  let link=`/projecttimeline/${this.id}/task`;
  //       console.log("/projecttimeline/-KpLe55CoJZxGK-1DT2b/task")
  //       console.log(link)
  //            this.TaskListObs = this.db.list(link)
  //               this.TaskListObs.subscribe(res=>{
  //                console.log(res)
  //                this.taskList=res;
  //                console.log("it is")
  //                console.log(this.taskList)
  //              })
=======
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
>>>>>>> 04f3a36d4b355a59a01bce9bdfd12ec019c2b66d
}

}
