# OKY Wallet — Transaction Explorer

**[Demo en vivo → https://okywallet.netlify.app](https://okywallet.netlify.app)**

Mini-aplicación que simula el historial de movimientos de una billetera digital, construida con React, TypeScript, Apollo Client y Gatsby. Los datos se consumen directamente desde la **Rick and Morty GraphQL API pública** — sin mocks, sin backend propio.

> Cada personaje de la API se presenta como una "transacción" en la UI. La prueba permite cualquier dominio (cohetes, personajes, etc.); lo importante es cómo se maneja y presenta la información.

---

## Funcionalidades implementadas

### Requeridas 

| # | Requerimiento | Implementación |
|---|---|---|
| Req 1 | Lista paginada | Paginación numérica con Apollo `typePolicies`, cada página tiene su propio cache entry |
| Req 2 | Filtro / búsqueda | Filtros enviados como variables GraphQL (`name`, `status`, `species`) + debounce de 300ms |
| Req 3 | Vista de detalle | Panel lateral (`?id=`) + ruta dedicada `/transaction/:id`, ambas con React routing |
| Req 4 | Estados completos | Skeleton loader, error con reintentar (+ countdown automático en rate-limit), estado vacío |
| Req 5 | TypeScript estricto | `strict: true`, sin `any` explícito, interfaces propias para todo el schema de la API |

### Opcionales 

| Opcional | Implementación |
|---|---|
| A. Diseño responsivo | Mobile-first con Tailwind (375px → 1280px), layout adaptable |
| B. Tests | 5 tests de componentes críticos con Vitest + Testing Library |
| C. Apollo Cache | `cache-and-network` en lista, `cache-first` en detalle, `keyArgs` por `["filter", "page"]` |
| D. Accesibilidad | Roles ARIA, navegación por teclado, `aria-modal`, `aria-pressed`, anillos de foco visibles |

### Extras (no solicitados)

- **Modo oscuro** — persiste en `localStorage`, respeta `prefers-color-scheme` en primera carga
- **Dashboard de estadísticas** — total, vivos, muertos y desconocidos en una sola query con aliases GraphQL
- **Resiliencia ante rate-limit** — `RetryLink` con exponential backoff (4 reintentos, hasta 8s), countdown visual de 10s en `ErrorState`
- **CI/CD** — GitHub Actions corre tests y typecheck en cada push/PR (`.github/workflows/ci.yml`)
- **Animaciones** — transición `fadeIn` en cambios de página y filtros (`animate-fade-in`)
- **404 personalizado** — página de error con navegación de vuelta al inicio

---

## Correr el proyecto (3 pasos)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start

# 3. Abrir en el navegador
# → http://localhost:8000
```

No se requiere backend local — la app habla directamente con `https://rickandmortyapi.com/graphql`.

### Otros comandos

| Comando | Descripción |
|---|---|
| `npm test` | Ejecutar todos los tests (Vitest) |
| `npm run build` | Build de producción |
| `npm run typecheck` | Verificación estricta de TypeScript |

### Apuntar a un endpoint diferente (opcional)

Crear `.env.development` en la raíz del proyecto:

```
GATSBY_GRAPHQL_URI=https://tu-endpoint-graphql/graphql
```

---

## Decisiones técnicas

### Stack

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Gatsby 5** | Routing basado en sistema de archivos, SSR-ready, TypeScript out-of-the-box |
| Datos | **Apollo Client 3** | Soporte GraphQL de primera clase, caché normalizado, política `cache-and-network` |
| Estilos | **Tailwind CSS** (`darkMode: "class"`) | Utility-first, zero runtime, modo oscuro consistente |
| Testing | **Vitest + Testing Library** | ESM nativo, zero config, misma API que Jest |
| API | **Rick and Morty GraphQL** (pública) | Estable, sin autenticación, paginación y filtros nativos, 826+ registros |

### Manejo de estado

El estado se gestiona en dos niveles:

- **Estado de servidor** — Apollo Client maneja todos los datos asincrónicos (fetching, caché, estados de error). No se necesita Redux ni Zustand.
- **Estado de UI** — `useState` y `useCallback` dentro de custom hooks encapsulados (`useCharacters`, `useCharacterDetail`, `useCharacterStats`, `useDarkMode`, `useDebounce`) mantienen la lógica testeable y desacoplada.

### Estrategia de caché Apollo

- La query de lista usa `fetchPolicy: "cache-and-network"`: muestra datos en caché instantáneamente mientras un refetch en background los mantiene frescos.
- La query de detalle usa `cache-first`: una vez cargado un personaje, abrirlo de nuevo es instantáneo.
- El campo `characters` tiene `keyArgs: ["filter", "page"]` en `typePolicies`, de modo que cada combinación única tiene su propio entry en caché y las páginas no se sobreescriben entre sí.
- `errorPolicy: "all"` a nivel de cliente: Rick and Morty devuelve un error GraphQL (no un array vacío) cuando un filtro no tiene resultados. Capturarlo permite renderizar un estado vacío limpio en lugar de un error genérico.

### Routing

El router de Gatsby gestiona dos rutas:

- `/` — lista paginada con query param `?id=<characterId>` para abrir el panel de detalle (URLs bookmarkeables, el botón Back del navegador cierra el panel).
- `/transaction/:id` — vista de detalle de página completa (client-only route declarada en `gatsby-node.ts` con `matchPath`).

### Implementación de filtros

Los filtros se envían como variables GraphQL (`filter: { name, status, species }`), no se filtran en el cliente. Este enfoque escala con una API real porque solo se transfieren los datos relevantes. Un debounce de 300ms en el campo de búsqueda evita una request por tecla.

El ordenamiento (por fecha `created`, más reciente / más antiguo) se hace en el cliente porque la API de Rick and Morty no soporta sort del lado del servidor — es el único post-procesamiento que se hace sobre los datos devueltos.

### Dashboard de estadísticas

El `StatsBar` usa una sola query con tres aliases GraphQL para obtener los conteos de total / vivos / muertos en un solo round-trip (ver `GET_STATS` en `src/graphql/queries.ts`).

### Accesibilidad

- Todas las tarjetas interactivas son navegables por teclado (`tabIndex=0`, manejadores de Enter/Space, anillos de foco visibles).
- El panel de detalle es un diálogo `aria-modal` que bloquea el scroll del body, enfoca el botón de cierre y se cierra con Escape.
- Los botones de filtro usan `aria-pressed` para exponer el estado activo a lectores de pantalla.
- El campo de búsqueda tiene ícono visible y etiqueta `sr-only`.

### Modo oscuro

`useDarkMode` persiste la preferencia en `localStorage` y respeta `prefers-color-scheme` en la primera carga. La estrategia `darkMode: "class"` de Tailwind compila cada utilidad `dark:` con zero runtime cost.

---

## Trade-offs

### Lo que sacrifiqué por tiempo

- **Infinite scroll** — La paginación numérica es más predecible y funciona bien con el page size fijo de 20 que impone la API. Infinite scroll requeriría `fetchMore` de Apollo con merge de offsets.
- **Filtrado dentro del detalle** — La vista de detalle lista todos los episodios en que aparece el personaje, pero no permite filtrar/buscar dentro de esa lista.
- **Tests E2E** — Solo hay tests unitarios de componentes. Un flujo E2E con Playwright (filtrar → clic → detalle → atrás) daría más confianza en la integración completa.

### Qué haría con más tiempo

- Tests E2E con Playwright cubriendo el flujo filtro → clic → detalle → atrás.
- Transiciones con `framer-motion` para el slide del panel de detalle y cross-fade en actualizaciones de la lista.
- Infinite scroll como alternativa a la paginación usando Apollo `fetchMore`.
- Optimistic UI para operaciones de escritura futuras (ej. marcar una transacción como revisada).
- Extender el skeleton loader al panel de detalle y al stats bar (actualmente solo en las tarjetas).

---

## Lo más difícil y cómo lo resolví

**Hacer funcionar Apollo Client dentro del SSR de Gatsby sin errores de `window is not defined`.**

Gatsby genera HTML estático durante el build (`gatsby build`) ejecutando los componentes en Node.js, donde `window` no existe. Apollo Client asume un entorno de browser al inicializarse. Esto causaba errores fatales en el build de Netlify que no aparecían en desarrollo.

La solución requirió tres cambios en cadena:

1. **Eliminar `ApolloProvider` de `gatsby-ssr.tsx`** — El envoltorio SSR ejecutaba código de Apollo durante el build estático. Quitarlo fue el fix más impactante: ningún código de Apollo se ejecuta en el servidor.
2. **Renderizado condicional con `mounted` state** — En `index.tsx` y `transaction.tsx`, los componentes que dependen de Apollo solo se renderizan en el cliente usando un flag `mounted` que cambia de `false` a `true` en un `useEffect`. El HTML estático muestra un loader; el JavaScript hidrata la app en el browser.
3. **Mover `navigate()` a un `useEffect`** — Llamar a `navigate("/")` directamente en el render (para redirigir IDs inválidos) también fallaba en SSR. Moverlo a un efecto garantiza que solo se ejecuta en el cliente.

Este problema no estaba en ninguna guía de Gatsby + Apollo — requirió leer el código fuente de ambas librerías para entender dónde exactamente ocurría el acceso a `window`.

---

## Estructura del proyecto

```
src/
├── components/       # TransactionCard, Pagination, SearchFilter, StatsBar, ErrorState, …
├── hooks/            # useCharacters, useCharacterDetail, useCharacterStats, useDarkMode, useDebounce
├── graphql/          # Queries: GET_CHARACTERS, GET_CHARACTER, GET_STATS
├── lib/              # Configuración de Apollo Client (RetryLink + typePolicies)
├── pages/            # index.tsx, transaction.tsx (/:id), 404.tsx
├── styles/           # CSS global (Tailwind base + animate-fade-in)
├── types/            # Interfaces TypeScript del schema de Rick and Morty
└── __tests__/        # Tests con Vitest + Testing Library
```

### CI/CD

GitHub Actions corre automáticamente en cada push y PR:
- `npm test` — suite completa de Vitest
- `npm run typecheck` — verificación estricta de TypeScript

Ver `.github/workflows/ci.yml`.
