import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './pages/employee-details/employee-details.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'add-employee', component: EmployeeFormComponent },
  { path: 'employee/:id', component: EmployeeDetailsComponent },
  { path: 'employee/edit/:id', component: EmployeeFormComponent, canActivate: [authGuard] }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
