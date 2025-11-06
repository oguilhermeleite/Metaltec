# 📁 Metaltec Estoque - Estrutura do Projeto

```
Metaltec/
│
├── app/                                  # Next.js 14 App Router
│   ├── api/                             # API Routes
│   │   ├── auth/[...nextauth]/         # NextAuth endpoints
│   │   │   └── route.ts
│   │   └── storage/                    # Storage operations
│   │       ├── store/route.ts         # Store items in locations
│   │       └── overflow/route.ts      # Store items in overflow
│   │
│   ├── login/                          # Login page
│   │   └── page.tsx
│   │
│   ├── product/[id]/                   # Product detail & storage
│   │   └── page.tsx
│   │
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Homepage (dashboard)
│   └── globals.css                     # Global styles + Tailwind
│
├── components/                          # React Components
│   ├── MobileSearchInterface.tsx       # Mobile-first search UI
│   ├── DesktopDashboard.tsx           # Desktop dashboard with KPIs
│   └── ProductDetailView.tsx          # Product detail & receiving flow
│
├── lib/                                # Utilities & configs
│   ├── auth.ts                        # NextAuth configuration
│   └── prisma.ts                      # Prisma client singleton
│
├── prisma/                             # Database schema & seeds
│   ├── schema.prisma                  # Database models
│   └── seed.ts                        # Sample data seeder
│
├── public/                             # Static assets
│   ├── manifest.json                  # PWA manifest
│   └── sw.js                          # Service Worker
│
├── .env                               # Environment variables (LOCAL)
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── .eslintrc.json                     # ESLint config
├── next.config.mjs                    # Next.js config
├── tailwind.config.ts                 # Tailwind CSS config
├── postcss.config.mjs                 # PostCSS config
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencies & scripts
│
├── README.md                          # Full documentation
├── QUICKSTART.md                      # Quick start guide
└── PROJECT_STRUCTURE.md               # This file
```

## 🗂️ Key Files Explained

### Database Layer
- **`prisma/schema.prisma`** - Complete database schema with 8 models
  - Users (authentication & roles)
  - Products (~200 hardware items)
  - Locations (24 shelf positions)
  - OverflowItems (gordura/temporary storage)
  - Movements (audit trail)
  - ProductionOrders (items marked as "OK")

### Authentication
- **`lib/auth.ts`** - NextAuth configuration with credentials provider
- **`app/api/auth/[...nextauth]/route.ts`** - Auth API endpoint
- **`app/login/page.tsx`** - Login UI

### Core Features
- **`app/page.tsx`** - Main entry point (mobile/desktop split)
- **`app/product/[id]/page.tsx`** - Product detail with storage workflow
- **`components/MobileSearchInterface.tsx`** - Primary operator interface
- **`components/ProductDetailView.tsx`** - Receiving workflow with smart suggestions

### Storage APIs
- **`app/api/storage/store/route.ts`** - Store items in shelf locations
- **`app/api/storage/overflow/route.ts`** - Store items in overflow

### Configuration
- **`.env`** - Local database connection, secrets
- **`tailwind.config.ts`** - Metaltec blue branding colors
- **`next.config.mjs`** - Image domains, server actions

## 📊 Database Models

```
User (authentication)
  ├── role: OPERATOR | MANAGER | EXPEDITION | PRODUCTION
  └── movements[]

Product (hardware catalog)
  ├── code: "1122 BR", "1510X CR", etc.
  ├── floor: 1 | 2
  ├── color: BR, PT, CR, MA, ME, BZ
  └── locations[]

Location (24 shelf positions)
  ├── floor: 1 | 2
  ├── column: L1-L6
  ├── boxPosition: 1 | 2
  ├── status: EMPTY | LOW | FULL | IN_PRODUCTION
  └── quantity: 0-2 boxes

OverflowItem (temporary storage)
  ├── quantity: number of boxes
  ├── dateStored: timestamp
  ├── priority: calculated by age
  └── waitingForFloor: 1 | 2

Movement (audit trail)
  ├── movementType: RECEIVED | STORED | MOVED | WITHDRAWN | TRANSFERRED
  ├── quantityBefore/After
  └── timestamp

ProductionOrder (items being produced)
  ├── quantityOrdered
  ├── expectedDelivery
  └── status: PENDING | IN_PRODUCTION | COMPLETED
```

## 🔄 Data Flow

### Receiving Workflow
```
Operator searches product
  ↓
System finds available locations
  ↓
Smart suggestion (same column priority)
  ↓
Operator selects quantity
  ↓
Confirms storage
  ↓
[API] /api/storage/store
  ↓
Update location status
  ↓
Create movement record
  ↓
Redirect to homepage
```

### Overflow Workflow
```
No space available
  ↓
Store in overflow
  ↓
[API] /api/storage/overflow
  ↓
Create overflow item
  ↓
Track priority (age)
  ↓
Alert when space opens
  ↓
Transfer to shelf
```

## 🎨 UI Components Structure

### Mobile View (Operator)
```
MobileSearchInterface
  ├── Search bar (autocomplete)
  ├── Quick actions (4 cards)
  │   ├── Armazenar Item
  │   ├── Gordura (overflow)
  │   ├── Itens Críticos
  │   └── Ver Estoque
  └── Recent movements list
```

### Desktop View (Manager)
```
DesktopDashboard
  ├── Header with CTA
  ├── KPI Cards (4 metrics)
  ├── Floor Visualization (heatmap)
  │   ├── Floor 1 (6 columns)
  │   └── Floor 2 (6 columns)
  └── Two-column grid
      ├── Recent movements
      └── Overflow items
```

### Product Detail View
```
ProductDetailView
  ├── Product info card
  ├── Current locations
  ├── Storage section
  │   ├── Quantity selector (1-5)
  │   ├── Smart location suggestion
  │   ├── Available locations list
  │   └── Confirm button
  └── Movement history
```

## 🔐 Security & Permissions

### Middleware Protection
- All routes except `/login` require authentication
- Server-side session validation
- Role-based access control

### User Roles

| Role | Permissions |
|------|-------------|
| OPERATOR | Search, store, move items, view overflow |
| MANAGER | Dashboard, reports, mark as "OK", all operator permissions |
| EXPEDITION | View stock, register withdrawals |
| PRODUCTION | View status only |

## 🚀 Performance Optimizations

1. **Server-side data fetching** - Fast initial page loads
2. **Client-side caching** - Reduced database queries
3. **Autocomplete debouncing** - Smooth search experience
4. **Parallel API calls** - `Promise.all()` for multiple queries
5. **PWA caching** - Offline capability

## 📱 Mobile Optimizations

- Font size 16px minimum (prevents iOS zoom)
- Touch targets 44px × 44px minimum
- Viewport settings for proper scaling
- Native select elements (better mobile UX)
- PWA manifest for home screen installation

## 🔧 Utility Functions

Currently inline, could be extracted to `lib/utils.ts`:
- Date formatting (locale pt-BR)
- Status color mapping
- Priority calculation
- Location suggestion algorithm

## 📈 Future Enhancements

See README.md Roadmap section for:
- Push notifications
- PDF/Excel reports
- Barcode scanning
- ERP integration
- Machine learning predictions

---

**Total Files**: ~25 core files
**Lines of Code**: ~3000+ (estimated)
**Database Tables**: 8 models
**API Routes**: 3 endpoints
**UI Components**: 3 main components
