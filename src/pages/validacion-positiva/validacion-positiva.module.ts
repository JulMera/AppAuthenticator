import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidacionPositivaPage } from './validacion-positiva';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ValidacionPositivaPage,
  ],
  imports: [
    IonicPageModule.forChild(ValidacionPositivaPage),
    TranslateModule,
  ],
})
export class ValidacionPositivaPageModule {}
