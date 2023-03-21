import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { FiltersTabComponent } from './filters-tab.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";

describe('FiltersTabComponent', () => {
  let component: FiltersTabComponent;
  let fixture: ComponentFixture<FiltersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CommonModule
      ],
      providers: [
        FiltersTabComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FiltersTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
