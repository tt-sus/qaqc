import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ProjectService } from '../home/project.service';
import { log } from 'util';
declare var vis: any;
@Component({
  selector: 'app-usertimeline',
  templateUrl: './usertimeline.component.html',
  styleUrls: ['./usertimeline.component.css']
})
export class UsertimelineComponent implements OnInit {
  toggleFull: boolean = false;
  load: boolean;
  projectname = [];
  @Input()
  user: string;
  items = new vis.DataSet([]);
  options: any;
  groups: any;
  timeline: any;
  userTasks = [];
  constructor(private projectService: ProjectService, private element: ElementRef) { }


  ngOnInit() {
    this.projectname = [];
    this.getuserTasks();
    this.load = true;
    setTimeout(() => { this.render(); this.load = false; }, 1000);
  }

  render() {

    this.items = new vis.DataSet(this.userTasks);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const threeWeeksLater = new Date();
    threeWeeksLater.setDate(oneWeekAgo.getDate() + 21);
    // if (this.toggleFull = false) {
    // tslint:disable-next-line:max-line-length
    //   this.options = { start: oneWeekAgo, end: threeWeeksLater, timeAxis: { scale: 'day', step: 5 }, verticalScroll: true, maxHeight: "200px" };
    // }
    // else if (this.toggleFull = false) {}
    this.options = {
      start: oneWeekAgo,
      end: threeWeeksLater,
      maxHeight: `200px`,
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
    this.toggleFull = true;
    this.render();
  }

  getuserTasks() {
    this.projectService.getMyTasks(this.user)
      .subscribe((projects) => {

        this.groups = new vis.DataSet();

        projects.filter(_ => _['tasks'])
        .forEach(
          (project, index) => {
            // create groups
            this.groups.add({ id: index, content: project.project_name});
            // create tasks
            const tasks = project.tasks;
            Object.keys(tasks).forEach(
              taskkey => {
                const task = tasks[taskkey];
                task['group'] = index;
                this.userTasks = [...this.userTasks, task];
              }
            )

          }
        );


      })
  }

}
