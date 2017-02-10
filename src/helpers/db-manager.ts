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
    this.storage.query(sql).then((data) => {
      console.log(data);
    });
  }

  insertIntoTable() {
    let sql = `INSERT INTO 'backup'('name','visible_name','item_id','status','user_id') VALUES (?,?,?,?,?)`;
    this.storage.query(sql, [1234567, "Backup Name", 12, 'A', '3']).then(() => {
      console.log("Data inserted");
    });
  }
}
