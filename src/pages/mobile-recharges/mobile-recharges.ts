import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';


@Component({
  selector: 'page-mobile-recharges',
  templateUrl: 'mobile-recharges.html'
})
export class MobileRechargesPage {

  public dbManager: DbManager;
  public recordLimit: Number;
  public filterMobile: String;
  public arrayRecords: Array<{ limit: Number }>;
  public arrayMobiles: Array<{ mobile: String }>;

  public mobileRecharges: Array<{
    name: String, amount: String, mobilenumber: String,
    type: String, logdate: String, id: Number
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
    this.getMobileRecharges();
  }

  formatLogDate(date) {
    let dDate = new Date(date);
    let zonTime = (dDate.getTimezoneOffset() * 60000);
    let preDate = new Date(dDate.getTime() + zonTime);
    let mins = preDate.getMinutes().toString();
    let dMins = mins.length > 1 ? mins : "0" + mins;
    return preDate.toDateString() + " " + preDate.getHours() + ":" + dMins;
  }

  getMobileRecharges() {
    this.mobileRecharges = [];
    this.arrayMobiles = [];
    this.arrayRecords = [];
    this.dbManager.getConfigData("flimit").then((data) => {
      this.recordLimit = data.res.rows.item(0).cvalue;
    });
    this.dbManager.getAllMobileRecharges().then((data) => {
      if (data.res.rows.length > 0) {
        for (var i = 0; i < data.res.rows.length; i++) {
          let mData = data.res.rows.item(i);
          let fDate = this.formatLogDate(mData.logdate);
          this.mobileRecharges.push({
            name: mData.name, amount: mData.amount,
            mobilenumber: mData.mobilenumber, type: mData.type, logdate: fDate, id: mData.id
          });
        }
        this.renderFilterData();
      }
      if (this.mobileRecharges.length == 0) {
        this.navCtrl.pop();
      }
    });
  }

  renderFilterData() {
    if (this.mobileRecharges.length > 1) {
      this.filterMobile = "All";
      this.arrayMobiles.push({ mobile: "All" });
    }
    for (var i = 0; i < this.mobileRecharges.length; i++) {
      let mobilenumber = this.mobileRecharges[i].mobilenumber;
      let filterMobiles = this.arrayMobiles.filter(function (data) {
        return data.mobile == mobilenumber;
      });
      if (filterMobiles.length == 0) {
        this.arrayMobiles.push({ mobile: mobilenumber });
      }
    }
    if (this.mobileRecharges.length == 1) {
      this.filterMobile = this.arrayMobiles[0].mobile;
    }

    let mobileRechargesLength = this.mobileRecharges.length;
    let fixLimit: any = this.recordLimit;
    if (mobileRechargesLength > fixLimit) {
      let modLen = Math.ceil(mobileRechargesLength / fixLimit);
      for (var i = 1; i < modLen + 1; i++) {
        this.arrayRecords.push({ limit: i * fixLimit });
      }
    } else {
      this.arrayRecords.push({ limit: fixLimit });
    }
  }

  onClickDeleteRecharge(id) {
    let confirm = this.alertCtrl.create({
      title: 'PerTrack',
      message: 'Are you sure want to delete the mobile recharge?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            confirm.dismiss();
            this.dbManager.deleteMobileRecharge(id).then(() => {
              let toast = this.toastCtrl.create({
                message: 'Mobile Recharge Deleted',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
              toast.onDidDismiss(() => {
                this.getMobileRecharges();
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
