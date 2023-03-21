import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { ElisticitySpectraTabComponent } from './elisticity-spectra-tab.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";

describe('ElisticitySpectraTabComponent', () => {
  let component: ElisticitySpectraTabComponent;
  let fixture: ComponentFixture<ElisticitySpectraTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, CommonModule
      ],
      providers: [
        ElisticitySpectraTabComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ElisticitySpectraTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
