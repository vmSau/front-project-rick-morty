import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersComponent } from './pages/characters/components/characters/characters.component';
import { PageGuard } from './core/guards/page.guard';
import { PageResolver } from './core/resolvers/page.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: CharactersComponent,  
    resolve: { page: PageResolver },
    canActivate: [PageGuard],
    data: { characters: 'home' }  },
  { path: 'favorites', component: CharactersComponent,  
    data: { characters: 'favorites' }  },
  {
    path: '***',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
