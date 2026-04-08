# Instrucciones de Operación: Ingeniería Inversa del Alcance del Proyecto

## 1. Rol y Objetivo
Actúa como un **Project Manager Técnico de Élite**. Tu objetivo es analizar el repositorio de código actual de forma autónoma y extraer la información necesaria para autocompletar un "Enunciado del Alcance del Proyecto". Debes inferir la información del negocio a partir de la arquitectura técnica, la documentación y los metadatos del código.

## 2. Metodología de Análisis (Mapping Técnico)
Busca evidencia en el código base utilizando las siguientes heurísticas para rellenar los campos:

*   **Identificación (Nombre del Proyecto, Versión, Fecha):** Extrae esto de los archivos de manifiesto (`package.json`, `pom.xml`, `go.mod`, `pyproject.toml`) o el título del `README.md`. Usa la fecha del último tag o commit relevante.
*   **Roles (Director del Proyecto, Equipo del proyecto, Patrocinador, Cliente, Otros Interesados):** Analiza el archivo `CODEOWNERS`, `CONTRIBUTORS.md`, los metadatos de autoría en el historial de Git, o las referencias a empresas externas en los archivos de configuración / variables de entorno.
*   **Descripción del proyecto (Antecedentes, Descripción del producto, Objetivos):** Sintetiza la introducción del `README.md`, los documentos de arquitectura (ej. la carpeta `docs/` o `ADRs`) y la justificación técnica de la existencia del repositorio.
*   **Requisitos y Criterios de Aceptación:** Infiere esto a partir de los tests automatizados (ej. `__tests__`, `spec.ts`), archivos de requerimientos (`requirements.txt`), y las validaciones de CI/CD.
*   **Entregables y Plazos:** Inspecciona los *Milestones*, *Releases* o *Tags* de Git. Observa los artefactos de salida en los flujos de CI/CD (ej. binarios, imágenes Docker, despliegues).
*   **Exclusiones y Restricciones:** Identifica limitaciones técnicas documentadas, deudas técnicas (`TODOs`, `FIXMEs`), restricciones de dependencias o límites definidos en la infraestructura como código (Terraform, Docker Compose).
*   **Supuestos:** Identifica qué precondiciones asume el sistema para ejecutarse (ej. "Asume que la base de datos PostgreSQL está activa en el puerto 5432").

## 3. Formato de Salida Requerido
Genera un informe final en formato Markdown estrictamente utilizando la siguiente estructura. Si un campo no puede ser inferido tras un análisis exhaustivo, márcalo como `[Requiere Confirmación Humana]` junto con la razón de su ausencia.

### ENUNCIADO DEL ALCANCE DEL PROYECTO

**1. Datos Generales**
*   **Fecha de Análisis:** 2026-04-08
*   **Nombre del Proyecto:** Sistema de Gestión de Convenios y Cupones (Client-FOBESO SaaS)
*   **Versión:** 0.2.0 (Fase de Migración Cloud completada)

**2. Matriz de Interesados**
*   **Director del Proyecto:** Marcos Román (Inferido del entorno de trabajo)
*   **Patrocinador / Cliente:** Fondo de Beneficio Social de la Universidad Nacional (FOBESO UNA)
*   **Equipo del Proyecto:** 
    *   Desarrollo Fullstack (Next.js + Supabase)
    *   Arquitectura Cloud (Migración de infraestructura local a SaaS)
*   **Otros Interesados:** Afiliados del Fondo (Usuarios finales), Empresas Aliadas (Proveedores de beneficios).

**3. Resumen Ejecutivo**
*   **Antecedentes:** El proyecto surge de la necesidad de modernizar la gestión de beneficios del Fondo de Beneficio Social de la UNA. Originalmente, el proyecto fue concebido y requerido para ejecutarse sobre una infraestructura rígida basada en OracleDB con Azure SDKs locales. No obstante, para efectos de portafolio y escalabilidad, se realizó una transición hacia una plataforma SaaS (Next.js + Supabase).
*   **Descripción del Producto/Servicio:** Aplicación web moderna (PWA-ready) que permite a los afiliados visualizar, filtrar y canjear cupones de beneficios mediante códigos QR. Incluye un panel administrativo para el control de empresas aliadas, sucursales y vigencia de convenios.
*   **Objetivos Principales:** 
    *   Digitalizar el ecosistema de convenios de FOBESO UNA.
    *   Facilitar el canje de beneficios en puntos de venta mediante tecnología QR.
    *   Centralizar la gestión de catálogos (Empresas, Sucursales, Categorías) en una base de datos segura en la nube (Supabase).

**4. Parámetros de Ejecución**
*   **Requisitos Principales:** 
    *   Autenticación segura para afiliados vinculada a su documento de identidad (Cédula).
    *   Visualización categorizada de convenios (Salud, Educación, Alimentación, etc.).
    *   Generación dinámica de cupones QR para validación instantánea.
    *   Panel administrativo (ABM) para la gestión completa del catálogo.
*   **Entregables Finales y Parciales:**

| Finales | Parciales | Fecha | Persona que Aprueba |
| :--- | :--- | :--- | :--- |
| **Infraestructura y Base de Datos Cloud** | Setup Supabase (Tablas, RLS, Políticas) | Julio 2024 | Marcos Román |
| | Configuración de Variables de Entorno y Cliente Lib | Julio 2024 | Marcos Román |
| **Sistema de Seguridad y Acceso** | Implementación de Middleware y Supabase Auth | Agosto 2024 | Marcos Román |
| | Flujo de Login y Persistencia de Sesión | Agosto 2024 | Marcos Román |
| **Plataforma de Gestión de Convenios** | Migración de Vertical Slices (Home/Detalle) | Septiembre 2024 | Dirección FOBESO |
| | Módulo Administrativo (ABM de Empresas y Convenios) | Octubre 2024 | Dirección FOBESO |
| **Sistema de Canje Digital** | Generación y Validación de Cupones QR | Octubre 2024 | Dirección FOBESO |
| | Repositorio de Imágenes (Supabase Storage) | Octubre 2024 | Marcos Román |
| **Producto Final SaaS (V 0.2.0)** | Remoción de Dependencias Legacy (Oracle/Azure) | Noviembre 2024 | Marcos Román |
| | Pruebas de Aceptación y Despliegue Final | Noviembre 2024 | Dirección FOBESO |
*   **Criterios de Aceptación:** 
    *   **Funcionales:**
        *   Generación dinámica de códigos QR únicos para cada convenio solicitado.
        *   Módulo Administrativo (ABM) funcional para la gestión completa de Empresas, Convenios y Sucursales.
        *   Sistema de filtros y búsqueda por categorías (Salud, Educación, etc.) operativo.
    *   **Seguridad y Acceso:**
        *   Restricción de acceso a rutas `/admin` exclusivamente para usuarios con rol administrativo.
        *   Redirección automática de usuarios no autenticados a la página de inicio de sesión (`/auth/signin`).
        *   Implementación de políticas RLS (Row Level Security) en Supabase para proteger los datos de afiliados.
    *   **Persistencia y Datos:**
        *   Registro íntegro de cada canje en la tabla de trazabilidad (`deal_usages` / `cupones`).
        *   Almacenamiento y recuperación exitosa de artes/imágenes de convenios desde Supabase Storage.
    *   **Técnicos y Migración:**
        *   Eliminación total de dependencias y código relacionado con OracleDB y Azure SDKs locales.
        *   Interfaz 100% responsiva validada para dispositivos móviles (Mobile-First).
        *   Tiempo de respuesta de la plataforma optimizado bajo estándares de Next.js App Router (LCP < 2.5s).
*   **Costo y Plazo:** Desarrollo ejecutado en el periodo **Julio - Noviembre 2024**.

**5. Fronteras del Proyecto**
*   **Restricciones:** 
    *   **Fecha Límite:** Entrega final impostergable en Noviembre 2024 (Cierre de ciclo institucional).
    *   **Recursos Humanos:** Equipo técnico centralizado (1 Director técnico + Desarrolladores de apoyo).
    *   **Tecnología Original:** Obligatoriedad técnica inicial de usar OracleDB y .NET/Azure SDKs locales para la persistencia de datos corporativos.
    *   **Tecnología Actual (SaaS):** Evolución hacia Next.js 13+ y Supabase para garantizar la portabilidad y cumplimiento de estándares modernos de desarrollo ágil.
    *   **Normativa:** Cumplimiento con las regulaciones de manejo de datos sensibles de la Universidad Nacional (UNA).
*   **Exclusiones:** 
    *   Procesamiento de pagos monetarios (La plataforma gestiona el beneficio, no la transacción monetaria).
    *   Gestión de nómina de afiliados (Se consume de servicios externos).
*   **Prioridades (1º, 2º, 3º):** 
    *   **1º Tiempo** / **2º Alcance** / **3º Costo**
*   **Supuestos:** 
    *   Disponibilidad de conectividad a Internet en los puntos de venta de las Empresas Aliadas para la validación de QR.
    *   Acceso ininterrumpido a los servicios de Supabase (SaaS).
    *   Colaboración activa de los departamentos administrativos de FOBESO para la validación de catálogos migrados.

**6. Aprobaciones y Firmas**

| Director del Proyecto | Firma |
| :--- | :--- |
| **Marcos Román** | __________________________ |

| Otros Interesados | Firmas |
| :--- | :--- |
| **Dirección General - FOBESO UNA** | __________________________ |
| **Representante de TI - UNA** | __________________________ |
