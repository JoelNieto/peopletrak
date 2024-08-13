import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from '../dashboard.store';
import { PositionsComponent } from './positions.component';

describe('PositionsComponent', () => {
  let component: PositionsComponent;
  let fixture: ComponentFixture<PositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ConfirmationService, MessageService, DashboardStore],
      imports: [PositionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
