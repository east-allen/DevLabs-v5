# DevLabs Color System

## 🎨 Quick Start

### 1. Import the Color System

Add this to your CSS file:
```css
@import './colors.css';
```

### 2. Use CSS Variables

```css
/* Primary colors */
.button {
  background-color: var(--primary-red);
  color: var(--text-white);
}

.button:hover {
  background-color: var(--primary-red-hover);
}

/* Text colors */
.heading {
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
}

/* Borders */
.card {
  border: 1px solid var(--border-light);
}

/* Shadows */
.card {
  box-shadow: 0 4px 20px var(--shadow-light);
}
```

### 3. Use Utility Classes

```html
<!-- Text utilities -->
<h1 class="text-primary">Main Heading</h1>
<p class="text-secondary">Subtitle text</p>
<span class="text-error">Error message</span>

<!-- Background utilities -->
<div class="bg-primary">White background</div>
<div class="bg-secondary">Light grey background</div>

<!-- Button utilities -->
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>

<!-- Shadow utilities -->
<div class="shadow-light">Light shadow</div>
<div class="shadow-medium">Medium shadow</div>

<!-- Focus utilities -->
<input class="focus-ring" type="text" />
```

## 🎯 Color Categories

### Brand Colors
- `--primary-red` - Main brand color (#ff5a5f)
- `--primary-red-hover` - Hover state (#e04e52)
- `--secondary-red` - Alternative red (#ff6b6b)
- `--secondary-orange` - Orange accent (#ff385c)

### Status Colors
- `--success-green` - Success states (#4CAF50)
- `--warning-orange` - Warning states (#FF9800)
- `--error-red` - Error states (#F44336)
- `--info-blue` - Info states (#17a2b8)

### Text Colors
- `--text-primary` - Main text (#333)
- `--text-secondary` - Secondary text (#666)
- `--text-muted` - Muted text (#888)
- `--text-white` - White text (#ffffff)

### Background Colors
- `--bg-primary` - Main background (#ffffff)
- `--bg-secondary` - Secondary background (#f7f7f7)
- `--bg-dark` - Dark background (#242424)
- `--bg-light` - Light background (#fafafa)

### Border Colors
- `--border-light` - Light borders (#e0e0e0)
- `--border-medium` - Medium borders (#ddd)
- `--border-primary` - Primary borders (#ff5a5f)

### Shadow Colors
- `--shadow-light` - Light shadows (rgba(0, 0, 0, 0.1))
- `--shadow-medium` - Medium shadows (rgba(0, 0, 0, 0.15))
- `--shadow-dark` - Dark shadows (rgba(0, 0, 0, 0.2))

## 🌙 Dark Mode

The color system automatically adapts to dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--devlabs-bg-primary);
    --text-primary: var(--devlabs-text-primary);
  }
}
```

## 🔧 Migration

Use the migration script to convert existing hardcoded colors:

```bash
# Migrate a specific file
node scripts/migrate-colors.js frontend/src/pages/Home.css

# Migrate all CSS files
node scripts/migrate-colors.js --all
```

## 📚 Full Documentation

See [COLOR_SYSTEM.md](../../../COLOR_SYSTEM.md) for complete documentation.

## 🎨 Color Palette Preview

### Primary Colors
```
🔴 --primary-red        #ff5a5f
🔴 --primary-red-hover  #e04e52
🟠 --secondary-orange   #ff385c
🔵 --accent-blue        #646cff
```

### Status Colors
```
🟢 --success-green      #4CAF50
🟠 --warning-orange     #FF9800
🔴 --error-red          #F44336
🔵 --info-blue          #17a2b8
```

### Neutral Colors
```
⚫ --text-primary       #333
⚫ --text-secondary     #666
⚫ --text-muted         #888
⚪ --bg-primary         #ffffff
⚪ --bg-secondary       #f7f7f7
⚪ --border-light       #e0e0e0
```

---

*This color system ensures consistency, maintainability, and accessibility across the entire DevLabs application.*