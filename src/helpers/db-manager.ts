import { Injectable } from '@angular/core';
import { SqlManager } from './sql-manager';

@Injectable()
export class DbManager {

  public storage: SqlManager;

  constructor() {
    this.storage = new SqlManager();
    this.storage.setDatabase("app.db");
  }

  getAllMobileNumbers() {
    let sql = `SELECT * from mobilenumbers`;
    return this.storage.query(sql);
  }

  getAllVehicles() {
    let sql = `SELECT * from vehicles`;
    return this.storage.query(sql);
  }

  getMobileRechargesForHome(limit) {
    let sql = `SELECT mobilerecharge.*,mobilenumbers.mobilenumber from mobilerecharge, mobilenumbers where mobilerecharge.mobilenumberid = mobilenumbers.id order by mobilerecharge.id DESC limit ?`;
    return this.storage.query(sql, [limit]);
  }

  setInitialConfigData() {
    let sql = `INSERT INTO 'configdata'('ctype','cvalue') VALUES (?,?)`;
    this.storage.query(sql, ["rlimit", "2"]);
    this.storage.query(sql, ["dname", "Jigar"]);
    this.storage.query(sql, ["damount", "100"]);
  }

  getConfigData(ctype) {
    let sql = ` SELECT * from configdata where ctype = ?`;
    return this.storage.query(sql, [ctype]);
  }

  setConfigData(data) {
    let sql = `INSERT INTO 'configdata'('ctype','cvalue') VALUES (?,?)`;
    return this.storage.query(sql, [data["ctype"], data["cvalue"]]);
  }

  updateConfigData(data) {
    let sql = `UPDATE 'configdata' SET cvalue = ? WHERE ctype = ?`;
    return this.storage.query(sql, [data["cvalue"], data["ctype"]]);
  }

  addMobileNumber(data) {
    let sql = `INSERT INTO 'mobilenumbers'('mobilenumber','carrier','status') VALUES (?,?,?)`;
    return this.storage.query(sql, [data["mobilenumber"], data["carrier"], 'A']);
  }

  addVehicle(data) {
    let sql = `INSERT INTO 'vehicles'('name','status') VALUES (?,?)`;
    return this.storage.query(sql, [data["name"], 'A']);
  }

  addMobileRecharge(data) {
    let sql = `INSERT INTO 'mobilerecharge'('name','mobilenumberid','amount','type','logdate','status') VALUES (?,?,?,?,?,?)`;
    return this.storage.query(sql,
      [data["name"], data["mobilenumberid"], data["amount"], data["type"], data["logdate"], 'A']);
  }
}
