# Archived Legacy Reference

For current runtime tokens and component guidance, use `app/globals.css` and `DESIGN.md`. This file preserves the earlier Figma/import setup and may mention dark themes, warning/info statuses, legacy aliases, hex values, and token scopes that are no longer part of the minimal runtime token surface.

# Manual variables — fast track (15 minutes)

The Tokens Studio plugin isn't applying. Skip it. Build the variables we actually need directly in Figma's Variables panel. This list strips the system to ~30 essentials — enough to build the first 5 components — and adds the rest later.

## Step 1 — Open Variables panel (10 seconds)

1. Click anywhere on an **empty canvas** so nothing is selected.
2. In the right sidebar, find the row labeled **`Variables`** with the small icon. Click the icon (looks like `≡` or a small modal indicator).
3. The Variables modal opens.

## Step 2 — Create one collection: "Teavision" (15 seconds)

1. Top-left of the modal: click **`+ Create collection`** (or rename the default).
2. Name it: `Teavision`
3. Inside, you'll see **Modes** — top-right shows the default mode "Mode 1". Rename it to `Light`.
4. Click **`+`** next to the Mode 1 column header to add a second mode. Name it `Dark`.

You now have one collection with two modes.

## Step 3 — Add variables in groups

For each row below, click **`+ Create variable`** at the top, pick the **Type** from column 1, type the **Name** (use `/` for groups — Figma will auto-nest), then enter the **Light** value, **Tab** to the Dark column, enter the **Dark** value, hit **Return**.

You can paste hex values without the `#` and Figma adds it.

### Colors (16 variables)

| Type | Name | Light | Dark |
| --- | --- | --- | --- |
| Color | `bg/canvas` | `#FAF7F2` | `#06060A` |
| Color | `bg/surface` | `#FFFFFF` | `#100F0D` |
| Color | `bg/surface-sunken` | `#F2EFE9` | `#06060A` |
| Color | `bg/brand` | `#244332` | `#1B3327` |
| Color | `bg/brand-subtle` | `#F2F6F3` | `#1A1916` |
| Color | `text/default` | `#25241F` | `#F2EFE9` |
| Color | `text/strong` | `#100F0D` | `#FAF7F2` |
| Color | `text/muted` | `#4F4E4A` | `#CFC8B8` |
| Color | `text/subtle` | `#777671` | `#B0A793` |
| Color | `text/on-brand` | `#FAF7F2` | `#FAF7F2` |
| Color | `text/brand` | `#244332` | `#87AC8E` |
| Color | `border/subtle` | `#E7E7E5` | `#25241F` |
| Color | `border/default` | `#C9C9C5` | `#353431` |
| Color | `border/brand` | `#244332` | `#87AC8E` |
| Color | `border/focus` | `#B5841F` | `#D29F2E` |
| Color | `action/primary-bg` | `#100F0D` | `#FAF7F2` |
| Color | `action/primary-text` | `#FAF7F2` | `#100F0D` |

### Status colors (4 variables)

| Type | Name | Light | Dark |
| --- | --- | --- | --- |
| Color | `success/bg` | `#ECF5EE` | `#1B4B29` |
| Color | `success/text` | `#1B4B29` | `#ECF5EE` |
| Color | `danger/bg` | `#F9EAE8` | `#6A2118` |
| Color | `danger/text` | `#6A2118` | `#F9EAE8` |

### Spacing (8 variables — Number type)

Same value in both modes. Just paste the number into the Light column; Dark inherits unless you change it.

| Type | Name | Value |
| --- | --- | --- |
| Number | `space/1` | `4` |
| Number | `space/2` | `8` |
| Number | `space/3` | `12` |
| Number | `space/4` | `16` |
| Number | `space/5` | `20` |
| Number | `space/6` | `24` |
| Number | `space/8` | `32` |
| Number | `space/12` | `48` |

### Radius (3 variables — Number type)

| Type | Name | Value |
| --- | --- | --- |
| Number | `radius/sm` | `4` |
| Number | `radius/md` | `6` |
| Number | `radius/lg` | `8` |

### Control sizes (3 variables — Number type)

| Type | Name | Value |
| --- | --- | --- |
| Number | `size/control-sm` | `32` |
| Number | `size/control-md` | `40` |
| Number | `size/control-lg` | `48` |

---

**Total: 34 variables.**

When done, the Teavision collection will have these variables across 2 modes (Light/Dark). Type styles (Fraunces/Inter at our 14 sizes) and shadows are quick to add as **Text Styles** and **Effect Styles** — we'll do those right after. Ping me when the Variables panel shows ≥30 variables and I'll inspect.
