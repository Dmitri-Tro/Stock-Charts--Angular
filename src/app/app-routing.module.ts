import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {ViewModeComponent} from "./view-mode/components/view-mode/view-mode.component";
import {SettingsComponent} from "./settings/components/settings.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/view-mode',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'view-mode',
        component: ViewModeComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
