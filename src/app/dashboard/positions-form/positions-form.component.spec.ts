import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DashboardStore } from '../dashboard.store';
import { PositionsFormComponent } from './positions-form.component';

describe('PositionsFormComponent', () => {
  let component: PositionsFormComponent;
  let fixture: ComponentFixture<PositionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        DynamicDialogRef,
        ConfirmationService,
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
      imports: [PositionsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PositionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
