# CARE24 UI GUIDELINES

---

# Purpose

This document is the official frontend design specification for the Care24 project.

Every UI generated for this project must follow these guidelines.

This document is the single source of truth for all frontend design decisions.

If any future request conflicts with these guidelines, this document takes priority unless I explicitly override it.

---

# Project

Name:
Care24 – Healthcare & Elderly Care Platform

Frontend Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS v4
- JavaScript (No TypeScript)

Architecture

- Component-based architecture
- Reusable UI
- Clean folder structure
- Responsive design
- Accessibility first

---

# Role

Act as the project's Senior Frontend Architect.

Your responsibility is to maintain one consistent design language across the entire application.

Every component should feel like it belongs to the same product.

Never introduce a new visual style.

---

# Design Philosophy

Care24 is a premium Healthcare SaaS application.

The UI should always feel:

- Clean
- Minimal
- Premium
- Modern
- Professional
- Medical
- Trustworthy
- Friendly
- Soft
- Elegant

The interface should inspire trust and professionalism while remaining approachable.

---

# Color Palette

Primary
#2563EB

Secondary
#14B8A6

Accent
#F97316

Success
#22C55E

Warning
#FACC15

Error
#EF4444

Background
#F8FAFC

Card Background
#FFFFFF

Text
#0F172A

Muted Text
#64748B

Border
#E2E8F0

Rules

- Never hardcode random colors.
- Use only the approved color palette.
- Maintain color consistency throughout the project.

---

# Typography

Typography should always feel clean and modern.

Requirements

- Strong hierarchy
- Comfortable spacing
- Professional appearance
- Readable font sizes
- Accessible contrast

---

# Border Radius

Use modern rounded corners.

Preferred sizes

- Large
- Extra Large

Avoid sharp corners unless explicitly required.

---

# Shadows

Use soft premium shadows.

Prefer

- subtle depth
- smooth elevation
- layered shadows

Avoid

- harsh shadows
- heavy black shadows

---

# Spacing

Maintain one consistent spacing system.

Every page should feel balanced.

Avoid random margins and padding.

---

# Animations

Animations should feel smooth and natural.

Preferred animations

- Fade In
- Slide Up
- Hover Lift
- Floating Elements
- Button Hover
- Card Hover
- Page Transition
- Modal Animation
- Toast Animation
- Loading Skeleton
- Soft Pulse

Animation Rules

- Keep animations subtle.
- Never distract the user.
- Prefer transform and opacity animations.
- Keep transitions smooth.

---

# Glassmorphism

Glass effects may be used only where appropriate.

Examples

- Navbar
- Floating Cards
- Dialogs
- Dashboard Panels

Avoid excessive glass effects.

---

# Components

Every component should follow the same design language.

Create reusable styling for

- Buttons
- Cards
- Forms
- Inputs
- Textareas
- Select Boxes
- Checkboxes
- Radio Buttons
- Tables
- Pagination
- Navigation
- Sidebar
- Dashboard Widgets
- Alerts
- Badges
- Chips
- Tooltips
- Dropdowns
- Avatars
- Modals
- Empty States
- Loading States
- Skeleton Loaders
- Toast Notifications

---

# Responsive Design

Desktop First

Then

Tablet

Then

Mobile

Requirements

- Responsive layouts
- Responsive spacing
- Responsive typography
- Responsive navigation
- Responsive tables
- Responsive cards

Never break layouts on smaller screens.

---

# Accessibility

Every component should support accessibility.

Requirements

- Semantic HTML
- Proper contrast
- Keyboard navigation
- Focus states
- Screen reader friendly where appropriate
- Accessible forms
- Visible focus rings

---

# Component Standards

Every component should be

- Reusable
- Clean
- Responsive
- Accessible
- Maintainable
- Easy to understand

Avoid duplicated UI.

Prefer reusable patterns.

---

# Code Quality

Keep code readable.

Requirements

- Clean JSX
- Small reusable components
- Avoid duplicated classes
- Keep styling consistent
- Use Tailwind utilities correctly
- Preserve readability

---

# Performance

Prefer lightweight UI.

Requirements

- Avoid unnecessary DOM nodes
- Avoid unnecessary re-renders
- Use transform animations
- Use opacity transitions
- Keep animations GPU-friendly

---

# Design Rules

Always

- Follow the Care24 design language.
- Reuse existing styles whenever possible.
- Maintain consistent spacing.
- Maintain consistent typography.
- Maintain consistent shadows.
- Maintain consistent colors.
- Maintain consistent animations.

Never invent a new visual style.

---

# Functional Rules

Never modify

- Business Logic
- API Calls
- Routing
- Authentication
- State Management
- Hooks
- Event Handlers
- Data Flow

Preserve

- React Logic
- Props
- State
- Context
- Redux
- Event Handling

Only improve presentation unless explicitly instructed otherwise.

---

# Project Rules

Do NOT

- Install additional libraries unless explicitly requested.
- Rewrite existing components.
- Create unnecessary files.
- Rename files without permission.
- Create components that were not requested.
- Change folder structure unnecessarily.
- Modify backend logic.
- Modify API structure.
- Change React Router configuration.
- Replace Tailwind with another styling solution.

Always

- Reuse existing files.
- Reuse existing components.
- Keep Tailwind CSS v4 compatibility.
- Build after major changes.
- Fix build errors before stopping.
- Keep code production-ready.

---

# Working Rules

Before every task

1. Read this document.
2. Understand the existing component.
3. Preserve all functionality.
4. Apply the Care24 design language.
5. Keep styling consistent.
6. Verify the application builds successfully.
7. Fix any build errors before completing the task.

---

# Reference Design

The provided Care24 reference is for inspiration only.

Do NOT copy

- HTML
- JSX
- Layout
- Component hierarchy
- Page structure

Only reuse

- Design language
- Color palette
- Typography
- Motion
- Spacing
- Shadows
- Visual consistency

Every page should be newly designed while preserving the same Care24 identity.

---

# Final Rule

The UI should always look like it belongs to one professional Healthcare SaaS product.

Consistency is more important than creativity.

Every new component must match the existing Care24 design language.