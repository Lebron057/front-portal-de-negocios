import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEmpresa } from './register-empresa';

describe('RegisterEmpresa', () => {
  let component: RegisterEmpresa;
  let fixture: ComponentFixture<RegisterEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
