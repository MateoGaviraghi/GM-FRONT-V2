# MOTION PLAYBOOK — GM-FRONT-V2
> Guión de dirección creativa y técnica para el motion del sitio. Escrito por Fable; los agentes ejecutores (Opus/Sonnet/Haiku) DEBEN leer este documento completo antes de construir o retocar cualquier página, y ejecutar exactamente estas firmas.
> Complementa a `PROJECT-BRAIN.md` (tokens, convenciones) y a las reglas de memoria: copy/data verbatim, cero /cotizador en público, componentes de registries adaptados a tokens.

---

## 1. El problema que este documento mata

Las primeras 4 páginas (home, nosotros, contacto, /foton) comparten UNA receta: hero con líneas enmascaradas (yPercent 114→0) + banda de stats con NumberTicker abajo + parallax scrub de la foto + entradas de sección `Reveal` (rise/wipe). El sistema de DISEÑO es correcto (tokens carbón/porcelana/petrol, sharp, hairlines, Archivo expandida) — **el lenguaje de MOTION se volvió monótono**. Veredicto del cliente: "todos tienen la misma entrada, los heros son idénticos, quiero que cada cosa te impresione".

**Principio rector desde ahora: UNA MECÁNICA DOMINANTE POR PÁGINA.** La gramática común (gm-label, hairlines, numeración 01–07, botones GM, grain) se mantiene; la coreografía NO se repite entre rutas.

## 2. Reglas duras (no negociables)

1. **Firma única**: cada ruta implementa SU firma de la tabla §3. Prohibido copiar la firma de otra ruta. El hero "líneas enmascaradas + stats band" es propiedad EXCLUSIVA del home.
2. **Tokens GM inmutables**: carbon/paper/petrol OKLCH, esquinas 90°, hairlines 1px, Archivo (wdth) / Instrument Sans / IBM Plex Mono. Nada de gradientes decorativos ni rounded.
3. **Copy y data verbatim** (regla de memoria). Cero contenido inventado, cero contenido eliminado u oculto (`hidden` en breakpoints = eliminación).
4. **Performance budget por página**: LCP móvil simulado ≤4s, CLS ≤0.05, TBT ≤250ms. Cualquier firma que sume >60KB gzip de JS va detrás de `next/dynamic` y NUNCA en el critical path del hero. Solo transform/opacity/clip-path/filter en animación continua.
5. **`prefers-reduced-motion`**: toda firma tiene versión estática digna (el contenido completo visible sin animación). Ya hay guard global en CSS; los hooks GSAP deben chequearlo.
6. **Mobile**: la firma debe tener traducción táctil (o sustituto explícito indicado en la spec). Nada de mecánicas hover-only sin equivalente.
7. **tailwind-merge**: si se crean utilities custom nuevas en `@theme`, registrarlas en `extendTailwindMerge` de `src/lib/utils.ts` (bug ya sufrido con `text-display-*`).
8. **Verificación por checkpoint** (igual que hasta ahora): `tsc` limpio → visual en Chrome real (hover/scroll con input verdadero) → strings verbatim contra original → mobile 390 sin overflow → recién ahí presentar a Mateo. Sin su OK no se avanza.

## 3. Mapa de firmas por ruta

| Ruta | Estado | Firma dominante (nombre en clave) | Mecánicas |
|---|---|---|---|
| `/` home | ✅ hecha | **"Apertura"** — dueña del hero canónico | masked lines + stats band + marquee + pin horizontal categorías (no tocar salvo pulido) |
| `/nosotros` | 🔁 RETROFIT R1 | **"Archivo"** — documental que cobra vida | hero B/N→color scrub, SplitText words rotateX, typewriter mono, odómetro de eras en el riel |
| `/contacto` | 🔁 RETROFIT R2 | **"Señal"** — canal que se abre | clip-path circular expand, onda radial desde Santa Fe, spotlight cards (ya ✓) |
| `/foton` | 🔁 RETROFIT R3 | **"Desfile"** — la marca en revista | máscara diagonal en foto, FOTON con spool de wdth 75→125, iconos de categorías que se encienden en secuencia; cursor-preview (ya ✓) |
| `/foton/[categoría]` ×7 | ⏭ B2 | **"Túnel"** — hero que se funde con el listado | título que asciende con scrub hasta volverse header del listado (sin corte de sección), cards de modelos con tilt 3D + glare, gauges de specs (DrawSVG arcos) |
| `/foton/[modelo]` ×12 | ⏭ B3 | **"Ficha maestra"** — la joya del sitio | hero multicapa con mouse-parallax de profundidad (3 capas), filmstrip pineado de exterior/interior con contador 01/05 y zoom-crossfade, versiones en carrusel 3D (cult-ui adaptado sharp), X-ray de motor con lente que sigue el cursor, dimensiones con planos que se TRAZAN (DrawSVG) + tickers |
| `/remolques` + [id] | ⏭ B4 | **"El patio"** — inventario físico | entrada en cascada diagonal (clip desde esquina), **GSAP Flip en filtros/reorden** (la estrella), detalle con galería drag inercial (Observer/Draggable + Inertia) |
| `/usados` + [id] | ⏭ B5 | **"Segunda vida"** | hover cortina que revela 2ª foto de la unidad, badge de año con flip numérico, hereda Flip de B4 (mismo motor, distinta piel) |
| `/novedades` + [id] | ⏭ B6 | **"La prensa"** | listado editorial con preview de imagen en columna de margen (variación fija del cursor-preview), **View Transition** card→hero al abrir la nota, barra de progreso de lectura en el detalle |
| `/admin/**` | ⏭ C | **"Cabina"** — velocidad como firma | CERO teatro: springs sobrios en modales/toasts, skeletons shimmer, hover raise 1px en filas, focus visible impecable. La impresión = respuesta instantánea |

## 4. Specs de ejecución (para los agentes)

### R1 — `/nosotros` · "Archivo"
- **Hero**: eliminar banda de stats del hero (los números 38+/1500+/2/2019 se REUBICAN como banda técnica al cierre de la timeline — no se pierden, regla verbatim). Foto del equipo arranca `grayscale(1) contrast(1.05)` y colorea con scrub (`filter` animado 1→0 en los primeros 60vh). Título "NOSOTROS": **SplitText por palabras**, entrada con `rotateX(-90°) → 0`, `transform-origin: 50% 100%`, stagger 0.08, perspective en el wrapper. Eyebrow "DESDE 1987 — SANTA FE, ARGENTINA" con efecto **typewriter** (chars revelados + caret mono parpadeante 3 ciclos).
- **Timeline**: añadir el **odómetro de eras** — readout vertical mono pegado al riel (sticky), texto del rango ("1987 — 1999") que rota tipo tambor al cruzar cada era (yPercent ±110 con swap). Trigger por era body, `start: top 55%` / `onEnterBack`.
- Plugins: `SplitText` (gratis en GSAP 3.13+, registrar `gsap/SplitText`).

### R2 — `/contacto` · "Señal"
- **Hero**: reemplazar la entrada estándar por **apertura de iris**: la foto entra con `clip-path: circle(0% at 30% 50%) → circle(140%)` (power4.inOut, 1.2s); el título "CONTACTANOS" aparece DENTRO del iris a mitad de la expansión (scale 1.06→1 + blur(6px)→0). Tras la apertura, **onda radial sutil** en SVG: 2 anillos concéntricos hairline que emanan cada ~4s desde un punto marcado "+ SANTA FE" sobre la foto (opacity 0.25→0, scale 1→1.6). Es un pulso, no un radar cursi: 1px, petrol, lento.
- La banda de canales del hero y las spotlight cards del form SE MANTIENEN (ya son firma propia).

### R3 — `/foton` · "Desfile"
- **Hero**: foto del showroom entra con **máscara diagonal** `clip-path: polygon` (barrido desde esquina inferior-izquierda, power4.inOut) — nada de scale/fade. "FOTON": animar `font-stretch` 75%→125% (spool de eje variable, 1.3s power2.out) simultáneo al masked rise (una sola línea, se permite la máscara como sub-elemento, no como receta completa).
- **Reemplazar la banda de stats** por la **fila de las 7 categorías como iconografía**: los 7 íconos lucide en celdas hairline que se "encienden" en secuencia (steel→petrol-bright, stagger 0.1, con un tick mono del nombre debajo). Los datos 7/13+/100%/2024 se mudan a una línea mono compacta bajo el sub del hero (verbatim, no se pierden).
- El índice cursor-preview se queda intacto (es la firma estrella de la página).

### B2 — Categoría · "Túnel"
- **Hero→listado continuo**: la foto de categoría full-bleed con el nombre display gigante centrado-izquierda; con scrub, el título se ESCALA hacia abajo y viaja a su posición de header del listado mientras la foto se comprime a una franja (pin de ~120vh total). Un solo movimiento narrativo, sin "sección hero + sección cards".
- **Cards de modelos** (2-3 por categoría): **tilt 3D** al mouse (rotateX/Y máx 6°, glare lineal sutil siguiendo el ángulo) — adaptar `react-bits TiltedCard` o hand-roll con quickTo; sharp, hairline, sin sombras blandas. Táctil: sin tilt, tap = navegación normal.
- **Specs (HP/tracción/carga)**: cada dato como **gauge de arco SVG** (270°, stroke hairline, relleno petrol con `DrawSVGPlugin` scrub al entrar) + cifra con ticker. Los 3 datos verbatim de cada card actual.
- Features ("Por qué elegir…"): iconos con **draw-on de trazo** al entrar (DrawSVG sobre paths de lucide convertidos o SVG propios).
- Breadcrumb "Volver a FOTON": flecha con **efecto magnético** (quickTo hacia el cursor en radio 60px).

### B3 — Modelo · "Ficha maestra" (la página más ambiciosa del sitio)
- **Hero multicapa**: 3 capas con mouse-parallax de profundidad (fondo desenfocado ±6px, vehículo ±14px, título display ±22px, quickTo lerp 0.4). El título usa el NOMBRE del modelo verbatim. En scroll, capas se separan (scrub).
- **Filmstrip**: sección pineada con las fotos de EXTERIOR (y luego INTERIOR) como negativo fílmico: cada foto ocupa el frame con **zoom-out + crossfade** al avanzar (no translateX plano — diferénciate del pin del home), contador "01 / 05" display gigante ghost, sprocket holes hairline decorativos arriba/abajo. Progreso con scrub.
- **Versiones**: carrusel 3D con perspectiva (adaptar `cult-ui three-d-carousel`: esquinas rectas, hairlines, drag con spring). Cada versión con su imagen y nombre verbatim.
- **Componentes (motor/caja)**: **X-ray lens** — sobre la imagen del vehículo, un círculo (máscara CSS `mask: radial-gradient` siguiendo el cursor, r≈140px) revela la imagen del MOTOR alineada debajo. Táctil: slider horizontal que mueve la lente.
- **Dimensiones y capacidades**: las imágenes de planos actuales + overlay SVG con **líneas de cota que se trazan** (DrawSVG) y medidas en mono con ticker al entrar.
- **R3F (OPCIONAL, flag `NEXT_PUBLIC_GM_WEBGL=1`)**: plano curvo con la textura del hero y distorsión de vértices al scroll (`@react-three/fiber` + `drei`). Solo si el budget de perf lo permite tras medir; NO es bloqueante del checkpoint.

### B4 — Remolques · "El patio"
- Listado: grid de unidades reales (API) con entrada **cascada diagonal**: `clip-path: inset(0 100% 100% 0)` → 0 con stagger por distancia a la esquina superior-izquierda (grid-aware, no index lineal).
- **Filtros con GSAP Flip**: al filtrar por marca/tipo o reordenar, las cards VIAJAN a su nueva posición (Flip.from con absolute, stagger 0.02, power3.inOut). Este es el wow funcional de la página.
- Detalle `[id]`: galería principal con **drag inercial** (Draggable + InertiaPlugin, bounds, snap a foto), thumbnails hairline, specs en definición técnica con reveals por columna.

### B5 — Usados · "Segunda vida"
- Cards: **cortina hover** — la 2ª imagen de la unidad revela con `clip-path: inset(0 0 0 100%→0)` (si la unidad tiene una sola imagen: zoom sutil + shift de encuadre). Badge año con **flip numérico** (rotateX 3D de dígitos al entrar).
- Hereda el motor Flip de filtros de B4 (mismo componente compartido `useFlipGrid`), con piel porcelana (la página es light — contraste con Remolques carbón).

### B6 — Novedades · "La prensa"
- Listado: filas/cards editoriales; en desktop, columna de margen fija donde la imagen de la nota hovereada hace **crossfade** (variación ESTÁTICA-en-columna del cursor-preview de /foton — no persigue al cursor, vive en el margen como periódico).
- **View Transition** card→detalle: `next.config` `experimental.viewTransition` + `<ViewTransition>` o `document.startViewTransition` en la navegación — la imagen de la card se expande al hero de la nota. Fallback: navegación normal (progresivo).
- Detalle: barra de progreso de lectura (1px petrol, top, scrub), tipografía de artículo (medida 68ch), imágenes con reveal.

### C — Admin · "Cabina"
- Kit UI con motion utilitario: modales scale 0.98→1 + fade 140ms, toasts con spring de entrada y salida, skeletons shimmer (animación CSS), filas de tabla hover raise (translateY -1px + hairline highlight), botones con el sweep GM ya existente. Sin pins, sin parallax, sin partículas. Firma = latencia percibida cero.

## 5. Arsenal técnico a incorporar (todo gratis, GSAP 3.13+)

| Herramienta | Uso | Páginas |
|---|---|---|
| `gsap/SplitText` | words/chars 3D | R1, (opcional títulos B3) |
| `gsap/Flip` | reorden de grids al filtrar | B4, B5 |
| `gsap/DrawSVGPlugin` | gauges, cotas, iconos trazados | B2, B3 |
| `gsap/Draggable` + `InertiaPlugin` | galería con drag físico | B3 (versiones), B4 (detalle) |
| `gsap/Observer` | gestos custom si hace falta | B3/B4 |
| View Transitions API | continuidad card→detalle | B6 |
| `@react-three/fiber` + `drei` | distorsión WebGL del hero de modelo | B3 (flag opcional) |
| `cult-ui three-d-carousel`, `react-bits TiltedCard` | registry components adaptados a tokens | B3, B2 |

Registrar imports de plugins una sola vez en un módulo `src/components/cliente/home/gm/gsap-setup.ts` (client) para no duplicar `registerPlugin`.

## 6. Orden de ejecución propuesto

1. **Bloque R (retrofits R1→R2→R3)** — rápidos, elevan lo ya visible, validan la nueva vara con Mateo.
2. **B2 → B3 → B4 → B5 → B6** con checkpoint por página como hasta ahora.
3. Etapa C (admin) con C0 auditoría primero.
4. D1 QA final (incluye re-medición Lighthouse: el budget de §2.4 se verifica por página).

Cada checkpoint sigue el protocolo de verificación de §2.8. Este documento se actualiza si Mateo aprueba variaciones.
