import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import * as _ from 'underscore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit   {
  title = 'app';
  projects:Observable<any>;
  projectTitles:Array<any>=[];
   items: FirebaseListObservable<any[]>;

  constructor(db: AngularFireDatabase,private pagerService: PagerService) {
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
  pagedItems: any[];
   ngOnInit() {
  // initialize to page 1
    
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


}
