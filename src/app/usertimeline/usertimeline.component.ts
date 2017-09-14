import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ProjectService } from '../home/project.service';
declare var vis: any;
@Component({
  selector: 'app-usertimeline',
  templateUrl: './usertimeline.component.html',
  styleUrls: ['./usertimeline.component.css']
})
export class UsertimelineComponent implements OnInit {
  toggleFull: boolean=false;
  load: boolean;
  projectname = [];
  @Input()
user:string;
  constructor(private projectService:ProjectService,private element: ElementRef) { }
  items=new vis.DataSet([]);
  options:any;
  groups: any;
  timeline: any;
  render(){  
    this.items = new vis.DataSet(this.userTasks);
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    let threeWeeksLater=new Date();
    threeWeeksLater.setDate(oneWeekAgo.getDate() + 21);
    if(this.toggleFull=false){
      this.options = {start:oneWeekAgo,end:threeWeeksLater,timeAxis: {scale: 'day', step: 5},verticalScroll:true,maxHeight:"200px"};        
    }
    else if(this.toggleFull=false){
      this.options = {start:oneWeekAgo,end:threeWeeksLater,timeAxis: {scale: 'day', step: 5}};              
     }
    this.timeline = new vis.Timeline(this.element.nativeElement, this.items,this.groups ,this.options);
    let startDate=new Date();
    let endDate= startDate.setDate(startDate.getDate()+8*24*60*60*1000);
  }
destroy(){
   this.timeline.destroy();
}
fullScreen(){
this.toggleFull=true;
this.render();
}
  getuserTasks(){
    this.projectService.getMyTasks(this.user)
      .subscribe((projects)=>{
        
        this.projectname=[];
        let taskKeys=[];
        projects.forEach((project,i)=>{
       
       // get project names
         
          this.groups = new vis.DataSet();
         
          let keys;
          if(Object.keys(project).includes('tasks')){
            keys=Object.keys(project['tasks']);
           taskKeys=[...keys];
           this.projectname=[...this.projectname,...project.project_name];
           for (let g=0; g<this.projectname.length;g++) {
                        this.groups.add({id: g, content:this.projectname[g]});
          }
          }
          taskKeys.forEach(key=>{
            this.formatTask((project['tasks'][key]),i);
          })
        });
      })
  }
  userTasks=[];
  formatTask(task,i){
    console.log(task)
    task['group']=i;
    this.userTasks=[...this.userTasks,task];
  }
  ngOnInit() {
    this.projectname=[];
    this.getuserTasks();
    this.load=true;
    setTimeout(()=>{this.render();this.load=false;},1000);
  }

}
