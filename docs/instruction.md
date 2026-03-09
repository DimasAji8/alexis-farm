# Development Guidelines - Alexis Farm

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Principles](#architecture-principles)
4. [Folder Structure](#folder-structure)
5. [Backend Standards](#backend-standards)
6. [Frontend Standards](#frontend-standards)
7. [Code Standards](#code-standards)
8. [Naming Conventions](#naming-conventions)
9. [Git Workflow](#git-workflow)
10. [Testing Guidelines](#testing-guidelines)

---

## 🎯 Project Overview

**Alexis Farm** adalah aplikasi manajemen peternakan ayam yang mencakup:
- Manajemen kandang dan ayam
- Tracking pakan (pembelian & pemakaian dengan FIFO)
- Produktivitas telur (produksi, stock, penjualan)
- Laporan keuangan
- Multi-user dengan role-based access

**Developer:** Fullstack (Backend & Frontend dalam satu project)

---

## 🛠 Tech Stack

### Core
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **API Documentation:** Swagger/OpenAPI 3.0

### Backend
- **Validation:** Zod
- **Authentication:** NextAuth.js v5
- **API:** Next.js API Routes (REST)
- **API Docs:** swagger-ui-react + swagger-jsdoc

### Frontend
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand (global state) + React Query (server state)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Date:** date-fns

### Development Tools
- **Database Client:** DBeaver / Prisma Studio
- **API Testing:** Postman / Thunder Client
- **Version Control:** Git + GitHub

---

## 🏗 Architecture Principles

### 1. **Feature-Based Architecture**
Organize code by **business domain/feature**, bukan technical layer.

**Why?**
- ✅ Consistency antara frontend dan backend
- ✅ Better organization & maintainability
- ✅ Easy to scale (add/remove features)
- ✅ Team-friendly (assign per feature)
- ✅ Microservices ready

### 2. **Separation of Concerns**
Setiap layer punya tanggung jawab jelas:

```
Route Handler → Controller → Service → Prisma → Database
     ↓              ↓           ↓          ↓
  Routing      HTTP Logic   Business   Database
   Only        Validation    Logic     Operations
```

### 3. **DRY (Don't Repeat Yourself)**
- Reusable components & utilities
- Shared types & constants
- Single source of truth

### 4. **Clean Code Principles**
- **Readable:** Code dibaca 10x lebih sering daripada ditulis
- **Simple:** KISS (Keep It Simple, Stupid)
- **Maintainable:** Easy to modify & extend
- **Testable:** Easy to unit test

### 5. **Type Safety**
- TypeScript everywhere
- No `any` type (use `unknown` if needed)
- Strict mode enabled

---

## 📁 Folder Structure

### Root Structure
```
alexis-farm/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Dashboard pages (protected)
│   └── api/               # API Routes (thin routing only)
│
├── lib/                   # Core application code
│   ├── features/          # Feature modules (domain-driven)
│   ├── shared/            # Shared utilities (cross-feature)
│   └── db/                # Database config
│
├── components/            # React components (feature-based)
│   ├── features/          # Feature-specific components
│   ├── ui/                # shadcn/ui components
│   └── layouts/           # Layout components
│
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
│
├── public/                # Static assets
├── .env                   # Environment variables (DO NOT COMMIT)
├── .env.example           # Example env file (commit this)
└── package.json
```

### Backend Structure (lib/)
```
lib/
├── features/              # Feature modules
│   ├── kandang/
│   │   ├── kandang.controller.ts    # HTTP request/response handler
│   │   ├── kandang.service.ts       # Business logic
│   │   ├── kandang.validation.ts    # Zod schemas
│   │   ├── kandang.types.ts         # TypeScript types
│   │   └── index.ts                 # Re-exports
│   │
│   ├── pakan/
│   │   ├── jenis-pakan/             # Sub-feature
│   │   │   ├── jenis-pakan.controller.ts
│   │   │   ├── jenis-pakan.service.ts
│   │   │   ├── jenis-pakan.validation.ts
│   │   │   └── index.ts
│   │   ├── pembelian/
│   │   ├── pemakaian/
│   │   └── pakan.types.ts           # Shared types for pakan domain
│   │
│   ├── telur/
│   │   ├── produksi/
│   │   ├── stock/
│   │   ├── penjualan/
│   │   └── telur.types.ts
│   │
│   ├── ayam/
│   │   ├── ayam-masuk/
│   │   └── kematian/
│   │
│   ├── laporan/
│   │   ├── keuangan/
│   │   └── produktivitas/
│   │
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.middleware.ts
│       └── index.ts
│
├── shared/                # Shared utilities (reusable across features)
│   ├── utils/
│   │   ├── api-response.ts          # Standard API response formatter
│   │   ├── error-handler.ts         # Centralized error handling
│   │   ├── date-helper.ts           # Date utilities
│   │   ├── calculation.ts           # Business calculations (FCR, dll)
│   │   └── validator.ts             # Common validators
│   │
│   ├── types/
│   │   ├── api.types.ts             # Common API types
│   │   ├── database.types.ts        # Prisma extended types
│   │   └── common.types.ts          # General types
│   │
│   ├── constants/
│   │   ├── status.ts                # Status constants
│   │   ├── roles.ts                 # User roles
│   │   └── messages.ts              # Error/success messages
│   │
│   └── middleware/
│       ├── auth.middleware.ts       # Authentication middleware
│       └── error.middleware.ts      # Error middleware
│
└── db/
    └── prisma.ts          # Prisma client singleton
```

### Frontend Structure (components/)
```
components/
├── features/              # Feature-specific components
│   ├── kandang/
│   │   ├── KandangList.tsx
│   │   ├── KandangForm.tsx
│   │   ├── KandangCard.tsx
│   │   └── hooks/
│   │       └── useKandang.ts
│   │
│   ├── pakan/
│   │   ├── PembelianPakanForm.tsx
│   │   ├── PemakaianPakanForm.tsx
│   │   └── hooks/
│   │       └── usePakan.ts
│   │
│   └── telur/
│       ├── ProduksiTelurForm.tsx
│       ├── StockTelurTable.tsx
│       └── hooks/
│           └── useTelur.ts
│
├── ui/                    # shadcn/ui components (reusable primitives)
│   ├── button.tsx
│   ├── input.tsx
│   ├── table.tsx
│   └── dialog.tsx
│
├── layouts/               # Layout components
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   └── Navbar.tsx
│
└── shared/                # Shared components (cross-feature)
    ├── DataTable.tsx
    ├── DateRangePicker.tsx
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx
```

---

## 🔧 Backend Standards

### API Route Structure (Thin Layer)

**Purpose:** Hanya untuk routing, tidak ada logic!

```typescript
// app/api/kandang/route.ts
import { KandangController } from '@/lib/features/kandang';

// Export controller methods directly
export const GET = KandangController.getAll;
export const POST = KandangController.create;
```

```typescript
// app/api/kandang/[id]/route.ts
import { KandangController } from '@/lib/features/kandang';

export const GET = KandangController.getById;
export const PUT = KandangController.update;
export const DELETE = KandangController.delete;
```

**Rules:**
- ✅ **DO:** Import dan export controller methods
- ❌ **DON'T:** Tulis logic di route handler
- ❌ **DON'T:** Direct database access dari route
- ❌ **DON'T:** Validation di route

---

### Controller Layer

**Purpose:** Handle HTTP request/response, validation, orchestration

**IMPORTANT:** Every controller method MUST have Swagger documentation using JSDoc comments!

```typescript
// lib/features/kandang/kandang.controller.ts
import { NextRequest } from 'next/server';
import { KandangService } from './kandang.service';
import { createKandangSchema } from './kandang.validation';
import { apiResponse, apiError } from '@/lib/shared/utils/api-response';

export class KandangController {
  /**
   * @swagger
   * /kandang:
   *   get:
   *     summary: Get all kandang
   *     description: Retrieve list of all kandang with optional filters
   *     tags: [Kandang]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [aktif, tidak_aktif, maintenance]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Data berhasil diambil
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Kandang'
   *       401:
   *         description: Unauthorized
   */
  static async getAll(req: NextRequest) {
    try {
      // 1. Parse query params
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status') || undefined;
      
      // 2. Call service
      const data = await KandangService.getAll({ status });
      
      // 3. Return response
      return apiResponse(data, 'Data berhasil diambil');
    } catch (error) {
      return apiError(error);
    }
  }

  /**
   * @swagger
   * /kandang:
   *   post:
   *     summary: Create new kandang
   *     tags: [Kandang]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateKandangInput'
   *     responses:
   *       201:
   *         description: Kandang created successfully
   */
  static async create(req: Request) {
    try {
      // 1. Parse body
      const body = await req.json();
      
      // 2. Validate
      const validated = createKandangSchema.parse(body);
      
      // 3. Call service
      const data = await KandangService.create(validated);
      
      // 4. Return response
      return apiResponse(data, 'Kandang berhasil dibuat', 201);
    } catch (error) {
      return apiError(error);
    }
  }
}
```

**Rules:**
- ✅ **DO:** Handle HTTP request/response
- ✅ **DO:** Validate input dengan Zod
- ✅ **DO:** Call service untuk business logic
- ✅ **DO:** Return standard response format
- ✅ **DO:** Add Swagger documentation (MANDATORY!)
- ✅ **DO:** Add JSDoc comments
- ❌ **DON'T:** Direct database access
- ❌ **DON'T:** Complex business logic
- ❌ **DON'T:** Data transformation (itu tugas service)

---

### Service Layer

**Purpose:** Business logic & database operations

```typescript
// lib/features/kandang/kandang.service.ts
import { prisma } from '@/lib/db/prisma';
import { CreateKandangInput, UpdateKandangInput } from './kandang.types';

export class KandangService {
  /**
   * Get all kandang
   */
  static async getAll(filters?: { status?: string }) {
    return await prisma.kandang.findMany({
      where: filters,
      orderBy: { kode: 'asc' },
      include: {
        _count: {
          select: {
            produksiTelur: true,
            kematianRecords: true
          }
        }
      }
    });
  }

  /**
   * Create new kandang
   */
  static async create(data: CreateKandangInput) {
    // Business rule: Check uniqueness
    const existing = await prisma.kandang.findUnique({
      where: { kode: data.kode }
    });
    
    if (existing) {
      throw new Error('Kode kandang sudah digunakan');
    }
    
    // Create with default values
    return await prisma.kandang.create({
      data: {
        ...data,
        jumlahAyam: 0
      }
    });
  }

  /**
   * Update jumlah ayam (business logic)
   */
  static async updateJumlahAyam(kandangId: string, delta: number) {
    const kandang = await this.getById(kandangId);
    const newJumlah = kandang.jumlahAyam + delta;
    
    // Business rule: Tidak boleh negatif
    if (newJumlah < 0) {
      throw new Error('Jumlah ayam tidak boleh negatif');
    }
    
    return await this.update(kandangId, { jumlahAyam: newJumlah });
  }
}
```

**Rules:**
- ✅ **DO:** All database operations via Prisma
- ✅ **DO:** Business logic & validation
- ✅ **DO:** Throw meaningful errors
- ✅ **DO:** Use transactions for complex operations
- ✅ **DO:** Reusable methods
- ❌ **DON'T:** Handle HTTP request/response
- ❌ **DON'T:** Return NextResponse
- ❌ **DON'T:** Parse request body

---

### Validation Layer

**Purpose:** Input validation schemas dengan Zod

```typescript
// lib/features/kandang/kandang.validation.ts
import { z } from 'zod';

export const createKandangSchema = z.object({
  kode: z.string()
    .min(1, 'Kode kandang wajib diisi')
    .max(10, 'Kode maksimal 10 karakter')
    .regex(/^[A-Z0-9]+$/, 'Kode hanya boleh huruf kapital dan angka'),
  
  nama: z.string()
    .min(1, 'Nama kandang wajib diisi')
    .max(50, 'Nama maksimal 50 karakter'),
  
  lokasi: z.string().optional(),
  
  status: z.enum(['aktif', 'tidak_aktif', 'maintenance'])
    .default('aktif'),
  
  keterangan: z.string().optional()
});

export const updateKandangSchema = createKandangSchema.partial();

// Export types
export type CreateKandangInput = z.infer<typeof createKandangSchema>;
export type UpdateKandangInput = z.infer<typeof updateKandangSchema>;
```

**Rules:**
- ✅ **DO:** Clear error messages in Indonesian
- ✅ **DO:** Use appropriate validators (min, max, regex, etc)
- ✅ **DO:** Export inferred types
- ✅ **DO:** Reuse schemas (e.g., update = create.partial())
- ❌ **DON'T:** Business logic in validation

---

### Standard API Response

```typescript
// lib/shared/utils/api-response.ts
import { NextResponse } from 'next/server';

// Success response
export function apiResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status }
  );
}

// Error response
export function apiError(
  error: any,
  message?: string,
  status: number = 500
) {
  console.error('API Error:', error);
  
  return NextResponse.json(
    {
      success: false,
      message: message || error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    },
    { status }
  );
}
```

**Response Format:**

Success:
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Kandang tidak ditemukan",
  "error": { ... } // only in development
}
```

---

### Database (Prisma)

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Rules:**
- ✅ **DO:** Use singleton pattern
- ✅ **DO:** Enable query logging in development
- ✅ **DO:** Use transactions for related operations
- ✅ **DO:** Use proper indexes
- ❌ **DON'T:** Create multiple Prisma instances
- ❌ **DON'T:** Expose sensitive data

---

## 🎨 Frontend Standards

### Component Structure

```typescript
// components/features/kandang/KandangList.tsx
'use client';

import { useKandang } from './hooks/useKandang';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';

export function KandangList() {
  const { kandangs, isLoading, error } = useKandang();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daftar Kandang</h1>
        <Button onClick={() => {}}>Tambah Kandang</Button>
      </div>
      
      <DataTable data={kandangs} columns={columns} />
    </div>
  );
}
```

**Rules:**
- ✅ **DO:** Use 'use client' directive when needed
- ✅ **DO:** Extract logic to custom hooks
- ✅ **DO:** Handle loading & error states
- ✅ **DO:** Use shadcn/ui components
- ✅ **DO:** Tailwind for styling
- ❌ **DON'T:** Inline API calls in components
- ❌ **DON'T:** Large components (split into smaller)

---

### Custom Hooks

```typescript
// components/features/kandang/hooks/useKandang.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kandangApi } from './kandang.api';

export function useKandang() {
  const queryClient = useQueryClient();

  // Get all
  const { data, isLoading, error } = useQuery({
    queryKey: ['kandang'],
    queryFn: kandangApi.getAll
  });

  // Create
  const createMutation = useMutation({
    mutationFn: kandangApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kandang'] });
    }
  });

  return {
    kandangs: data,
    isLoading,
    error,
    create: createMutation.mutate
  };
}
```

**Rules:**
- ✅ **DO:** Use React Query for server state
- ✅ **DO:** Invalidate queries after mutations
- ✅ **DO:** Handle loading & error states
- ✅ **DO:** Return clean interface
- ❌ **DON'T:** Mix server state with local state

---

## 📝 Code Standards

### General Rules

1. **TypeScript Strict Mode**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitAny": true
     }
   }
   ```

2. **No `any` Type**
   ```typescript
   // ❌ Bad
   function process(data: any) { ... }
   
   // ✅ Good
   function process(data: unknown) { ... }
   function process<T>(data: T) { ... }
   ```

3. **Explicit Return Types**
   ```typescript
   // ❌ Bad
   function getKandang() {
     return prisma.kandang.findMany();
   }
   
   // ✅ Good
   async function getKandang(): Promise<Kandang[]> {
     return await prisma.kandang.findMany();
   }
   ```

4. **Use Const Over Let**
   ```typescript
   // ❌ Bad
   let name = 'Kandang 1';
   
   // ✅ Good
   const name = 'Kandang 1';
   ```

5. **Arrow Functions**
   ```typescript
   // ✅ Good for short functions
   const add = (a: number, b: number) => a + b;
   
   // ✅ Good for methods
   export class KandangService {
     static async getAll() { ... }
   }
   ```

6. **Async/Await over Promises**
   ```typescript
   // ❌ Bad
   function getData() {
     return prisma.kandang.findMany()
       .then(data => ...)
       .catch(error => ...);
   }
   
   // ✅ Good
   async function getData() {
     try {
       const data = await prisma.kandang.findMany();
       return data;
     } catch (error) {
       throw error;
     }
   }
   ```

7. **Destructuring**
   ```typescript
   // ❌ Bad
   const kode = kandang.kode;
   const nama = kandang.nama;
   
   // ✅ Good
   const { kode, nama } = kandang;
   ```

8. **Optional Chaining & Nullish Coalescing**
   ```typescript
   // ✅ Good
   const lokasi = kandang?.lokasi ?? 'Tidak ada lokasi';
   ```

---

## 🏷 Naming Conventions

### Files & Folders
- **kebab-case** for files and folders
  ```
  ✅ kandang.controller.ts
  ✅ jenis-pakan.service.ts
  ✅ api-response.ts
  ```

### React Components
- **PascalCase** for component files
  ```
  ✅ KandangList.tsx
  ✅ ProduksiTelurForm.tsx
  ```

### Variables & Functions
- **camelCase**
  ```typescript
  ✅ const jumlahAyam = 100;
  ✅ function getKandangById() {}
  ```

### Classes
- **PascalCase**
  ```typescript
  ✅ class KandangService {}
  ✅ class KandangController {}
  ```

### Constants
- **UPPER_SNAKE_CASE**
  ```typescript
  ✅ const MAX_KANDANG = 10;
  ✅ const API_BASE_URL = 'https://...';
  ```

### Types & Interfaces
- **PascalCase** with descriptive suffix
  ```typescript
  ✅ type CreateKandangInput = { ... };
  ✅ interface KandangResponse { ... };
  ```

### Database Tables (Prisma)
- **PascalCase** for models
  ```prisma
  ✅ model Kandang { ... }
  ✅ model PembelianPakan { ... }
  ```

---

## 🔄 Git Workflow

### Branch Naming
```
main                    # Production-ready code
develop                 # Development branch
feature/kandang-crud    # New feature
fix/kandang-validation  # Bug fix
refactor/api-response   # Code refactoring
```

### Commit Messages
Follow **Conventional Commits**:

```
feat: add CRUD kandang API
fix: validation error on kandang form
refactor: move api response to shared utils
docs: update development guidelines
chore: update dependencies
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc
- `test`: Adding tests
- `chore`: Maintain

### Commit Frequency
- Commit **sering** dengan perubahan kecil
- Setiap commit harus **working code**
- Push ke remote **minimal 1x per hari**

---

## 🔐 Authentication & Authorization

### User Roles

**3 Roles yang dibutuhkan:**

1. **Admin**
   - Full access ke semua fitur
   - Manage users
   - CRUD semua data
   - Lihat semua laporan

2. **Staff**
   - Input data operasional (pakan, telur, kematian)
   - Tidak bisa delete data
   - Tidak bisa manage users
   - Lihat data yang di-input sendiri

3. **Owner**
   - Read-only access
   - Lihat dashboard
   - Lihat semua laporan
   - Export laporan
   - Tidak bisa input/edit/delete data

### NextAuth.js Setup

```typescript
// lib/features/auth/auth.config.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username dan password wajib diisi');
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user || !user.isActive) {
          throw new Error('User tidak ditemukan atau tidak aktif');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Password salah');
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};
```

### Role-Based Middleware

```typescript
// lib/shared/middleware/auth.middleware.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/features/auth/auth.config';
import { apiError } from '@/lib/shared/utils/api-response';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  
  return session;
}

// Usage in controller
export class KandangController {
  static async create(req: Request) {
    try {
      // Only admin and staff can create
      await requireRole(['admin', 'staff']);
      
      const body = await req.json();
      const validated = createKandangSchema.parse(body);
      const data = await KandangService.create(validated);
      
      return apiResponse(data, 'Kandang berhasil dibuat', 201);
    } catch (error) {
      return apiError(error);
    }
  }
  
  static async delete(req: Request, { params }: { params: { id: string } }) {
    try {
      // Only admin can delete
      await requireRole(['admin']);
      
      await KandangService.delete(params.id);
      return apiResponse(null, 'Kandang berhasil dihapus');
    } catch (error) {
      return apiError(error);
    }
  }
}
```

### Frontend Route Protection

```typescript
// components/shared/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    redirect('/login');
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}
```

---

## 🔄 FIFO Implementation (Pakan)

### Algorithm FIFO untuk Pemakaian Pakan

```typescript
// lib/features/pakan/pemakaian/pemakaian-pakan.service.ts
export class PemakaianPakanService {
  /**
   * Process pemakaian pakan dengan FIFO
   * Mengambil stock dari pembelian paling lama
   */
  static async create(data: {
    kandangId: string;
    jenisPakanId: string;
    tanggalPakai: Date;
    jumlahKg: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get available stock (oldest first - FIFO)
      const availableStock = await tx.pembelianPakan.findMany({
        where: {
          jenisPakanId: data.jenisPakanId,
          sisaStokKg: { gt: 0 }
        },
        orderBy: { tanggalBeli: 'asc' } // FIFO: paling lama dulu
      });

      // 2. Check total available stock
      const totalAvailable = availableStock.reduce(
        (sum, stock) => sum + stock.sisaStokKg,
        0
      );

      if (totalAvailable < data.jumlahKg) {
        throw new Error(
          `Stok tidak cukup. Tersedia: ${totalAvailable} kg, Dibutuhkan: ${data.jumlahKg} kg`
        );
      }

      // 3. Process FIFO: ambil dari stock paling lama
      let remainingQty = data.jumlahKg;
      const pemakaianRecords = [];

      for (const stock of availableStock) {
        if (remainingQty <= 0) break;

        const qtyToTake = Math.min(remainingQty, stock.sisaStokKg);
        const totalBiaya = qtyToTake * stock.hargaPerKg;

        // Create pemakaian record
        const pemakaian = await tx.pemakaianPakan.create({
          data: {
            kandangId: data.kandangId,
            jenisPakanId: data.jenisPakanId,
            pembelianPakanId: stock.id,
            tanggalPakai: data.tanggalPakai,
            jumlahKg: qtyToTake,
            hargaPerKg: stock.hargaPerKg,
            totalBiaya
          }
        });

        // Update sisa stock
        await tx.pembelianPakan.update({
          where: { id: stock.id },
          data: { sisaStokKg: stock.sisaStokKg - qtyToTake }
        });

        pemakaianRecords.push(pemakaian);
        remainingQty -= qtyToTake;
      }

      return pemakaianRecords;
    });
  }
}
```

---

## 📊 Dashboard & Laporan

### Dashboard Components Structure

```
components/features/dashboard/
├── DashboardStats.tsx          # Summary cards (total kandang, ayam, dll)
├── ProduksiTelurChart.tsx     # Chart produktivitas telur
├── KeuanganChart.tsx          # Chart pemasukan/pengeluaran
├── MortalityChart.tsx         # Chart kematian ayam
├── RecentActivities.tsx       # Recent activities list
└── hooks/
    └── useDashboard.ts        # Dashboard data fetching
```

### Chart Implementation dengan Recharts

```typescript
// components/features/dashboard/ProduksiTelurChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useDashboard } from './hooks/useDashboard';

export function ProduksiTelurChart() {
  const { produksiData, isLoading } = useDashboard();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Produktivitas Telur (7 Hari Terakhir)</h2>
      <LineChart width={600} height={300} data={produksiData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tanggal" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="jumlahButir" stroke="#8884d8" name="Jumlah Telur" />
      </LineChart>
    </div>
  );
}
```

### Export Laporan ke Excel

```typescript
// lib/shared/utils/export-excel.ts
import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Usage in component
const handleExport = () => {
  exportToExcel(laporanData, 'laporan-keuangan-2024');
};
```

---

## 🔍 Pagination & Filtering

### Backend Pagination

```typescript
// lib/features/kandang/kandang.service.ts
export class KandangService {
  static async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(params?.status && { status: params.status }),
      ...(params?.search && {
        OR: [
          { kode: { contains: params.search, mode: 'insensitive' } },
          { nama: { contains: params.search, mode: 'insensitive' } }
        ]
      })
    };

    const [data, total] = await Promise.all([
      prisma.kandang.findMany({
        where,
        skip,
        take: limit,
        orderBy: { kode: 'asc' }
      }),
      prisma.kandang.count({ where })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
```

### Frontend Pagination Component

```typescript
// components/shared/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex gap-2 justify-center mt-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      <span className="py-2 px-4">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
```

---

## 🧪 Testing Guidelines

### Unit Tests (Service Layer)
```typescript
// lib/features/kandang/__tests__/kandang.service.test.ts
import { KandangService } from '../kandang.service';

describe('KandangService', () => {
  describe('getAll', () => {
    it('should return all kandang', async () => {
      const result = await KandangService.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
```

### Integration Tests (API)
```typescript
// app/api/kandang/__tests__/route.test.ts
import { GET, POST } from '../route';

describe('Kandang API', () => {
  it('GET /api/kandang should return 200', async () => {
    const req = new Request('http://localhost:3000/api/kandang');
    const response = await GET(req);
    expect(response.status).toBe(200);
  });
});
```

---

## 📖 API Documentation with Swagger

### Setup Swagger

```bash
# Install dependencies
npm install swagger-ui-react swagger-jsdoc
npm install -D @types/swagger-ui-react @types/swagger-jsdoc
```

### Swagger Configuration

Create `lib/shared/config/swagger.ts` with OpenAPI 3.0 spec configuration (see artifacts for complete example).

### Access Swagger UI

After setup, access API documentation at:
- **Local:** http://localhost:3000/api-docs
- **Production:** https://your-domain.com/api-docs

### Swagger Documentation Rules

**Every API endpoint MUST have:**

1. **Summary** - Brief description
2. **Description** - Detailed explanation
3. **Tags** - Group by feature
4. **Security** - If requires auth
5. **Parameters** - Query params, path params
6. **Request Body** - For POST/PUT/PATCH
7. **Responses** - All possible responses (200, 400, 401, 404, 500)

**Example:**
```typescript
/**
 * @swagger
 * /kandang:
 *   get:
 *     summary: Get all kandang
 *     description: Retrieve list of all kandang with optional filters
 *     tags: [Kandang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aktif, tidak_aktif, maintenance]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kandang'
 *       401:
 *         description: Unauthorized
 */
static async getAll(req: NextRequest) {
  // ... implementation
}
```

### Swagger Schemas

Define reusable schemas in `swagger.ts`:

```typescript
components: {
  schemas: {
    Kandang: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        kode: { type: 'string' },
        nama: { type: 'string' },
        // ... other properties
      }
    },
    CreateKandangInput: {
      type: 'object',
      required: ['kode', 'nama'],
      properties: {
        kode: { type: 'string', maxLength: 10 },
        nama: { type: 'string', maxLength: 50 }
      }
    }
  }
}
```

### Testing API with Swagger UI

1. Open http://localhost:3000/api-docs
2. Click "Authorize" button
3. Enter JWT token
4. Try out any endpoint
5. See request/response in real-time

---

## 🌱 Database Seeding

### Seed Data Structure

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Administrator',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    }
  });

  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      name: 'Staff Operasional',
      password: await bcrypt.hash('staff123', 10),
      role: 'staff',
      isActive: true
    }
  });

  const owner = await prisma.user.upsert({
    where: { username: 'owner' },
    update: {},
    create: {
      username: 'owner',
      name: 'Owner',
      password: await bcrypt.hash('owner123', 10),
      role: 'owner',
      isActive: true
    }
  });

  console.log('✅ Users created');

  // 2. Create Kandang
  const kandang1 = await prisma.kandang.upsert({
    where: { kode: 'KDG1' },
    update: {},
    create: {
      kode: 'KDG1',
      nama: 'Kandang 1',
      lokasi: 'Blok A',
      jumlahAyam: 0,
      status: 'aktif'
    }
  });

  const kandang2 = await prisma.kandang.upsert({
    where: { kode: 'KDG2' },
    update: {},
    create: {
      kode: 'KDG2',
      nama: 'Kandang 2',
      lokasi: 'Blok B',
      jumlahAyam: 0,
      status: 'tidak_aktif'
    }
  });

  const kandang3 = await prisma.kandang.upsert({
    where: { kode: 'KDG3' },
    update: {},
    create: {
      kode: 'KDG3',
      nama: 'Kandang 3',
      lokasi: 'Blok C',
      jumlahAyam: 0,
      status: 'tidak_aktif'
    }
  });

  console.log('✅ Kandang created');

  // 3. Create Jenis Pakan
  const jenisPakan = [
    { kode: 'JG001', nama: 'JAGUNG', satuan: 'KG' },
    { kode: 'KT001', nama: 'KATUK', satuan: 'KG' },
    { kode: 'CPS24A', nama: 'CPS24A', satuan: 'KG' },
    { kode: 'KLK5001', nama: 'KONSENTRAT', satuan: 'KG' }
  ];

  for (const pakan of jenisPakan) {
    await prisma.jenisPakan.upsert({
      where: { kode: pakan.kode },
      update: {},
      create: pakan
    });
  }

  console.log('✅ Jenis Pakan created');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run Seed

```bash
# Install bcryptjs untuk seed
npm install bcryptjs
npm install -D @types/bcryptjs

# Run seed
npx prisma db seed
```

### Default Login Credentials

After seeding:
```
Admin:
- Username: admin
- Password: admin123

Staff:
- Username: staff
- Password: staff123

Owner:
- Username: owner
- Password: owner123
```

---

## 🚀 Deployment Checklist

### Environment Variables

```bash
# .env.example (commit this)
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="production"
```

### Production Checklist

**Before Deploy:**
- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Seed data run (for initial setup)
- [ ] Error handling tested
- [ ] Security review completed

**Deployment Steps:**
1. Build project: `npm run build`
2. Check build errors
3. Test production build: `npm start`
4. Deploy to hosting (Vercel recommended)
5. Configure environment variables
6. Run database migrations
7. Test deployed app

### Recommended Hosting

**Frontend + Backend:**
- **Vercel** (Recommended) - Zero config, free tier

**Database:**
- **Supabase** - Free 500MB PostgreSQL
- **Neon** - Serverless PostgreSQL
- **Railway** - Full-stack hosting

---

## 📚 Additional Best Practices

### 1. Error Handling
```typescript
// Always handle errors gracefully
try {
  const data = await KandangService.getById(id);
  return apiResponse(data);
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    return apiError(error, 'Database error', 500);
  }
  return apiError(error);
}
```

### 2. Environment Variables
```typescript
// Always validate env vars
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
```

### 3. Security
- ✅ Sanitize user input
- ✅ Use parameterized queries (Prisma does this)
- ✅ Validate on both client and server
- ✅ Never expose sensitive data
- ✅ Use HTTPS in production

### 4. Performance
- ✅ Use indexes on frequently queried fields
- ✅ Paginate large datasets
- ✅ Cache frequently accessed data
- ✅ Lazy load components
- ✅ Optimize images

---

## ✅ Checklist Sebelum Commit

- [ ] Code compiled without errors
- [ ] No TypeScript errors
- [ ] No console.log (except intentional logging)
- [ ] Formatted dengan Prettier
- [ ] Linted dengan ESLint
- [ ] Meaningful commit message
- [ ] Tested locally

---

## 📖 Documentation

### JSDoc Comments
```typescript
/**
 * Get kandang by ID
 * @param id - Kandang ID
 * @returns Promise<Kandang>
 * @throws Error if kandang not found
 */
static async getById(id: string): Promise<Kandang> {
  // ...
}
```

### README per Feature
Setiap feature folder harus punya README.md yang menjelaskan:
- Purpose feature
- API endpoints
- Data models
- Business rules

---

## 🎯 Summary

**Key Principles:**
1. ✅ **Feature-Based Architecture** - Organize by domain
2. ✅ **Separation of Concerns** - Route → Controller → Service → DB
3. ✅ **Type Safety** - TypeScript strict mode
4. ✅ **Clean Code** - Readable, simple, maintainable
5. ✅ **Reusability** - DRY principle
6. ✅ **Best Practices** - Industry standards
7. ✅ **Consistency** - Same patterns throughout

**Remember:**
> "Code is read 10x more than it's written. Write for humans, not machines."

---

**Last Updated:** December 2024
**Version:** 1.0.0