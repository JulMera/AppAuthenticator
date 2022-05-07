import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesafiliarPage } from './desafiliar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DesafiliarPage,
  ],
  imports: [
    IonicPageModule.forChild(DesafiliarPage),
    TranslateModule
  ],
})
export class DesafiliarPageModule {}
