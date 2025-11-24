import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CardEmpresa } from './components/card-empresa/card-empresa';



import { Register } from './components/register/register';  
import { Login } from './components/login/login'; 
import { VerDetalhes } from './components/ver-detalhes/ver-detalhes';


export const routes: Routes = [
    
    {
        path: "", component: Home
    },
    {
        path: "card", component: CardEmpresa
    },
    {
        path: "login", component: Login
    },
    {
        path: 'register', component: Register
    },
    {
        path: 'detalhe', component: VerDetalhes
    }
];
