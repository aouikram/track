import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Conducteur } from './conducteur';
import { Image } from 'app/image/image';
import { ConducteurService } from './conducteur.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-conducteur',
  templateUrl: './conducteur.component.html',
  styleUrls: ['./conducteur.component.scss']
})
export class ConducteurComponent implements OnInit {

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  url: any;
  url1: any;
  image:any;
  imagenom:any;

  title = 'geolocalisation';
  conducteurs: Conducteur[] = [];
  editConducteur: Conducteur | undefined;
  editConducteurImage: Image | undefined;
  editConducteurImageUrl : any ; 
  deleteConducteur: Conducteur | undefined;
  viewConducteur : Conducteur | undefined;
  viewConducteurUrl : any ;

  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  uploadedImage: Image;
  

  constructor(private conducteurService: ConducteurService,private httpClient: HttpClient, 
    private _sanitizer: DomSanitizer) { }

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
 public onOpenModal( mode: string ,conducteur?: Conducteur,conducteurImage ? : Image ): void {
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
   this.editConducteurImage = conducteur.image;
   this.url=""
   button.setAttribute('data-target', '#updateConducteurModal');
  }
  else if (mode === 'delete') {
    this.deleteConducteur = conducteur;
    button.setAttribute('data-target', '#deleteConducteurModal');
  }
  else if (mode === 'view') {

    this.viewConducteur = conducteur;
    this.viewConducteurUrl = "data:"+this.viewConducteur?.image?.type+";base64,"+this.viewConducteur?.image?.picByte;
    button.setAttribute('data-target', '#viewConducteurModal');
    this.url1=""
  }
  container?.appendChild(button);
  button.click();
}
// adds the form input as a vehicule
public onAddConducteur(addForm:NgForm , uploadedImage : Image ):void{
  
  console.log(addForm.value.nom);

 let conducteur : Conducteur = {

    categoriePermis: addForm.value.categoriePermis,
    contactEmail: addForm.value.contactEmail,
    gender: addForm.value.gender,
    nom: addForm.value.nom,
    numTel: addForm.value.numTel,
    prenom: addForm.value.prenom,
    image: uploadedImage

   }; 

  console.log(conducteur);

  document.getElementById('add-conducteur-form')?.click();

 this.conducteurService.addConducteur(conducteur).subscribe(
      (response: Conducteur) => {
        console.log(response);
        this.getConducteurs();
        addForm.reset();
        this.url = "";
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
        this.url = "";
      }
    );
  }

public onUpdateConducteur(conducteur : Conducteur , uploadedImage : Image):void{
 
    conducteur.image = uploadedImage;
    
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
    
    this.conducteurService.updateConducteur(conducteur).subscribe(
      (response: Conducteur) => {
        console.log(response);
        this.getConducteurs();
        this.url ="";
        console.log(" conducteur image updated");
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }, ()=>this.deleteOldImage(this.editConducteurImage?.id)
    );
  }

public deleteOldImage(imageId : number) {
    if(imageId == null ){
      return ;
    }
    else {
    this.conducteurService.deleteImage(imageId).subscribe(
        (response: void) => {
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }, ()=>console.log(" old image deleted")
      );   }
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


  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
   
        
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      
      reader.onload = (_event) => {
        this.url = reader.result; 
      }
    }



//Gets called when the user clicks on submit to upload the image
onUpload(addForm : NgForm ) : Image {

  
  //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
  const uploadImageData = new FormData();
  uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

this.conducteurService.uploadImage(uploadImageData).subscribe(
  (response : Image) => {
    this.uploadedImage = response;
},
(error :HttpErrorResponse) => {
  alert(error.message);
} , ()=> this.onAddConducteur(addForm , this.uploadedImage)  
);  
return this.uploadedImage;
}

onEdit(conducteur : Conducteur ) : Image {  
  if(this.selectedFile == null){
    this.onUpdateConducteur(conducteur,this.editConducteurImage); 
  }
  else {
  const uploadImageData = new FormData();

  uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);



   this.conducteurService.uploadImage(uploadImageData).subscribe(
      (response : Image) => {
    this.uploadedImage = response;
    console.log(" new image uploaded");
        },
(error :HttpErrorResponse) => {
  alert(error.message);
} , ()=> this.onUpdateConducteur(conducteur , this.uploadedImage)  
);  

 }
return this.uploadedImage;
}

  //Gets called when the user clicks on retieve image button to get the image from back end
// getImage() {
//   //Make a call to Sprinf Boot to get the Image Bytes.
//   this.httpClient.get('http://localhost:8080/image/get/' + this.imageName)
//     .subscribe(
//       res => {
//         this.retrieveResonse = res;
//         this.base64Data = this.retrieveResonse.picByte;
//         this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
//       }
//     );
//     console.log(this.httpClient.get('http://localhost:8080/image/get/' + this.imageName)
//     .subscribe(
//       res => {
//         this.retrieveResonse = res;
//         this.base64Data = this.retrieveResonse.picByte;
//         this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
//       }
//     ));
// }
getImage1(){
  //Make a call to Sprinf Boot to get the Image Bytes.
  if(this.viewConducteur?.image?.id == null){
    return;
  }
  else {
  this.httpClient.get('http://localhost:8095/image/get/' + this.viewConducteur?.image?.id)
    .subscribe(
     (res: Image) => {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.picByte;
        this.retrievedImage = "data:"+this.viewConducteur?.image?.type+";base64," + this.base64Data;
      },
      (error:HttpErrorResponse)=>{
        alert(error.message)
      },
     ()=> this.completed(this.retrieveResonse)
    );
     
    return this.retrieveResonse; 
  }
 
}
public completed(image : Image) {
  this.image = image;

  this.url1="data:"+this.viewConducteur?.image?.type+";base64,"+this.image.picByte;
  
  console.log(this.image);
  console.log(this.url1);
  var reader = new FileReader();
  reader.readAsDataURL(this.image);
  
  reader.onload = (_event) => {
    this.url = reader.result; 
  }
}

}
