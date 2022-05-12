
export interface Device{
    //***********************************Identification 
	deviceId?:number;
	deviceName:String;
	firmwareVersion:String;
	lastStartTime:Date;	
	rtcTime:Date;
	powerVoltage?:number;
	deviceIMEI?:String;
	externalStorage:number;
    batteryVoltage:number;


}
