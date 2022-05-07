import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TkQrPage } from './tk-qr';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    TkQrPage,
  ],
  imports: [
    IonicPageModule.forChild(TkQrPage),
    TranslateModule,
    NgxQRCodeModule
  ],
})
export class TkQrPageModule {}
