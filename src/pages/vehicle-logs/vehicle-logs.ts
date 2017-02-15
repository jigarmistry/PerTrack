import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-vehicle-logs',
  templateUrl: 'vehicle-logs.html'
})
export class VehicleLogsPage {

  public dbManager: DbManager;

  public recordLimit: Number;
  public filterVehicle: String;
  public arrayRecords: Array<{ limit: Number }>;
  public arrayVehicles: Array<{ name: String }>;

  public vehicleLogs: Array<{
    vehiclename: String, amount: String, name: String,
    oddometer: String, liters: String, logdate: String, id: Number
  }>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.dbManager = new DbManager();
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.getVehicleLogs();
  }

  formatLogDate(date) {
    let dDate = new Date(date);
    let zonTime = (dDate.getTimezoneOffset() * 60000);
    let preDate = new Date(dDate.getTime() + zonTime);
    let mins = preDate.getMinutes().toString();
    let dMins = mins.length > 1 ? mins : "0" + mins;
    return preDate.toDateString() + " " + preDate.getHours() + ":" + dMins;
  }

  getVehicleLogs() {
    this.vehicleLogs = [];
    this.arrayRecords = [];
    this.arrayVehicles = [];
    this.dbManager.getConfigData("flimit").then((data) => {
      this.recordLimit = parseInt(data.res.rows.item(0).cvalue);
    });
    this.dbManager.getAllVehicelLogs().then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let mData = data.res.rows.item(i);
          let fDate = this.formatLogDate(mData.logdate);
          this.vehicleLogs.push({
            name: mData.name, amount: mData.amount,
            vehiclename: mData.vname,
            oddometer: mData.oddometer, liters: mData.liters, logdate: fDate, id: mData.id
          });
        }
        this.renderFilterData();
      }
      if (this.vehicleLogs.length == 0) {
        this.navCtrl.pop();
      }
    });
  }

  renderFilterData() {
    if (this.vehicleLogs.length > 1) {
      this.filterVehicle = "All";
      this.arrayVehicles.push({ name: "All" });
    }
    for (var i = 0; i < this.vehicleLogs.length; i++) {
      let vehname = this.vehicleLogs[i].vehiclename;
      let filterMobiles = this.arrayVehicles.filter(function (data) {
        return data.name == vehname;
      });
      if (filterMobiles.length == 0) {
        this.arrayVehicles.push({ name: vehname });
      }
    }
    if (this.vehicleLogs.length == 1) {
      this.filterVehicle = this.arrayVehicles[0].name;
    }
    let vehicleLogsLength = this.vehicleLogs.length;
    let fixLimit: any = this.recordLimit;
    if (vehicleLogsLength > fixLimit) {
      let modLen = Math.ceil(vehicleLogsLength / fixLimit);
      for (var i = 1; i < modLen + 1; i++) {
        this.arrayRecords.push({ limit: i * fixLimit });
      }
    } else {
      this.arrayRecords.push({ limit: fixLimit });
    }
  }

  onClickDeleteVehicleLog(id) {
    let confirm = this.alertCtrl.create({
      title: 'PerTrack',
      message: 'Are you sure want to delete the vehicle log?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            confirm.dismiss();
            this.dbManager.deleteVehicleLog(id).then(() => {
              let toast = this.toastCtrl.create({
                message: 'Vehicle Log Deleted',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
              toast.onDidDismiss(() => {
                this.getVehicleLogs();
              });
            });
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }
}
