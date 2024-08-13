import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from '../dashboard.store';
import { BranchesComponent } from './branches.component';

describe('BranchesComponent', () => {
  let component: BranchesComponent;
  let fixture: ComponentFixture<BranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DashboardStore, MessageService, ConfirmationService],
      imports: [BranchesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
