import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle tipoLogin between consumidor and empresa', () => {
    expect(component.tipoLogin).toBe('empresa');
    component.alternarTipo();
    expect(component.tipoLogin).toBe('consumidor');
    component.alternarTipo();
    expect(component.tipoLogin).toBe('empresa');
  });

  it('should call loginConsumidor on consumer form submit', () => {
    spyOn(component, 'loginConsumidor');
    component.tipoLogin = 'consumidor';
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.loginConsumidor).toHaveBeenCalled();
  });

  it('should call loginEmpresa on company form submit', () => {
    spyOn(component, 'loginEmpresa');
    component.tipoLogin = 'empresa';
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.loginEmpresa).toHaveBeenCalled();
  });
});
