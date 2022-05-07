import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CommandsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommandsProvider {
  
  public E2ADMR43    : number = 0;  //ya * transfer OTP 
  public E2ADMR608_1 : number = 1;  //ya *
  public E2ADMR67PT  : number = 2;  //ya * 
  public E2ADMR81_1  : number = 3;  //ya *
  public E2LSCR12A   : number = 4;  //ya *
  public E2LSCR210   : number = 5;  //ya *
  public E2LSCR40D   : number = 6;  // no
  public E2LSCR69    : number = 7;  // no
  public E2LSCR72    : number = 8;  //ya *
  public E2LSCR89L   : number = 9;  //ya * 
  public E2LSMR6081  : number = 10; //ya * 
  public E2MOMR80    : number = 11; //ya * 
  public E2SECR61P   : number = 12; //ya *

  // Comando nuevos para encriptar
  public iv        : string = "iv";
  public salt      : string = "salt";
  public masterKey : string = "passphrase";


  constructor(public http: Http) {
    
  }

}
