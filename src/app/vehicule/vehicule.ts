export interface Vehicule {
    //***********************************Identification 
        vehiculeId : number;
        vehiculeCode : string;
        creationTime     : Date;
        //user: Utilisateur 
    
    //******************************* Model  
        manufacturer     : string;
        model     : string;
        equipmentType     : string;
        licensePlate     : string;
        modelYear:number;
        color: string;
        numberOfSeats:number;
        numberOfDoors: number;
        
    //******************** vehicule  
        immatriculationDate : Date;
        cancellationDate:  Date;
        serialNumber     : string;
        lastOdometre: number;
        isActive:boolean;
        location     : string;
        numberIMEI     : string;
    
    //******************** Engine
        fuelCapacity: number;
        speedLimitKPH: number;
        maximumSpeed: number;
        fuelConsumption: number;
        fuelType: string;
        power: number;
    //****************** Drivers
    
        lastDriverID     : string;
        //private List<Affectation> affectations;
    
    
    
    //******************** Missions
        //private List<Mission> missions;
    
    
    }