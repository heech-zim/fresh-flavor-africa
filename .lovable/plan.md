

## Farmer Portal - Real-Time Dashboard

### Overview
Build a complete farmer portal with authentication, onboarding, dashboard, produce listings, payment tracking, and shipment visibility. Farmers register via Supabase Auth, complete onboarding with profile and document uploads, then access a dashboard.

### Database Changes (Migration)

**1. Add `farmer` to `app_role` enum:**
```sql
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'farmer';
```

**2. Create `farmer_profiles` table:**
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, FK to auth.users, unique, not null)
- `farm_name`, `phone`, `location`, `province`, `farm_size`, `experience_level` (text)
- `current_crops` (text[])
- `globalg_ap_certified` (boolean, default false)
- `onboarding_completed` (boolean, default false)
- `created_at`, `updated_at` (timestamptz)

RLS: Farmers can read/update own profile. Admins can read all.

**3. Create `farmer_documents` table:**
- `id`, `farmer_id` (FK to farmer_profiles), `document_type` (text: certification, id_document, land_title, etc.), `file_url`, `status` (pending/approved/rejected), `created_at`

RLS: Farmers can insert/read own documents. Admins can read/update all.

**4. Create `farmer_produce_listings` table:**
- `id`, `farmer_id` (FK to farmer_profiles), `product_name`, `category`, `quantity`, `unit`, `price_per_unit`, `harvest_date`, `available_from`, `status` (available/sold/reserved), `created_at`, `updated_at`

RLS: Farmers CRUD own listings. Admins can read all. Public can read available listings.

**5. Create `farmer_payments` table:**
- `id`, `farmer_id` (FK to farmer_profiles), `amount`, `currency` (default 'USD'), `payment_date`, `reference_number`, `description`, `status` (pending/completed/failed), `shipment_id` (FK to shipments, nullable), `created_at`

RLS: Farmers can read own payments. Admins can manage all.

**6. Create storage bucket `farmer-documents`** (private).

### New Pages & Components

**1. `/farmer/register` - FarmerRegister.tsx**
- Sign-up form using `supabase.auth.signUp()` with email/password
- Captures first_name, last_name in user metadata
- Auto-assigns `farmer` role via trigger or post-signup insert
- Redirects to onboarding

**2. `/farmer/login` - FarmerLogin.tsx**
- Login form, checks for `farmer` role, redirects to dashboard

**3. `/farmer/onboarding` - FarmerOnboarding.tsx**
- Multi-step form (3 steps):
  1. Farm details (name, location, province, size, experience, crops)
  2. Document uploads (ID, land title, certifications) to `farmer-documents` bucket
  3. Review and submit
- Marks `onboarding_completed = true` on finish

**4. `/farmer/dashboard` - FarmerDashboard.tsx**
- Protected route (requires farmer role + completed onboarding)
- Tabs-based layout:
  - **Overview**: Stats cards (total listings, pending payments, active shipments), recent activity
  - **Produce Listings**: Table of listings with add/edit. Create new listing form
  - **Payments**: Table of payment history with status badges, total earned
  - **Shipments**: View shipments linked to farmer's produce with tracking status and blockchain verification
  - **Profile**: Edit farm profile, view/upload documents

### Route Updates (App.tsx)
Add routes:
- `/farmer/register`
- `/farmer/login`
- `/farmer/onboarding`
- `/farmer/dashboard`

### Auth Guard Component
Create a `FarmerAuthGuard` component that:
- Checks for active session
- Verifies `farmer` role via `has_role()` function
- Checks `onboarding_completed` status
- Redirects to login/onboarding as needed

### Navigation Update
Add "Farmer Portal" link to the main Navigation component.

### Technical Details

- Real-time updates on dashboard via Supabase realtime subscriptions on `farmer_produce_listings` and `farmer_payments`
- Zod validation on all farmer forms
- File uploads use Supabase Storage with signed URLs
- Database trigger to auto-create `farmer_profiles` row and assign `farmer` role on signup via the farmer registration flow
- All farmer data access controlled by RLS policies using `auth.uid()`

