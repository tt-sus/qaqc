import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,AbstractControl } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
@Component({
  selector: 'app-qc1',
  templateUrl: './qc1.component.html',
  styleUrls: ['./qc1.component.css']
})
export class Qc1Component implements OnInit {
@Input()
taskId:string;
taskQC1Observable: FirebaseListObservable<any[]>;

// large Form Inputs // Front Section
coverPage:boolean=false;tableContents:boolean=false;executiveSummary:boolean=false;
frontComment:string;

//tables anf figures
matchNumbers:boolean=false;significantDigits:boolean=false;updatedFigures:boolean=false;
alignment:boolean=false;consistentFormatting:boolean=false;accuracy:boolean=false;tablesComment:string;

//reference 
referenceConsistency:boolean=false;referenceComment:string;

//general format
acronyms:boolean=false;fonts:boolean=false;highlighting:boolean=false;
styling:boolean=false;spell:boolean=false;generalComment:string;
database:any;
inputsForm:FormGroup;
  constructor(private fb:FormBuilder, private db: AngularFireDatabase) { 
      this.database=db;
  }
  taskArray:any;
  ngOnInit() {
    this.inputsForm=this.fb.group({
      coverPage:[this.coverPage],
      tableContents:[this.tableContents],
      executiveSummary:[this.executiveSummary],
      frontComment:[this.frontComment],
      matchNumbers:this.matchNumbers,
      significantDigits:this.significantDigits,
      updatedFigures:this.updatedFigures,
      alignment:this.alignment,
      consistentFormatting:this.consistentFormatting,
      accuracy:this.accuracy,
      tablesComment:this.tablesComment,
      referenceConsistency:this.referenceConsistency,
      referenceComment:this.referenceComment,
      acronyms:this.acronyms,
      fonts:this.fonts,
      highlighting:this.highlighting,
      styling:this.styling,
      spell:this.spell,
      generalComment:this.generalComment

    });
   
    this.taskQC1Observable=this.database.list(`${this.taskId}/qaqc`);
        this.taskQC1Observable.subscribe((task)=>{
          this.taskArray=task;
          console.log(task)
        })

  }
submitQC1(){
  this.taskQC1Observable.push({
    coverPage:this.coverPage,
    tablecontents:this.tableContents,
    executiveSummary:this.executiveSummary,
    frontComment:this.frontComment,
    matchNumbers:this.matchNumbers,
    significantDigits:this.significantDigits,
    updatedFigures:this.updatedFigures,
    alignment:this.alignment,
    consistentFormatting:this.consistentFormatting,
    accuracy:this.accuracy,
    tablesComment:this.tablesComment,
    referenceConsistency:this.referenceConsistency,
    referenceComment:this.referenceComment,
    acronyms:this.acronyms,
    fonts:this.fonts,
    highlighting:this.highlighting,
    styling:this.styling,
    spell:this.spell,
    generalComment:this.generalComment
  })
     console.log(this.taskArray)
}

}
