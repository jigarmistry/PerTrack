import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DbManager } from '../../helpers/db-manager';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public dbManager: DbManager;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dbManager = new DbManager();
  }

  ionViewDidLoad() {
    this.dbManager.getAllMobileNumbers();
  }

  onClickAddMobile() {
    console.log("Add Mobile");
  }

  onClickMobileBadge() {
    console.log("Mobile Badge");
  }

  onClickAddVehicle() {

  }

  onClickVehicleBadge() {

  }

}
