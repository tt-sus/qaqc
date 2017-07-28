import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';

import * as _ from 'underscore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Project } from './project';
import { Manager } from './manager';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit   {
  dateInvalid: boolean;
  currentUser: string;

  projects:Observable<any>;
  projectTitles:Array<any>=[];
  items: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  timeline: FirebaseListObservable<any[]>;
  Managers:any[]=[];
  database:any;
  project_key:string;
  constructor(db: AngularFireDatabase,
              private pagerService: PagerService,
              public authService: AuthService,
              private router:Router,
              private fb:FormBuilder
              ) {
                  this.items = db.list('/projects')
                  this.items.subscribe(res=> {
                    this.projectTitles=res;
                    this.setPage(1);
                 });
                    this.timeline = db.list('/projecttimeline');
                    this.users = db.list('/users')
                    this.users.subscribe(res=> {
                  
                    this.Managers=res;

                      this.checkManager(this.Managers)
                     this.database=db;
                 })  
                }
// add project
    addToList() {
    
     this.project_key= this.timeline.push({
                      project_name:this.title, 
                      project_number:this.project_number,
                      manager:this.manager}).key
      this.items.push(
      {
      title: this.title,
      manager:this.manager,
      project_number:this.project_number,
      services: {
        s1: "Building certification",
        s2:"Energy ANalytics"
      },
        startDate:this.startDate,
        endDate:this.endDate,
        client:this.client,
        climate:this.climate,
        timeline_key:this.project_key,
        combined:this.title+this.manager+this.project_number
      }
    );
 
  }
  reset(){
     this.inputsForm.reset()
  }
  //delete Project
  delete(key:string,project:Project){
    let time_key=project.timeline_key;
    this.items.remove(key).then((project)=>{
      this.timeline.remove(time_key);
    })
   
  }
isManager:string;
  //authenticate manager
  checkManager(manager:Array<any>){
    this.authService.user.subscribe((u)=>{
     this.setCurrentUser(u.email,manager)
    })
  
  }
  setCurrentUser(user:string,manager){
    this.currentUser=user;
    console.log(this.currentUser);
     for(let i=0;i<this.Managers.length; i++){
     console.log(this.currentUser)
      if(manager[i].$value==this.currentUser){
        this.isManager= "true";
        return
      }
      else{
       this.isManager= "false";
      
      }
    }
  }
    // pager object
  pager: any = {};
    // paged items
  pagedItems: Project[];

//search filter
transform(filter:Project){
  if(!filter){
 
 this.pagedItems = this.projectTitles;
  this.pager = this.pagerService.getPager(this.projectTitles.length, 1);
 this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }
  let temp:Array<any>=this.projectTitles;
  temp=temp.filter((item: Project) =>this.applyFilter(item, filter));

  this.pager = this.pagerService.getPager(temp.length, 1);
 this.pagedItems = temp.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
 applyFilter(project: Project, filter: Project=new Project()): boolean {
   console.log(project)
    for (let field in filter) {
      console.log(project)
      if (filter[field]) {

          if (project.combined.toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
       
      }
    }
    return true;
}
//pagination
setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
      return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.projectTitles.length, page);
  // get current page of items
  this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);

}

filter:Project=new Project();
//child routing
  goToProject(project) {
  
    this.router.navigate(['projectDetail', project.$key,`${this.isManager}`]);
  };
  inputsForm:FormGroup;
startDate:Date=new Date();
say(){

}
title:string;
manager:string;
project_number:string;
endDate:Date;
status:string;
client:string;
climate:string
   ngOnInit() {
     if(this.authService.isLoggedIn){
          this.inputsForm=this.fb.group({
     project_number:[this.project_number,[Validators.required]],
      title:[this.title,[Validators.required]],
      manager:[this.manager,[Validators.required]],
      startDate:[this.startDate,[Validators.required]],
      endDate:[this.startDate,[Validators.required]],
      client:[this.client,[Validators.required]],
      climate:[this.climate,[Validators.required]]
     })
     }
      else{
          this.router.navigate([""]);
      }

   }
checkDate(){
 
  if(new Date(this.endDate).getTime() - new Date(this.startDate).getTime()<0 ){
    this.dateInvalid=true;
  }
  else{
    this.dateInvalid=false;
  }
}

}