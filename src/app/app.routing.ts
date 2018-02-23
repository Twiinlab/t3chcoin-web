import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { HallComponent } from './hall/hall.component';
import { NotFoundComponent } from './notfound/notfound.component';

export const AppRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'hall', component: HallComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', component: HomeComponent }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
