import { Routes } from '@angular/router';
import { Home } from './components/home/home';



import { Register } from './components/register/register';  
import { Login } from './components/login/login'; 


export const routes: Routes = [
    
    {
        path: "", component: Home
    },
    {
        path: "login", component: Login
    },
    {
        path: 'register', component: Register
    }
];
