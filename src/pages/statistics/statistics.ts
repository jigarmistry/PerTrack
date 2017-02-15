import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {

  public stateType: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.stateType = "mobile";
  }

  ionViewDidLoad() {

  }

}
