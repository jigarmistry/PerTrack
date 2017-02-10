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
