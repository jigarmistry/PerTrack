import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { DbManager } from '../helpers/db-manager';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  public dbManager: DbManager;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.dbManager = new DbManager();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.checkForInitialData();

    });
  }

  checkForInitialData() {
    this.dbManager.getConfigData("rlimit").then((data) => {
      if (data.res.rows.length > 0) {
      } else {
        this.dbManager.setInitialConfigData();
      }
    })
  }
}
