import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DynamicStylesService {
  private loadedStyles = new Set<string>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadStyleUrls(styleUrls: string[], communityId: string): void {
    // Remove previous community styles
    this.removeStylesWithPrefix(`community-${communityId}`);

    // Load new styles
    styleUrls.forEach((url, index) => {
      this.loadStyle(url, `community-${communityId}-${index}`);
    });
  }

  private loadStyle(url: string, id: string): void {
    if (this.loadedStyles.has(url)) {
      return; // Already loaded
    }

    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.id = id;

    link.onload = () => {
      this.loadedStyles.add(url);
      console.log(`CSS loaded: ${url}`);
    };

    link.onerror = () => {
      console.error(`Failed to load CSS: ${url}`);
    };

    this.document.head.appendChild(link);
  }

  private removeStylesWithPrefix(prefix: string): void {
    const existingLinks = this.document.querySelectorAll(`link[id^="${prefix}"]`);
    existingLinks.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      this.loadedStyles.delete(href);
      link.remove();
    });
  }

  removeAllCommunityStyles(): void {
    const communityLinks = this.document.querySelectorAll('link[id^="community-"]');
    communityLinks.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      this.loadedStyles.delete(href);
      link.remove();
    });
  }
}
