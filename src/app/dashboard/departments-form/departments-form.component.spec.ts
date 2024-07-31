import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DashboardStore } from '../dashboard.store';
import { DepartmentsFormComponent } from './departments-form.component';

describe('DepartmentsFormComponent', () => {
  let component: DepartmentsFormComponent;
  let fixture: ComponentFixture<DepartmentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        DynamicDialogRef,
        ConfirmationService,
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
      imports: [DepartmentsFormComponent, DynamicDialogModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
