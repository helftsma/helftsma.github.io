import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadTabComponent } from './download-tab.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';

describe('DownloadTabComponent', () => {
  let component: DownloadTabComponent;
  let fixture: ComponentFixture<DownloadTabComponent>;

  beforeEach(async () => {
   TestBed.configureTestingModule({
      imports: [
        CommonModule, HttpClientModule
      ],
      declarations: [ DownloadTabComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DownloadTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
