import { Routes } from '@angular/router';
import { Home } from './components/home/home'; 
import { Login } from './components/login/login';
import { RegisterCliente } from './components/register-cliente/register-cliente';
import { RegisterEmpresa } from './components/register-empresa/register-empresa';   

export const routes: Routes = [
    {
        path: '', component: Home
    },

    {
        path:'login', component: Login
    },

    {
        path: 'register_cliente', component: RegisterCliente
    },
    {
        path: 'register_empresa', component: RegisterEmpresa
    }
];
