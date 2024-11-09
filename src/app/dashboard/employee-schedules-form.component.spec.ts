import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeSchedulesFormComponent } from './employee-schedules-form.component';

describe('EmployeeSchedulesFormComponent', () => {
  let component: EmployeeSchedulesFormComponent;
  let fixture: ComponentFixture<EmployeeSchedulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
