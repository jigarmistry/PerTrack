import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddMobileRechargePage } from '../pages/add-mobile-recharge/add-mobile-recharge';
import { AddPetrolLogPage } from '../pages/add-petrol-log/add-petrol-log';
import { MobileRechargesPage } from '../pages/mobile-recharges/mobile-recharges';
import { VehicleLogsPage } from '../pages/vehicle-logs/vehicle-logs';
import { SettingsPage, MobilesPopOver, VehiclesPopOver } from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddMobileRechargePage,
    AddPetrolLogPage,
    SettingsPage,
    MobileRechargesPage,
    VehicleLogsPage,
    MobilesPopOver,
    VehiclesPopOver
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddMobileRechargePage,
    AddPetrolLogPage,
    SettingsPage,
    MobileRechargesPage,
    VehicleLogsPage,
    MobilesPopOver,
    VehiclesPopOver
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
