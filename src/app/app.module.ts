import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SidebarComponent } from "./features/sidebar/sidebar.component";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SidebarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
