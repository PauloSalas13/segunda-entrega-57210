import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOkComponent } from './dialogOk.component';

describe('DialogokComponent', () => {
  let component: DialogOkComponent;
  let fixture: ComponentFixture<DialogOkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogOkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
