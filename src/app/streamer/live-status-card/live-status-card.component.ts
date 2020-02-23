import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-live-status-card',
  templateUrl: './live-status-card.component.html',
  styleUrls: ['./live-status-card.component.scss']
})
export class LiveStatusCardComponent implements OnDestroy, OnInit {
  private alive = true;

  @Input() liveUpdateChartData: { value: [string, number] }[];
  @Input() streamTime;
  @Input() isStreaming;
  @Output() streamStatusChange = new EventEmitter<any>();

  currentTheme: string;
  hoverLive = false;

  constructor(private themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  switchStreamStatus() {
    this.streamStatusChange.emit();
  }

}
