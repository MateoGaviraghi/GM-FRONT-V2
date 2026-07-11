# PLAN MAESTRO v2 — Rediseño GM-FRONT-V2
### Cerebro: Fable · Ejecutan: Sonnet/Haiku · Audita: Fable (u Opus con este doc)

> Fuente de verdad operativa. Cada sprint se construye contra ESTE documento, entrega
> el RESUMEN DE ENTREGA (§8) y se audita ANTES de avanzar. Ningún agente decide
> composición ni motion por su cuenta: la dirección de diseño está escrita acá.
> Compañeros de este doc: `MOTION-PLAYBOOK.md` (firmas por ruta) y el design system
> vivo en `src/app/globals.css` (tokens GM).

---

## VISIÓN — qué significa "WOW" en ESTE proyecto (5 criterios VERIFICABLES)

1. **Firma única por ruta**: recorrer las 9 superficies públicas = 9 aperturas
   distintas y nombrables (Apertura/Archivo/Señal/Desfile/Túnel/Ficha maestra/
   El patio/Segunda vida/La prensa). Verificación: inventario de motion sin
   mecánica dominante duplicada.
2. **Cero estética IA**: greps de lista negra (§2.5-9) y legacy (cyan/slate/rounded)
   = 0 en público; solo tokens GM; esquinas 90°.
3. **Scroll narrativo, no decorativo**: cada página tiene ≥1 momento scroll-driven
   que COMUNICA (cotas que se dibujan, progreso de lectura, Flip de inventario) y
   0 parallax/pins sin función. 60fps: sin long-tasks >50ms en interacción.
4. **Performance**: LCP <2.5s desktop / ≤4s mobile-4x, CLS ≤0.05, TBT ≤250ms
   (Lighthouse en D1); ninguna imagen above-the-fold >100kB en home.
5. **Detalle terminado**: hover/focus/empty/error/loading en lenguaje GM en TODAS
   las superficies; focus visible con teclado; reduced-motion digno al 100%.

---

## 0. ESTADO REAL DEL PROYECTO (no re-hacer, no re-explorar)

**TERMINADO y aprobado por Mateo:**
- Home completo (firma "Apertura"), /nosotros ("Archivo"), /contacto ("Señal"),
  /foton landing ("Desfile").
- B2: CategoryTemplate "Túnel" + 7 páginas de categoría (filas editoriales 50/50
  alternadas, índice fantasma en flujo, features en rail).
- B3: ModelTemplate "Ficha maestra" + 12 modelos (hero con riel + membrete wordmark +
  placa insignia, velo de legibilidad, bandas de cifras, cotas blueprint, Ken Burns,
  componentes flotantes con sombra de piso).
- B4: Remolques público "El patio" (apertura con portones + título letra-por-letra,
  rail de filtros con subrayado viajero, Flip, cards con sweep, detalle "legajo de
  taller" con cotas, drag-gallery con chip ARRASTRÁ, PDF del folleto rediseñado GM
  en el backend con PDFKit).
- P1 (=B5): Usados público "Segunda vida" (porcelana, cortina hover, flip-year,
  panel de filtros bordeado con pills petróleo, detalle con datasheet completo).
  Fixes post-checkpoint aplicados (entrada on-mount de cards, bordes marcados).
- Share subsystem GM (botón flotante solo-ícono apilado sobre scroll-top + modales
  foton/remolque/usado).
- Header publica `--gm-header-h` (expandido, para heros) y `--gm-header-h-live`
  (ResizeObserver, para stickies). Logo compensado (-ml-3 por padding del PNG).

- T1 (fixes de auditoría): firma única blindada (gates solo en remolques),
  reduced-motion completo en gm/reveal, gm/section-heading, foton-categories;
  **Lenis global** (único mount en `src/app/(public)/layout.tsx`); redirects 308
  de `/foton/{tm,tunland-g7,tunland-v9}` a canónicas; `/cotizador` 632→116kB
  First Load (react-pdf lazy); logos del home <80kB.

- P2 (=B6): Novedades público "La prensa" — masthead centrado + filete doble que
  se imprime, lead story, feed teletipado, columna de margen sticky con crossfade,
  detalle con barra de lectura 2px (var live), 68ch, drop cap, lightbox GM,
  View Transitions activas (next.config experimental, build prod ok). Demo:
  2 novedades sembradas (6a501546…, 6a501547…).

- A0: kit "Cabina" completo en `src/components/admin/kit/` (11 archivos) + tokens
  danger/success/warn + demo en `/admin/kit-demo` (URL `/admin/_kit` vía rewrite en
  next.config — **A6 debe borrar carpeta Y rewrite**). GmButton reusado. Verificado
  logueado contra backend real. Desvío aceptado: ConfirmDialog danger = GmButton
  solidDark + bg-danger (sweep petrol; opcional agregar tone danger a GmButton).

- A1: AdminShell aplicado al layout real (nav verbatim, auth/middleware/logout
  intactos, flujo HTTP probado), login Cabina (page limpia, sin wrapper legacy),
  dashboard Cabina. 8/8 checks.
- P2 v3 (dirección final tras iteraciones con Mateo): hero fotográfico con filete
  doble imprimiéndose, cards foto-dominantes (figure 62.7% de la card, h3 ≤24px),
  detalle con hero en placa sin recorte (desvío 0.2%), drop cap 52px. CARDS
  UNIFICADAS usados+novedades (16:10, 3-col, Δ2.7px) con la cascada diagonal de
  remolques como entrada estándar de cards; home con la misma cascada y layout
  auto-centrado (1-2 cards centradas exacto, hasta 4 por fila).

**CAMBIO DE ALCANCE (Mateo):** el módulo admin "Vehículos 0km" NO se usará →
**A3 CANCELADO**. Se quita de la nav del AdminShell; las rutas /admin/vehiculos
quedan dormidas (no se borran salvo pedido explícito). T1.4 AUTORIZADO (borrar
media-gallery/hero-media-gallery si 0 imports).
NOTA entorno: error 431 en /admin = cookies acumuladas de localhost (dominio
compartido entre proyectos/puertos) — se resuelve limpiando cookies del sitio;
no es bug de código.

- A0R "Mostrador": kit admin re-skineado completo a la spec elderly-first de Mateo
  (§4R) — 10/10 checks. AdminButton nuevo; tipografía ≥16px (0 restos); bordes 2px;
  contraste primario 6.91:1; tokens -text de estado AA (4.6:1+); masks (tel/precio/
  patente/fecha) + MaskedInput; useFormDraft (bug de pérdida de datos cazado y
  arreglado) + DraftBanner + useUnsavedGuard; friendly-errors; MediaUploadZone v2
  (instrucción permanente, validación previa, compresión canvas 1920px, progreso);
  shell/login/dashboard re-skineados; demo actualizada. NOTA API: onFilesSelected
  ahora es (files: File[]) ya comprimidos.

- A2/A4/A5/A6: los 4 módulos admin re-vestidos a Mostrador con field-diff vacío,
  drafts+guard, ConfirmDialog, debounce server-side, MediaUploadZone v2 (incl.
  editar de remolques con previews de media existente y staging de borrado),
  ToastProvider único en layout, papelera de novedades con restore, fix
  destacada (append solo si true), fix mismatch usados en service (normalize
  lectura + rename/whitelist escritura — detalle público ya muestra Versión/
  Transmisión/Tracción/Potencia). Demo kit-demo y su rewrite ELIMINADOS.

**PENDIENTE:** D1 QA final. Backlog §7 (+ NUEVO abajo).
**GAP DE BACKEND (†A4-fix, para Mateo):** remolques NO tiene endpoint
update-with-media ni delete de imagen/video (PATCH es JSON-only) → la UI de
editar ya está lista (staging de altas/bajas de media) pero NO PERSISTE cambios
de media hasta que el backend agregue ese endpoint (usados sí lo tiene; copiar
ese patrón en GM-BACK-V2).
Incidente menor documentado: una pestaña de preview compartida entre agentes
borró una novedad de PRUEBA creada durante la verificación de A6 ("QA Test
Novedad A6") — las 2 novedades demo sembradas siguen intactas; sin pérdida real.
REGLA DE PROCESO vigente: specs a nivel TRANSCRIPCIÓN (JSX/clases exactas del
director); los agentes no diseñan, transcriben y verifican con números.
LANDMINE anotada: regla global `button{min-height:44px}` FUERA de @layer en
globals.css le gana a las utilities — cuidado con controles compactos en A2-A6
(el kit ya la esquiva donde hizo falta).
Quirk backend anotado para A6: el DTO de novedades coerce "false"→true en
`destacada` (multipart string→boolean); revisar al re-vestir el form admin.

**Datos de demo sembrados (dev):** remolque `6a4f17ef…` (Alcorta batea), usado
`6a4fd7c7…` (Foton Aumark 2019). Usuario dev `dev-seeder@guzmanmotors.local`
(contraseña NO se guarda en el repo — pedirla en sesión; borrar este usuario
cuando Mateo tenga su propio admin).

**2026-07-09/10 — D1 QA transversal: CERRADO.** Build prod limpio (shared 113kB;
modelos FOTON 284-285kB First Load) · tsc limpio · greps lista negra público = 0
(única fuente era `nosotros/page_nueva.tsx`, borrador huérfano sin rutear —
ELIMINADO) · 0 links a /cotizador · overflow 390px = 0 en las 14 rutas clave ·
solapes fantasma: 2 reportes verificados como FALSOS POSITIVOS (índice en flujo
dentro de su propio card-link en category-template) · rutas: todas 200/308/307
esperados (un 500 puntual fue race de compile on-demand tras limpiar .next) ·
2 imágenes pesadas convertidas a WebP (PesadosVocacionales2 1028→357KB, exterior-
WONDER-5 1233→420KB, refs actualizadas; PNGs originales quedan en disco sin uso).
PENDIENTE AMBIENTAL: Lighthouse mobile no se puede correr local sin `next build`
que pisa `.next` de los dev servers (ya rompió 3001/3005 una vez — se recuperó
con kill + rm .next + relaunch); medirlo en el deploy de producción.
LANDMINE nueva (regla 24): NUNCA correr `next build` mientras los dev servers
comparten el mismo `.next` — tumba el 3001 de Mateo con "Internal Server Error".

**2026-07-10 — REDISEÑO ADMIN "LA OFICINA" (§4R2): APLICADO COMPLETO.** Mateo
rechazó Mostrador v1 (feo/tildado/íconos viejos). Rediseño total en 4 olas
(14/14 agentes, 22 archivos, +5698/-8207): kit completo (shell riel de carbón
268px + breadcrumb mono, FormShell/FormSection tarjetas con índice, controlBase
1.5px + halo petrol, DataTable mono headers, Badge/Tabs/Modal/Toast/Upload/Draft
hairline), login split "Recepción" (panel carbón + form papel, logos públicos,
lógica/rate-limit intactos), dashboard "Tablero" (stats reales 4 módulos vía
services + accesos rápidos + cards cuenta/acceso con copy verbatim), perf
des-tildado (useFormDraft valuesRef, autocomplete debounce 150ms, ProtectedRoute
sessionValidated una vez, lista-clientes 1 fetch por pausa + useCallback,
useWatch único en forms clientes), barrido 4 módulos con field-diff VACÍO
verificado. Verificación en vivo: login OK, stats con números (no skeleton
eterno), sidebar carbón activo petrol, form crear con eyebrow/tarjetas/índices,
0 errores consola. Restos border-2 corregidos a mano (clientes/page, media-upload
error box tint, login success card + error alert tint); EXCEPCIONES válidas:
spinner `rounded-full border-2` en admin/page:123 y overlay `bg-carbon-0/50` de
modal.tsx (parte de spec 4R2.c). vehiculos/** NO tocado (fuera del negocio).
Falta: veredicto de Mateo sobre la nueva dirección.
**RECHAZADO por Mateo (2026-07-10)** → ver 4R3.

**2026-07-10 — RE-SKIN ADMIN "SOFT SAAS" (§4R3): APLICADO Y VERIFICADO 13/13.**
Mateo dejó 8 referencias en `public/examples-admin/` (HiveQ/Prodex): SaaS suave.
Aplicado: sidebar BLANCO con secciones "Menú principal/Módulos" + logo mark +
"Guzmán Motors" en texto gray-900 (fix del reclamo del logo), fondo #F6F7F9,
tarjetas rounded-2xl+shadow-sm, botón primario gray-900 (adiós "todo azul"),
chips pastel por módulo (emerald/indigo/amber/violet), pills rounded-full,
tablas aireadas hover suave, inputs rounded-lg h-11, login card centrada (sin
split carbón), dashboard con 👋 y stat-cards con chips, danger suave en filas.
Verificación: tsc limpio · greps 4R3 en verde (0 tokens GM/display/mono en admin;
39 falsos positivos eran shrink-0) · vivo 20/20 (sidebar blanca medida, radius
16px, sombra presente, botón oscuro lab 8.1, red suave, h-11) · DOM del director
confirmado. EXCEPCIONES OK: spinner border-2 en admin/page:158 (aro de carga);
backdrop-blur solo en vehiculos/** (fuera del negocio, no tocado). Los perf
fixes 4R2.f SIGUEN vigentes (no se tocó lógica). El admin queda EXENTO de las
reglas 90°/tokens GM del público — regla §2 NO aplica a src/app/admin ni al kit.
NOTA screenshots: el tab de preview dejó de responder a capturas (renderer
freeze conocido, regla 22) — verificación hecha por preview_inspect/DOM.
Falta: veredicto de Mateo.

**2026-07-10 — BARRIDO E2E TOTAL (pedido de Mateo "cada endpoint de par a par"):
COMPLETO, 6/6.** Inventario real desde el código (56 endpoints, 59 rutas, 330
assets). Resultados: (a) 51 GETs todos 200 en 205-337ms, ninguno >800ms; edge
cases page=9999/acentos/ñ OK; (b) CRUD E2E 24/24 por los 4 módulos (crear→leer→
editar→borrar; novedades: soft delete→papelera→restore→hard delete OK), payloads
inválidos → 400 con mensajes claros, limpieza QA-E2E- verificada total 0;
(c) 59 rutas front OK, 0 errores consola, 0 network failed, 0 imágenes rotas en
17 páginas; (d) 330 assets existen y sirven 200, case-sensitivity APTO para
deploy Linux, 27/27 paths difíciles (espacios/case/+) OK.
FIXES aplicados tras el barrido:
1. Imágenes tanda 2: 10 PNGs >600KB → WebP q72 (8.3MB→2.0MB, -76%), 10 refs
   actualizadas en 7 archivos (cotizador-data, wonder, medianos, auman-d,
   pesados-ruta, nuevo-auman-r, auman-c), originales borrados (git los guarda);
   `FOTON/Auman D.png` y `Foto-Cateogries-Foton-Medianos2.png` = huérfanos sin
   refs en src (se conservan por si la DB los referencia). Verificado: tsc 0,
   10/10 webp 200, 7/7 páginas 200.
2. BACKEND GM-BACK-V2 (únicos 2 bugs del barrido) CORREGIDOS Y VERIFICADOS:
   clientes.service findOne validaba nada → ahora 400 id inválido / 404
   inexistente (patrón del propio archivo); usuarios.service findOne/update/
   remove → validación ObjectId 400 (antes 500 CastError). Probado en vivo:
   /clientes/abc→400, /clientes/000…0→404, /usuarios/abc→400.
3. Ambos servers relanzados tras reinicio de la máquina (back 3000 + front 3001).
PENDIENTE que queda del barrido: nada bloqueante. Backlog §7 sin cambios
(remolques update-with-media, register público, borrar dev-seeder, PDFs pesados
4-11MB son fichas descargables — decisión de Mateo si comprimirlas).

**2026-07-10 — DEPLOY A PRODUCCIÓN: COMPLETO Y VERIFICADO.**
Infra real (Mateo la tenía configurada): FRONT = Vercel proyecto `guzman-motors`
→ www.guzmanmotors.com.ar (NEXT_PUBLIC_API_URL=https://gm-back-v2.fly.dev/api) ·
BACK = Fly.io app `gm-back-v2` región gru, secrets completos (Mongo Atlas
compartida dev/prod, Cloudinary, JWT, CORS_ORIGINS). Deploys hechos desde el
directorio local (fly deploy --remote-only / vercel --prod) porque la auth de
GitHub del equipo está VENCIDA (token inválido — push pendiente de `gh auth login`).
Pre-deploy: REGISTER CERRADO (POST /usuarios ahora JWT+admin; verificado 401 en
prod) — resuelve el ítem de seguridad de §7; contraseña de dev-seeder REMOVIDA
del plan; capturas de referencia movidas de public/ a design-refs-admin/; archivo
basura `nul` (nombre reservado Windows) borrado — rompía git add.
Git: front commit 84364e9 (todo el rediseño, 294 archivos) + back ec21dfc
(validaciones + register + PDF GM), dev mergeado a main en AMBOS repos (front
resolvió conflicto package-lock con versión dev). TODO SIN PUSHEAR hasta re-auth.
Verificación en prod: back 401 register/400 id inválido/200 público · dominio
sirve versión nueva (marcadores gm-display en home, login Soft SaaS con
"Iniciar sesión"+rounded-2xl, webp nuevos referenciados, /remolques 200,
redirect legacy 308). Fly con auto_stop min=0: primer request tras inactividad
tiene cold start de ~2-4s (subir min_machines_running a 1 si molesta).
PENDIENTES POST-DEPLOY para Mateo: (1) ~~gh auth login y push~~ HECHO 2026-07-10
(repos 100% sync, Action de Fly en verde); (2) crear su usuario admin real y
borrar dev-seeder; (3) decidir compresión de PDFs 4-11MB.

**2026-07-10 — SPRINT RESPONSIVE "NIVEL APP" (público): COMPLETO 11/11.**
Skills instaladas global (~/.claude/skills): imagegen-frontend-mobile,
mobile-android-design, mobile-app-ui-design, responsive-design,
flutter-build-responsive-layout. Auditoría: batería DOM propia del director
(overflow/tap-targets/tiny-fonts/zoom-inputs/broken/edge/clipped/squeezed) en
30 rutas @390 + 10 @768 + 2 auditores de código. SANO de base: 0 overflow en
todo, GSAP/pinned/Draggable/sticky con guards correctos. CORREGIDO (recetas
R1-R9 del director, desktop intacto — todo mobile-prefixed o expansión
invisible py/-my): (1) tap-targets ≥44px: nav drawer+footer (min-h-11),
tel/email (py-3 -my-3), sociales (size-11), "Volver a X" en category/model/
remolque/usado (py-3 -my-3), breadcrumbs novedad (py-2.5), chip categoría
(pseudo before -inset-y-2 = hit 44px), FilterPills (min-h-11); (2) anti-zoom
iOS: inputs/selects de los 3 listados + contacto a text-[16px] sm:<original>;
(3) hover-only→touch: Maximize2 galería y chevrons widget ahora
"opacity-100 md:opacity-0 md:group-hover:opacity-100"; (4) safe-area:
share-button y scroll-to-top con bottom calc(...+env(safe-area-inset-bottom));
(5) .gm-label 11px→12px SOLO mobile (@media max-640 en globals). FALSO
POSITIVO: "edge" del home = slides del marquee cruzando el borde (por diseño).
LECCIÓN (regla 21 otra vez): tras editar un componente compartido, rutas ya
compiladas por Turbopack sirven el chunk viejo — /contacto y /foton "fallaban"
por caché; restart del server y pasaron.
SÍNTOMA NUEVO de la misma regla 21 (2026-07-10): "SPLASH INFINITO" — Turbopack
podrido sirve SSR viejo + cliente nuevo → hydration mismatch masivo → React
nunca completa la hidratación → los timers del splash (page-transition.tsx,
450/800ms) jamás corren y el telón queda pegado para siempre (diagnóstico:
sessionStorage 'gm-splash' queda null). Fix: kill 3001+3005 + rm .next +
relanzar ambos (comparten .next). Verificado: splash entra y sale en <1s tras
la limpieza. Verificación final del director en
vivo: 11/11 rutas PASA + tsc limpio. SIN DEPLOYAR aún (commit pendiente de
OK de Mateo).

**2026-07-10 — PDFs FICHA TÉCNICA "NIVEL FOLLETO FOTON" (back): COMPLETO.**
Director estudió visualmente el folleto FOTON G7 real (poppler instalado global
vía winget para renderizar PDFs a PNG: pdftoppm en
%LOCALAPPDATA%/Microsoft/WinGet/Packages/oschwartz10612.Poppler_*/poppler-*/Library/bin/).
Diseño "FICHA GM" en ambos endpoints existentes (remolques y usados
/:id/ficha-tecnica, pdfkit, sin tocar rutas/lógica/fetch Cloudinary):
A4 APAISADO · Pág1 portada foto full-bleed con degradado carbón reforzado
(0→0.55@45%→0.96), logos arriba-izq, FICHA TÉCNICA tracked arriba-der, eyebrow
petrolBright (condición·categoría·marca / tipo·año·km), título Helvetica-
BoldOblique 42/30 máx 2 líneas + barra petrol + subtítulo; sin foto → portada
tipográfica con watermark 120pt 5% · Pág2 técnica clara estilo FOTON: banda de
marca carbón 72pt con título der, banda CARACTERÍSTICAS TÉCNICAS, tabla
agrupada (categoría en celda panel SIN hairlines cruzadas — líneas de fila
desde x=158; filas de altura dinámica 17/29 para valores de 2 líneas sin "…"),
2 placas de foto der (fallback placa carbón con logo / panel), banda de
contacto carbón 60pt (dirección/tel/email/horarios reales) · Pág3+ EQUIPAMIENTO
2 columnas con "+" petrol (remolques: DE SERIE/OPCIONAL; usados: lista única),
paginación dinámica. Iteración v2→v4 con revisión VISUAL del director
(pdftoppm→Read): fix tachado de categorías, fix wrap de valores (redondeo
pdfkit: fila 29pt / height 21), fix legibilidad eyebrow. Build nest limpio.
SIN DEPLOYAR (junto con el sprint responsive — ambos esperan OK de Mateo:
back = fly deploy o push a main con Action; front = commit responsive +
vercel --prod).

---

## 1. CÓMO SE TRABAJA (loop de ahorro de tokens)

| Modelo | Rol | Hace | NO hace |
|---|---|---|---|
| **Haiku** | ojos/manos | leer, grep, extraer verbatim, auditar fidelidad, swaps con spec exacta | decidir diseño, resolver bugs |
| **Sonnet** | constructor | implementar EXACTAMENTE lo especificado acá, espejando referencias aprobadas | inventar composición/motion |
| **Fable/Opus** | cerebro+auditor | este plan, decisiones, bugs duros, auditoría de cada entrega | picar código repetitivo, leer archivos enteros |

**Ciclo:** abrir sprint (spec ya está acá) → construir (Workflow si hay paralelismo
real; agente único si es secuencial) → RESUMEN DE ENTREGA → auditoría del cerebro
(checklist §8, re-corriendo tsc y verificando en DOM, sin confiar en reportes) →
checkpoint a Mateo → recién ahí, siguiente sprint.

**Referencias canónicas para espejar** (los agentes las leen, no las reinventan):
- Listado oscuro + filtros + Flip: `src/components/cliente/remolques/remolques-listado.tsx`
- Listado claro + panel filtros bordeado: `src/components/cliente/usados/usados-listado.tsx`
- Detalle datasheet + tabs live: `src/components/cliente/remolques/remolque-detalle.tsx`
- Card con sweep: `src/components/cliente/remolques/remolque-card.tsx` /
  `usados/usado-card.tsx`
- Galería drag entidad-agnóstica: `src/components/cliente/remolques/remolque-gallery.tsx`
- Botón con sweep: `src/components/cliente/home/gm/gm-button.tsx`
- Share modal GM: `src/components/remolque-share-modal.tsx`

---

## 2. REGLAS DURAS GLOBALES (violación = auditoría roja)

### Contenido
1. **VERBATIM absoluto.** Ningún texto/dato/imagen/link se altera, quita ni oculta
   (ni `hidden` por breakpoint). Lo que "sobra" se RE-PRESENTA.
2. **Prohibido `/cotizador`** en páginas públicas.

### Estética (matar el look IA)
3. Solo tokens GM: `carbon-0/1/2/3`, `paper-0/1/2`, `ink-0/1/2`,
   `platinum/silver/steel`, `line-dark(-2)/line-light(-2)`, `petrol-bright/deep/dim`.
   **Cero cyan/slate legacy. Esquinas 90°. Hairlines 1px.**
4. Tipos: `.gm-display` (Archivo wdth 125, uppercase), `.gm-label` (mono 0.22em),
   `text-display-1/2/3` fluidos. `gm-grain` para matar el flat.

### LISTA NEGRA (patrones prohibidos)
5. Grillas de celdas-caja `gap-px` + `bg-*-2 px-5 py-5` como recurso por defecto
   → hoja datasheet / banda de cifras inline / cota blueprint.
6. El trío `gm-plus + label + hairline flex-1` clonado idéntico en toda sección.
7. Reveal `y:30 autoAlpha` como ÚNICA mecánica.
8. Dos botones-cajón gemelos al pie de cards → sweep GM inline.
9. Stats en cajitas con borde exterior → tira mínima con regla lateral.

### Composición (ganadas con sangre)
10. **Índices fantasma EN FLUJO** (`block`, bloque propio arriba del heading,
    `leading-[0.85] text-platinum/[0.06]`). NUNCA absolute. Lado opuesto a la imagen.
11. **Texto sobre foto**: labels `silver` (dark) / `ink-1` (light) + **velo**
    `bg-carbon-0/45 backdrop-blur-md` detrás del bloque. Sin excepción.
12. **Card de vehículo**: foto REAL full-bleed `object-cover`; la sin-fondo es del PDF.
13. Filas editoriales **simétricas 50/50 + canal ≥56px**; jamás solape imagen↔texto.
14. **En skin claro los hairlines `line-light` no alcanzan**: controles (inputs,
    selects, pills, navs) llevan `border-line-light-2` + fondo diferenciado
    (`paper-2`) + acento `petrol-deep`. Pills activas con `bg-petrol-dim`.
15. Sweep de GmButton (capa `-translate-x-[101%]`→`0`, 520ms bezier(0.16,1,0.3,1))
    = ÚNICA mecánica de "pintar la barra". No reinventar.
16. Sticky interno ancla a `--gm-header-h-live`; heros usan `--gm-header-h`.
17. **La identidad de cada ruta es su ENTRADA (motion)**, no reacomodar el layout.
    Una mecánica dominante por ruta, jamás clonada de otra (MOTION-PLAYBOOK).

### Motion / a11y
18. Entradas de contenido above-the-fold: **on-mount**, no scroll-gated (evita el
    estado clippeado "tildado"). ScrollTrigger solo para lo que está bajo el fold.
    `clearProps` al terminar tweens que tocan transform/clip de elementos interactivos.
19. `prefers-reduced-motion` → estado final visible; si hay overlays de apertura
    (portones), ocultarlos ANTES del early-return.
20. Decorativos `alt="" aria-hidden`. El nombre real siempre en el `<h1>`.

### Entorno (gotchas caros)
21. **Watcher de Turbopack se pudre**: si el SSR sirve markup viejo (hydration
    mismatch old-vs-new) → matar proceso del puerto, borrar `.next`, relanzar,
    y verificar con `curl` que el SSR sirve lo nuevo. No diagnosticar "bug de código"
    sin descartar esto.
22. Backend GM-BACK-V2 en :3000 (`set PORT=3000&& npm run start:dev`, detached,
    cwd `C:\Users\mateo\Desktop\GM-BACK-V2`). Prefijo `/api`. Si el preview toma
    el puerto 3000, el backend está caído: soltarlo y relanzar backend primero.
23. El preview de automación congela rAF y rompe screenshots → verificar por DOM
    forzando estado final y midiendo rects. El auditor de solapes es obligatorio
    donde haya fantasmas/overlays.

---

## 2b. SPRINT T1 — Correcciones de auditoría (ANTES de P2; salió de la Fase 1)

| Ítem | Objetivo | Skill(s) | Modelo | Criterio de aceptación | Riesgo |
|---|---|---|---|---|---|
| T1.1 Higiene motion | Quitar los PORTONES copiados de `usados-listado` (su apertura = estampado del título + línea petrol + cortinas de cards + flip-year, nada más); agregar `prefers-reduced-motion` a `reveal.tsx`, `section-heading.tsx`, `category-template.tsx`, `foton-categories.tsx` (con fallback estático en el matchMedia de categories); mover `SmoothScroll` a `src/app/(public)/layout.tsx` y quitar TODOS los mounts por página | /ui-animation, /gsap-scrolltrigger | Sonnet | grep `data-gate` en usados = 0; los 4 archivos con check de reduce; `SmoothScroll` solo en el layout público (grep = 1 mount); todas las rutas públicas 200 | Medio (toca varios archivos de motion) |
| T1.2 Redirects legacy | `/foton/tm`, `/foton/tunland-g7`, `/foton/tunland-v9` → `permanentRedirect` a sus canónicas (`/foton/ultralivianos/tm`, `/foton/pick-ups/…`). NO borrar archivos todavía | — | Sonnet | curl a las 3 rutas → 308 hacia la canónica | Bajo |
| T1.3 Perf quick-wins | (a) Lazy-load `@react-pdf/renderer` en `/cotizador` vía `next/dynamic` (SIN tocar nada visual de esa página); (b) comprimir/convertir los logos pesados del home (150-224kB → WebP/PNG optimizado, script `scripts/optimize-images.mjs`) | /optimize | Sonnet | build prod: `/cotizador` First Load < 300kB; logos del home < 80kB c/u; PDF del cotizador sigue generándose | Bajo-medio (verificar PDF) |
| T1.4 Borrados (CHECKPOINT Mateo) | Tras T1.2 en verde: borrar las 3 páginas dupe + `media-gallery.tsx`/`hero-media-gallery.tsx` si el grep confirma 0 imports | — | Haiku verifica → Mateo aprueba | grep de imports = 0 y OK explícito de Mateo | Irreversible → checkpoint |

Notas de auditoría descartadas por el cerebro (no ejecutar): "cerrar /cotizador
público" (es herramienta interna de Mateo; la regla es no promocionarlo);
"clearProps en el track de Draggable" (lo rompería); "Server Action en contacto"
(mega-refactor sin valor visible).

---

## 3. SPRINT P2 — Novedades público · firma "La prensa" (DIRECCIÓN COMPLETA)

> **ENMIENDA v3 (dirección FINAL tras dos rechazos de Mateo):** anulados el masthead
> centrado, el lead 16/9, la columna de margen, y también las filas texto-dominantes
> de la v2 (tipografía gigante, fotos de 200px, recortes 21/9). Dirección vigente:
> (a) HERO FOTOGRÁFICO como todas las páginas (78svh, foto+scrims, eyebrow ACTUALIDAD,
> NOVEDADES display-1 a eje izquierdo, subtítulo) con el FILETE DOBLE imprimiéndose
> en su borde inferior — esa es la firma, junto con teletipo/barra de lectura/VT;
> (b) feed de CARDS FOTO-DOMINANTES (grid sm:grid-cols-2; figure 16/10 ≥50% de la
> card; título gm-display tope text-2xl; destacada = badge sobre la foto, tamaño
> uniforme; NovedadCard compartida con relacionadas); (c) detalle: título tope
> 2.75rem, hero en PLACA carbón object-contain max-h-560 (cero recortes), drop cap
> 3.25rem, galería contact-sheet contain, headings de sección tope text-xl.
> **En novedades LA FOTO manda; el texto acompaña.** Regla de proceso derivada:
> las specs a agentes se escriben a nivel TRANSCRIPCIÓN (clases exactas) — los
> agentes no diseñan. Lo que sigue de §3 vale solo donde no contradiga esto.

**Concepto:** la sala de prensa de Guzmán. No es showroom: es EDITORIAL. La página
respira a periódico bien impreso: jerarquía tipográfica dura, filetes, datelines
en mono, una columna de margen con la foto de la nota que estás por leer.

**Skin:** claro papel (paper/ink/petrol-deep) pero con **densidad editorial**:
el dispositivo distintivo es el **filete doble** (regla de 2px + regla de 1px
separadas 3px — `border-t-2` + pseudo/hermano `h-px` con `mt-[3px]`) bajo el
masthead y entre bloques mayores. Ese filete NO existe en ninguna otra ruta:
es la marca de "La prensa".

### 3.1 Listado `/novedades` (`src/components/cliente/novedades/novedades-listado.tsx`)
Composición (desktop):
- **Masthead centrado** (única ruta con centro: autenticidad de periódico):
  eyebrow "ACTUALIDAD" mono → "NOVEDADES" en `text-display-1` → subtítulo verbatim
  ("Mantente informado…") → **filete doble** a todo el ancho del contenedor.
- Bajo el masthead, barra de herramientas editorial (búsqueda + Categoría +
  Mostrar destacadas + Limpiar): en claro ⇒ regla 14 (bordes `line-light-2`,
  fondo `paper-2`, pills/selects como en usados).
- **Feed en dos zonas**: columna principal (filas editoriales) + **columna de margen
  fija derecha ~320px (sticky)** con la imagen de la nota bajo hover en **crossfade**
  (no persigue el cursor; vive en el margen). Mobile: la columna de margen no existe
  y cada fila muestra su imagen arriba (nada se oculta: la imagen está en la fila).
- **Fila editorial** (cada nota): dateline mono (`fechaPublicacion` formateada +
  `vistas` + chip hairline de `categoria` si existe) → título en display grande
  (hover: subrayado gm-underline) → `resumen` (si existe) → "Leer más" con flecha.
  Hairline entre filas. Índice de fila mono (01, 02…) en el margen izquierdo.
- **Lead story**: la PRIMERA nota `destacada` de la página se presenta a lo ancho
  (imagen 16/9 grande + título display-2) antes del feed. Si no hay destacadas,
  no hay lead (no inventar).
- Paginación existente (9/pág) re-vestida: prev/next mono + "Mostrando X de Y
  novedades" verbatim.

Motion de entrada (única de la ruta — "el cierre de edición"):
1. El **filete doble se imprime**: la regla gruesa `scaleX 0→1` izq→der (0.9s
   power3.inOut) y la fina la sigue con 0.12s de delay.
2. "NOVEDADES" **emerge desde debajo del filete**: contenedor `overflow-hidden`,
   título `yPercent 110→0` (0.9s power4.out) apenas la regla pasa el 30%.
3. Las filas del feed se **teletipan**: stagger rápido 0.05s, `y:14 autoAlpha 0→1`,
   ON-MOUNT para lo visible (regla 18), ScrollTrigger para las de abajo.
4. Columna de margen: la imagen hace crossfade 0.35s al cambiar hover; con la
   primera nota como estado inicial (nunca vacía si hay notas).

**View Transition** card→detalle (la estrella funcional):
- `next.config.ts`: `experimental: { viewTransition: true }`.
- Cada imagen de nota lleva `view-transition-name: nota-<_id>` (style inline).
- La imagen hero del detalle lleva el MISMO nombre ⇒ la imagen "viaja" de la
  card/margen al hero al navegar. Progressive: sin soporte → navegación normal.
- Guard: nombre único por página (solo la nota navegada lo conserva al salir si
  hace falta; implementación estándar de VT en App Router con `<Link>`).

### 3.2 Detalle `/novedades/[id]` (`src/components/cliente/novedades/novedad-detalle.tsx`)
- **Barra de progreso de lectura**: `fixed top-0` (bajo el header sticky:
  `top-[var(--gm-header-h-live,68px)]`), 2px petrol-deep, `scaleX` scrub por scroll
  del artículo (GSAP ScrollTrigger scrub con trigger = el cuerpo del artículo).
- Layout artículo: breadcrumb verbatim → dateline mono (fecha + vistas + categoria
  + badge "Destacada" si aplica, verbatim) → título display → imagen hero (la del
  VT) → **cuerpo a 68ch** (`max-w-[68ch]`), texto plano `whitespace-pre-wrap`
  respetado. **Drop cap**: `first-letter:` en Archivo, 3 líneas, solo si el primer
  carácter es letra (CSS puro, sin tocar contenido).
- Galería adicional (resto de `imagenes[]`): reveals al scroll, click → lightbox
  (reusar patrón del lightbox de remolque-gallery si es trivial; si no, el modal
  ampliado existente re-vestido).
- `links[]` → "Enlaces Relacionados" (verbatim): bloques hairline con título,
  descripción y ExternalLink, hover sweep sutil.
- Share row existente re-vestida GM (Compartir/WhatsApp/Instagram/Facebook +
  "¡Copiado!" verbatim; solo piel).
- "Novedades relacionadas" (verbatim): filas editoriales compactas.
- Estados error/loading verbatim re-vestidos.

**Modelo:** Sonnet construye (2 agentes: listado / detalle+VT). Haiku extrae verbatim
antes y verifica después. Fable ya dejó la dirección (este §3): no hay decisión
abierta. **Nota VT:** si `experimental.viewTransition` diera problemas con la
versión de Next (15.4), fallback aprobado = transición manual con
`document.startViewTransition` en el click handler; si tampoco, navegación normal
y se reporta en la entrega (no bloquear el sprint por la VT).

**Aceptación:** tsc · rutas 200 · masthead centrado con filete doble que se imprime ·
margin-preview con crossfade (desktop) e imagen por fila (mobile) · lead story solo
si hay destacada · barra de lectura scrubea · 68ch · texto plano intacto · VT o
fallback documentado · 0 legacy · verbatim confirmado · sin overflow 390.

---

## 4R. [SUPERSEDIDO por 4R2 en lo ESTÉTICO — la funcionalidad elderly-first sigue VIGENTE] SPEC ADMIN "MOSTRADOR"

> **PIVOT de Mateo (ley):** el admin lo usan personas de 50–80 años. Pregunta única:
> ¿una persona de 70 lo completa sola, sin manual? Prioridad: entendible > funcional
> > veloz > estético. PROHIBIDO dark mode, three.js, scroll cinematográfico,
> íconos sin etiqueta, animaciones >200ms. El kit "Cabina" (A0) conserva su
> ARQUITECTURA/API pero se re-skinea completo a esta spec. El "wow" del admin =
> que nadie tenga que pedir ayuda.

**TOKENS (agregar/usar):** base blanca `#fff` + `paper-0/1` para paneles; texto
`ink-0/1`; **borde visible** nuevo `--gm-line-strong: oklch(0.74 0.01 250)`
(mapear `color-line-strong`); primaria `petrol-deep` (AA sobre blanco ✓);
`danger/success/warn` existentes. **Bordes 2px** (`border-2 border-line-strong`)
en inputs/cards/tablas — nada fantasma.

**TIPOGRAFÍA/TAMAÑOS (mínimos duros):** cuerpo 17px; labels 16px semibold ARRIBA
del campo (visible siempre; placeholder = solo ejemplo); inputs `h-12 text-[17px]
px-4 border-2`; botones `h-12` (≥48px) `text-[16px] font-semibold` SIEMPRE
texto+ícono (20px); filas de tabla `h-14 text-[16px]`; foco
`focus-visible:outline-[3px] outline-petrol-deep outline-offset-2`. Contraste
WCAG AA 4.5:1 piso. Esquinas 90° (marca) con bordes bien visibles.

**RE-SKIN de primitivos (misma API):** AdminShell (sidebar blanca border-r-2,
ítems 17px ícono+label, activo = fondo petrol-deep texto blanco; topbar blanca),
DataTable (bordes marcados, acciones como BOTONES CON TEXTO "Editar"/"Eliminar",
skeleton claro, paginación grande), FormShell/Field (label arriba 16px, error en
rojo AA con CÓMO corregir), Modal/ConfirmDialog (blanco, título 20px, textos
explícitos "¿Eliminar…? Esta acción no se puede deshacer"), Toast (claro, borde
izq 4px por estado, 16px, sin jerga), Badge/Tabs/Breadcrumb a 16px. Micro-motion
≤200ms solo funcional.

**FUNCIONALIDAD NUEVA del kit (elderly-first):**
- `masks.ts`: teléfono AR ("011 4567-8900"), precio ARS, patente (AAA 111 /
  AA 111 AA), fecha — + `MaskedInput`.
- `use-form-draft.ts`: autosave de borrador (localStorage, debounce 1s) +
  banner "Restaurar borrador" + guard beforeunload si hay cambios sin guardar.
- `friendly-errors.ts`: mapa de errores API → lenguaje simple ("No pudimos
  guardar los cambios. Esperá unos segundos y volvé a intentar.").
- `MediaUploadZone v2`: zona GRANDE (min-h-40) con instrucción permanente
  ("Arrastrá las fotos acá o hacé clic — JPG o PNG, máximo X MB"), validación de
  formato/peso ANTES de subir con mensaje claro, **compresión automática
  client-side** (canvas → máx 1920px JPEG 0.85), barra de progreso por archivo
  y check verde de éxito.

**DATOS:** listados con paginación/filtros/búsqueda SERVER-SIDE (los services ya
aceptan page/limit/q) + debounce 300ms; filtros visibles (selects/chips), nunca
en menús; respuesta percibida <500ms con skeletons.

**CRITERIOS (medibles):** test de los 70 años por flujo; cargar novedad/vehículo
completo <3min; WCAG AA verificado; cero pérdida de datos (draft+guard);
listados <500ms; grep: 0 botones ícono-solo en admin; font-size ≥16 en todo el kit.

**SPRINTS:** A0R = re-skin kit completo + shell + login + dashboard (las
superficies de A1 se re-skinean acá mismo) + funcionalidad nueva del kit + demo
actualizada. Después A2/A4/A5/A6 con el contrato §5 MÁS: wiring server-side con
debounce, máscaras en campos que aplique, autosave, errores amables.

---

## 4R2. SPEC ADMIN DEFINITIVA — "LA OFICINA" (premium + legible) — RECHAZO v1 DE MATEO

> **LEY (Mateo, 2026-07-09):** el Mostrador v1 fue rechazado de plano: "HORRENDO,
> ULTRA TILDADO, UI ULTRA FEA, ICONOS VIEJOS, FORMULARIOS HORRENDOS... me referí a
> colores y un diseño donde comprendan". Conclusión: la spec elderly-first de §4R
> es de USABILIDAD (se conserva TODA: ≥16px, botones h-12 texto+ícono, labels
> arriba, validación con CÓMO, máscaras, drafts, errores amables, server-side,
> confirmaciones) pero la EJECUCIÓN estética era una intranet del 2005. El admin
> se rehace con el MISMO ADN premium del sitio público. Dark mode sigue PROHIBIDO
> en el ÁREA DE CONTENIDO; el riel de marca (sidebar) SÍ es carbón.

**Concepto:** *La Oficina técnica del concesionario.* Riel de carbón a la izquierda
(la marca, como el header público), papel cálido a la derecha (el trabajo). Filetes
de 1px estructuran; 1.5px solo en controles interactivos. Tipografía editorial:
`gm-display` para títulos, mono (`var(--font-plex-mono)`) para labels/eyebrows/números,
16px cuerpo. Esquinas 90°. CERO sombras decorativas, CERO GSAP en admin, transiciones
≤150ms solo color/opacity.

### 4R2.a — AdminShell "Riel de carbón" (kit/admin-shell.tsx, misma API)
- Wrapper página: `min-h-screen bg-paper-1`.
- Sidebar desktop: `fixed inset-y-0 left-0 z-30 hidden w-[268px] flex-col border-r border-line-dark bg-carbon-0 lg:flex`.
- Zona logo: `flex h-[72px] shrink-0 items-center border-b border-line-dark px-6` — logoSlot (el layout pasa los assets públicos `/images/logo/logoGM-Photoroom.png` + `/images/logo/letrasGuzmanMotors-Photoroom.png`, blancos sobre carbón, sin blend).
- Nav: `flex flex-1 flex-col gap-0.5 overflow-y-auto px-4 py-6`.
- Ítem nivel 1: `flex items-center gap-3 border-l-[3px] h-11 pl-[11px] pr-3 text-[15.5px] font-medium transition-colors duration-150` + inactivo `border-transparent text-silver hover:bg-white/[0.04] hover:text-platinum` / activo `border-petrol-bright bg-petrol-dim text-petrol-bright`. Íconos `size-5 shrink-0` strokeWidth `1.75`.
- Hijos: contenedor `mt-0.5 mb-1 ml-[29px] flex flex-col border-l border-line-dark pl-4`; hijo `flex h-10 items-center text-[15px] transition-colors duration-150` + inactivo `text-steel hover:text-platinum` / activo `text-petrol-bright`.
- Footer sidebar (logout): `border-t border-line-dark px-4 py-4`; el botón logout (en layout.tsx): `flex w-full items-center gap-3 h-11 px-3.5 text-[15.5px] font-medium text-silver transition-colors duration-150 hover:bg-white/[0.04] hover:text-platinum`.
- Drawer mobile: mismo contenido, `w-[300px] bg-carbon-0`, overlay `bg-carbon-0/60`; botón cerrar `text-silver hover:text-platinum`.
- Topbar: `sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-line-light-2 bg-white px-6 lg:px-10`; botón Menú mobile `text-ink-0 hover:text-petrol-deep` (igual que hoy pero sin border-2 abajo).
- Main: `mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-10`.
- Breadcrumb (kit/breadcrumb.tsx): items `[font-family:var(--font-plex-mono)] text-[13px] uppercase tracking-[0.08em] text-ink-1 hover:text-petrol-deep`; separador `/` en `text-line-strong`; actual `text-ink-0`.

### 4R2.b — Formularios (kit/form.tsx, misma API + props opcionales)
- FormShell header (sin caja): fila eyebrow `flex items-center gap-3` → `<span className="gm-plus text-petrol-deep" aria-hidden />` + `<span className="[font-family:var(--font-plex-mono)] text-[13px] uppercase tracking-[0.08em] text-ink-1">{eyebrow ?? "Panel de administración"}</span>` (prop opcional `eyebrow`); título `gm-display mt-4 text-[30px] leading-[1.05] text-ink-0 sm:text-[34px]`; descripción `mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-1`; luego `<div className="mt-7 h-px bg-line-light-2" aria-hidden />`. Grid hijos igual.
- FormSection = TARJETA: `col-span-full border border-line-light-2 bg-white p-6 sm:p-7`; encabezado `mb-6 flex items-center gap-3` → índice mono opcional (`prop index?: number` → `String(index).padStart(2,"0")` en `[font-family:var(--font-plex-mono)] text-[13px] text-petrol-deep`) + título `text-[17px] font-semibold text-ink-0` + `<span className="h-px flex-1 bg-line-light-2" aria-hidden />`. Grid interno igual.
- `controlBase`: `h-12 w-full border-[1.5px] border-line-strong bg-white px-4 text-[16px] text-ink-0 placeholder:text-ink-2 transition-[border-color,box-shadow] duration-150 focus:border-petrol-deep focus:shadow-[0_0_0_3px_oklch(0.45_0.085_220_/_0.18)] focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-paper-1 disabled:opacity-70` (17px→16px; 2px→1.5px; foco = borde petrol + halo suave, NO outline saltarín).
- Field: label `text-[16px] font-semibold text-ink-0` (igual); error igual (16px danger-text + AlertCircle); hint `text-[15px] text-ink-1`.
- SwitchField: `border-[1.5px]` en el track; resto igual.
- AccordionSection: `border border-line-light-2 bg-white`; botón `px-5 py-4 text-[17px] font-semibold text-ink-0 hover:bg-paper-1`; contenido `border-t border-line-light-2 px-5 py-6`.
- AdminButton: `border-[1.5px]` (antes 2); variantes → primary igual; secondary `border-line-strong bg-white text-ink-0 hover:border-ink-1 hover:bg-paper-1`; danger igual. h-12/texto+ícono/focus-visible INTACTOS.

### 4R2.c — DataTable / Badge / Modal / Toast (kit, misma API; reemplazar SOLO clases)
- Wrapper tabla: `border border-line-light-2 bg-white` (sin border-2).
- th: `bg-paper-2 px-4 py-3.5 text-left [font-family:var(--font-plex-mono)] text-[12.5px] font-medium uppercase tracking-[0.08em] text-ink-1 whitespace-nowrap`.
- tr body: `border-t border-line-light-2 transition-colors duration-150 hover:bg-paper-1`; td `px-4 py-4 align-middle text-[16px] text-ink-0`.
- Paginación: barra `flex items-center justify-between gap-4 border-t border-line-light-2 px-4 py-3`; números/estado en mono 14px `text-ink-1`; botones grandes se conservan.
- Badge: `inline-flex items-center gap-1.5 border px-2.5 py-1 [font-family:var(--font-plex-mono)] text-[12.5px] font-medium uppercase tracking-[0.06em]`; mapear variantes existentes → info/petrol `border-petrol-deep/25 bg-petrol-dim text-petrol-deep`; success `border-success-text/25 bg-[oklch(0.96_0.03_150)] text-success-text`; danger `border-danger-text/25 bg-[oklch(0.96_0.03_25)] text-danger-text`; warn `border-warn-text/25 bg-[oklch(0.97_0.04_85)] text-warn-text`; neutral `border-line-light-2 bg-paper-2 text-ink-1`.
- Modal/ConfirmDialog: overlay `bg-carbon-0/50`; panel `w-full max-w-lg border border-line-light-2 bg-white p-6 sm:p-7`; título `text-[20px] font-semibold text-ink-0`; textos explícitos INTACTOS. Toast: fondo blanco, `border border-line-light-2 border-l-4` + borde-l por estado (petrol-deep/success-text/danger-text), texto 16px ink-0.
- MediaUploadZone: `border-[1.5px] border-dashed border-line-strong bg-white hover:border-petrol-deep hover:bg-paper-1` + ícono ImagePlus petrol-deep; instrucción permanente/validación/compresión INTACTAS. DraftBanner: `border border-petrol-deep/25 bg-petrol-dim px-4 py-3 text-[16px] text-petrol-deep` + botones.

### 4R2.d — Login "Recepción" (login-form.tsx + admin/login) — LÓGICA INTACTA (rate-limit, validación, show/hide)
Split-screen: izquierda `relative hidden w-[44%] flex-col justify-between overflow-hidden gm-grain bg-carbon-0 p-10 lg:flex` → arriba logos públicos (mark + letras, h-9); centro: eyebrow mono `text-[13px] uppercase tracking-[0.08em] text-petrol-bright` "Panel interno" + `gm-display text-[44px] leading-[1.02] text-platinum` "Guzmán Motors" + hairline `h-px w-16 bg-line-dark-2` + `text-[15px] leading-relaxed text-silver` "Gestión de clientes, remolques, usados y novedades."; abajo `[font-family:var(--font-plex-mono)] text-[12.5px] uppercase tracking-[0.08em] text-steel` "Av. Blas Parera 6422 — Santa Fe". Derecha `flex flex-1 items-center justify-center bg-paper-0 px-6 py-12` con form `w-full max-w-[400px]`: título `gm-display text-[28px] text-ink-0` "Iniciar sesión" + descripción actual 16px ink-1 + campos kit + AdminButton primary w-full (texto/íconos actuales). En mobile (sin panel izq): franja superior `bg-carbon-0` con logos + form abajo. Textos existentes VERBATIM (incluye mensajes de error y rate-limit).

### 4R2.e — Dashboard "Tablero" (admin/page.tsx) — contenido actual VERBATIM re-presentado + stats reales
- Header: eyebrow mono petrol-deep "Tablero" + `gm-display text-[32px] text-ink-0` "Bienvenido, {nombre}" + fecha del día en mono 13px ink-1.
- Fila de 4 stat-cards (`grid gap-4 sm:grid-cols-2 xl:grid-cols-4`): `border border-line-light-2 bg-white p-6` → label mono 13px uppercase ink-1 (Clientes/Remolques/Usados/Novedades) + número `gm-display mt-3 text-[40px] leading-none text-ink-0` + link `mt-4 text-[15px] font-medium text-petrol-deep` "Ver todos →". Datos: counts reales vía services existentes (Promise.allSettled, Skeleton mientras carga, "—" si falla). NO crear endpoints nuevos.
- "Accesos rápidos": 4 cards módulo (`border border-line-light-2 bg-white p-6`): placa ícono `flex size-12 items-center justify-center border border-line-light-2 bg-paper-1` (ícono lucide `size-6 text-petrol-deep` sw 1.75) + título 17px semibold + descripción 15px ink-1 + fila AdminButton secondary "Ver lista" y primary "Crear nuevo" (novedades: + "Eliminadas").
- Card "Tu cuenta": Nombre/Email/Rol actuales con Badge de rol. Card "Tu acceso": los textos condicionales por rol EXISTENTES, re-presentados como checklist con `Check` petrol-deep. PROHIBIDO borrar copy.

### 4R2.f — Performance "des-tildado" (fixes exactos de la auditoría 2026-07-09)
1. `use-form-draft.ts`: eliminar `JSON.stringify(values)` de deps → `const valuesRef = useRef(values); valuesRef.current = values;` + interval/debounce que lee `valuesRef.current` (draft sigue 1s).
2. `lista-clientes.tsx`: UN solo useEffect disparado por params YA debounced (300ms); `cargarClientes`+`cargarCount` juntos; `actions`/`render` de columnas envueltos en `useCallback`/`useMemo`.
3. `autocomplete-input.tsx`: estado local del input + notificar `onChange` con debounce 150ms; filtro dentro de `useMemo`.
4. `protected-route.tsx`: validar token UNA vez por sesión (flag module-level `let sessionValidated`); si ya validado, render inmediato sin spinner.
5. `crear/editar-cliente-form.tsx`: un único `useWatch({ control })` (eliminar los 7 individuales); lo demás lo resuelve el fix 1.
6. Grep final: 0 `backdrop-blur` en superficies grandes del admin, 0 GSAP en admin.

### 4R2.g — Barrido por páginas (todas las de admin EXCEPTO vehiculos/* que está fuera del negocio)
Cada página adopta: header de página estilo FormShell (eyebrow+título display+acción primaria a la derecha), tarjetas/tablas/modales según 4R2.b–c, `border-2`→filetes según spec (1.5px SOLO inputs), botones AdminButton. Clientes crear/editar (hoy ad-hoc) se montan sobre FormShell/FormSection/Field del kit. CONTRATO §5 INTACTO: PROHIBIDO tocar lógica/handlers/services/name=; field-diff vacío obligatorio por página.

### 4R2.h — Criterios de cierre
Build+tsc limpios · grep `border-2` en admin = SOLO donde spec lo pida (idealmente 0) · grep GSAP/`backdrop-blur` admin = 0 · field-diffs vacíos · WCAG AA piso · mis capturas de las 8 superficies con veredicto propio ANTES de mostrar a Mateo · perf: tipeo fluido en búsqueda de clientes (1 request por pausa, no por tecla).

---

## 4R3. SPEC ADMIN FINAL — "SOFT SAAS" (referencias de Mateo en public/examples-admin) — SUPERSEDE 4R2

> **LEY (Mateo, 2026-07-10, SEGUNDO rechazo):** "La Oficina" (4R2) también rechazada:
> "sigue todo igual de feo insulso, nunca te pedí que el dashboard lo hagas en azul...
> lo del logo ni siquiera se ve". Dejó 8 capturas de referencia en
> `public/examples-admin/` (estilo HiveQ/Prodex/Statra): **SaaS moderno suave**.
> ESTA VEZ SE COPIA LA REFERENCIA, NO SE INTERPRETA. El admin queda EXENTO de las
> reglas de marca del público: en admin `rounded-*`, paleta `gray-*` + tintes
> pastel de Tailwind y `shadow-sm` SON EL ESTÁNDAR (el público NO cambia: sigue
> 90°/tokens GM). PROHIBIDO en admin: gm-display, font-plex-mono, tokens
> carbon/platinum/silver/steel/paper/ink/line-*/petrol como color dominante.
> La usabilidad elderly de §4R sigue: cuerpo ≥16px, botones ≥44px (h-11) SIEMPRE
> texto+ícono, labels arriba, validación con CÓMO, drafts, confirmaciones.

**Paleta y superficie (exacta):**
- Fondo página: `bg-[#F6F7F9]`. Tarjeta: `rounded-2xl border border-gray-100 bg-white shadow-sm` (padding `p-5` o `p-6`).
- Texto: principal `text-gray-900`, secundario `text-gray-500`, mudo `text-gray-400`.
- Acentos SOLO como tintes suaves en chips/pills: emerald (éxito/clientes), indigo (info/remolques), amber (warn/usados), violet (novedades), red (peligro). Chip de ícono: `flex size-10 items-center justify-center rounded-lg bg-{tinte}-50 text-{tinte}-600` (ícono size-5, sw 1.75).
- Botones: primario `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-[15.5px] font-semibold text-white transition-colors duration-150 hover:bg-gray-700` · secundario `...rounded-lg border border-gray-200 bg-white px-5 text-[15.5px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900` · danger sólido (solo confirmar) `bg-red-600 text-white hover:bg-red-700` · danger suave (filas) `border border-red-100 bg-red-50 text-red-600 hover:bg-red-100`. Foco: `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/10`.
- Inputs (controlBase): `h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[16px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-150 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 focus:outline-none disabled:bg-gray-50 disabled:opacity-60`. Label: `text-[15.5px] font-semibold text-gray-800` (+ `*` red-500). Error: `text-[15px] font-medium text-red-600` (+AlertCircle). Hint `text-[14.5px] text-gray-500`.
- Pills/badges: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium` + dot opcional `size-1.5 rounded-full bg-current` — success `bg-emerald-50 text-emerald-700` · danger `bg-red-50 text-red-600` · warn `bg-amber-50 text-amber-700` · info `bg-indigo-50 text-indigo-600` · neutral `bg-gray-100 text-gray-600`.
- Tabla: wrapper tarjeta `rounded-2xl ... overflow-hidden`; th `bg-gray-50 px-4 py-3 text-left text-[13px] font-medium text-gray-400` (sentence case, SIN uppercase mono); tr `border-t border-gray-100 transition-colors duration-150 hover:bg-gray-50/70`; td `px-4 py-4 align-middle text-[15.5px] text-gray-700` (nombre/dato fuerte `font-medium text-gray-900`); paginación pie `border-t border-gray-100 px-4 py-3 text-[14px] text-gray-500` con botones secundarios rounded-lg.
- Modal: overlay `bg-gray-900/40`; panel `w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl`; título `text-[20px] font-semibold text-gray-900`. Toast: `rounded-xl border border-gray-100 bg-white p-4 shadow-lg` + chip de ícono tintado. Upload: `rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-gray-400` (drag: `border-gray-900 bg-gray-100`), barra `bg-gray-900` rounded-full. DraftBanner: `rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-[15.5px] text-indigo-700`. Tabs: píldoras `rounded-lg px-4 h-10 text-[15.5px] font-medium` inactiva `text-gray-500 hover:bg-gray-50` activa `bg-gray-100 text-gray-900` (como "Backlog/Priority/Kanban" de la ref). Accordion: tarjeta rounded-2xl, botón `px-5 py-4 text-[16.5px] font-semibold text-gray-900`, contenido `border-t border-gray-100 px-5 py-6`. Skeleton: `rounded-lg bg-gray-100 animate-pulse`.

**Shell (ref HiveQ):** sidebar BLANCA `fixed ... w-[260px] flex-col border-r border-gray-100 bg-white`; logo row `flex h-16 items-center gap-2.5 px-5` → `<Image logoGM h-8 w-auto>` + `<span className="text-[17px] font-semibold tracking-tight text-gray-900">Guzmán Motors</span>` (SIEMPRE legible — este era el reclamo del logo); nav `px-3 py-4`: label de sección `px-3 pt-5 pb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400` ("Menú principal" antes de Dashboard, "Módulos" antes de Clientes); ítem `flex h-11 items-center gap-3 rounded-lg px-3 text-[15.5px] font-medium transition-colors duration-150` inactivo `text-gray-600 hover:bg-gray-50 hover:text-gray-900` (ícono `size-5 text-gray-400`) activo `bg-gray-100 text-gray-900` (ícono `text-gray-700`); hijos `ml-8 flex flex-col gap-0.5` ítem hijo `flex h-10 items-center rounded-lg px-3 text-[15px] text-gray-500 hover:bg-gray-50 hover:text-gray-900` activo `bg-gray-50 font-medium text-gray-900`; pie: `border-t border-gray-100 p-3` con botón logout `flex w-full h-11 items-center gap-3 rounded-lg px-3 text-[15.5px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600`. Topbar `sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-6 lg:px-8`; breadcrumb sentence-case `text-[14px] text-gray-400`, actual `font-medium text-gray-900`, separador `/` gray-300. Main `mx-auto w-full max-w-[1240px] px-6 py-8 lg:px-8`. Drawer mobile blanco.

**Header de página:** título `text-[26px] font-semibold tracking-[-0.01em] text-gray-900` + descripción `mt-1.5 text-[16px] text-gray-500` + acción primaria a la derecha (`flex items-end justify-between gap-6`). SIN eyebrow mono, SIN hairline separadora obligatoria, SIN uppercase.

**FormShell/FormSection:** shell = header simple de arriba; section = tarjeta `rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm` con título `text-[16.5px] font-semibold text-gray-900 mb-5` (SIN índice mono; opcionalmente chip de ícono si la página lo pasa). Grid 2 col md igual.

**Dashboard "Tablero" (misma data que 4R2.e):** saludo `text-[26px] font-semibold` "Bienvenido, {nombre} 👋" + fecha `text-[15px] text-gray-500` sentence-case; 4 stat-cards con chip tintado (Users/emerald, Truck/indigo, CarFront/amber, Newspaper/violet) + label `text-[14px] text-gray-500` + valor `text-[28px] font-semibold tracking-tight text-gray-900` + "Ver todos →" `text-[14.5px] font-medium text-gray-500 hover:text-gray-900`; accesos rápidos = tarjetas rounded-2xl con chip + botones; cards cuenta/acceso mismas tarjetas (copy verbatim). Sub-dashboards de módulos (ej EstadisticasClientes, CumpleanosHoy): mismas stat-cards con chips tintados y pills.

**Login:** centrado, SIN panel carbón: página `flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4`; card `w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm`; arriba `flex items-center gap-2.5` logo mark h-9 + "Guzmán Motors" `text-[17px] font-semibold text-gray-900`; título `mt-7 text-[24px] font-semibold tracking-tight text-gray-900` "Iniciar sesión"; descripción actual `mt-1.5 text-[16px] text-gray-500`; campos kit; botón primario w-full; nota admin actual `text-[14px] text-gray-400`. Lógica/textos/rate-limit INTACTOS.

**Criterios 4R3:** grep en scope admin (sin vehiculos/**): `gm-display|plex-mono|gm-plus` = 0 · `petrol|carbon|platinum|silver|steel|ink-|paper-|line-dark|line-light|line-strong` = 0 · `border-2` solo el dashed del upload · tsc limpio · field-diff vacío · verificación en vivo + capturas propias del director.

---

## 4. [DEPRECADO por 4R — no usar] SPRINT A0 — Design System Admin "Cabina"

**Concepto:** cabina de camión moderna de noche: carbón, instrumentos legibles,
CERO teatro. **La firma es la velocidad percibida**: todo responde en <150ms
percibidos, los estados de carga son shimmer, el foco es impecable. Densidad alta
(es una herramienta, no un brochure).

**Skin:** oscuro siempre: fondo `carbon-0`, superficies `carbon-1`, controles
`carbon-2`, hover `carbon-3`. Texto `platinum/silver/steel`. Hairlines `line-dark(-2)`.
Acento `petrol-bright`. Labels mono. Esquinas 90°.

**Tokens NUEVOS (agregar en `globals.css` como parte de A0):**
```css
--gm-danger:  oklch(0.62 0.19 25);   /* rojo seco, no neón */
--gm-success: oklch(0.68 0.14 155);
--gm-warn:    oklch(0.78 0.12 85);
```
mapeados en `@theme inline` (color-danger, color-success, color-warn) y registrados
en tailwind-merge si hiciera falta.

**Ubicación:** `src/components/admin/kit/` (un archivo por primitivo, index.ts).
**Demo:** página temporal `/admin/_kit` con todos los primitivos en sus estados
(se borra al cerrar A6). Sirve para auditar A0 sin módulos reales.

### Primitivos y especificación exacta

**AdminShell** (`admin-shell.tsx`) — reemplaza la piel de `src/app/admin/layout.tsx`
preservando nav/auth/logout/rutas EXACTOS:
- Sidebar fija 264px `bg-carbon-0` + hairline derecha. Logo arriba (compensación
  -ml si aplica). Nav: ítems `gm-label` + icono 16px strokeWidth 1.5; submenu
  indentado con rail hairline izquierdo; **activo = barra 2px petrol a la izquierda
  + texto petrol-bright + bg carbon-1** (no gradientes). Colapso móvil = overlay
  actual re-vestido. Logout al pie con hairline superior.
- Topbar: breadcrumb (mono, separador "/") + spacer + email del usuario + logout icon.
- Main: `bg-carbon-0`, contenedor denso `max-w-[1400px] px-6 py-6`.

**DataTable** (`data-table.tsx`) — genérica, tipada:
```ts
type Column<T> = { key: string; header: string; width?: string;
  sortable?: boolean; render?: (row: T) => ReactNode; align?: "left"|"right" };
type DataTableProps<T> = { columns: Column<T>[]; rows: T[]; rowKey: (r:T)=>string;
  loading?: boolean; emptyText?: string; sort?: {key:string; dir:"asc"|"desc"};
  onSortChange?: …; toolbar?: ReactNode; pagination?: {page,totalPages,total,
  onPage}; actions?: (row:T)=>ReactNode };
```
- Header: `gm-label` 11px steel, sticky dentro del scroll de tabla, hairline inferior
  `line-dark-2`. Sort: flecha 12px petrol al activo; click togglea.
- Filas: `h-11`, hairline inferior `line-dark`; **hover: translateY(-1px) +
  bg carbon-1 + hairline inferior a petrol-dim** (transition 120ms). Sin zebra.
- Loading: 8 filas skeleton shimmer. Empty: gm-plus + texto `emptyText` centrado.
- Acciones: iconos ghost 16px steel → hover petrol-bright; destructivas abren
  ConfirmDialog SIEMPRE.
- Paginación: mono "Página X de Y · Total: N" + prev/next hairline.

**FormShell + campos** (`form.tsx`) — SOLO piel; la lógica (react-hook-form/zod/
estado/handlers) queda intacta en cada módulo:
- `FormShell`: título display pequeño + descripción + grid `md:grid-cols-2 gap-x-6
  gap-y-5`; secciones con `FormSection` (heading mono + hairline).
- `Field` (label mono 11 steel uppercase + slot + error): error en `text-danger`
  12px con icono 12; el control en error lleva `border-danger`.
- `TextInput/TextareaField/SelectField`: `h-10 bg-carbon-2 border border-line-dark
  px-3 text-sm text-platinum placeholder:text-steel` · focus `border-petrol-bright
  outline-none` · disabled `opacity-50`. Textarea `min-h-24`.
- `SwitchField`: pista 36×20 hairline, thumb cuadrado 14px platinum, activo pista
  petrol-dim + thumb petrol-bright (140ms).
- `AutocompleteField`: WRAPPER visual de los autocompletes existentes
  (`SmartAutocomplete`, `Dynamic*Autocomplete`) — los envuelve con Field y les pasa
  clases; NO reimplementa su lógica.
- `AccordionSection`: header mono + chevron 90° que rota 140ms; contenido con
  grid interno; hairline entre secciones (para specs de remolques).

**MediaUploadZone** (`media-upload.tsx`) — WRAPPER visual del flujo actual
(drag-drop + previews + límites 10img/5vid + fotoSinFondo1/2): zona punteada
hairline (`border border-dashed border-line-dark-2`, hover petrol), previews en
grid con índice mono 01…, botón borrar al hover (ConfirmDialog si ya subida),
slots rotulados "FOTO SIN FONDO 1/2". La lógica de archivos/Cloudinary NO se toca.

**Feedback:**
- `Modal`: overlay `bg-carbon-0/80 backdrop-blur-sm`; panel `bg-carbon-1` hairline
  `line-dark-2`; entrada **scale 0.98→1 + fade, 140ms** ease-out; ESC + click-fuera;
  focus trap básico.
- `ConfirmDialog`: Modal chico con título, texto, Cancelar (outline) + acción
  (bg-danger para destructivas). SIEMPRE antes de delete.
- `Toast` + `ToastProvider`: stack bottom-right; item hairline `bg-carbon-1` con
  icono en color de estado; entrada spring sobrio (y 16→0 + fade 320ms
  cubic-bezier(0.22,1,0.36,1)); auto-dismiss 4s con **línea de progreso 1px**
  drenando; hover pausa.
- `Skeleton`: bloque `bg-carbon-2` con shimmer (gradiente translúcido que cruza,
  keyframe CSS 1.6s linear infinite).
- `Badge`: chip hairline mono 10px; variantes default/success/warn/danger/petrol.
- `Tabs`: raíl hairline inferior; activa border-b-2 petrol (como tabs públicas).
- `Breadcrumb`: mono steel, separador "/", último ítem platinum.

**Motion global Cabina:** NADA de pins/parallax/partículas/fantasmas. Solo:
modal 140ms, toast spring, shimmer, hover-raise 1px, sweep en botones, focus ring
`outline-2 outline-petrol-bright outline-offset-2` SIEMPRE visible con teclado.

**Modelo:** Fable ya especificó (esto). Sonnet implementa TODO A0 en un agente
(coherencia interna > paralelismo), con `/admin/_kit` como demo. Haiku no participa.

**Aceptación:** tsc · `/admin/_kit` 200 mostrando todos los primitivos y estados ·
tokens danger/success/warn en globals + @theme · 0 cyan/rounded en el kit · modal
140ms y hover-raise -1px medibles en DOM · focus ring visible con Tab · reduced-motion.

---

## 5. SPRINTS A1–A6 — Admin por módulos (protocolo de RE-VESTIDO)

**Principio:** los forms gigantes (1230–1693 líneas) FUNCIONAN. No se reescriben.
Se les cambia la piel con los primitivos de A0. **Contrato del re-vestido:**

PROHIBIDO tocar: `useState/useEffect/useCallback`, handlers, llamadas a services,
validación, nombres de campos (`name=`), estructura de datos, autocompletes
(solo se envuelven), flujo de submit, redirects.
PERMITIDO: JSX presentacional, clases, contenedores, iconos, textos de UI NO-datos
solo si son idénticos semánticamente (mejor: verbatim).

**Verificación de cada módulo (además de §8):** Haiku extrae ANTES la lista de
`name=`/campos del form original y DESPUÉS la del re-vestido → diff vacío.
Flujo manual: Mateo prueba crear/editar 1 registro por módulo en el checkpoint.

- **A1 — C2/C3: Shell + Login + Dashboard.** Sonnet. Aplicar AdminShell al layout
  (nav/labels verbatim del actual), re-vestir `login-form.tsx` (validación/rate-limit
  intactos; pantalla centrada carbón con panel hairline y logo) y el dashboard
  (195L: bienvenida + card usuario + funcionalidades por rol → Badges + hairlines).
- **A2 — C4 Clientes.** Sonnet. `lista-clientes.tsx` (1306L) → DataTable (los 14
  criterios de búsqueda, sort, export y paginación INTACTOS — el toolbar los aloja);
  `crear/editar-cliente-form` → FormShell/Field; widgets Estadísticas/Cumpleaños
  re-vestidos (NumberTicker permitido).
- **A3 — C5 Vehículos 0km** (el más pesado: crear 1230, editar 1693). Sonnet, un
  agente con effort high. MediaUploadZone envuelve la MediaUploadSection actual.
- **A4 — C6 Remolques admin.** Sonnet. Acordeones de specs → AccordionSection;
  equipamiento serie/opcional dinámico intacto; fotoSinFondo slots.
- **A5 — C7 Usados admin.** Sonnet. + **TAREA EXTRA (única con lógica):** resolver
  el mismatch de campos backend↔front (§7.1) normalizando EN el service de front
  (`usados.service.ts`: mapear respuesta `transmisiones→transmision`,
  `tracciones→traccion`, `potenciaMaxima→potencia`, `variantes→version`,
  `ejes→(mostrar)`) y en el buildFormData inverso, para que el detalle público
  muestre todo. Test: el usado sembrado debe mostrar transmisión/tracción/potencia.
- **A6 — C8 Novedades admin.** Sonnet. links[] dinámicos intactos; papelera
  /eliminadas con restore + ConfirmDialog. **Al cerrar: borrar `/admin/_kit`.**

**Paralelización:** A1 solo tras A0. Después **(A2 ‖ A3)** y luego **(A4 ‖ A5)** vía
Workflow (archivos disjuntos), A6 al final. Cada par con verify propio.
**Checkpoints a Mateo:** al cierre de A0+A1 (define el lenguaje admin) y al cierre
de A6 (admin completo). A2–A5 se auditan internamente sin frenar.

---

## 6. SPRINT D1 — QA transversal final

**Haiku (barrido) + Fable/Opus (veredicto). Tareas:**
1. `next build` de producción limpio.
2. Grep global: `cyan-|slate-|rounded-(lg|xl|2xl|3xl)|shadow-cyan` = 0 en
   `src/app/(public)` y `src/components/cliente|admin` (excepción documentada:
   `rounded-full` de spinners). `/cotizador` = 0 en público.
3. Lighthouse (mobile): LCP ≤4s, CLS ≤0.05, TBT ≤250ms en home, /foton, 1 modelo,
   /remolques, /usados, /novedades.
4. Barrido overflow 390 en TODAS las rutas públicas + auditor de solapes de
   fantasmas en las que tengan.
5. Spot-check verbatim (Haiku, 1 página por sección vs git history).
6. Chequeo de stickies (tabs ancladas a live var, sin gap tras scroll).
7. Reporte final a Mateo + lista de pendientes de backend (§7).

---

## 7. BACKLOG TÉCNICO / SEGURIDAD (avisar a Mateo, no olvidar)

1. **Mismatch usados backend↔front** (se arregla en A5): el DTO del backend usa
   `transmisiones/tracciones/potenciaMaxima/variantes/ejes` y no acepta
   `version/tipoVehiculo/transmision/traccion/potencia/cilindrada/color/
   cantidadPuertas/cantidadAsientos/equipamiento` que el front tipa y muestra.
   Normalizar en el service de front (corto plazo); idealmente alinear el DTO del
   backend (fuera de alcance front).
2. **SEGURIDAD — registro público `POST /api/usuarios` acepta `role:"admin"`**:
   cualquiera se hace admin. Cerrar server-side antes de producción.
3. Borrar de Mongo el usuario dev `dev-seeder@guzmanmotors.local` y los registros
   de demo (remolque Alcorta, usado Aumark) antes de producción.
4. Dirección placeholder `"Av. Principal 123, Centro, Ciudad"` en detalles de
   remolques/usados — la real es Av. Blas Parera 6422, Santa Fe. Cambiar cuando
   Mateo lo confirme (es contenido: no se toca sin su OK).
5. `next.config.ts` — al activar `experimental.viewTransition` (P2), verificar
   que el build de producción no se queje; si hay warning bloqueante, retirar y
   usar el fallback manual documentado en §3.

---

## 8. RESUMEN DE ENTREGA + CHECKLIST DE AUDITORÍA

**Cada tarea devuelve:**
```
SPRINT <id> — <nombre>
Archivos tocados: <paths>
Qué se hizo: <bullets>
Firma/motion: <mecánica implementada y dónde>
Verificación propia: tsc / rutas 200 / grep legacy=0 / verbatim confirmado /
  overflow 390 / reduced-motion / (admin: diff de campos vacío)
Dudas / desviaciones: <lo que no se pudo EXACTO como el plan, y por qué>
```

**Checklist del auditor (verde para avanzar) — re-verificar, no confiar:**
- [ ] tsc re-corrido limpio.
- [ ] Rutas 200 (curl) y SSR sirviendo markup NUEVO (regla 21).
- [ ] Verbatim: Haiku diff vs original si el sprint tocó contenido.
- [ ] 0 lista negra / 0 legacy. Reglas 10–17 muestreadas en DOM real
      (forzar estado final + medir rects; auditor de solapes si hay fantasmas).
- [ ] Firma de motion presente, única, on-mount para above-the-fold.
- [ ] Overflow 390 = no. Reduced-motion digno.
- [ ] Admin: funcionalidad intacta (diff de campos vacío, CRUD manual en checkpoint).
- [ ] Actualizar §0 (estado real) de este doc al cerrar cada sprint.

---

## 9. ORDEN DE EJECUCIÓN

```
T1 Auditoría-fixes ─► P2 Novedades ─► A0 Cabina DS ─► A1 Shell+Login+Dash ─► (A2 ‖ A3) ─► (A4 ‖ A5) ─► A6 ─► D1
  (T1.4 = checkpoint     checkpoint      checkpoint       checkpoint                                      checkpoint
   borrados Mateo)        Mateo           auditoría         Mateo                                          Mateo final
```
Deuda diferida a sprints posteriores: 30× `<img>`→`next/image` y TODOs triplicados
de dashboards (se resuelven al re-vestir A2–A6); dynamic-import de plugins GSAP
solo si Lighthouse D1 falla TBT (riesgo > beneficio hoy).
P1 queda cerrado cuando Mateo dé el OK visual de los últimos fixes (cards on-mount +
panel de filtros bordeado). Si pide ajustes, se atienden antes de abrir P2.
