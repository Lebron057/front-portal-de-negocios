import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comerciante } from './comerciante';

describe('Comerciante', () => {
  let component: Comerciante;
  let fixture: ComponentFixture<Comerciante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comerciante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comerciante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
