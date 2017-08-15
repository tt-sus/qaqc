import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { PagerService } from "pagination";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
export class HomeComponent implements OnInit {
  params: string;
  isAdmin: string;
  dateInvalid: boolean;
  currentUser: string;

  projects: Observable<any>;
  projectTitles: Array<any> = [];
  items: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  timeline: FirebaseListObservable<any[]>;
  Managers: any[] = [];
  database: any;
  project_key: string;
  constructor(db: AngularFireDatabase,
    private pagerService: PagerService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.items = db.list('/projects')
    this.items.subscribe(res => {
      this.projectTitles = res;
      this.setPage(1);
    });
    this.timeline = db.list('/projecttimeline');
    this.users = db.list('/users')
    this.users.subscribe(res => {

      this.Managers = res;
      console.log(this.Managers)
      this.checkManager(this.Managers)
      this.database = db;
    })

  }
  // add project
  projectStatus: boolean = false;
  addToList() {

    this.project_key = this.timeline.push({
      project_name: this.title,
      project_number: this.project_number,
      manager: this.manager
    }).key
    this.items.push(
      {
        title: this.title,
        manager: this.manager,
        project_number: this.project_number,
        services: {
          s1: "Building certification",
          s2: "Energy ANalytics"
        },
        startDate: this.startDate,
        endDate: this.endDate,
        client: this.client,
        climate: this.climate,
        timeline_key: this.project_key,
        projectStatus: this.projectStatus,
        combined: this.title + this.manager + this.project_number
      }
    );

  }
  reset() {
    this.inputsForm.reset()
  }

  getProject(key, project) {
    this.project_key = key
    this.project = project;
  }
  tasks: FirebaseListObservable<any[]>;
  project: Project;
  //delete Project
  delete() {
    let time_key = this.project.timeline_key;
    this.tasks = this.database.list(`/projecttimeline/${time_key}`);


    this.tasks.remove();

    this.items.remove(this.project_key).then((project) => {
      this.timeline.remove(time_key);

    })
  }
  isManager: string;
  //authenticate manager
  checkManager(managers: Array<any>) {
    this.authService.user.subscribe((u) => {
      this.setCurrentUser(u.email, managers)
      
    })

    alert(this.authService.isLoggedIn);
  }
  setCurrentUser(user: string, managers) {

    this.currentUser = user;
    for (let i = 0; i < managers.length; i++) {

      if (managers[i].email.toLowerCase() === user) {
        if (managers[i].manager_access) {
          this.isManager = "true";
          this.params = "aabsvchfo134852f"
          if (managers[i].admin_access) {
            this.isAdmin = "true";
            return
          }
        } else {
          this.isManager = "false";
          this.isAdmin = "false";
          this.params = "aabsvchfo1egsgu432f"
        }
      }
    }
  }

  addUser() {
    this.router.navigate(["addUsers"])
  }
  // pager object
  pager: any = {};
  // paged items
  pagedItems: Project[];

  //search filter
  transform(filter: Project) {
    if (!filter) {

      this.pagedItems = this.projectTitles;
      this.pager = this.pagerService.getPager(this.projectTitles.length, 1);
      this.pagedItems = this.projectTitles.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }
    let temp: Array<any> = this.projectTitles;
    temp = temp.filter((item: Project) => this.applyFilter(item, filter));

    this.pager = this.pagerService.getPager(temp.length, 1);
    this.pagedItems = temp.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  applyFilter(project: Project, filter: Project = new Project()): boolean {

    for (let field in filter) {

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

  filter: Project = new Project();
  //child routing
  goToProject(project) {

    this.router.navigate(['projectDetail', project.$key, `${this.params}`]);
  };
  inputsForm: FormGroup;
  startDate: Date = new Date();
  say() {

  }
  title: string;
  manager: string;
  project_number: string;
  endDate: Date;
  status: string;
  client: string;
  climate: string
  ngOnInit() {

    this.inputsForm = this.fb.group({
      project_number: [this.project_number, [Validators.required]],
      title: [this.title, [Validators.required]],
      manager: [this.manager, [Validators.required]],
      startDate: [this.startDate, [Validators.required]],
      endDate: [this.startDate, [Validators.required]],
      client: [this.client, [Validators.required]],
      climate: [this.climate, [Validators.required]]
    })
    this.authService.user.subscribe((val => { this.routeThis(val) }))

  }
  routeThis(val) {
    if (!val) {
      this.router.navigate([""]);
    }
  }
  checkDate() {

    if (new Date(this.endDate).getTime() - new Date(this.startDate).getTime() < 0) {
      this.dateInvalid = true;
    }
    else {
      this.dateInvalid = false;
    }
  }

}