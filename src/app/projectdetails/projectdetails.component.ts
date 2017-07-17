import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  timelineToShow: any;
  projectId: number;
  database:any;
  projectToShow;
  sub:any;
  id:any;
  constructor(
     private location: Location,
                private db: AngularFireDatabase,
              private route: ActivatedRoute,
             
            ) { 
                this.database=db;
              }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
    });  
   this.database.object('projects/'+this.id ).subscribe((res)=>{
            this.projectToShow=res;
            console.log("this")
         this.getTimeline(this.projectToShow.timeline_id)
      });    
  }
     getTimeline(id){
        let query_id=this.projectToShow.timeline_id;
        this.database.object('projecttimeline/'+query_id).subscribe((res)=>{
          this.timelineToShow=res;
          console.log(this.timelineToShow)
      });
  
     }

}
