import {Component, Input, OnDestroy} from '@angular/core';
import {Adspot} from '../../model';
import {AppService} from '../../services';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-ad-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['../ad-space.component.scss']
})
export class UnregisteredComponent implements OnDestroy {
  @Input() ad: Adspot;
  private subscriptions = new Subscription();

  constructor(private appService: AppService) { }

  signIn() {
    this.subscriptions.add(
      this.appService.nearLogin().subscribe(result => console.log('nearLogin', result))
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
