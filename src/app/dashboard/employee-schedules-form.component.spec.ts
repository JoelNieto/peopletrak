import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DashboardStore } from '../stores/dashboard.store';
import { EmployeeSchedulesFormComponent } from './employee-schedules-form.component';

describe('EmployeeSchedulesFormComponent', () => {
  let component: EmployeeSchedulesFormComponent;
  let fixture: ComponentFixture<EmployeeSchedulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        ConfirmationService,
        DynamicDialogRef,
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
      imports: [EmployeeSchedulesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSchedulesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
