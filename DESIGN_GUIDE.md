# Black & Gold Design Refactoring Guide

## Overview

The main design has been refactored with a **black and gold** theme with dynamic accent colors (emerald, crimson, azure, amber, purple, teal) that adapt to functionality.

---

## Background Image Setup

### Step 1: Prepare Your Image

You'll need a **medieval ball/feast scene** image with historical recognizable characters.

**Recommended specifications:**

- **Dimensions**: 1920x1080px or higher (min 1200px width)
- **Format**: JPG or PNG
- **File size**: 500KB - 2MB (optimize for web)
- **Content**: Medieval feast/ball with visible noble figures

### Step 2: Add to Project

1. **Place image** in `src/assets/img/`
2. **Name it** as `medieval-ball.jpg` (or similar)
3. **Update references**:
   - In `app-header.component.scss`: Change `background.jpg` to `medieval-ball.jpg`
   - The home component already uses this background

### Step 3: Optimize for Web

If your image is large:

```bash
# Using ImageMagick or similar tool
# Resize to max 2000px width
# Compress quality to 85-90%
```

**Recommended tools:**

- [TinyPNG](https://tinypng.com/) - Free compression
- [ImageOptim](https://imageoptim.com/) - Batch optimization
- Online resize tools

---

## Color System

### Primary Colors

- **Black**: `#0a0a0a` (main background)
- **Gold**: `#d4af37` (primary accent)

### Dynamic Accent Colors

Defined in `src/styles.scss`, applied via classes or SCSS variables:

| Color   | Value     | Usage                               |
| ------- | --------- | ----------------------------------- |
| Crimson | `#c41e3a` | Events, dramatic elements           |
| Emerald | `#218838` | Interactive tools, available states |
| Azure   | `#0066cc` | Information, primary actions        |
| Amber   | `#ff9800` | Warnings, important notices         |
| Purple  | `#663399` | Premium/Elite content               |
| Teal    | `#20b2aa` | Discovery, new content              |

### Applying Colors

In SCSS components:

```scss
.element {
  border-color: $crimson; // Crimson accent
  border-color: $emerald; // Emerald accent
  background: rgba($gold-primary, 0.1); // Gold overlay
}
```

In HTML with utility classes:

```html
<div class="card accent-emerald"></div>
<div class="card accent-crimson"></div>
```

---

## Component Updates

### Header (`app-header.component`)

- **Navigation**: Black background with gold links
- **Hover effects**: Gold glow and underline animation
- **Title**: Prominent gold text with shadow
- **Background**: Supports image with dark overlay

### Home Page (`home.component`)

- **Hero section**: Full-width image with gradient overlay
- **Content cards**: Three-column grid with hover effects
  - Featured card spans full width
  - Each card has dynamic accent color
  - Hover animation: lift effect with enhanced glow

### Events & Cities Tool

- Already styled with black-gold theme
- Consistent with new main design

---

## Navigation Structure

**Updated Navigation Links:**

- `Home` - Main landing page
- `Events` - Events list
- Additional routes can be added to `app-header.component.ts` navLinks array

**Adding New Navigation Items:**

```typescript
navLinks = [
  { label: 'Home', route: '/' },
  { label: 'Events', route: '/events' },
  { label: 'New Item', route: '/new-item' },
];
```

---

## Testing the Design

### 1. Start Development Server

```bash
npm start
```

### 2. Check Header

- Visit `http://localhost:4200`
- Verify navigation links appear with gold styling
- Hover over links to see animation
- Check background image displays properly

### 3. Check Home Page

- Verify hero section with title and subtitle
- Check three content cards layout
- Hover over cards to see lift animation
- Test responsive layout (mobile, tablet)

### 4. Verify Colors

- Gold accents should appear throughout
- Emerald accent on "Interactive Adventures" card
- Crimson accent on "Historic Events" card

### 5. Mobile Responsiveness

```bash
# Use Chrome DevTools
# Device toolbar (Ctrl+Shift+M)
# Test at: 375px, 768px, 1024px widths
```

---

## Customization

### Change Accent Colors

Edit `src/styles.scss`:

```scss
$crimson: #c41e3a; // Change to your color
$emerald: #218838; // Change to your color
```

### Adjust Card Layout

Edit `home.component.scss`:

```scss
.content-wrapper {
  grid-template-columns: repeat(
    3,
    1fr
  ); // Change to repeat(2, 1fr) for 2 columns
}
```

### Modify Header Height

Edit `app-header.component.scss`:

```scss
header {
  padding: 60px 40px 50px; // Adjust padding
}
```

---

## Performance Tips

1. **Optimize background image** - aim for <500KB after compression
2. **Use WebP format** - smaller file size, modern browsers support it
3. **Lazy load images** - consider lazy loading for below-fold images
4. **Monitor bundle size** - run `npm run build --stats-json`

---

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Mobile browsers**: Responsive design adapts to all sizes

---

## Troubleshooting

### Background Image Not Showing

1. Check file path in SCSS
2. Verify image exists in `src/assets/img/`
3. Check for typos in filename
4. Clear browser cache: Ctrl+Shift+Delete

### Colors Look Different

1. Check browser DevTools (might be cached)
2. Rebuild project: `npm run build`
3. Hard refresh: Ctrl+Shift+R

### Navigation Not Styled Correctly

1. Verify `app-header.component.scss` was updated
2. Check for CSS selector conflicts
3. Clear node_modules: `rm -r node_modules && npm install`

---

## Next Steps

1. ✅ Add background image to `src/assets/img/medieval-ball.jpg`
2. ✅ Update image path in component stylesheets
3. ✅ Test design in browser at `http://localhost:4200`
4. ✅ Adjust colors/layout as needed
5. ✅ Deploy to GitHub Pages when satisfied

---

**Last Updated**: 2026-07-27
