# Terrain Portfolio Redesign

## Summary
Redesign the portfolio as a vertical scroll "terrain" experience. Each section represents a deeper geological layer with organic shapes, earth-tone colors, and fluid animations. Route: `/redesign`.

## Aesthetic Direction
- **Style:** Organic / Fluid
- **Tone:** Creative, unexpected, memorable
- **Narrative:** Journey through work — each project is a chapter

## Color Palette
| Name | Hex | Role |
|------|-----|------|
| Cream | #F5F0E8 | Lightest background |
| Sand | #E8DCC8 | Upper layer background |
| Terracotta | #C2703E | Primary accent, CTAs |
| Olive | #5C6B4F | Secondary, tags |
| Dark Earth | #2A1F14 | Deep layers, text on light |
| Warm Black | #1A1410 | Deepest layer, footer |

## Typography
- **Display:** DM Serif Display (Google Fonts)
- **Body:** Outfit (Google Fonts)

## Page Structure

### 1. Opening — "Surface" (Cream/Sand)
- Large animated name (staggered letter reveal)
- Subtitle: short tagline
- Organic SVG blob background, slow CSS morph
- Custom fluid scroll indicator

### 2. About — "Topsoil" (Sand → Terracotta gradient)
- Asymmetric layout: text left, image right with organic mask
- 2-3 sentences max
- Tech stack as scattered "pebble" badges

### 3. Projects — "Deep Layers" (Terracotta → Olive → Dark Earth)
- Each project = new background layer
- Full-width: alternating screenshot left/right
- Organic wave/blob SVG dividers between projects
- Fluid hover animations
- Projects: Nexus, Midnight Studio, Budgetly

### 4. Reviews — "Fossils" (Dark Earth)
- Testimonial cards with organic/rough edges
- Slight rotation/tilt
- Max 3 reviews

### 5. Contact — "Roots" (Warm Black)
- Email, GitHub, LinkedIn, Upwork
- Organic root/branch decorative SVG
- "Let's create something together"

## Animations
- Scroll-driven fade-in + slide-up (Framer Motion whileInView)
- Parallax on blob/wave elements
- Fluid scale on hover
- Background blob morph (CSS, 15-20s loop)
- No particles, no floating orbs, no "tech" effects

## Mobile
- Single column, same flow
- Scaled blobs, touch-friendly targets (48px min)
- Responsive wave SVGs

## Excluded
- Services, Process, FAQ, CTA sections
- Dark/light toggle (single cohesive theme)
- Hamburger nav (scroll-only navigation)
