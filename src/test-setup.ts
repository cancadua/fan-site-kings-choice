// jsdom does not implement element scrolling; stub it so components that
// scroll on init (e.g. NavHubComponent) can render under Vitest.
Element.prototype.scrollBy ??= () => undefined;
Element.prototype.scrollTo ??= () => undefined;
Element.prototype.scrollIntoView ??= () => undefined;
