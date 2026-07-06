# Design Token Structure Documentation

## Overview
The design system uses a three-tier token architecture:
1. **Global tokens** - Base primitive values (colors, spacing, typography)
2. **Alias tokens** - Semantic tokens that reference globals (theme-specific)
3. **Component tokens** - Component-specific tokens that reference alias tokens

## Token Hierarchy

```
Global (primitives)
  ↓ references
Alias (semantic, theme-specific)
  ↓ references  
Component (component-specific)
```

## 1. Global Tokens

**Location:** `global.json`

**Structure:** `global.{category}.{subcategory}.{scale}`

**Characteristics:**
- Contains raw hex color values
- Organized by category (color, spacing, font, etc.)
- Scale-based naming (5, 10, 20, 30, etc. for colors)
- **Theme-agnostic** - same across light/dark modes

**Example:**
```json
{
  "global": {
    "color": {
      "neutrals": {
        "5": {
          "value": "#F7F7FA",
          "type": "color",
          "description": "Page background color"
        },
        "white": {
          "value": "#FFFFFF",
          "type": "color"
        }
      },
      "brand": {
        "60": {
          "value": "#5BB3EA",
          "type": "color"
        }
      }
    }
  }
}
```

**Categories include:**
- `color.neutrals` (grayscale palette)
- `color.brand` (brand colors)
- `color.red`, `color.orange`, `color.green`, etc. (semantic colors)
- `spacing` (layout spacing values)
- `font` (typography tokens)
- `borderRadius`

## 2. Alias Tokens

**Location:** `light.json` (light mode) and `dark.json` (dark mode)

**Structure:** `alias.{purpose}.{element}.{variant}.{state}`

**Characteristics:**
- Reference global tokens using `{global.category.subcategory.scale}`
- **Theme-specific** - different values for light vs dark mode
- Semantic naming based on purpose, not appearance
- Organized by usage context

**Example from light.json:**
```json
{
  "alias": {
    "content": {
      "text": {
        "primary": {
          "default": {
            "value": "{global.color.neutrals.100}",
            "type": "color",
            "description": "Primary color for text"
          }
        }
      }
    },
    "background": {
      "normal": {
        "value": "{global.color.neutrals.white}",
        "type": "color",
        "description": "Primary background color"
      }
    }
  }
}
```

**Example from dark.json (same token, different value):**
```json
{
  "alias": {
    "content": {
      "text": {
        "primary": {
          "default": {
            "value": "{global.color.neutrals.white}",
            "type": "color",
            "description": "Primary text color"
          }
        }
      }
    },
    "background": {
      "normal": {
        "value": "{global.color.neutrals.90}",
        "type": "color",
        "description": "Default component background"
      }
    }
  }
}
```

**Main alias categories:**
- `content.text.*` - Text colors (primary, secondary, link, negative, positive, etc.)
- `content.icon.*` - Icon colors
- `border.*` - Border colors (normal, negative, positive, etc.)
- `background.*` - Background colors
- `action.*` - Interactive element colors (primary, secondary, positive, negative)
- `interaction.border.*` - Input/form border states
- `interaction.background.*` - Input/form background states
- `accent.*` - Accent colors for notifications, badges, etc.
- `elevation.*` - Shadow/elevation values
- `chart.*` - Chart/data visualization colors

## 3. Component Tokens

**Location:** `button.json` (and other component files)

**Structure:** `component.{componentName}.{variant}.{state}.{property}`

**Characteristics:**
- Reference alias tokens using `{alias.category.element.variant}`
- Component-specific
- Organized by component, then variant, then state
- **Always start with "component."**

**Example from button.json:**
```json
{
  "component": {
    "button": {
      "primary": {
        "default": {
          "background": {
            "value": "{alias.action.primary.default}",
            "type": "color"
          },
          "text": {
            "value": "{alias.content.text.base}",
            "type": "color"
          }
        },
        "hover": {
          "background": {
            "value": "{alias.action.primary.hover}",
            "type": "color"
          }
        }
      }
    }
  }
}
```

**Common component patterns:**
- Variants: `primary`, `secondary`, `tertiary`, `danger`, `link`
- States: `default`, `hover`, `pressed`, `disabled`, `loading`
- Properties: `background`, `text`, `icon`, `border`

## Token Reference Syntax

Tokens reference other tokens using curly brace syntax:
- `{global.color.neutrals.white}` - References a global token
- `{alias.content.text.primary.default}` - References an alias token
- `#FFFFFF` - Raw hex value (should NOT be used in designs)

## Validation Rules

### Rule 1: No Hex Values
**CRITICAL** - Designers should NEVER use raw hex values in Figma.
- ❌ `#F7F7FA`
- ✅ `{alias.background.neutral}`

### Rule 2: Prefer Alias/Component over Global
**CRITICAL** - Global tokens should not be used directly.
- ❌ `{global.color.neutrals.5}`
- ✅ `{alias.background.neutral}`
- ✅ `{component.button.primary.default.background}`

### Rule 3: Use Correct Token Category
**WARNING** - Use tokens for their intended purpose.
- Background properties → Use `background.*` or `action.*` tokens
- Text properties → Use `content.text.*` tokens
- Icon properties → Use `content.icon.*` tokens
- Border properties → Use `border.*` or `interaction.border.*` tokens

### Rule 4: Dark Mode Compatibility
**WARNING** - Ensure tokens exist in both light.json and dark.json
- If a token only exists in light.json, it will break in dark mode
- Both component and alias tokens should have dark mode equivalents

### Rule 5: Component Token Structure
**INFO** - Custom components should use alias tokens, not global tokens
- ✅ `{alias.action.primary.default}`
- ❌ `{global.color.brand.60}`

### Rule 6: Design System Component Usage
**INFO** - Modified design system components should still use component/alias tokens
- If a button is modified, it should still reference `{component.button.*}` tokens

## Token Type Mapping

| Figma Property | Expected Token Category |
|----------------|------------------------|
| Fill (background) | `alias.background.*`, `alias.action.*`, `alias.interaction.background.*` |
| Fill (icon) | `alias.content.icon.*`, `component.*.icon` |
| Stroke/Border | `alias.border.*`, `alias.interaction.border.*`, `component.*.border` |
| Text Color | `alias.content.text.*`, `component.*.text` |
| Effect/Shadow | `alias.elevation.*` |

## Dark Mode Token Mapping

A token is dark-mode compatible if it exists in both files:

**Example - Compatible:**
```
light.json: alias.content.text.primary.default → {global.color.neutrals.100}
dark.json:  alias.content.text.primary.default → {global.color.neutrals.white}
✅ Both exist, safe for dark mode
```

**Example - NOT Compatible:**
```
light.json: alias.custom.special → {global.color.brand.60}
dark.json:  [token doesn't exist]
❌ Only in light mode, will break in dark mode
```

## Figma Token Representation

In Figma, tokens are typically represented as:
- **Styles:** Color styles, text styles, effect styles
- **Variables:** Design variables (newer Figma feature)
- **Token names:** Following the dot notation (e.g., `alias/content/text/primary/default`)

When designers use tokens in Figma, the Figma API returns either:
- A style reference (styleId)
- A variable reference (boundVariables)
- A raw color value (if they used hex directly)

## Summary

**Correct usage pattern:**
```
Designer creates a button background:
1. Uses component.button.primary.default.background
2. Which references → alias.action.primary.default
3. Which references → global.color.brand.60 (light) or global.color.brand.50 (dark)
4. Which resolves to → #5BB3EA (light) or #96CFF0 (dark)
```

**Incorrect usage patterns:**
```
❌ Designer uses #5BB3EA directly
❌ Designer uses global.color.brand.60 directly
❌ Designer uses alias.content.text.* for a background
❌ Designer uses a token that only exists in light.json
```
