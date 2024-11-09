import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSchedulesComponent } from './employee-schedules.component';

describe('EmployeeSchedulesComponent', () => {
  let component: EmployeeSchedulesComponent;
  let fixture: ComponentFixture<EmployeeSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
