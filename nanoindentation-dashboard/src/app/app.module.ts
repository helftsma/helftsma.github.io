import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {ButtonModule} from 'primeng/button';
import {SidenavComponent} from './sidenav/sidenav.component';
import {AccordionModule} from "primeng/accordion";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import {FileUploadModule} from "primeng/fileupload";
import {HttpClientModule} from "@angular/common/http";
import { GraphsComponent } from './graphs/graphs.component';
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {TooltipModule} from 'primeng/tooltip';
import {MatSliderModule} from '@angular/material/slider';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    GraphsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    AccordionModule,
    BrowserAnimationsModule,
    InputNumberModule,
    FormsModule,
    InputSwitchModule,
    MultiSelectModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    TooltipModule,
    ChartModule, 
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
