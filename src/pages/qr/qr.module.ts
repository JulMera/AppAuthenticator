import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrPage } from './qr';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    QrPage,
  ],
  imports: [
    IonicPageModule.forChild(QrPage),
    TranslateModule,
    NgxQRCodeModule
  ],
})
export class QrPageModule {}
