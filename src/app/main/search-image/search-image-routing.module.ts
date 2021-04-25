import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchImageComponent } from '../search-image/search-image.component';

const routes: Routes = [{ path: 'searchImage', component: SearchImageComponent },
{
  path: '',
  redirectTo: 'searchImage',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchImageRoutingModule { }
