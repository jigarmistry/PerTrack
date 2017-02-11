import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';


@Component({
  selector: 'page-mobile-recharges',
  templateUrl: 'mobile-recharges.html'
})
export class MobileRechargesPage {

  public dbManager: DbManager;
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
      }
      if (this.mobileRecharges.length == 0) {
        this.navCtrl.pop();
      }
    })
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
