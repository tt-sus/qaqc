import { Component, OnInit, Input } from '@angular/core';
import { NgModule, ElementRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/Rx'

import { Project } from '../home/project';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProjectService } from '../home/project.service';
import { UserService } from '../home/user.service';
import { ManagerService } from '../home/manager.service';
declare var vis: any;


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  timelineHeight = 400;
  load: boolean;
  projectNames = [];
  tasks = [];
  currentUser: string;
  userTasks: any[];
  @Input()
  Key: string;
  @Input()
  manager: boolean;
  projectsTimeline: any = [];
  groups: any;
  timeline: any;
  name: string;
  finaltasks = [];
  taskA = [];
  items = new vis.DataSet([]);
  options: any;
  constructor(private element: ElementRef, private projectService: ProjectService, private managerService: ManagerService) {
  }
  render() {
    this.items = new vis.DataSet(this.finaltasks);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const threeWeeksLater = new Date();
    threeWeeksLater.setDate(oneWeekAgo.getDate() + 21);

    this.options = {
      start: oneWeekAgo,
      end: threeWeeksLater,
      maxHeight: `${this.timelineHeight}px`,
      // maxHeight: `200px`,
      zoomMin: 1209600000,
      zoomMax: 31536000000,
      moment: function(date) {
        return vis.moment(date).utcOffset('-05:00');
      }
     };
    this.timeline = new vis.Timeline(this.element.nativeElement, this.items, this.groups, this.options);
  }
  destroy() {
    this.timeline.destroy();
  }
  fullScreen() {
    this.timelineHeight = 1200
  }
  windowed() {
    this.timelineHeight = 500
  }
  formatTasks(task, i) {
    this.finaltasks.push({
      start: task.dueDate,
      content: task.taskName,
      group: i,
      className: task.categoryType
    })
  }
  destroyTimeline() {
    this.timeline.destroy();
  }
  renderTimeline() {
    this.load = true;
    setTimeout(() => { this.render(); this.load = false; }, 1000);
  }
  managerTasks() {
    this.projectNames = [];
    this.currentUser = localStorage.getItem("userName");

    this.projectService.getManagerProjects(this.currentUser)
      .subscribe((projects) => {
        // projects with manager as myself
        projects.forEach((project, i) => {
          this.tasks = [];
          this.tasks.push(project.tasks); //[tasks-project1,tasks-project2]

          if (this.tasks[0] !== undefined) {
            this.tasks.forEach((task) => {
              let taskKeys = Object.keys(task);
              taskKeys.forEach((element, j) => {
                this.formatTasks(task[Object.keys(task)[j]], i);
              });
            })//finaltasks=[task1,task2]
          }

          this.projectNames.push(project.project_name);
        })
        this.groups = new vis.DataSet();
        for (let g = 0; g < this.projectNames.length; g++) {
          this.groups.add({ id: g, content: this.projectNames[g] });
        }
      })

    let projects$ = this.projectService.getManagerProjects(this.currentUser)
  }
  ngOnInit() {
    this.finaltasks = [];
    this.managerTasks();
    this.renderTimeline();
  }
}
