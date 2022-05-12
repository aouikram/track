import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { VehiculeComponent } from 'app/vehicule/vehicule.component';
import { AffectationComponent } from 'app/affectation/affectation.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MissionsComponent } from 'app/missions/missions.component';
import { ConducteurComponent } from 'app/conducteur/conducteur.component';
import { DeviceComponent } from 'app/device/device.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatListModule} from '@angular/material/list';
import { MatTableModule } from '@angular/material/table'  ;
import {MatIconModule} from '@angular/material/icon';
import * as moment from 'moment';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    

  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    DeviceComponent,
    ConducteurComponent,
    MissionsComponent,
    VehiculeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    AffectationComponent,

  ]
})

export class AdminLayoutModule {}
