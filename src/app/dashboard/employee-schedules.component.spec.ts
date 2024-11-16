import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from './dashboard.store';
import { EmployeeSchedulesComponent } from './employee-schedules.component';

describe('EmployeeSchedulesComponent', () => {
  let component: EmployeeSchedulesComponent;
  let fixture: ComponentFixture<EmployeeSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DashboardStore, MessageService, ConfirmationService],
      imports: [EmployeeSchedulesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
