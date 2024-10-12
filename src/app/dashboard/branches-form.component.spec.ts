import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BranchesFormComponent } from './branches-form.component';
import { DashboardStore } from './dashboard.store';

describe('BranchesFormComponent', () => {
  let component: BranchesFormComponent;
  let fixture: ComponentFixture<BranchesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        DynamicDialogRef,
        ConfirmationService,
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
      imports: [BranchesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
