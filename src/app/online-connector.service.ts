import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Observable, Subject, Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OnlineConnectorService implements OnDestroy {

  private offlineSubscription: Subscription;
  private onlineSubscription: Subscription;
  online$: Observable<boolean>;

  constructor() {
    console.log('constructor', window.navigator.onLine);
    const onlineStatusEmitter = new EventEmitter<boolean>();

    this.online$ = onlineStatusEmitter.pipe(
      startWith(window.navigator.onLine)
    );
    this.offlineSubscription = fromEvent(window, 'offline').subscribe(_ => onlineStatusEmitter.emit(false));
    this.onlineSubscription = fromEvent(window, 'online').subscribe(_ => onlineStatusEmitter.emit(true));
  }

  ngOnDestroy(): void {
    try {
      this.offlineSubscription.unsubscribe();
      this.onlineSubscription.unsubscribe();
    } catch (e) {
      console.log(e);
    }
  }

}
