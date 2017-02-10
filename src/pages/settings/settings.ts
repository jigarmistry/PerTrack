import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public dbManager: DbManager;
  public allMobileNumbers: Array<{ mobilenumber: String, carrier: String }>;
  public allVehicles: Array<{ name: String }>;
  public mobileNumbersCount: Number;
  public vehiclesCount: Number;
  public recordLimit: String;
  public defaultName: String;
  public defaultAmount: String;

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
    this.allMobileNumbers = [];
    this.allVehicles = [];
    this.mobileNumbersCount = 0;
    this.vehiclesCount = 0;
    this.dbManager = new DbManager();
  }

  ionViewWillEnter() {
    this.getDataFromDb();
  }

  getDataFromDb() {
    this.allMobileNumbers = [];
    this.dbManager.getAllMobileNumbers().then((data) => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let adata = { mobilenumber: item.mobilenumber, carrier: item.carrier }
          this.allMobileNumbers.push(adata);
        }
      }
      this.mobileNumbersCount = this.allMobileNumbers.length;
    });

    this.allVehicles = [];
    this.dbManager.getAllVehicles().then((data) => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let adata = { name: item.name }
          this.allVehicles.push(adata);
        }
      }
      this.vehiclesCount = this.allVehicles.length;
    });

    this.dbManager.getConfigData("rlimit").then((data) => {
      this.recordLimit = data.res.rows.item(0).cvalue;
    });
    this.dbManager.getConfigData("dname").then((data) => {
      this.defaultName = data.res.rows.item(0).cvalue;
    });
    this.dbManager.getConfigData("damount").then((data) => {
      this.defaultAmount = data.res.rows.item(0).cvalue;
    });

  }

  addMobileNumberIntoDb(data) {

    if (data.mobilenumber.trim() == "") {
      let toast = this.toastCtrl.create({
        message: 'Please Enter Mobile Number',
        duration: 2000
      });
      toast.present();
      return;
    }

    if (data.carrier.trim() == "") {
      let toast = this.toastCtrl.create({
        message: 'Please Enter Carrier',
        duration: 2000
      });
      toast.present();
      return;
    }

    if (this.allMobileNumbers.length > 0) {
      let filterData = this.allMobileNumbers.filter((fdata) => {
        return fdata.mobilenumber == data.mobilenumber;
      })
      if (filterData.length > 0) {
        let toast = this.toastCtrl.create({
          message: 'Mobile Number Already Exist',
          duration: 2000
        });
        toast.present();
        return;
      }
    }

    let sendData = { "mobilenumber": data["mobilenumber"], "carrier": data["carrier"] }
    this.dbManager.addMobileNumber(sendData).then(() => {
      this.getDataFromDb();
    });
  }

  addVehicleIntoDb(data) {

    if (data.name.trim() == "") {
      let toast = this.toastCtrl.create({
        message: 'Please Enter Vehicle Name',
        duration: 2000
      });
      toast.present();
      return;
    }

    if (this.allVehicles.length > 0) {
      let filterData = this.allVehicles.filter((fdata) => {
        return fdata.name == data.name;
      })
      if (filterData.length > 0) {
        let toast = this.toastCtrl.create({
          message: 'Vehicle Already Exist',
          duration: 2000
        });
        toast.present();
        return;
      }
    }

    let sendData = { "name": data["name"] }
    this.dbManager.addVehicle(sendData).then(() => {
      this.getDataFromDb();
    });
  }


  onClickAddMobile() {
    let prompt = this.alertCtrl.create({
      title: 'PerTrack',
      message: "Add Mobile Number",
      inputs: [
        {
          name: 'mobilenumber',
          placeholder: 'Mobile Number'
        },
        {
          name: 'carrier',
          placeholder: 'Carrier'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            prompt.dismiss();
            this.addMobileNumberIntoDb(data);
          }
        }
      ]
    });
    prompt.present();
  }

  onClickSetConfigData(type) {

    var message = "Set Record Limit";
    var value = this.recordLimit.toString();
    var ttype = "number";

    if (type == "dname") {
      message = "Set Default Name";
      value = this.defaultName.toString();
      ttype = "text";
    }
    if (type == "damount") {
      message = "Set Default Amount";
      value = this.defaultAmount.toString();
      ttype = "text";
    }

    let prompt = this.alertCtrl.create({
      title: 'PerTrack',
      message: message,
      inputs: [
        {
          name: 'config',
          placeholder: 'Config',
          value: value,
          type: ttype
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Set',
          handler: data => {
            prompt.dismiss();
            this.dbManager.updateConfigData({ ctype: type, cvalue: data.config }).then(() => {
              this.getDataFromDb();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  onClickMobileBadge() {
    console.log("Mobile Badge");
  }

  onClickAddVehicle() {
    let prompt = this.alertCtrl.create({
      title: 'PerTrack',
      message: "Add Vehicle",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            prompt.dismiss();
            this.addVehicleIntoDb(data);
          }
        }
      ]
    });
    prompt.present();
  }

  onClickVehicleBadge() {

  }

}
