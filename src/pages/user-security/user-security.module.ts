import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSecurityPage } from './user-security';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    UserSecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(UserSecurityPage),
    TranslateModule,
    NgxQRCodeModule
  ],
})
export class UserSecurityPageModule {}
