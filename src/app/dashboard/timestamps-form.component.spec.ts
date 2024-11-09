import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimestampsFormComponent } from './timestamps-form.component';

describe('TimestampsFormComponent', () => {
  let component: TimestampsFormComponent;
  let fixture: ComponentFixture<TimestampsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimestampsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimestampsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
