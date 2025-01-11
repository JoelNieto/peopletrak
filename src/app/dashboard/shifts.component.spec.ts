import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from './dashboard.store';
import { ShiftsComponent } from './shifts.component';

describe('ShiftsComponent', () => {
  let component: ShiftsComponent;
  let fixture: ComponentFixture<ShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DashboardStore, MessageService, ConfirmationService],
      imports: [ShiftsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
