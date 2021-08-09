import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  counter: number | undefined;
  timerRef: number = 0;
  running: boolean = false;
  _clicked: boolean = false;
  @Input() set clicked(value: boolean) {
    this._clicked = value;
    value ? this.startTimer() : this.clearTimer()
  }

  @Input() set stopped(value: boolean) {
    if (value) {
      this.running = false;
      clearInterval(this.timerRef);
    } else if (this._clicked)
      this.startTimer()
  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  clearTimer() {
    this.running = false;
    this.counter = undefined;
    clearInterval(this.timerRef);
  }

  millisToMinutesAndSeconds(millis: number) {
    let minutes: number = Math.floor(millis / 60000);
    let seconds: number = +((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

}
