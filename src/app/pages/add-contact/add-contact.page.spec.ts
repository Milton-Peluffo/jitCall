import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContactPage } from './add-contact.page';

describe('AddContactPage', () => {
  let component: AddContactPage;
  let fixture: ComponentFixture<AddContactPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
