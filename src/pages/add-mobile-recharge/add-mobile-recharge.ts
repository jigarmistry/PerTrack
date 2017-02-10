import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-add-mobile-recharge',
  templateUrl: 'add-mobile-recharge.html'
})
export class AddMobileRechargePage {

  public name: String;
  public mobilenumber: any;
  public amount: Number;
  public type: String;
  public logdate: any;
  public isMobileNumberAdded: Boolean;
  public allMobileNumbers: Array<{ mobilenumber: String, id: Number }>;

  public dbManager: DbManager;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    this.name = "";
    this.mobilenumber = 0;
    this.amount = 0;
    this.type = "Calling";
    let zonTime = (new Date().getTimezoneOffset() * 60000);
    let fLocalDate = new Date(new Date().getTime() - zonTime).toISOString()
    this.logdate = fLocalDate;
    this.isMobileNumberAdded = false;
    this.allMobileNumbers = [];

    this.dbManager = new DbManager();
  }

  ionViewWillEnter() {
    this.getMobileNumbers();
  }

  getMobileNumbers() {
    this.dbManager.getAllMobileNumbers().then((data) => {
      if (data.res.rows.length > 0) {
        this.isMobileNumberAdded = true;
        for (var i = 0; i < data.res.rows.length; i++) {
          let mData = data.res.rows.item(i);
          this.allMobileNumbers.push({ mobilenumber: mData.mobilenumber, id: mData.id });
        }
        this.mobilenumber = this.allMobileNumbers[0].id;
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Please Add Mobile Numbers From Setting Screen',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
        this.isMobileNumberAdded = false;
      }
    });
  }

  onClickAddMobileRecharge() {
    let sendData = {};
    sendData["name"] = this.name;
    sendData["mobilenumberid"] = this.mobilenumber;
    sendData["amount"] = this.amount;
    sendData["type"] = this.type;
    sendData["logdate"] = this.logdate;

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.dbManager.addMobileRecharge(sendData).then(() => {
      loader.dismiss().then(() => {
        this.navCtrl.pop();
      });
    });
  }
}
