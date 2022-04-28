import { Image } from 'app/image/image';

export interface Conducteur{
    //***********************************Identification 
	userId?:number;
	nom:String;
	prenom:String;
	numTel:String;	
	contactEmail:String;
	login?:String;
	password?:String;
	gender:String;
    categoriePermis:String;
	image?:Image;
	imageUrl? : any;


}
