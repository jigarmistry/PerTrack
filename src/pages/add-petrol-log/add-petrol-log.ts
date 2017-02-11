import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-add-petrol-log',
  templateUrl: 'add-petrol-log.html'
})
export class AddPetrolLogPage {

  public name: String;
  public vehicle: any;
  public amount: Number;
  public liters: Number;
  public oddometer: Number;
  public logdate: any;
  public isVehicleAdded: Boolean;
  public oddometerPlaceholder: Number;
  public litersPlaceholder: Number;
  public allVehicles: Array<{ name: String, id: Number }>;

  public dbManager: DbManager;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    this.name = "";
    this.vehicle = 0;
    this.liters = 1;
    let zonTime = (new Date().getTimezoneOffset() * 60000);
    let fLocalDate = new Date(new Date().getTime() - zonTime).toISOString()
    this.logdate = fLocalDate;
    this.isVehicleAdded = false;
    this.allVehicles = [];
    this.oddometerPlaceholder = 1000;
    this.litersPlaceholder = 1;

    this.dbManager = new DbManager();
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.getVehicles();
    this.getLastVehicleLog();

    this.dbManager.getConfigData("dname").then((data) => {
      this.name = data.res.rows.item(0).cvalue;
    });
    this.dbManager.getConfigData("damount").then((data) => {
      this.amount = data.res.rows.item(0).cvalue;
    });
  }

  getLastVehicleLog() {
    this.dbManager.getLastVehicelLog().then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let mData = data.res.rows.item(i);
          this.oddometerPlaceholder = mData.oddometer;
          this.litersPlaceholder = mData.liters;
        }
      }
    });
  }

  getVehicles() {
    this.dbManager.getAllVehicles().then((data) => {
      if (data.res.rows.length > 0) {
        this.isVehicleAdded = true;
        for (var i = 0; i < data.res.rows.length; i++) {
          let mData = data.res.rows.item(i);
          this.allVehicles.push({ name: mData.vname, id: mData.id });
        }
        this.vehicle = this.allVehicles[0].id;
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Please Add Vehicle From Setting Screen',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
        this.isVehicleAdded = false;
      }
    });
  }

  onClickAddVehicleLog() {
    let sendData = {};
    sendData["name"] = this.name;
    sendData["vehicleid"] = this.vehicle;
    sendData["oddometer"] = this.oddometer;
    sendData["amount"] = this.amount;
    sendData["logdate"] = this.logdate;
    sendData["liters"] = this.liters;

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.dbManager.addVehicleLog(sendData).then(() => {
      loader.dismiss().then(() => {
        this.navCtrl.pop();
      });
    });
  }
}
