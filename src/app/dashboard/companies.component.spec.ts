import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CompaniesComponent } from './companies.component';
import { DashboardStore } from './dashboard.store';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        MessageService,
        DynamicDialogRef,
        ConfirmationService,
      ],
      imports: [CompaniesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
