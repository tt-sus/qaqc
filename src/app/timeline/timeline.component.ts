import { Component, OnInit, Input } from '@angular/core';
import { NgModule, ElementRef} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
declare var vis: any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
@Input()
tasks;

timeline: any;
 
  name:string;
  constructor(private element: ElementRef) {
   
  }
  taskA=[];
    items=new vis.DataSet([]);

    options:any;
  render(){  
  this.items = new vis.DataSet(this.taskA);
      this.options = {};
  this.timeline = new vis.Timeline(this.element.nativeElement, this.items, this.options);
    // Create a Timeline
this.items.push()
  }
  public ngOnDestroy(): void {
        this.timeline.off(this.timeline, 'click');
    }
  ngOnInit() {
  
 console.log(this.tasks);
    for(let i = 0; i < this.tasks.length; i++){
      this.taskA.push({
        content:this.tasks[i].taskName,
        start:this.tasks[i].startDate,
        end:this.tasks[i].dueDate
      })
}
    this.render()
 // Create a DataSet (allows two way data-binding)    
  }


}
