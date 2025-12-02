import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDetalhesEmpresa } from './register-detalhes-empresa';

describe('RegisterDetalhesEmpresa', () => {
  let component: RegisterDetalhesEmpresa;
  let fixture: ComponentFixture<RegisterDetalhesEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDetalhesEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDetalhesEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
