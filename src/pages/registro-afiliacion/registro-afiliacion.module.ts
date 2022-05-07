import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroAfiliacionPage } from './registro-afiliacion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegistroAfiliacionPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroAfiliacionPage),
    TranslateModule
  ],
})
export class RegistroAfiliacionPageModule {}
