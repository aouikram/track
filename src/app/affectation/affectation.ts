import { Vehicule } from "app/vehicule/vehicule";

export interface Affectation {
  
        affectationId : number;
        vehicule : Vehicule;
    	dateDebut : Date;
	    dateFin : Date;

    
    }