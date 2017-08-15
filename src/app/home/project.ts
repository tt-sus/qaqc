export class Project {
 
  project_number: string="";
  manager: String="";
  title: String="";
  status:String="";
  timeline_key:string="";
  client:string="";
  climate_zone:string="";
  combined: string = `${this.manager}${this.project_number}${this.title}`;
}