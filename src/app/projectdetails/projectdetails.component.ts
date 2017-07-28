import { Component, OnInit,Input  } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  projectStatus: string;
  dateInvalid: boolean = false;
  isManager: string;
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
              private fb: FormBuilder,
              private router:Router
            ) { 
           
              this.database=db;
             this.isManager="false";
              }
//modelling inputs
  categoryType:string;
taskObj={
taskName:"",
categoryType:this.categoryType,
assigned_to:"",
startDate:new Date(),
dueDate:new Date(),
details:"",
hours:0,
status:false
}
timeline_key:"";
goToProjects(){
  this.router.navigate(['home']);
}
  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isManager = params['manager'];
     
    });  
  
 
   this.database.object('projects/'+this.id ).subscribe((res)=>{
         this.projectToShow=res;
         this.getTimeline(this.projectToShow.timeline_key)
      });  
        
       
        this.inputsForm=this.fb.group({
          taskName:[this.taskObj.taskName],
          categoryType:[this.taskObj.categoryType],
          assigned_to:[this.taskObj.assigned_to],
          startDate:[this.taskObj.startDate],
          dueDate:[this.taskObj.dueDate],
          details:[this.taskObj.details],
          hours:[this.taskObj.hours],
          status:[this.taskObj.status]
        })
       if(!this.taskObj.status){
         this.projectStatus="In Progress";
       }
        else if(this.taskObj.status){
           this.projectStatus="Completed";
        }
  }
  
// category
checkDate(){
  if(new Date(this.taskObj.dueDate).getTime() - new Date(this.taskObj.startDate).getTime()<0 ){
    this.dateInvalid=true;
  }
  else{
    this.dateInvalid=false;
  }
}
  categoryArray:Array<Object> = [
      {num: 0, name: "Task"},
      {num: 1, name: "Milestone"}
  ];
    toNumber(){
      console.log(this.categoryType)
      this.taskObj.categoryType=this.categoryType
    }
//end
  taskCategory=[];
  MilestoneCategory=[];
  globalTasks=[];
      filterTaskCategory(){
          this.taskList=this.globalTasks.filter((task)=>{
            return task.categoryType=== "Task";
          })

      }
      filterMilestoneCategory(){
        this.taskList=this.globalTasks.filter((task)=>{
          return task.categoryType==="Milestone";
        })
        }
       showAll(){
           this.taskList=this.globalTasks;
       }

     
     getTimeline(id){
      this.query_id=id;
      this.database.object('projecttimeline/'+this.query_id).subscribe((res)=>{
        this.timelineToShow=res;
       
        this.timeline_key=this.timelineToShow.$key;
        this.taskListObs=this.database.list(`projecttimeline/${this.timeline_key}/tasks`)
        this.taskListObs.subscribe(res => {
        this.taskList=res;
        this.globalTasks=res;
          this.sortTasks();
         })
      });
       
     }
    //true is latest dates at top/ false is latest dates at bottom
sortUp:boolean=false;
sortTasks(){
  this.sortUp=!this.sortUp;

  if(this.sortUp){
    
    this.taskList=this.taskList.sort((a,b)=> { 
    console.log(a);
    return -new Date(a.startDate).getTime() + new Date(b.startDate).getTime(); 
  });
  }
else if(!this.sortUp){
   this.taskList=this.taskList.sort((a,b)=> { 
    console.log(a);
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  })
}
}
addTask(){
  this.edit=false;
  this.taskListObs.push({
    taskName:this.taskObj.taskName,
          categoryType:this.taskObj.categoryType,
          assigned_to:this.taskObj.assigned_to,
          startDate:this.taskObj.startDate,
          dueDate:this.taskObj.dueDate,
          details:this.taskObj.details,
          hours:this.taskObj.hours,
          status:false,
    qaqc:[{task_name:this.taskObj.taskName}]
  })
  this.inputsForm.reset();
  this.sortUp=true;
  this.sortTasks();
}
resetForm(){
   this.inputsForm.reset();
}
taskId:any;
edit:boolean=false;
getTask(taskKey){
  this.edit=true;
  this.taskId=taskKey;
   let taskToget;
  let taskToGetObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
  taskToGetObs.subscribe((task)=>{
  this.taskObj=task;
  })
}
editTask(){
  let taskToEdit;
  let taskToEditObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
  taskToEditObs.subscribe(task=>{
  taskToEdit=task;
 });
 taskToEditObs.update({
    taskName:this.taskObj.taskName,
          categoryType:this.taskObj.categoryType,
          assigned_to:this.taskObj.assigned_to,
          startDate:this.taskObj.startDate,
          dueDate:this.taskObj.dueDate,
          details:this.taskObj.details,
          hours:this.taskObj.hours,
          status:this.taskObj.status
 });
  this.sortUp=true;
  this.sortTasks();
}
deleteTask(){
  alert();
  let taskToDelete;
  let taskToDeleteObs = this.database.object(`projecttimeline/${this.timeline_key}/tasks/${this.taskId}`);
  taskToDeleteObs.subscribe(task=>{
  taskToDelete=task;
 });
 taskToDeleteObs.remove();
 this.sortUp=true;
  this.sortTasks();
}

}