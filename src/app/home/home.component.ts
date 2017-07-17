import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import * as _ from 'underscore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Project } from './project';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit   {
 
  projects:Observable<any>;
  projectTitles:Array<any>=[];
   items: FirebaseListObservable<any[]>;

  constructor(db: AngularFireDatabase,
              private pagerService: PagerService,
              public authService: AuthService,
              private router:Router
              ) {
    this.items = db.list('/projects')
    this.items.subscribe(res=> {
      this.projectTitles=res;
        this.setPage(1);
      console.log(this.projectTitles)
    }) 
  }
    addToList(item: any) {
    this.items.push(
      {
        title: " Lord of the rings",
      manager:"Sunny",
      project_number:"1",
      services: {
        s1: "Building certification",
        s2:"Energy ANalytics"
      }
      }
    );
  }
    // pager object
  pager: any = {};
    // paged items
  pagedItems: Project[];
   ngOnInit() {
  // initialize to page 1
    
    }
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
     setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.projectTitles.length, page);
        // get current page of items
        this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);
        console.log("paged"+this.pagedItems)
    }
logOut(){
this.authService.logout();
}
filter:Project=new Project();
  goToProject(project) {
    console.log("p is"+project.$key);
    this.router.navigate(['projectDetail', project.$key]);
  };
}