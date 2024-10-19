import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimestampsComponent } from './timestamps.component';

describe('TimestampsComponent', () => {
  let component: TimestampsComponent;
  let fixture: ComponentFixture<TimestampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
