import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const win: any = window;

@Injectable()
export class SqlManager {

  private _db: any;

  constructor() {
  }

  setDatabase(dbname: string) {
    if (win.sqlitePlugin) {
      this._db = win.sqlitePlugin.openDatabase({
        name: dbname,
        location: 'default',
        createFromLocation: 0
      });
    } else {
      this._db = win.openDatabase(dbname, '1.0', 'database', 5 * 1024 * 1024);
    }
    this._tryInit();
  }

  // Initialize the DB with our required tables
  _tryInit() {
    // key value table
    this.query('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)').catch(err => {
      console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
    });

    // mobilerecharge table
    this.query(`CREATE TABLE IF NOT EXISTS 'mobilerecharge' ('id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT,'mobilenumberid' NUMBER, 'amount' TEXT, 'type' TEXT, 'logdate' TEXT, 'status' TEXT)`).then(() => {
        console.log("mobilerecharge table created");
      }, (error) => {
        console.log("Error in mobilerecharge table creation" + JSON.stringify(error.err));
      });

    // petrollog table
    this.query(`CREATE TABLE IF NOT EXISTS 'petrollog' ('id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT,'vehicleid' NUMBER, 'oddometer' TEXT, 'liters' TEXT, 'amount' TEXT, 'logdate' TEXT, 'status' TEXT)`).then(() => {
        console.log("petrollog table created");
      }, (error) => {
        console.log("Error in petrollog table creation" + JSON.stringify(error.err));
      });

    // mobilenumbers table
    this.query(`CREATE TABLE IF NOT EXISTS 'mobilenumbers' ('id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'mobilenumber' TEXT,'carrier' TEXT, 'status' TEXT)`).then(() => {
        console.log("mobilenumbers table created");
      }, (error) => {
        console.log("Error in mobilenumbers table creation" + JSON.stringify(error.err));
      });

    // vehicles table
    this.query(`CREATE TABLE IF NOT EXISTS 'vehicles' ('id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'vname' TEXT,'status' TEXT)`).then(() => {
        console.log("vehicles table created");
      }, (error) => {
        console.log("Error in vehicles table creation" + JSON.stringify(error.err));
      });

    // configdata table
    this.query(`CREATE TABLE IF NOT EXISTS 'configdata' ('id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'ctype' TEXT,'cvalue' TEXT)`).then(() => {
        console.log("configdata table created");
      }, (error) => {
        console.log("Error in configdata table creation" + JSON.stringify(error.err));
      });
  }

  /**
   * Perform an arbitrary SQL operation on the database. Use this method
   * to have full control over the underlying database through SQL operations
   * like SELECT, INSERT, and UPDATE.
   *
   * @param {string} query the query to run
   * @param {array} params the additional params to use for query placeholders
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._db.transaction((tx: any) => {
          tx.executeSql(query, params,
            (tx: any, res: any) => resolve({ tx: tx, res: res }),
            (tx: any, err: any) => reject({ tx: tx, err: err }));
        },
          (err: any) => reject({ err: err }));
      } catch (err) {
        reject({ err: err });
      }
    });
  }

  /**
   * Get the value in the database identified by the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  get(key: string): Promise<any> {
    return this.query('select key, value from kv where key = ? limit 1', [key]).then(data => {
      if (data.res.rows.length > 0) {
        return data.res.rows.item(0).value;
      }
    });
  }

  /**
   * Set the value in the database for the given key. Existing values will be overwritten.
   * @param {string} key the key
   * @param {string} value The value (as a string)
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  set(key: string, value: any): Promise<any> {
    return this.query('insert or replace into kv(key, value) values (?, ?)', [key, value]);
  }

  /**
   * Remove the value in the database for the given key.
   * @param {string} key the key
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  remove(key: string): Promise<any> {
    return this.query('delete from kv where key = ?', [key]);
  }

  /**
   * Clear all keys/values of your database.
   * @return {Promise} that resolves or rejects with an object of the form { tx: Transaction, res: Result (or err)}
   */
  clear(): Promise<any> {
    return this.query('delete from kv');
  }

}
