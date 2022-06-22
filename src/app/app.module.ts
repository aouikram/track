import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ImageComponent } from './image/image.component';
import { MapLeafletComponent } from './map-leaflet/map-leaflet.component';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import * as bootstrap from "bootstrap";
import { NO_ERRORS_SCHEMA }      from '@angular/core'; //
import * as $ from "jquery";


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ImageComponent,
    


    
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ] // add this line
})
export class AppModule { }