import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardStore } from './dashboard.store';
import { TimestampsComponent } from './timestamps.component';

describe('TimestampsComponent', () => {
  let component: TimestampsComponent;
  let fixture: ComponentFixture<TimestampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [MessageService, ConfirmationService, DashboardStore],
      imports: [TimestampsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimestampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});