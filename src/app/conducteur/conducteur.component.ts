import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Conducteur } from './conducteur';
import { ConducteurService } from './conducteur.service';
@Component({
  selector: 'app-conducteur',
  templateUrl: './conducteur.component.html',
  styleUrls: ['./conducteur.component.scss']
})
export class ConducteurComponent implements OnInit {

  title = 'geolocalisation';
  conducteurs: Conducteur[] = [];
  editConducteur: Conducteur | undefined;
  deleteConducteur: Conducteur | undefined;
  viewConducteur : Conducteur | undefined;

  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private conducteurService: ConducteurService) { }

  ngOnInit(): void {
    this.getConducteurs();
  }
  public getConducteurs():void {
    this.conducteurService.getConducteurs().subscribe(
      (response : Conducteur[]) => {
        this.conducteurs = response;
      },
      (error :HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
   // controls the modal of the html that will be displayed 
 public onOpenModal( mode: string ,conducteur?: Conducteur ): void {
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');
  if (mode === 'add') {
    button.setAttribute('data-target', '#addConducteurModal');
  }
  else if (mode === 'edit') {
   this.editConducteur  = conducteur;
    button.setAttribute('data-target', '#updateConducteurModal');
  }
  else if (mode === 'delete') {
    this.deleteConducteur = conducteur;
    button.setAttribute('data-target', '#deleteConducteurModal');
  }
  else if (mode === 'view') {
    this.viewConducteur = conducteur;
    button.setAttribute('data-target', '#viewConducteurModal');
  }
  container?.appendChild(button);
  button.click();
}
// adds the form input as a vehicule
public onAddConducteur(addForm:NgForm):void{
  document.getElementById('add-conducteur-form')?.click();
    this.conducteurService.addConducteur(addForm.value).subscribe(
      (response: Conducteur) => {
        console.log(response);
        this.getConducteurs();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
  public onUpdateConducteur(conducteur:Conducteur):void{
    this.conducteurService.updateConducteur(conducteur).subscribe(
      (response: Conducteur) => {
        console.log(response);
        this.getConducteurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

public onDeleteConducteur(id: number): void {
    this.conducteurService.deleteConducteur(id).subscribe(
      (response: void) => {
        console.log(response);
        this.getConducteurs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

onTableDataChange(event: any) {
    this.page = event;
    this.getConducteurs();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getConducteurs();
  }



// search vehicule by manufacturer or serial number
public searchConducteurs(key: string):void {
  console.log(key);
  const results: Conducteur[] = []; // array that stores all the vehicules that match the key : results
  for (const conducteur of this.conducteurs) { // loop over all the vehicules in the app
    if ( conducteur.nom.toLowerCase().indexOf(key.toLowerCase()) !== -1 
    || conducteur.prenom.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || conducteur.numTel.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || conducteur.contactEmail.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || conducteur.gender.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || conducteur.categoriePermis.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(conducteur);
    }
  }
  this.conducteurs = results; //list the results
  if (results.length === 0 || !key) {
    this.getConducteurs();
  }
}
}