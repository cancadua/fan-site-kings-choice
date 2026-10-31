import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { OG_IMAGE, SeoPage, SITE_NAME, SITE_URL } from './seo.constants';

const JSON_LD_ID = 'seo-jsonld';

/**
 * Sets the title, description, canonical URL, social tags and breadcrumb data for the
 * current page. It runs during prerendering too, so the tags are in the generated HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update(page: SeoPage): void {
    const fullTitle = `${page.title} | ${SITE_NAME}`;
    const url = SITE_URL + (page.path === '/' ? '/' : page.path);
    const robots = page.noindex ? 'noindex, nofollow' : 'index, follow';

    this.title.setTitle(fullTitle);
    this.setName('description', page.description);
    this.setName('robots', robots);
    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:title', fullTitle);
    this.setProperty('og:description', page.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', OG_IMAGE);
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', fullTitle);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', OG_IMAGE);
    this.setCanonical(url);
    this.setBreadcrumbs(page);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setBreadcrumbs(page: SeoPage): void {
    let script = this.doc.head.querySelector<HTMLScriptElement>(
      `script#${JSON_LD_ID}`
    );
    const crumbs = page.breadcrumbs ?? [];
    if (crumbs.length === 0) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', JSON_LD_ID);
      this.doc.head.appendChild(script);
    }
    const items = [{ name: 'Home', path: '/' }, ...crumbs];
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: SITE_URL + item.path,
      })),
    });
  }
}
