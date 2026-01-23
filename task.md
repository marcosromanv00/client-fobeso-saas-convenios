# Tarea Actual: Migración final de Catálogos (Empresas y Sucursales)

## Contexto

Ya hemos migrado la parte "core" de convenios y la autenticación. Ahora necesitamos desconectar completamente Oracle migrando los mantenimientos.

## Pasos Inmediatos

### 1. Migrar Empresas (`api/crud/empresas/route.js`)

- [x] Mapear campos.
- [x] GET, POST, PUT, DELETE usando `supabase`.

### 2. Migrar Sucursales (`api/crud/sucursales/route.js`)

- [x] Mapear campos.
- [x] GET, POST, PUT, DELETE usando `supabase`.

### 3. Limpieza Final

- [x] Eliminar `lib/db.js`.
- [x] Desinstalar `oracledb` del package.json.
