---
name: upshift
description: Webdesign agency uit België met snelle websites, webshops en AI-oplossingen zonder bureaugedoe.
colors:
  warm-ash-cream: '#f8f5ef'
  warm-paper: '#fffcf7'
  ink-brown: '#16110f'
  paper-glow: '#fffcf7d1'
  warm-surface: '#f3ede3'
  quiet-stone: '#5f5751'
  signal-teal: '#06c2a4'
  signal-teal-strong: '#049e86'
  hairline-brown: '#16110f1f'
typography:
  display:
    fontFamily: 'Bespoke Slab Variable, Arial, Helvetica, sans-serif'
    fontSize: 'clamp(3.5rem, 7vw, 7rem)'
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: '-0.06em'
  headline:
    fontFamily: 'Bespoke Slab Variable, Arial, Helvetica, sans-serif'
    fontSize: '4rem'
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: '-0.012em'
  title:
    fontFamily: 'Bespoke Slab Variable, Arial, Helvetica, sans-serif'
    fontSize: '1.875rem'
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: '-0.01em'
  body:
    fontFamily: 'DM Sans, Arial, Helvetica, sans-serif'
    fontSize: '1.05rem'
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: 'DM Sans, Arial, Helvetica, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '0.22em'
rounded:
  pill: '9999px'
  soft: '12px'
  card: '24px'
  feature: '32px'
spacing:
  button-y: '0.95rem'
  button-x: '1.4rem'
  shell-x-mobile: '1.5rem'
  shell-x-desktop: '2rem'
  section-tight: 'clamp(4rem, 6vw, 5.5rem)'
  section: 'clamp(5rem, 7vw, 7rem)'
  hero: 'clamp(5.5rem, 8vw, 7.75rem)'
components:
  brand-grid:
    backgroundColor: '{colors.warm-ash-cream}'
    textColor: '{colors.ink-brown}'
    size: '36px 36px'
  button-primary:
    backgroundColor: '{colors.signal-teal}'
    textColor: '{colors.ink-brown}'
    rounded: '{rounded.pill}'
    padding: '{spacing.button-y} {spacing.button-x}'
  button-primary-hover:
    backgroundColor: '{colors.signal-teal-strong}'
    textColor: '{colors.ink-brown}'
    rounded: '{rounded.pill}'
    padding: '{spacing.button-y} {spacing.button-x}'
  button-secondary:
    backgroundColor: '{colors.warm-paper}'
    textColor: '{colors.ink-brown}'
    rounded: '{rounded.pill}'
    padding: '{spacing.button-y} {spacing.button-x}'
  surface-card:
    backgroundColor: '{colors.paper-glow}'
    textColor: '{colors.ink-brown}'
    rounded: '{rounded.feature}'
    padding: '2rem'
  social-square-post:
    backgroundColor: '{colors.warm-ash-cream}'
    textColor: '{colors.ink-brown}'
    rounded: '{rounded.soft}'
    size: '1080px 1080px'
  social-story-cover:
    backgroundColor: '{colors.ink-brown}'
    textColor: '{colors.warm-ash-cream}'
    rounded: '{rounded.soft}'
    size: '1080px 1920px'
---

# Design System: upshift

## 1. Overview

**Creative North Star: "The Clear Workshop"**

The upshift interface should feel like a focused project table: warm, bright, technically precise, and easy to enter. The brand sells clarity and speed, so the design uses generous space, strong display typography, concise copy, and direct action paths.

This is a brand surface, not a dense product shell. It should show craft through rhythm, image, performance and restrained interaction. It rejects generic AI-template styling, purple SaaS gradients, decorative glass layers, and card stacks that make the agency feel interchangeable.

For social media assets, the same system becomes a static editorial workshop: one decisive idea per post, a warm background, a clear typographic hierarchy, disciplined teal accents and enough negative space to feel premium in a busy feed. Social posts should look like close relatives of the website, not like generic Canva templates.

**Key Characteristics:**

- Warm off-white base with deep brown text and disciplined teal actions.
- Large expressive headlines balanced by compact, readable body copy.
- Editorial sections with occasional dark contrast bands for pacing.
- CSS-first motion that supports perceived quality without slowing the page.
- Clear CTA language that lowers commitment and makes the next step obvious.
- Social layouts built from one strong message, one proof cue and one restrained brand mark.
- The subtle Brand Grid gives hero sections and selected social assets a quiet technical workshop texture.

## 2. Colors

The palette is a warm neutral workshop with one precise teal signal. Teal should feel useful and rare, not decorative.

### Primary

- **Signal Teal** (`#06c2a4`): Primary CTAs, focus rings, underlines, active accents and small proof signals.
- **Deep Signal Teal** (`#049e86`): Hover state for primary actions and stronger interactive feedback.

### Neutral

- **Warm Ash Cream** (`#f8f5ef`): Page background and inverted button fill.
- **Warm Paper** (`#fffcf7`): Social card interiors, light buttons, quote panels and exported graphics that need a warmer alternative to pure white.
- **Ink Brown** (`#16110f`): Primary text, dark bands, footer background and high-contrast surfaces.
- **Paper Glow** (`#fffcf7d1`): Translucent surface cards and warm panels.
- **Warm Surface** (`#f3ede3`): Secondary hover backgrounds and stronger tonal surfaces.
- **Quiet Stone** (`#5f5751`): Body support text and muted labels.
- **Hairline Brown** (`#16110f1f`): Borders and section dividers.

### Named Rules

**The One Signal Rule.** Teal is for action, focus and proof. Do not expand it into a full teal theme.

**The Warm Neutral Rule.** Never use pure `#000` or `#fff` as the dominant interface colors. Keep neutrals warm and tied to the brand base.

**The Feed Contrast Rule.** Social posts may use Ink Brown as a full background for contrast, but at least one large warm area or warm text block should keep the asset connected to the website.

**The Grid Texture Rule.** The Brand Grid uses `rgba(22, 17, 15, 0.06)` 1px lines on a `36px` rhythm. Use it as a quiet background layer on warm surfaces, never as a loud pattern or dark-grid effect.

## 3. Typography

**Display Font:** Bespoke Slab Variable with Arial fallback  
**Body Font:** DM Sans with Arial fallback  
**Label/Mono Font:** DM Sans unless code blocks require browser monospace

**Character:** The pairing gives upshift an editorial but pragmatic voice. Bespoke Slab carries confidence and craft; DM Sans keeps service copy clear and operational.

### Hierarchy

- **Display** (700, `clamp(3.5rem, 7vw, 7rem)`, 1.06): Homepage hero and major page heroes only.
- **Headline** (400, `4rem`, 1.06): Section titles and long-form headings.
- **Title** (600, `1.875rem`, 1.15): Feature callouts, cards and image captions.
- **Body** (400, `1.05rem`, 1.7): Marketing copy, descriptions and rich text. Keep paragraphs around 65 to 75 characters when possible.
- **Label** (600, `0.875rem`, uppercase letter spacing around `0.22em`): Section labels, tags, metadata and small trust signals.

### Named Rules

**The Quiet Body Rule.** If a paragraph is doing the same work as its heading, cut it or make it more concrete.

**The Social Headline Rule.** Social graphics need one dominant line, usually 5 to 10 words. Use body text only when it adds a concrete next step, objection or proof cue.

## 4. Elevation

upshift uses a hybrid of tonal layering and soft ambient shadows. Resting surfaces are warm and lightly separated by borders; stronger shadows appear for interactive cards, elevated hero images and hover states.

### Shadow Vocabulary

- **Surface Ambient** (`0 12px 30px rgba(22, 17, 15, 0.04)`): Default `surface-card` lift.
- **Hero Image Lift** (`0 20px 44px rgba(22, 17, 15, 0.08)`): Large editorial image containers.
- **Primary Button Lift** (`0 12px 28px rgba(6, 194, 164, 0.25)`): Primary CTA at rest.
- **Primary Button Hover** (`0 16px 34px rgba(6, 194, 164, 0.35)`): CTA hover state.
- **Accent Card Hover** (`0 18px 40px rgba(6, 194, 164, 0.08)`): Interactive service or project hover.

### Named Rules

**The Shadow Follows Intent Rule.** Shadows must imply action, hierarchy or media depth. Do not add floating decoration to ordinary copy sections.

## 5. Components

### Buttons

- **Shape:** Fully rounded pill (`9999px`).
- **Primary:** Signal Teal background, Ink Brown text, `0.95rem 1.4rem` padding, semibold text and soft teal shadow.
- **Hover / Focus:** Move up `2px`, deepen background to Deep Signal Teal, increase shadow, keep visible teal focus outline.
- **Secondary:** White background, hairline border, Ink Brown text and subtle brown shadow. Use for lower-priority exploration links.

### Chips

- **Style:** Small rounded tags with translucent white on image overlays, or teal-tinted badges on dark AI cards.
- **State:** Use sparingly for project tags, case labels and status-like signals. Avoid turning chips into decorative confetti.

### Cards / Containers

- **Corner Style:** Feature cards use `32px`; smaller system containers can use `24px` or `12px`.
- **Background:** Paper Glow or warm white with Hairline Brown borders.
- **Shadow Strategy:** Low ambient shadow by default; stronger shadow only on hover or major media.
- **Border:** Thin warm brown borders, never thick colored side stripes.
- **Internal Padding:** Usually `2rem`; reduce only for dense utility panels.

### Inputs / Fields

- **Style:** Warm white fill, Hairline Brown border, rounded corners, clear labels and generous tap targets.
- **Focus:** Teal outline via global `:focus-visible`.
- **Error / Disabled:** Keep copy concrete and visible; do not rely on color alone.

### Navigation

Desktop navigation is compact, muted and text-first with teal underline animation on hover. The header is sticky with a warm translucent background and blur. Mobile navigation uses a full-height panel, large row links and one primary CTA at the bottom.

### Brand Grid

The Brand Grid is the subtle technical texture used in hero sections. It is made from two 1px linear gradients in warm brown at 6% opacity, repeated every `36px` horizontally and vertically. Use it behind hero copy, social quote posts, carousel covers and story covers when the asset needs a stronger link to the website. Keep it on Warm Ash Cream, Warm Paper or a very restrained warm panel. Do not use it over busy imagery, inside small cards or as the main decorative idea.

### Signature Motion

Hero and section reveals use IntersectionObserver plus CSS animations. Split headline words rotate and lift into place; cards and CTAs use transform-only hover movement. Reduced-motion users receive visible content without animation.

### Social Media Templates

Use these as first-class formats for LinkedIn and Instagram. Keep all important text inside a 9% safe area on every edge. Use `upshift` as a small wordmark, preferably top-left or bottom-left. Do not place the wordmark in a floating pill unless the layout already uses a clear panel.

- **LinkedIn feed graphic** (`1200x1200` or `1200x1500`): Warm Ash Cream background, one large Bespoke headline, one short DM Sans support line, one teal proof cue or CTA. Use `1200x1500` when the post needs a short list or mini-framework.
- **Instagram square post** (`1080x1080`): One idea only. Use oversized type, a small label, and either a warm surface block, the Brand Grid or one editorial image crop. Leave at least 96px outer margin.
- **Carousel cover** (`1080x1080`): Big headline, small content-pillar label, slide count marker such as `01/05`, and one teal rule, dot or underline. The cover should make the payoff obvious without reading the caption. Use the Brand Grid when the cover has no image.
- **Carousel content slide** (`1080x1080`): One point per slide. Use a large step number, a short title, and a 1 to 2 sentence explanation. Avoid paragraphs longer than 22 words.
- **Story or reel cover** (`1080x1920`): Use a dark Ink Brown or warm split background, keep the central 1080x1420 area clear, place the main title in the vertical middle third, and keep CTAs above the bottom 240px.
- **Case-study proof post** (`1200x1500`): Lead with the before/after tension, include one screenshot or cropped project image when available, and end with a concrete lesson rather than a vanity metric.

For social imagery, use real project screenshots, workshop/process photos or close crops of interface work. If stock imagery is unavoidable, choose tactile work scenes and avoid smiling-office stock, generic laptop hands and abstract AI visuals.

## 6. Do's and Don'ts

### Do:

- **Do** use Signal Teal for primary action, focus and proof cues.
- **Do** keep the page warm, bright and legible with Warm Ash Cream and Ink Brown.
- **Do** use Bespoke Slab for confident headings and DM Sans for practical service copy.
- **Do** preserve generous section rhythm through `section-shell`, `section-stack` and editorial image blocks.
- **Do** keep motion transform-based and respectful of `prefers-reduced-motion`.
- **Do** make social posts feel like a website fragment: warm surface, strong type, one teal signal and a clear idea.
- **Do** use Dutch/Flemish B2B copy by default for social: concrete, useful and direct.
- **Do** use the Brand Grid as a subtle workshop texture on warm social backgrounds and website hero-style sections.

### Don't:

- **Don't** use generic AI-template esthetiek, paarse SaaS-gradients or neon-on-black category reflexes.
- **Don't** create card-in-card layouts or endless identical card grids.
- **Don't** use decorative glassmorphism as the default surface treatment.
- **Don't** use `border-left` or `border-right` greater than `1px` as a colored accent on cards, list items, callouts or alerts.
- **Don't** use gradient text or pure decorative glow as a substitute for hierarchy.
- **Don't** make CTA copy vague. The next step should be explicit and low-friction.
- **Don't** create social posts around oversized standalone metrics. Metrics need context, proof or a before/after story.
- **Don't** use pure white social backgrounds. Use Warm Ash Cream, Warm Paper or Ink Brown.
- **Don't** use stock-looking business imagery, generic robot/AI graphics or floating dashboard mockups disconnected from upshift's real work.
- **Don't** make the Brand Grid high-contrast, colored teal or layered over busy photos.
