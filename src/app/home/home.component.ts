import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { Http, Headers, RequestOptions, Response } from '@angular/http';
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
                      project_number:this.projectNumber,
                      manager:this.manager}).key
      this.items.push(
      {
      title: this.title,
      manager:this.manager,
      project_number:this.projectNumber,
      services: {
        s1: "Building certification",
        s2:"Energy ANalytics"
      },
        startDate:this.startDate,
        endDate:this.endDate,
        timeline_key:this.project_key
      }
    );
  }
  //delete Project
  delete(key:string,project:Project){
    let time_key=project.timeline_key;
    this.items.remove(key).then((project)=>{
      this.timeline.remove(time_key);
    })
   
  }
isManager:boolean=false;
  //authenticate manager
  checkManager(manager:Array<any>){
    console.log(manager)
   for(let i=0;i<this.Managers.length; i++){
      if(manager[i].$value==this.authService.userName){
        this.isManager= true;
      }
      else{
       this.isManager= false;
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
    for (let field in filter) {
      
      if (filter[field]) {

          if (project.title.toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
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
projectNumber:string;
endDate:Date;
status:string;
   ngOnInit() {
     this.inputsForm=this.fb.group({
     projectNumber:[null,[]],
      title:[null,[]],
      manager:[null,[]],
      startDate:[this.startDate,[]],
      endDate:[this.startDate,[]],
     })
       
   }

}