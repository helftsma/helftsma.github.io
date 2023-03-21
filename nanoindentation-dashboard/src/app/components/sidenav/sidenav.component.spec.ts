import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SidenavComponent} from './sidenav.component';
import {GraphService} from '../../services/graph.service';
import {ProcessorService} from '../../services/processor.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let graphService: GraphService;
  let processService: ProcessorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule],
      declarations: [SidenavComponent],
      providers: [GraphService, ProcessorService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    graphService = TestBed.inject(GraphService);
    processService = TestBed.inject(ProcessorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload raw data', () => {
    const spy = spyOn(graphService, 'uploadDataRaw');
    const file = new File([], 'test');
    const event = {target: {files: [file]}}; // update event object
    graphService.uploadDataRaw(event.target.files[0]);
    expect(spy).toHaveBeenCalledWith(file); // update expected argument
  });


});