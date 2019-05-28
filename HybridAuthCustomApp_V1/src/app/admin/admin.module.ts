import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AppUsersDisplayComponent } from './app-users-display/app-users-display.component';
import { AppUserDetailComponent } from './app-user-detail/app-user-detail.component';

import { SharedModule, ConfirmDialogModule, ConfirmationService, DropdownModule, AccordionModule, AutoCompleteModule, ButtonModule, CalendarModule, CheckboxModule, DialogModule, EditorModule, FieldsetModule, FileUploadModule, GrowlModule, InputTextareaModule, ListboxModule, PaginatorModule, PanelModule, InputTextModule, ProgressBarModule, RadioButtonModule, RatingModule, SelectButtonModule, SplitButtonModule, TabViewModule, TreeModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppUsersDisplayComponent,
    AppUserDetailComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ConfirmDialogModule,
    DropdownModule,
    TableModule
  ]
})
export class AdminModule { }
