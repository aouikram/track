import { Conducteur } from "app/conducteur/conducteur";
import { Device } from "app/device/device";
import { Utilisateur } from "app/utilisateur/utilisateur";
export interface EventData {
  
	eventDataId : number;

    account : Utilisateur

    device : Device;  
	
	entityID : string;  
	
	driverID  : string;
	
	transportID  : string;
	
    timestamp : number;
	
    statusCode : number;
	
	latitude : number;
	
	longitude : number;
	
	gpsAge : number;
	
	speedKPH : number;
	
	heading : number;
	
	altitude : number;
	
	inputMask : number;

	address : string ;
	dataSource : string;
	
	rawData  : string;
	

	distanceKM  : number;
	odometerKM  : number;
	geozoneIndex  : number;

	geozoneID  : string;
	creationTime  : number;
	streetAddress  : string;
	city  : string;
	stateProvince  : string;
	postalCode  : string;
	country  : string;
	subdivision  : string;
	speedLimitKPH  : number;
	
	isTollRoad : Boolean;
	
	 gpsFixType  : number;
	
	horzAccuracy  : number;
	vertAccuracy  : number;
	 HDOP  : number;

	satelliteCount  : number;
	
	 batteryLevel   : number;
	signalStrength   : number;
	fuelUsageUsage  : number;
	fuelLevel  : number;
	fuelEconomy  : number;
	fuelTotal  : number;
	fuelIdle  : number;
	fuelPTO  : number;
	engineRpm  : number;
	
	engineHours  : number;
	engineLoad  : number;
	idleHours  : number;
	transOilTemp  : number;
	coolantLevel  : number;
	coolantTemp  : number;
	intakeTemp  : number;
	brakeGForce  : number;
	acceleration  : number;
	brakePressure  : number;
	oilPressure  : number;
	oilLevel  : number;
	oilTemp  : number;
	airPressure  : number;
	

	 
	ptoEngaged : Boolean;
	
	ptoHours : number;
	throttlePos : number;
	brakePos : number;
	vBatteryVolts : number;
	
	
	j1708Fault : number ;
	
	fuelPressure : number;
	fuelTemp : number;
	engineTorque : number;
	airFilterPressure : number;
	batteryVolts : number;
	faultCode  : string;
	workHours : number;
	turboPressure : number;
	
	
	malfunctionLamp : boolean;
	
	tirePressure  : string;
	tireTemp  : string;
	rfidTag  : string;
	
	creationMillis : number;
	
	dataPush : boolean;


    driverStatus  : number;
	driverMessage  : string;
	sensorLow  : number;
	sensorHigh : number;
	costCenter : number;
	jobNumber  : string;
	attachType  : string;
	
	attachData : Int16Array;
}