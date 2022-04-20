import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Affectation } from './affectation';
import { AffectationService } from './affectation.service';


@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss']
})
export class AffectationComponent implements OnInit{
    affectations: Affectation[] = [];

    displayedColumns: string[];

    dataSource = [];
  
    groupingColumn;
  
    reducedGroups = [];
  
    initialData: any [];

    newInputData =[];
   viewAffectation : Affectation | undefined;
  clickedAffectation: any;
  editAffectation: Affectation;
  deleteAffectation: Affectation;


  constructor(private affectationService: AffectationService ) { }

   ngOnInit():void {
      this.getAffectations(); 

      }
  
  public completed() : void {
  
    let inputData =  this.affectations;
    this.newInputData = inputData.map((affectation)=>{

      return { 
               AffectationId : affectation.affectationId, 
               UniteMobile : affectation.vehicule.manufacturer+' '+affectation.vehicule.licensePlate,
               Conducteur: affectation.conducteur.nom +' '+affectation.conducteur.prenom,
               DateDebut: (moment(affectation.dateDebut)).format('DD-MMM-YYYY HH:mm:ss'),
               DateFin: (moment(affectation.dateFin)).format('DD-MMM-YYYY HH:mm:ss')
              }
              
    });
    console.log(this.affectations);
    console.log(this.newInputData);
    if(!this.initData(this.newInputData)) 
       return;

    this.buildDataSource();
  }


  public getAffectations() : void {
    this.affectationService.getAffectations().subscribe(
      (response : Affectation[]) => {
        this.affectations = response; 
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      },
     ()=> this.completed()
      );     
   
  }

  public getAffectationById(mode: string , affectationId : number) : Affectation {
    let result : Affectation 
    this.affectationService.getAffectationById(affectationId).subscribe(
      (response : Affectation) => {
        result = response
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      } ,
      ()=> this.onOpenModal(mode, result)
    ); return result
  }

  public onOpenModal( mode: string , affectation  :Affectation): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

     if (mode === 'view') {
     this.viewAffectation  = affectation;

     button.setAttribute('data-target', '#viewAffectationModal');
   }
   else if (mode === 'edit') {
     this.editAffectation  = affectation;
     button.setAttribute('data-target', '#updateAffectationModal');
   }
   else if (mode === 'delete') {
     this.deleteAffectation = affectation;
     console.log(this.deleteAffectation);
     button.setAttribute('data-target', '#deleteAffectationModal');
   }

    container?.appendChild(button);
    button.click();
  }

  public onDeleteAffectation(affectationId: number): void {
    console.log(affectationId);
    this.affectationService.deleteAffectation(affectationId).subscribe(
      (response: void) => {
        console.log(response);
        this.getAffectations();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateAffectation(affectation:Affectation):void{
    this.affectationService.updateAffectation(affectation).subscribe(
      (response: Affectation) => {
        console.log(response);
        this.getAffectations();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  /**
   * Discovers columns in the data
   */
   initData(data){

    if(data[0] == null)
     return false;

    else {
    this.displayedColumns = Object.keys(data[0]);

    console.log(Object.keys(data[0]));
    this.displayedColumns = ['UniteMobile', 'Conducteur', 'DateDebut', 'DateFin','Action']
    this.initialData = this.newInputData;
    return true;
        }
  }

  /**
   * Rebuilds the datasource after any change to the criterions
   */
   buildDataSource(){
    this.dataSource = this.groupBy(this.groupingColumn,this.initialData,this.reducedGroups);
  }

  /**
   * Groups the @param data by distinct values of a @param column
   * This adds group lines to the dataSource
   * @param reducedGroups is used localy to keep track of the colapsed groups
   */
  groupBy(column:string,data: any[],reducedGroups?: any[]){
    if(!column) {
      column="UniteMobile";
      this.groupBy(column,data,reducedGroups);
    }

    console.log(column);
    let collapsedGroups = reducedGroups;

    if(!reducedGroups) 
         collapsedGroups = [];

    const customReducer = (accumulator, currentValue) => {
      let currentGroup = currentValue[column];
      if(!accumulator[currentGroup])
      accumulator[currentGroup] = [{
        groupName: `${currentValue[column]}`,
        value: currentValue[column], 
        isGroup: true,
        reduced: collapsedGroups.some((group) => group.value == currentValue[column])
      }];
      
      accumulator[currentGroup].push(currentValue);
     

      return accumulator;
    }
    let groups = data.reduce(customReducer,{});
    let groupArray = Object.keys(groups).map(key => groups[key]);
    let flatList = groupArray.reduce((a,c)=>{return a.concat(c); },[]);

    return flatList.filter((rawLine) => {
        return rawLine.isGroup || 
        collapsedGroups.every((group) => rawLine[column]!=group.value);
      });
  }

  /**
   * Since groups are on the same level as the data, 
   * this function is used by @input(matRowDefWhen)
   */
  isGroup(index, item): boolean{
    return item.isGroup;
  }

  /**
   * Used in the view to collapse a group
   * Effectively removing it from the displayed datasource
   */
  reduceGroup(row){
    row.reduced=!row.reduced;
    if(row.reduced)
      this.reducedGroups.push(row);
    else
      this.reducedGroups = this.reducedGroups.filter((el)=>el.value!=row.value);
    
    this.buildDataSource();
  }
}


