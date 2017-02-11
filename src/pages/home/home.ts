import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AddMobileRechargePage } from '../add-mobile-recharge/add-mobile-recharge';
import { AddPetrolLogPage } from '../add-petrol-log/add-petrol-log';
import { SettingsPage } from '../settings/settings';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public dbManager: DbManager;
  public mobileRechargeData: Array<{
    mobilenumber: String, amount: String, type: String, id: Number,
    logdate: String
  }>;
  public vehicleLogData: Array<{
    vehiclename: String, amount: String, oddometer: String, id: Number,
    logdate: String, liters: String
  }>;

  public limit: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController) {

    this.mobileRechargeData = [];
    this.dbManager = new DbManager();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.getConfigData();
  }

  getConfigData() {
    this.dbManager.getConfigData("rlimit").then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let cData = data.res.rows.item(i);
          this.limit = cData.cvalue;
        }
      }
      this.getMobileRechargeData();
      this.getVehicleLogData();
    })
  }

  formatLogDate(date) {
    let dDate = new Date(date);
    let zonTime = (dDate.getTimezoneOffset() * 60000);
    let preDate = new Date(dDate.getTime() + zonTime);
    let mins = preDate.getMinutes().toString();
    let dMins = mins.length > 1 ? mins : "0" + mins;
    return preDate.toDateString() + " " + preDate.getHours() + ":" + dMins;
  }

  getMobileRechargeData() {
    this.mobileRechargeData = [];
    this.dbManager.getMobileRechargesForHome(this.limit).then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let rData = data.res.rows.item(i);
          let fDate = this.formatLogDate(rData.logdate);
          this.mobileRechargeData.push({
            mobilenumber: rData.mobilenumber,
            amount: rData.amount, type: rData.type, id: rData.id, logdate: fDate
          });
        }
      }
    });
  }

  getVehicleLogData() {
    this.vehicleLogData = [];
    this.dbManager.getVehicleLogsForHome(this.limit).then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let rData = data.res.rows.item(i);
          let fDate = this.formatLogDate(rData.logdate);
          this.vehicleLogData.push({
            vehiclename: rData.vname,
            amount: rData.amount, oddometer: rData.oddometer, id: rData.id, logdate: fDate,
            liters: rData.liters
          });
        }
      }
    });
  }

  onClickAddMobileRecharge() {
    this.navCtrl.push(AddMobileRechargePage);
  }

  onClickAddPetrolLog() {
    this.navCtrl.push(AddPetrolLogPage);
  }

  onClickSettings() {
    this.navCtrl.push(SettingsPage);
  }

  onClickAdd() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Your Option',
      buttons: [
        {
          text: 'Add Mobile Recharge',
          handler: () => {
            this.onClickAddMobileRecharge();
          }
        }, {
          text: 'Add Petrol Log',
          handler: () => {
            this.onClickAddPetrolLog();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
