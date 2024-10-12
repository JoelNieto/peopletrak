import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { randomUUID } from 'crypto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from './dashboard.store';
import { EmployeeDetailComponent } from './employee-detail.component';

describe('EmployeeDetailComponent', () => {
  let component: EmployeeDetailComponent;
  let fixture: ComponentFixture<EmployeeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        ConfirmationService,
        ResizeObserver,
      ],
      imports: [EmployeeDetailComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('employee_id', randomUUID());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
