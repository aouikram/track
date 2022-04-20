import { Conducteur } from "app/conducteur/conducteur";
import { Vehicule } from "app/vehicule/vehicule";

export interface Affectation {

  
        affectationId? : number;
        vehicule : Vehicule;
        conducteur :  Conducteur;
    	dateDebut: Date;
	    dateFin: Date;

    
    }