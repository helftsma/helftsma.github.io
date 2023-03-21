import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { ForceIndTabComponent } from './force-ind-tab.component';

describe('ForceIndTabComponent', () => {
  let component: ForceIndTabComponent;
  let fixture: ComponentFixture<ForceIndTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        ForceIndTabComponent
      ]
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForceIndTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
