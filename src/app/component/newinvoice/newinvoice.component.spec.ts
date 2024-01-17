import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewinvoiceComponent } from './newinvoice.component';

describe('NewinvoiceComponent', () => {
  let component: NewinvoiceComponent;
  let fixture: ComponentFixture<NewinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewinvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
