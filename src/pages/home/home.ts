import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AddMobileRechargePage } from '../add-mobile-recharge/add-mobile-recharge';
import { AddPetrolLogPage } from '../add-petrol-log/add-petrol-log';
import { SettingsPage } from '../settings/settings';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
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
