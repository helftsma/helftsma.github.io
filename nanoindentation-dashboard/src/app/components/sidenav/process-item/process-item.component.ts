import {Component, Input} from '@angular/core';
import {Process} from "../../../models/process.model";
import {ProcessorService} from "../../../services/processor.service";
import {EInputFieldType} from "../../../models/input.model";
import {EGeometryType} from "../../../models/geometry.model";

@Component({
  selector: 'app-process-item',
  templateUrl: './process-item.component.html',
  styleUrls: ['./process-item.component.scss']
})
export class ProcessItemComponent {

  // RESUSABLE COMPONENT TO BE USED WHENEVER A PROCESS NEEDS INPUTS

  @Input() process: Process;

  EInputFieldType = EInputFieldType;
  geometries: { name: string, value: EGeometryType }[] = [
    {name: 'Sphere', value: EGeometryType.SPHERE},
    {name: 'Cone', value: EGeometryType.CONE},
    {name: 'Cylinder', value: EGeometryType.CYLINDER},
    {name: 'Pyramid', value: EGeometryType.PYRAMID}
  ];

  constructor(public processorService: ProcessorService) {
  }

}
