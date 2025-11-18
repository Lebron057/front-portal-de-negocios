import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CardEmpresa } from './components/card-empresa/card-empresa';

export const routes: Routes = [
    {
        path: "", component: Home
    },
    {
        path: "card", component: CardEmpresa
    }
];
