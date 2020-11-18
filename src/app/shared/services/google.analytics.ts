import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';

// --- use a declare to allow the compiler find the ga function
declare let ga: Function;

// notes you may need to do this as well: npm install --save-dev @types/google.analytics
@Injectable()


export class GoogleAnalyticsService {
  private subscription: Subscription;

  constructor(private router: Router) {  }


  public subscribe() {
    if (!this.subscription) {
      // subscribe to any router navigation and once it ends, write out the google script notices
      this.subscription = this.router.events.subscribe( e => {
        if (e instanceof NavigationEnd) {
          // this will find & use the ga function pulled via the google scripts
          try {
            ga('set', 'page', e.urlAfterRedirects);
            ga('send', 'pageview');
          } catch {
             console.log('tracking not found - make sure you installed the scripts');
          }
        }
      });
    }
  }

  public unsubscribe() {
    if (this.subscription) {
      // --- clear our observable subscription
      this.subscription.unsubscribe();
    }
  }

  public trackEvent(category: string, label: string, action: string = 'click', value: number = null) {
    try {
      ga('send', 'event', { eventCategory: category, eventLabel: label,
        eventAction: action, eventValue: value
      });
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

}
