/**
 * Indicador deslizante con muelle, compartido por la navegación de secciones y
 * por el control segmentado de planos.
 *
 * Por qué un muelle y no una transición CSS: el destino cambia mientras el
 * indicador todavía se mueve (al hacer scroll rápido se encadenan varias
 * secciones). Un muelle re-apunta desde la posición y la velocidad actuales;
 * una transición CSS reinicia y produce un salto visible.
 *
 * X y ancho se animan con muelles independientes: comparten destino pero no
 * velocidad, y acoplarlos los desincroniza en los cambios largos.
 *
 * Contrato de marcado:
 *   [data-indicator-root]   contenedor con `position: relative`
 *     [data-indicator]      pastilla absoluta que se mueve
 *     [data-indicator-item] cada opción; la activa lleva `data-active`
 */

const RESPONSE = 0.35; // segundos hasta alcanzar el destino
const DAMPING = 1; // críticamente amortiguado: llega sin rebotar
const MAX_DT = 1 / 30; // un frame perdido no dispara el muelle

class SpringValue {
  private value = 0;
  private velocity = 0;
  private target = 0;
  private readonly stiffness = ((2 * Math.PI) / RESPONSE) ** 2;
  private readonly damping = (4 * Math.PI * DAMPING) / RESPONSE;

  get current() {
    return this.value;
  }

  setTarget(next: number) {
    this.target = next;
  }

  /** Coloca el valor sin animar: primer render o `prefers-reduced-motion`. */
  snap(next: number) {
    this.target = next;
    this.value = next;
    this.velocity = 0;
  }

  step(dt: number) {
    const acceleration =
      this.stiffness * (this.target - this.value) - this.damping * this.velocity;
    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;
  }

  get settled() {
    return (
      Math.abs(this.target - this.value) < 0.1 && Math.abs(this.velocity) < 0.1
    );
  }
}

export function mountIndicator(root: HTMLElement): () => void {
  const indicator = root.querySelector<HTMLElement>("[data-indicator]");
  if (!indicator) return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const x = new SpringValue();
  const width = new SpringValue();

  let frame = 0;
  let lastTime = 0;
  let primed = false;

  const render = () => {
    indicator.style.transform = `translate3d(${x.current}px, 0, 0)`;
    indicator.style.width = `${width.current}px`;
  };

  const tick = (now: number) => {
    const dt = Math.min((now - lastTime) / 1000, MAX_DT);
    lastTime = now;

    x.step(dt);
    width.step(dt);
    render();

    if (x.settled && width.settled) {
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const sync = () => {
    const active = root.querySelector<HTMLElement>(
      "[data-indicator-item][data-active]",
    );

    if (!active) {
      indicator.style.opacity = "0";
      return;
    }

    const targetX = active.offsetLeft;
    const targetWidth = active.offsetWidth;
    indicator.style.opacity = "1";

    // El primer posicionamiento no se anima: nada se estaba moviendo, así que
    // un deslizamiento desde el origen sería movimiento inventado.
    if (!primed || reduced.matches) {
      primed = true;
      x.snap(targetX);
      width.snap(targetWidth);
      render();
      return;
    }

    x.setTarget(targetX);
    width.setTarget(targetWidth);

    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  // El estado activo lo escribe quien corresponda (scroll-spy o click); aquí
  // sólo se observa, de modo que el indicador no sabe nada de su dueño.
  const mutations = new MutationObserver(sync);
  mutations.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-active"],
  });

  const resize = new ResizeObserver(() => {
    primed = false; // tras un reflow se recoloca, no se desliza
    sync();
  });
  resize.observe(root);

  sync();

  return () => {
    cancelAnimationFrame(frame);
    mutations.disconnect();
    resize.disconnect();
  };
}

/** Monta el indicador en cada raíz presente y devuelve la limpieza conjunta. */
export function mountAllIndicators(
  selector = "[data-indicator-root]",
): () => void {
  const cleanups = Array.from(
    document.querySelectorAll<HTMLElement>(selector),
  ).map(mountIndicator);

  return () => cleanups.forEach((fn) => fn());
}
