# ArtistSiteussy – Full-Stack Artist Website

A production-ready **Next.js 14** website template for contemporary artists, featuring bilingual support (English/French), portfolio management, commission requests, event calendar, Stripe-integrated shop functionality, and comprehensive admin panel with dynamic theme customization, social media management, and layout options.

## 🚀 Hosting & Deployment (Primary)

### Server-Side Hosting (Recommended)
This site is optimized for **server-side hosting** with full API functionality:

#### **Recommended Platforms:**
- **Vercel** (recommended) - Serverless deployment with Next.js optimization
- **Netlify** - Serverless functions with CDN and forms
- **Railway** - Full-stack deployment with database support
- **DigitalOcean App Platform** - Cloud hosting with scaling
- **AWS EC2/Lambda** - Enterprise-grade hosting

#### **Deploy Steps:**
```bash
# 1. Build the application
npm run build

# 2. Start production server
npm start

# 3. Or deploy to your hosting platform
# Platforms like Vercel will handle build automatically
```

#### **Environment Setup:**
Create a `.env.local` file:
```env
# Admin Panel Credentials
ADMIN_USER=admin
ADMIN_PASS=cedric2024

# Stripe (for payment features)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

#### **Data Storage:**
All content is stored in JSON files (`/public/*.json`) with real-time API updates:
- `siteMeta.json` - Site configuration, theme, and social media
- `portfolio.json` - Artwork collections
- `events.json` - Exhibitions and events
- `commissions.json` - Commission types and pricing
- `store.json` - Products for sale

### Admin Panel Access
- **URL**: `/admin/site-meta`
- **Default Credentials**: `admin` / `cedric2024`
- **Features**: Edit content, customize themes, manage sections, real-time saving

### Theme Customization
The site includes a powerful theme system with API-driven updates:
- **8 Professional Presets**: Default, Purple, Nature, Bold, Minimal, Ocean, Warm, Cool
- **Dynamic Colors**: Primary, secondary, accent, background, text colors
- **Font Selection**: Inter, Arial, Helvetica, Georgia, Times New Roman
- **Layout Options**: Scroll Layout or Tabbed Layout
- **Real-time Updates**: Changes save and apply immediately via API

### Bilingual Support
- **Languages**: English (default) and French
- **Switching**: Language toggle in header navigation
- **Content**: All text content supports both languages
- **API**: Server-side content updates for both languages

### Customization Options
- **Colors**: Primary, secondary, accent, background, and text colors
- **Fonts**: Choose from 5 font families for body and headings
- **Layout**: Scroll or tabbed navigation layout
- **Sections**: Show/hide website sections (Hero, Bio, Gallery, Events, Commissions, Shop)
- **Social Media**: Add links to all major platforms with automatic icons
- **Custom Links**: Add unlimited footer links with custom icons
- **Real-time Saving**: All changes save immediately to server

### Hosting Options

#### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and connect to Vercel
```

#### **Option 2: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### **Option 3: Traditional Server**
```bash
# Build for production
npm run build

# Start production server
npm start
```

#### **Option 4: Docker**
```bash
# Build Docker image
docker build -t cedric-site .

# Run container
docker run -p 3000:3000 cedric-site
```

## 🎨 Theme System Implementation

### How It Works
- **API-Driven Updates**: Theme settings save to server via API routes
- **CSS Custom Properties**: Colors and fonts applied via CSS variables
- **Real-time Application**: `ClientWrapper.tsx` loads and applies theme on page load
- **Persistent Storage**: Changes saved to `public/siteMeta.json` via API

### Available Customizations
- **Colors**: Primary (#7c3aed), Secondary (#a78bfa), Accent (#ec4899), Background (#ffffff), Text (#1f2937)
- **Fonts**: Inter, Arial, Helvetica, Georgia, Times New Roman
- **Layout**: Scroll or Tabbed navigation
- **Sections**: Enable/disable Hero, Bio, Gallery, Events, Commissions, Shop
- **Social Media**: Facebook, Twitter/X, Instagram, LinkedIn, YouTube, TikTok, Behance, Dribbble
- **Custom Links**: Unlimited footer links with custom icons

### Current Theme
Your site is currently using the **Purple Theme** preset with:
- Primary: Purple (#7c3aed)
- Secondary: Light Purple (#a78bfa)
- Accent: Pink (#ec4899)
- Background: White (#ffffff)
- Text: Dark Gray (#1f2937)

## 📁 Project Structure

```
artistsiteussy/
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx         # Root layout with dynamic metadata
│   ├── page.tsx           # Home page with footer
│   ├── admin/             # Admin panel pages
│   │   ├── site-meta/     # Site configuration editor
│   │   ├── portfolio/     # Portfolio management
│   │   ├── events/        # Events management
│   │   ├── commissions/   # Commission settings
│   │   └── store/         # Store management
│   └── api/               # API routes (server-side functionality)
│       ├── admin/         # Admin-specific APIs
│       │   ├── save/      # Save site metadata
│       │   ├── export/    # Export data
│       │   ├── import/    # Import data
│       │   └── upload/    # File upload
│       ├── auth/          # Authentication APIs
│       │   ├── login/     # Admin login
│       │   └── logout/    # Admin logout
│       ├── commissions.ts # Commission form handler
│       └── updateInventory.ts # Stripe webhook handler
├── components/            # React components
│   ├── Header.tsx         # Navigation with dynamic title
│   ├── Footer.tsx         # Social media footer with dynamic links
│   ├── Hero.tsx           # Animated hero section
│   ├── BioCard.tsx        # Artist biography
│   ├── GalleryGrid.tsx    # Portfolio masonry grid
│   ├── EventsCalendar.tsx # FullCalendar integration
│   ├── CommissionsForm.tsx # Commission request form
│   ├── ShopGrid.tsx       # Product catalog
│   ├── Lightbox.tsx       # Image lightbox component
│   ├── ClientWrapper.tsx  # Data loading and theme application
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and data loaders
│   ├── clientDataLoader.ts # Client-side JSON data fetching
│   ├── dataLoader.ts      # Server-side data loading
│   └── types.ts           # TypeScript interfaces
├── public/                # Static assets and data files
│   ├── siteMeta.json      # Site configuration, theme, and social media
│   ├── portfolio.json     # Artwork collections
│   ├── events.json        # Upcoming events
│   ├── commissions.json   # Commission types and pricing
│   ├── store.json         # Products for sale
│   └── placeholder/       # Image placeholder files
├── styles/globals.css     # Global styles with theme variables
├── siteConfig.ts          # Site configuration
└── next.config.js         # Next.js configuration
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Stripe account (only if using payment features)

### Local Development Setup

```bash
# Clone or navigate to the project directory
cd artistsiteussy

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint
```

## 🎨 Admin Panel Features

The website includes a comprehensive admin interface for managing all content and customization:

**Access**: Navigate to `/admin/site-meta` and log in with your credentials
**Default Credentials**: `admin` / `cedric2024` (change in `.env.local`)

### Available Editors:

#### 🎨 **Site Meta** - Complete site customization
- **Basic Information**: Artist name and **dynamic site title** (updates header and browser tab)
- **Biography**: Bilingual artist biography (English/French)
- **Taglines**: Short taglines in both languages
- **Contact Information**: Email and location details
- **Theme Manager**: Complete color and layout customization
  - **8 Professional Presets**: Default, Purple, Nature, Bold, Minimal, Ocean, Warm, Cool
  - Primary, secondary, accent colors with color pickers
  - Background and text colors
  - Font selection (Inter, Arial, Helvetica, Georgia, Times New Roman)
  - **Layout Options**: Scroll Layout or Tabbed Layout
  - **Real-time Preview**: See changes instantly without saving
- **Site Sections**: Enable/disable website sections
  - Hero, Biography, Gallery, Events, Commissions, Shop
  - Toggle switches for each section
- **Social Media Links**: Complete social media management
  - Facebook, Twitter/X, Instagram, LinkedIn, YouTube, TikTok
  - Behance, Dribbble, personal website
  - Platform-specific icons in footer
- **Custom Links**: Add unlimited custom footer links
  - Custom names and URLs
  - Icon selection (Globe, Link, External Link, Home, Mail, Phone, Camera, Image)

#### 🎭 **Portfolio** - Artwork collections and featured works
- Featured artworks and art collections with image uploads
- Bilingual descriptions and metadata

#### 📅 **Events** - Exhibitions and live painting events
- Exhibition, live painting events, and workshops
- Date pickers and location management

#### 💰 **Commissions** - Commission types and pricing
- Commission types, pricing, and process information

#### 🛍️ **Store** - Product inventory and sales
- Product inventory with availability toggles and image uploads

### Features:
- ✅ **Real-time Saving**: Changes save immediately via API routes
- ✅ Bilingual content editing (_en/_fr)
- ✅ Add/remove items dynamically
- ✅ Form validation for required fields
- ✅ Date pickers for events
- ✅ Availability toggles for store items
- ✅ **Image upload functionality** - Upload images directly or enter URLs
- ✅ **Dynamic site title** - Updates header navigation and browser tab
- ✅ **Theme customization** - Complete color and font control with 8 presets
- ✅ **Section management** - Show/hide website sections
- ✅ **Layout options** - Choose between Scroll or Tabbed layout
- ✅ **Live theme preview** - See changes instantly without saving
- ✅ **Social media integration** - Footer with platform icons
- ✅ **Custom links** - Unlimited footer links with icons
- ✅ **API-driven updates** - All changes save to server immediately
- ✅ Success/error notifications
- ✅ Secure authentication with logout

## 🔧 API Routes

The application includes several API endpoints for functionality:

### Admin APIs (`/api/admin/`)
- `POST /api/admin/save` - Save site metadata, themes, and configuration
- `GET /api/admin/export` - Export complete site data as ZIP
- `POST /api/admin/import` - Import site data from ZIP file
- `POST /api/admin/upload` - Upload images and files

### Authentication APIs (`/api/auth/`)
- `POST /api/auth/login` - Admin panel authentication
- `POST /api/auth/logout` - Admin logout

### Public APIs
- `POST /api/commissions` - Handle commission form submissions
- `POST /api/updateInventory` - Stripe webhook for inventory updates

## 💳 Stripe Integration

### Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe dashboard
3. Create a `.env.local` file in the project root:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Webhook Testing

1. Install Stripe CLI: `npm install -g stripe`
2. Login to Stripe: `stripe login`
3. Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/updateInventory
```

4. Trigger test events:

```bash
# Simulate a successful payment
stripe trigger payment_intent.succeeded
```

### Inventory Management

The `/api/updateInventory` endpoint:
- Receives Stripe webhook events
- Updates product inventory in `public/store.json`
- Uses atomic file operations for data consistency
- Automatically marks items as sold when inventory reaches 0

## 🎨 Customization

### Admin Panel Customization (Recommended)

The easiest way to customize the website is through the admin panel at `/admin/site-meta`:

#### 🎨 **Theme Customization**
- **8 Professional Presets**: One-click application of complete color schemes
- **Colors**: Use the color picker to customize primary, secondary, accent, background, and text colors
- **Fonts**: Choose from Inter, Arial, Helvetica, Georgia, and Times New Roman for body and heading fonts
- **Layout Options**: Choose between Scroll Layout (traditional scrolling) or Tabbed Layout (sections in tabs)
- **Live Preview**: See all changes instantly without saving

#### 📱 **Site Structure**
- **Section Management**: Enable/disable website sections (Hero, Bio, Gallery, Events, Commissions, Shop)
- **Social Media**: Add links to Facebook, Twitter/X, Instagram, LinkedIn, YouTube, TikTok, Behance, Dribbble
- **Custom Links**: Add unlimited custom footer links with icon selection
- **Site Title**: Update the site title (appears in header and browser tab)

#### 📝 **Content Management**
- **Bilingual Content**: Edit all content in both English and French
- **Real-time Updates**: All changes are reflected immediately on the website
- **API-Driven**: Changes save immediately to server via API routes

### Manual Customization

To adapt this template for different artists manually:

1. Update `siteConfig.ts` (fallback values):
    ```typescript
    export const siteConfig = {
      siteTitle: "Artist Name",
      defaultLocale: "en",
      locales: ["en", "fr"],
      dataFolder: "/data"
    }
    ```

2. Replace `/public/*.json` files with new artist content
3. Update `/public/placeholder/` with new images
4. Use the admin panel for theme and configuration changes

## 🆕 Recent Changes & Updates

### 🎨 **Server-Side Theme System**
- **API-Driven Updates**: Theme settings save to server via API routes
- **Real-time Application**: Changes apply immediately across the site
- **Persistent Storage**: Theme data stored in `public/siteMeta.json`
- **Dynamic CSS Variables**: Colors and fonts applied via CSS custom properties

### 📱 **Enhanced Server Compatibility**
- **Full API Functionality**: All admin features work with server-side APIs
- **Real-time Saving**: No more manual file updates - changes save immediately
- **Authentication**: Admin panel with login/logout functionality
- **File Uploads**: Image upload capability through admin interface

### ✨ Enhanced Admin Panel
- **Dynamic Site Title**: Update website title from admin (affects header & browser tab)
- **Advanced Theme Manager**: 8 professional presets, color customization, layout options
- **Section Management**: Show/hide website sections with toggle switches
- **Layout System**: Choose between Scroll or Tabbed layout with immediate application
- **Social Media Integration**: Footer with platform icons and custom links
- **Streamlined Interface**: Consolidated settings with real-time saving
- **Live Theme Preview**: See all changes instantly without saving

### 🔧 Technical Improvements
- **Enhanced TypeScript**: Comprehensive interfaces for theme presets and layout options
- **Better Data Management**: API-driven JSON updates with proper error handling
- **Server-Side Rendering**: Full SSR support with dynamic metadata
- **Authentication System**: Admin login/logout with session management
- **File Upload Support**: Image upload functionality through admin panel
- **Streamlined Architecture**: Clean separation between client and server functionality

## 🧪 Testing

### Unit Tests

Tests are located in `__tests__/` and cover:
- Inventory update functionality
- API validation
- Error handling
- Concurrent update scenarios

Run tests:
```bash
npm run test
```

### Test Scenarios

The inventory update tests cover:
- ✅ Normal sale (inventory decreases, item marked as sold)
- ✅ Product not found error handling
- ✅ Concurrent updates (prevents overselling)

## 📦 Deployment

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the project root with:

```env
# Admin Panel Credentials
ADMIN_USER=admin
ADMIN_PASS=cedric2024

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

For production deployment, also set:
- `NODE_ENV=production`

## 🔧 Technologies Used

### Core Framework
- **Next.js 14** - React framework with App Router and dynamic metadata
- **TypeScript** - Type-safe JavaScript with comprehensive interfaces
- **Tailwind CSS** - Utility-first CSS framework

### UI & Components
- **shadcn/ui** - Modern UI component library (Button, Input, Card, Switch, Select, etc.)
- **Lucide React** - Beautiful icon library (Facebook, Twitter, Instagram, etc.)
- **Framer Motion** - Animation library

### Content Management
- **React Hook Form** - Advanced form handling with validation
- **React Color Picker** - Visual color selection for themes
- **Dynamic Metadata** - Server-side metadata generation

### Data & APIs
- **Client/Server Data Loaders** - Efficient data fetching patterns
- **JSON File Management** - Atomic file updates for configuration
- **API Routes** - RESTful endpoints for admin functionality

### Internationalization & Features
- **Next Intl** - Internationalization (English/French support)
- **FullCalendar** - Event calendar integration
- **Stripe** - Payment processing and webhook handling

### Development & Testing
- **Vitest** - Unit testing framework
- **TypeScript ESLint** - Code linting and quality

### New Components Added
- **Footer Component** - Dynamic social media footer with custom links
- **Enhanced Header** - Dynamic title support
- **Admin Panel Extensions** - Theme manager, section toggles, API integration
- **Advanced Form Controls** - Color pickers, switches, multi-select dropdowns

## 📄 License

This project is a template for artist websites. Customize and deploy as needed for any contemporary artist.

## 🤝 Contributing

When making changes:
1. Update corresponding data files in `/public/`
2. Add placeholder images to `/public/placeholder/`
3. Update tests if modifying API functionality
4. Test both English and French locales

---

## 🚀 What's New in This Version

### 🎨 **Server-Side Theme System**
- **API-Driven Updates**: Theme settings save to server via API routes
- **Real-time Application**: Changes apply immediately across the site
- **Persistent Storage**: Theme data stored in `public/siteMeta.json` via API
- **Dynamic CSS Variables**: Colors and fonts applied via CSS custom properties

### 📱 **Enhanced Server Compatibility**
- **Full API Functionality**: All admin features work with server-side APIs
- **Real-time Saving**: No more manual file updates - changes save immediately
- **Authentication**: Admin panel with login/logout functionality
- **File Upload Support**: Image upload capability through admin interface

### ✨ Enhanced Admin Panel
- **Dynamic Site Title**: Update website title from admin (affects header & browser tab)
- **Advanced Theme Manager**: 8 professional presets, color customization, layout options
- **Section Management**: Show/hide website sections with toggle switches
- **Layout System**: Choose between Scroll or Tabbed layout with immediate application
- **Social Media Integration**: Footer with platform icons and custom links
- **Streamlined Interface**: Consolidated settings with real-time API saving
- **Live Theme Preview**: See all changes instantly without saving

### 🔧 Technical Improvements
- **Enhanced TypeScript**: Comprehensive interfaces for theme presets and layout options
- **Better Data Management**: API-driven JSON updates with proper error handling
- **Server-Side Rendering**: Full SSR support with dynamic metadata
- **Authentication System**: Admin login/logout with session management
- **File Upload Support**: Image upload functionality through admin panel
- **Streamlined Architecture**: Clean separation between client and server functionality

---

**Built with ❤️ for the global artist community**