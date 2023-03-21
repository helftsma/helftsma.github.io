import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ProcessItemComponent} from './process-item.component';
import {ProcessorService} from 'src/app/services/processor.service';
import {GraphService} from 'src/app/services/graph.service';
import {ErrorHandlerService} from 'src/app/services/error-handler.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('ProcessItemComponent', () => {
  let component: ProcessItemComponent;
  let fixture: ComponentFixture<ProcessItemComponent>;

  let errorHandler = new ErrorHandlerService();
  let http: HttpClient;
  let graph = new GraphService(http);

  let process: ProcessorService;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule, HttpClientModule
      ],
      providers: [
        GraphService,
        ErrorHandlerService,
        ProcessorService,
        ProcessItemComponent],
       schemas: [
         CUSTOM_ELEMENTS_SCHEMA
       ],
     })
       .compileComponents();
   });

   it('should create', () => {
     const service = new ProcessorService(http, errorHandler, graph);
     const component = new ProcessItemComponent(service);
     expect(component).toBeTruthy();
   });
 });
