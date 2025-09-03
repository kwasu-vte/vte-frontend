# Legacy Cleanup Preparation Plan

**Status:** Preparation Phase
**Phase:** 1 of 4 - Foundation & Security
**Task:** Delete legacy authentication files and insecure components

---

## **Files to Delete (Critical Security Risk)**

### **Authentication Files**
- `src/lib/useAuth.ts` → **DELETE** (replaced by `src/context/AuthContext.tsx`)
- `src/lib/auth.js` → **DELETE** (replaced by `src/lib/auth.ts`)
- `src/components/providers/AuthProvider.tsx` → **DELETE** (replaced by new context)

### **Legacy Sidebar Components (Phase 2)**
- `src/app/components/AdminSidebar.tsx` → **DELETE** (replaced by unified Sidebar)
- `src/app/components/StaffSidebar.tsx` → **DELETE** (replaced by unified Sidebar)
- `src/app/components/StudentSidebar.tsx` → **DELETE** (replaced by unified Sidebar)
- `src/app/components/ResponsiveAdminSidebar.tsx` → **DELETE** (replaced by unified Sidebar)
- `src/app/components/ResponsiveSidebar.tsx` → **DELETE** (replaced by unified Sidebar)

### **Legacy API Files (Phase 3)**
- `src/lib/queries/` → **DELETE ENTIRE DIRECTORY** (replaced by centralized `api.ts`)
- `src/hooks/mutations/` → **DELETE ENTIRE DIRECTORY** (replaced by Server Actions)

---

## **Security Vulnerabilities Being Eliminated**

### **1. Client-Side Token Storage**
- ❌ `localStorage` for access tokens
- ❌ `js-cookie` for sensitive data
- ❌ Client-side token management
- ✅ **REPLACED WITH:** httpOnly cookies managed by Server Actions

### **2. Hardcoded Credentials**
- ❌ Hardcoded usernames/passwords in components
- ❌ Insecure authentication logic
- ✅ **REPLACED WITH:** Secure Server Actions with proper validation

### **3. Insecure API Calls**
- ❌ Direct fetch calls without centralized error handling
- ❌ Scattered authentication logic
- ✅ **REPLACED WITH:** Centralized API service with proper error handling

---

## **Deletion Strategy**

### **Phase 1: Authentication Security (Immediate)**
1. **Delete legacy auth files** after confirming new context works
2. **Remove hardcoded credentials** from all components
3. **Update imports** to use new authentication system

### **Phase 2: Layout Consolidation**
1. **Delete old sidebar components** after new AppShell is implemented
2. **Update page layouts** to use unified Sidebar component
3. **Remove duplicate navigation logic**

### **Phase 3: API Centralization**
1. **Delete old query/mutation files** after new API service is complete
2. **Update all data fetching** to use centralized service
3. **Remove scattered API logic**

---

## **Pre-Deletion Checklist**

- [ ] **New system is fully functional** and tested
- [ ] **All imports are updated** to use new components
- [ ] **No breaking changes** in existing functionality
- [ ] **Backup created** of files being deleted
- [ ] **Team notified** of the changes

---

## **Post-Deletion Validation**

- [ ] **Application builds** without errors
- [ ] **All routes function** correctly
- [ ] **Authentication flow** works securely
- [ ] **No broken imports** or missing dependencies
- [ ] **Performance improved** (smaller bundle size)

---

**Note:** This is a preparation document. The actual deletion will happen systematically as each new system becomes fully functional and tested.
