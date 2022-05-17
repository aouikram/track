import { Image } from 'app/image/image';
import { EventData } from 'app/maps/eventData';
import { Vehicule } from 'app/vehicule/vehicule';

export interface Utilisateur {
	userId : number;
	nom : string;
	prenom  : string;
	numTel : string;	
	contactEmail : string;
	login : string;
	password : string;
	gender : string;
	photo : string;
	

	image : Image;

	evenData : EventData[];

    vehicule : Vehicule[];
}
