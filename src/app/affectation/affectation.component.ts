import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Conducteur } from 'app/conducteur/conducteur';
import { Vehicule } from 'app/vehicule/vehicule';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Affectation } from './affectation';
import { AffectationService } from './affectation.service';


@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss'],
  
})
export class AffectationComponent implements OnInit{

    affectations: Affectation[] = [];
    displayedColumns: string[];
    dataSource = [];
    groupingColumn;
    reducedGroups = [];
    initialData: any [];
    vehicules: Vehicule[] = []; 
    conducteurs: Conducteur[] = []; 
    vehiculeDropDownList = [];
    conducteurDropDownList = [];
    newInputData =[];
    viewAffectation : Affectation | undefined;
    clickedAffectation: any;
    editAffectation: Affectation;
    deleteAffectation: Affectation;
    currentAffectationVehicule : String ;
    currentAffectationConducteur : String ;

  constructor(private affectationService: AffectationService ) { }

   ngOnInit():void {
      this.getAffectations();  // list of all affectations
      this.getVehiculesAndConducteurs(); // list of all vehicules and conducteurs in database

      }
  
  // vehicules = list of all vehicule in DB , conducteurs = list of all conducteurs in DB
  public getVehiculesAndConducteurs():void {

    this.affectationService.getVehicules().subscribe(
      (response : Vehicule[]) => {
        this.vehicules = response;
        
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      },
      ()=> this.makeVehiculeList()  // on finish make vehicule list to display in dropdown
    );
    this.affectationService.getConducteurs().subscribe(
      (response : Conducteur[]) => {
        this.conducteurs = response;
         
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      },
      ()=> this.makeConducteurList() // on finish make conducteurs list to display in dropdown
    );
  }

  // make dropdown lists 
  public makeVehiculeList(): void {

    this.vehiculeDropDownList = this.vehicules.map((vehicule)=>{

      return { 
               vehiculeId : vehicule?.vehiculeId, 
               vehicule : vehicule?.manufacturer+' '+vehicule?.model+' '+vehicule?.licensePlate+' avec ID: '+vehicule?.vehiculeId
              }
              
    });
 
  }
  public makeConducteurList(): void {

    this.conducteurDropDownList = this.conducteurs.map((conducteur)=>{

      return { 
               conducteurId : conducteur?.userId, 
               conducteur : conducteur?.nom+' '+conducteur?.prenom+' avec ID: '+conducteur?.userId
              }
              
    });
 
  }

  // get all affectations from database
  public getAffectations() : void {
    this.affectationService.getAffectations().subscribe(
      (response : Affectation[]) => {
        this.affectations = response; 
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      },
     ()=> this.completed() // on finish execute function completed()
      );     
   
  }

  public completed() : void {
  
    let inputData =  this.affectations; 

    // make new array of attributes to list 
    this.newInputData = inputData.map((affectation)=>{

      return { 
               AffectationId : affectation.affectationId, 
               UniteMobile : affectation?.vehicule?.manufacturer+' '+affectation?.vehicule?.licensePlate,
               Conducteur: affectation?.conducteur?.nom +' '+ affectation?.conducteur?.prenom,
               DateDebut: (moment(affectation?.dateDebut)).format('DD-MMM-YYYY HH:mm:ss'),
               DateFin: (moment(affectation?.dateFin)).format('DD-MMM-YYYY HH:mm:ss')
              }
              
    });
    
    if(!this.initData(this.newInputData)) 
       return;

    this.buildDataSource();
  }

// called when delete or edit icon is clicked : gets affectation by id and sends it to onOpenModal()
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
     this.currentAffectationVehicule = this.editAffectation.vehicule.manufacturer+" "+this.editAffectation.vehicule.model+" "+this.editAffectation.vehicule.licensePlate+" avec ID:"+this.editAffectation.vehicule.vehiculeId;
     this.currentAffectationConducteur = this.editAffectation.conducteur.nom+" "+this.editAffectation.conducteur.prenom+" avec ID:"+this.editAffectation.conducteur.userId;
     button.setAttribute('data-target', '#updateAffectationModal');
   }
   else if (mode === 'delete') {
     this.deleteAffectation = affectation;
     button.setAttribute('data-target', '#deleteAffectationModal');
   }

    container?.appendChild(button);
    button.click();
  }

// called when edit form is submited : finds affectation to update , selected vehicule and selected conducteurs
/* affectation {
  affectationId : 
  vehiculeId : 
  conducteurId:
  dateDebut: 
  dateFin:
} */
  public getAffectationFromEdit(affectation:Affectation) : Affectation {
console.log(affectation);
    let result : Affectation 

    forkJoin(
      this.affectationService.getAffectationById(affectation.affectationId),
      this.affectationService.getVehiculeById(affectation.vehiculeId),
      this.affectationService.getConducteurById(affectation.conducteurId)
    ).subscribe(
      (res) => {
      this.onUpdateAffectation(res[0], res[1], res[2],affectation.dateDebut,affectation.dateFin);
    });
    
    return result;

  }

  public onUpdateAffectation(affectation: Affectation , vehicule : Vehicule , conducteur : Conducteur , dateDebut : Date, dateFin : Date):void{
    affectation.dateDebut = dateDebut;
    affectation.dateFin = dateFin;
    affectation.vehicule = vehicule;
    affectation.conducteur = conducteur;
    
    this.affectationService.updateAffectation(affectation).subscribe(
      (response: Affectation) => {
        this.getAffectations(); 
        this.getVehiculesAndConducteurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );


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





//********************** methods for grouping */
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


