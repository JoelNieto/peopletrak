import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from '../dashboard.store';
import { EmployeeListComponent } from './employee-list.component';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DashboardStore, MessageService, ConfirmationService],
      imports: [EmployeeListComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
