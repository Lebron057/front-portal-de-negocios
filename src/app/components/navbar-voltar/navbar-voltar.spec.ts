import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarVoltar } from './navbar-voltar';

describe('NavbarVoltar', () => {
  let component: NavbarVoltar;
  let fixture: ComponentFixture<NavbarVoltar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarVoltar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarVoltar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
