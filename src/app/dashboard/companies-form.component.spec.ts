import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompaniesFormComponent } from './companies-form.component';
import { DashboardStore } from './dashboard.store';

describe('CompaniesFormComponent', () => {
  let component: CompaniesFormComponent;
  let fixture: ComponentFixture<CompaniesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        ConfirmationService,
        DynamicDialogRef,
        { provide: DynamicDialogConfig, useValue: { data: {} } },
      ],
      imports: [CompaniesFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
