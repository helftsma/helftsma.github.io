import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';
import {DownloadSettingsTabComponent} from './download-settings-tab.component';

describe('DownloadSettingsTabComponent', () => {
  let component: DownloadSettingsTabComponent;
  let fixture: ComponentFixture<DownloadSettingsTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CommonModule
      ],
      providers: [
        DownloadSettingsTabComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DownloadSettingsTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

