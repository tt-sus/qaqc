import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Task } from './task';
import { ProjectService } from '../home/project.service';
import { UserService } from '../home/user.service';
import { TasksTimelineComponent } from '../tasks-timeline/tasks-timeline.component';
import { ManagerService } from '../home/manager.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  projectArea: number;
  marketSector: string;
  projectCategory: any;
  user_short_before: string;
  loggedInUser: string;
  @ViewChild(TasksTimelineComponent) timelineCmp: TasksTimelineComponent;
  projectManager: any;
  project_name: any;
  projectClient: any;
  project_number: any;
  projectID: any;
  taskref: any;
  user_key: string;
  projectStatus: string;
  dateInvalid: boolean = false;
  isManager: string;
  query_id: any;
  timelineToShow: any;
  projectId: number;
  database: any;
  projectToShow;
  sub: any;
  id: any;
  inputsForm: FormGroup;
  taskListObs: FirebaseListObservable<any[]>;
  userList: Observable<any[]>;
  taskList: any[] = [];
  userArray = [];
  scope:string;
  todayDate: Date;
  
  constructor(
    private location: Location,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private managerService: ManagerService
  ) {

    this.isManager = "false";
    const today = new Date();
    this.todayDate = today;

  }
  //modelling inputs
  categoryType: string;
  assigned_to = { $key: "", imageUrl: "", user_name: "", short_name: "" }
  taskObj = {
    taskName: "",
    categoryType: "",
    assigned_to: "",
    startDate: new Date(),
    dueDate: new Date(),
    details: "",
    hours: 0,
    status: false,
    user_short: "",
    scope:this.scope,
    imageUrl: this.assigned_to.imageUrl,
  }
  clean() {
    this.assigned_to = { $key: "", imageUrl: "", user_name: "", short_name: "" }
    this.categoryType = null;
    this.taskObj = {
      taskName: "",
      categoryType: null,
      assigned_to: "",
      startDate: this.todayDate,
      dueDate: null,
      details: "",
      hours: 0,
      status: false,
      imageUrl: "",
      user_short: "",
      scope:""
    }
  }
  categoryArray: Array<Object> = [
    { num: 0, name: "Task" },
    { num: 1, name: "Milestone" }
  ];
  calStatus(date: Date, complete: boolean) {
    if (complete) {
      return "Completed";
    }else{
      let dueDate = new Date(date).getTime();
      let currentDate = new Date().getTime();
      let subTime = dueDate - currentDate;

      if (subTime < 0) {
        return "Missed Deadline";
      }
      else if (subTime <= (86400*1000*2)) {
        return "Approaching Deadline";
      }else{
        return "In Progress";
      }
    }
  }
  toNumber() {
    this.taskObj.categoryType = this.categoryType
  }
  toNumberUsers() {

    this.taskObj.assigned_to = this.assigned_to.user_name;
    this.taskObj.imageUrl = this.assigned_to.imageUrl;
  }
  timeline_key: "";
  onComplete(bool) {
    this.projectService.updateProjectStatus(this.projectID, bool);
  }
  projectHours:number=0;
  projectHoursLeft:number=0;
  ngOnInit() {
    let m= localStorage.getItem("manager");
    this.isManager=`${m}`;
    this.sub = this.route.params.subscribe(params => {
      this.projectID = params['id'];
      this.user_key = params['user'];
    });
    this.managerService.loggedInUser()
      .subscribe(user=>{
        let $pos = user.email.indexOf('@');
        let shortEmail=user.email.substr(0, $pos);
       this.loggedInUser=shortEmail;
      }
    )
    let timelineInfo = this.projectService.getTimelineInfo(this.projectID);
    timelineInfo.subscribe((info) => {
      this.project_number = info.project_number;
      this.projectClient = info.client;
      this.project_name = info.project_name;
      this.projectManager = info.manager;
      this.projectCategory = info.category;
      this.marketSector = info.market_sector;
      this.projectArea = info.area
    })
    this.userList = this.userService.getUsers()
      .map(users=>users.sort((a: any, b: any) => {
        if (a.user_name < b.user_name) {
          return -1;
        } else if (a.user_name > b.user_name) {
          return 1;
        } else {
          return 0;
        }
      }))
     this.taskObj.startDate.setDate(new Date().getDate())
    let projectTasksObs = this.projectService.getTimeline(this.projectID);

    projectTasksObs.subscribe(tasks => {
      this.taskList = tasks;
      this.globalTasks = tasks;
      this.custom(this.globalTasks)
      this.globalTasks.forEach(task=>{
        this.projectHours  = this.projectHours+ task.hours; 
        if (!task.status) {
          this.projectHoursLeft = this.projectHoursLeft + task.hours;
        }
      })
    })
    this.inputsForm = this.fb.group({
      taskName: [this.taskObj.taskName],
      categoryType: [this.taskObj.categoryType],
      assigned_to: [this.taskObj.assigned_to],
      startDate: [this.taskObj.startDate],
      dueDate: [this.taskObj.dueDate],
      details: [this.taskObj.details],
      hours: [this.taskObj.hours],
      status: [this.taskObj.status],
      scope:[this.scope]
      
    })
    this.scopeFilter='allScopes';
    if (!this.taskObj.status) {
      this.projectStatus = "In Progress";
    }
    else if (this.taskObj.status) {
      this.projectStatus = "Completed";
    }
    this.authService.user.subscribe((val => { this.routeThis(val) }));

  }
  tagUser(){

    this.projectService.tagUser(this.projectID,this.taskId,this.assigned_to.short_name,this.taskObj.taskName,this.taskObj.dueDate,this.projectManager,false);
  }
  routeThis(val) {
    if (!val)
      this.router.navigate([""])
  }
  checkDate() {
    if (new Date(this.taskObj.dueDate).getTime() - new Date(this.taskObj.startDate).getTime() < 0) {
      this.dateInvalid = true;
    }
    else {
      this.dateInvalid = false;
    }
  }
  //end
  taskCategory = [];
  MilestoneCategory = [];
  globalTasks = [];
  filter:string;
  filterTaskCategory() {
    this.filter="task";
    this.taskList = this.globalTasks.filter((task) => {
      return task.categoryType === "Task";
    });
    this.timelineCmp.filterTaskCategory();
  }
  filterMilestoneCategory() {
    this.filter="milestone";
    this.taskList = this.globalTasks.filter((task) => {
      return task.categoryType === "Milestone";
    });
    this.timelineCmp.filterMilestoneCategory();
  }

  filterInProcressCategory() {
    this.taskList = this.globalTasks.filter((task) => {
      return task.status === false;
    })
  }

  filterFinishedCategory() {
    this.taskList = this.globalTasks.filter((task) => {
      return task.status === true;

    })
  }

  showMine() {
    //todo
  }

  showAll() {
    this.filter="all"
    this.taskList = this.globalTasks;
    this.timelineCmp.showAll();
  }
  custom(array: any) {
    let userArray;
    this.userList.subscribe((users) => {
      userArray = users;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < userArray.length; j++) {
          if (this.taskList[i].assigned_to === userArray[j].user_name) {
            this.taskList[i].assigned_to = userArray[j].user_name
            this.taskList[i].imageUrl = userArray[j].imageUrl;
          }
        }
      }
    })

  }
  //true is latest dates at top/ false is latest dates at bottom
  sortUp: boolean = false;
  sortTasks() {
    this.sortUp = !this.sortUp;
    if (this.sortUp) {
      this.taskList = this.taskList.sort((a, b) => {
        return -new Date(a.dueDate).getTime() + new Date(b.dueDate).getTime();
      });
    }
    else if (!this.sortUp) {
      this.taskList = this.taskList.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
    }
  }
  addTask() {
    this.edit = false;
    let task_key = this.projectService.addTasks({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: false,
      imageUrl: this.taskObj.imageUrl,
      user_short: this.assigned_to.short_name,
      scope:this.scope,      
      qc1: {},
      qc2: {},
      comments: {}
    });
    if(this.assigned_to.short_name!=this.loggedInUser){
      this.projectService.addTasksForMe(this.assigned_to.short_name,this.projectID,this.project_name,task_key,this.taskObj.dueDate,this.taskObj.taskName,this.taskObj.categoryType)      
    }
    this.inputsForm.reset();
    this.sortUp = true;
    this.timelineCmp.destroy();
    this.timelineCmp.getTasks();
    this.timelineCmp.drawTimeline();
  }
  resetForm() {
    this.assigned_to = { $key: "", imageUrl: "", user_name: this.taskObj.assigned_to, short_name: "" }
    this.taskObj = {
      taskName: "",
      categoryType: "",
      assigned_to: "",
      startDate: new Date(),
      dueDate: new Date(),
      details: "",
      hours: 0,
      status: false,
      imageUrl: this.assigned_to.imageUrl,
      user_short: "",
      scope:""
    }

  }
  taskId: any;
  edit: boolean = false;
  getTask(taskKey) {
    this.edit = true;
    this.taskId = taskKey;
    let taskToget;
    let taskToGetObs = this.projectService.getTask(taskKey, this.projectID);
    taskToGetObs.subscribe((task) => {
      this.taskObj = task;
      this.categoryType = task.categoryType;
      this.assigned_to.user_name = task.assigned_to;
      this.assigned_to.short_name = task.user_short;
      this.scope=task.scope
    })
    this.user_short_before = this.taskObj.user_short;

  }
  editTask() {
    this.projectService.editTask({
      taskName: this.taskObj.taskName,
      categoryType: this.taskObj.categoryType,
      assigned_to: this.taskObj.assigned_to,
      startDate: this.taskObj.startDate,
      dueDate: this.taskObj.dueDate,
      details: this.taskObj.details,
      hours: this.taskObj.hours,
      status: this.taskObj.status,
      imageUrl: this.taskObj.imageUrl,
      user_short: this.assigned_to.short_name,
      scope:this.scope,
    });
    this.projectService.editNotification({
      due_date: this.taskObj.dueDate, manager: this.projectManager,type:true, project_id: this.projectID, task_id: this.taskId, task_name: this.taskObj.taskName
    }, this.taskObj.user_short, this.taskId)
    if (this.isManager) {
      this.projectService.editTasksForMe(
        this.user_short_before,
        this.taskObj.user_short,
        this.projectID,
        this.project_name,
        this.taskId,
        this.taskObj.dueDate,
        this.taskObj.taskName,
        this.taskObj.categoryType)
    }
    this.sortUp = true;
    this.timelineCmp.destroy();
    this.timelineCmp.getTasks();
    this.timelineCmp.drawTimeline();
  }
  deleteTask() {
    this.projectService.deleteTasksForMe(this.taskObj.user_short, this.taskId, this.projectID);
    this.projectService.deleteTask(this.taskObj.user_short);

    this.sortUp = true;
    this.timelineCmp.destroy();
    this.timelineCmp.getTasks();
    this.timelineCmp.drawTimeline();
  }
  userTasks() {
    this.filter="mytask"
    this.taskList = this.globalTasks.filter((task) => {
      return task.user_short === this.loggedInUser;
    });
    this.timelineCmp.filterMyTaskCategory(this.loggedInUser);
  }
  scopeFilter:string;
  filterByScope(){
   
    if(this.scopeFilter==='allScopes'){
      this.taskList = this.globalTasks;
      this.timelineCmp.showAll();
    }
    else{
      this.taskList = this.globalTasks.filter((task) => {
        return task.scope === this.scopeFilter;
      });
      this.timelineCmp.filterByScope(this.scopeFilter);
    }
    
  }
}