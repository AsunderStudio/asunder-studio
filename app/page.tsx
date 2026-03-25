"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const cursorDot = document.getElementById("cursor-dot") as HTMLElement;
    const cursorRing = document.getElementById("cursor-ring") as HTMLElement;
    const descriptorEl = document.getElementById("studio-descriptor") as HTMLElement;

    // Build per-character descriptor
    const DESCRIPTOR_TEXT = "A Creative Agency For The Agentic Era";
    const descriptorChars: { el: HTMLSpanElement; brightness: number }[] = [];
    for (let i = 0; i < DESCRIPTOR_TEXT.length; i++) {
      const span = document.createElement("span");
      span.classList.add("char");
      if (DESCRIPTOR_TEXT[i] === " ") {
        span.classList.add("space");
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = DESCRIPTOR_TEXT[i];
      }
      descriptorEl.appendChild(span);
      descriptorChars.push({ el: span, brightness: 0 });
    }

    const ILLUMINATE_RADIUS = 180;
    const ILLUMINATE_DECAY = 0.025;
    const ILLUMINATE_PEAK = 1.0;

    const WAVE_DURATION = 2800;
    const WAVE_FEATHER = 0.25;
    let mouseX = -9999, mouseY = -9999;
    let prevMouseX = mouseX, prevMouseY = mouseY;
    let mouseVX = 0, mouseVY = 0;
    let ringX = 0, ringY = 0;
    let isMouseDown = false;
    let isTouchDevice = false;

    const onMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      prevMouseX = mouseX; prevMouseY = mouseY;
      mouseX = e.clientX; mouseY = e.clientY;
      mouseVX = mouseX - prevMouseX; mouseVY = mouseY - prevMouseY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    };
    const onMouseDown = () => {
      if (isTouchDevice) return;
      isMouseDown = true;
      cursorRing.style.width = "60px"; cursorRing.style.height = "60px";
      cursorRing.style.borderColor = "rgba(255,255,255,0.6)";
    };
    const onMouseUp = () => {
      if (isTouchDevice) return;
      isMouseDown = false;
      cursorRing.style.width = "40px"; cursorRing.style.height = "40px";
      cursorRing.style.borderColor = "rgba(255,255,255,0.3)";
    };
    const onTouchStart = (e: TouchEvent) => {
      isTouchDevice = true;
      isMouseDown = true;
      const t = e.touches[0];
      prevMouseX = mouseX = t.clientX;
      prevMouseY = mouseY = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      prevMouseX = mouseX; prevMouseY = mouseY;
      mouseX = t.clientX; mouseY = t.clientY;
      mouseVX = mouseX - prevMouseX; mouseVY = mouseY - prevMouseY;
    };
    const onTouchEnd = () => {
      isMouseDown = false;
      setTimeout(() => { mouseX = -9999; mouseY = -9999; }, 100);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    let rafRing: number;
    const ringLoop = () => {
      if (!isTouchDevice) {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";
      }
      rafRing = requestAnimationFrame(ringLoop);
    };
    rafRing = requestAnimationFrame(ringLoop);

    // Simplex noise
    const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
    const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
    {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      let s = 42;
      for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
      for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12; }
    }
    function noise2D(xin: number, yin: number) {
      // eslint-disable-next-line prefer-const
      let n0: number, n1: number, n2: number;
      const s = (xin + yin) * F2, i = Math.floor(xin + s), j = Math.floor(yin + s), t = (i + j) * G2;
      const x0 = xin - (i - t), y0 = yin - (j - t);
      let i1, j1; if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
      const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      const ii = i & 255, jj = j & 255;
      const gi0 = permMod12[ii + perm[jj]], gi1 = permMod12[ii + i1 + perm[jj + j1]], gi2 = permMod12[ii + 1 + perm[jj + 1]];
      let t0 = 0.5 - x0 * x0 - y0 * y0; n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0));
      let t1 = 0.5 - x1 * x1 - y1 * y1; n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1));
      let t2 = 0.5 - x2 * x2 - y2 * y2; n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2));
      return 70 * (n0 + n1 + n2);
    }

    // Canvas
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    let W: number, H: number, DPR: number;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    let FONT_SIZE: number, GRID_SPACING: number, DOT_MAX_RADIUS: number, NOISE_BASE: number, NOISE_AMP: number;
    let ZONE_A: number, ZONE_B: number, WARP_AMP: number;
    let IS_MOBILE = false;

    function computeResponsiveConfig() {
      IS_MOBILE = W < 768;
      FONT_SIZE = Math.min(Math.max(W * 0.09, IS_MOBILE ? 40 : 56), 140);
      if (IS_MOBILE) {
        GRID_SPACING = Math.max(10, Math.min(14, Math.round(FONT_SIZE / 4)));
      } else {
        GRID_SPACING = Math.max(6, Math.min(10, Math.round(FONT_SIZE / 14)));
      }
      DOT_MAX_RADIUS = 1.6;

      NOISE_BASE = 0.7;
      NOISE_AMP = 0.9;
      ZONE_A = Math.round(FONT_SIZE * 0.09);
      ZONE_B = Math.round(FONT_SIZE * 0.2);
      WARP_AMP = GRID_SPACING * 1.6;
    }

    const WARP_SCALE = 0.003;
    const WARP_SPEED = 0.00025;
    const SIZE_SCALE = 0.004;
    const SIZE_SPEED = 0.0002;
    const CURSOR_RADIUS = 200;
    const CURSOR_WARP = 80;
    const CLICK_MULT = 2.5;
    const FISSION_START = 800;
    const FISSION_DURATION = 2000;
    const FLARE_DURATION = 800;
    let startTime = 0;
    let gridCols = 0, gridRows = 0;

    let textMask: Uint8Array | null = null;
    let textDist: Float32Array | null = null;
    let textW = 0, textH = 0;
    let textLeft = 0, textRight = 0;

    function buildTextMask() {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const octx = off.getContext("2d")!;

      const STRETCH_X = 1.4;
      const baseFontSize = FONT_SIZE * 0.88;
      const spacing = baseFontSize * -0.04;

      octx.fillStyle = "#fff";
      octx.textBaseline = "middle";
      octx.font = `900 ${baseFontSize}px "Nunito", "Arial Black", sans-serif`;

      const text = "ASUNDER";
      let naturalW = 0;
      for (let c = 0; c < text.length; c++) {
        naturalW += octx.measureText(text[c]).width;
        if (c < text.length - 1) naturalW += spacing;
      }
      const stretchedW = naturalW * STRETCH_X;

      const cy = H / 2;
      let cx = (W - stretchedW) / 2;
      textLeft = cx;

      for (let c = 0; c < text.length; c++) {
        const charW = octx.measureText(text[c]).width;
        const stretchedCharW = charW * STRETCH_X;
        octx.save();
        octx.translate(cx + stretchedCharW * 0.5, cy);
        octx.scale(STRETCH_X, 1);
        octx.fillText(text[c], -charW * 0.5, 0);
        octx.restore();
        cx += stretchedCharW + spacing * STRETCH_X;
      }
      textRight = cx - spacing * STRETCH_X;

      const blurAmt = Math.max(2, Math.round(baseFontSize * 0.025));
      const blobCanvas = document.createElement("canvas");
      blobCanvas.width = W; blobCanvas.height = H;
      const bctx = blobCanvas.getContext("2d")!;
      bctx.filter = `blur(${blurAmt}px)`;
      bctx.drawImage(off, 0, 0);
      bctx.filter = "none";
      bctx.globalCompositeOperation = "source-over";
      bctx.filter = `blur(${Math.round(blurAmt * 0.5)}px) contrast(3)`;
      bctx.drawImage(blobCanvas, 0, 0);
      bctx.filter = "none";
      bctx.globalCompositeOperation = "source-over";

      octx.font = `900 ${baseFontSize}px "Nunito", "Arial Black", sans-serif`;
      const metrics = octx.measureText(text);
      const descent = (metrics as TextMetrics & { actualBoundingBoxDescent?: number }).actualBoundingBoxDescent || baseFontSize * 0.25;
      const wordmarkBottom = cy + descent;

      const descriptorGap = FONT_SIZE * 0.35;
      const descriptorTop = wordmarkBottom + descriptorGap;
      descriptorEl.style.setProperty("--descriptor-top", descriptorTop + "px");
      descriptorEl.style.top = "var(--descriptor-top)";

      const imgData = bctx.getImageData(0, 0, W, H);
      const data = imgData.data;
      textW = W; textH = H;
      textMask = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) {
        textMask[i] = data[i * 4 + 3];
      }

      textDist = new Float32Array(W * H);
      const STEP = 2;
      const borders: number[] = [];
      for (let y = 1; y < H - 1; y += STEP) {
        for (let x = 1; x < W - 1; x += STEP) {
          const idx = y * W + x;
          const a = textMask[idx];
          if ((a > 40 && a < 220) ||
              (a > 80 && (textMask[idx - 1] < 80 || textMask[idx + 1] < 80 ||
                          textMask[idx - W] < 80 || textMask[idx + W] < 80))) {
            borders.push(x, y);
          }
        }
      }
      const DIST_STEP = IS_MOBILE ? 5 : 3;
      for (let y = 0; y < H; y += DIST_STEP) {
        for (let x = 0; x < W; x += DIST_STEP) {
          const idx = y * W + x;
          const inside = textMask[idx] > 80;
          let bestD2 = 999999;
          for (let b = 0; b < borders.length; b += 2) {
            const ddx = x - borders[b];
            const ddy = y - borders[b + 1];
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < bestD2) bestD2 = d2;
          }
          const dist = Math.sqrt(bestD2);
          const signedDist = inside ? -dist : dist;
          for (let gy = 0; gy < DIST_STEP && y + gy < H; gy++) {
            for (let gx = 0; gx < DIST_STEP && x + gx < W; gx++) {
              textDist[(y + gy) * W + (x + gx)] = signedDist;
            }
          }
        }
      }
    }

    function textDistAt(px: number, py: number) {
      const ix = Math.round(px), iy = Math.round(py);
      if (ix < 0 || ix >= textW || iy < 0 || iy >= textH) return 999;
      return textDist![iy * textW + ix];
    }

    const MAX_FRAGMENTS = 200;
    const fragments: { x: number; y: number; vx: number; vy: number; r: number; life: number; decay: number; isHot: boolean }[] = [];

    function spawnFragment(x: number, y: number, parentRadius: number) {
      if (fragments.length >= MAX_FRAGMENTS) return;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = angle1 + Math.PI * (0.6 + Math.random() * 0.8);
      const speed = 1.5 + Math.random() * 2;
      const r = parentRadius * 0.35;
      fragments.push(
        { x, y, vx: Math.cos(angle1) * speed, vy: Math.sin(angle1) * speed, r, life: 1.0, decay: 0.015 + Math.random() * 0.01, isHot: Math.random() < 0.4 },
        { x, y, vx: Math.cos(angle2) * speed, vy: Math.sin(angle2) * speed, r, life: 1.0, decay: 0.015 + Math.random() * 0.01, isHot: Math.random() < 0.4 }
      );
    }

    function updateAndDrawFragments() {
      for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i];
        f.x += f.vx; f.y += f.vy;
        f.vx *= 0.97; f.vy *= 0.97;
        f.life -= f.decay;
        if (f.life <= 0) { fragments.splice(i, 1); continue; }
        const alpha = f.life;
        const v = Math.floor(220 * alpha);
        ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(Math.atan2(f.vy, f.vx));
        const s = f.r * f.life;
        ctx.fillRect(-s, -s * 0.4, s * 2, s * 0.8);
        ctx.restore();
      }
    }

    const SPRING_GRID = 5;
    let springW = 0, springH = 0;
    let springDX: Float32Array, springDY: Float32Array;
    let springVX: Float32Array, springVY: Float32Array;

    function initSprings() {
      springW = Math.ceil(W / (GRID_SPACING * SPRING_GRID)) + 2;
      springH = Math.ceil(H / (GRID_SPACING * SPRING_GRID)) + 2;
      const n = springW * springH;
      springDX = new Float32Array(n); springDY = new Float32Array(n);
      springVX = new Float32Array(n); springVY = new Float32Array(n);
    }

    function updateSprings() {
      const n = springW * springH;
      for (let i = 0; i < n; i++) {
        springVX[i] += -springDX[i] * 0.045;
        springVY[i] += -springDY[i] * 0.045;
        springVX[i] *= 0.88;
        springVY[i] *= 0.88;
        springDX[i] += springVX[i];
        springDY[i] += springVY[i];
      }
    }

    function addSpringForce(gx: number, gy: number, fx: number, fy: number) {
      const si = Math.round(gx / SPRING_GRID);
      const sj = Math.round(gy / SPRING_GRID);
      if (si < 0 || si >= springW || sj < 0 || sj >= springH) return;
      const idx = sj * springW + si;
      springVX[idx] += fx * 0.3;
      springVY[idx] += fy * 0.3;
    }

    function getSpringDisp(gx: number, gy: number): [number, number] {
      const si = gx / SPRING_GRID, sj = gy / SPRING_GRID;
      const si0 = Math.floor(si), sj0 = Math.floor(sj);
      const si1 = si0 + 1, sj1 = sj0 + 1;
      const fx = si - si0, fy = sj - sj0;
      if (si0 < 0 || si1 >= springW || sj0 < 0 || sj1 >= springH) return [0, 0];
      const i00 = sj0 * springW + si0, i10 = sj0 * springW + si1, i01 = sj1 * springW + si0, i11 = sj1 * springW + si1;
      return [
        springDX[i00] * (1 - fx) * (1 - fy) + springDX[i10] * fx * (1 - fy) + springDX[i01] * (1 - fx) * fy + springDX[i11] * fx * fy,
        springDY[i00] * (1 - fx) * (1 - fy) + springDY[i10] * fx * (1 - fy) + springDY[i01] * (1 - fx) * fy + springDY[i11] * fx * fy,
      ];
    }

    function fullInit() {
      resize();
      computeResponsiveConfig();
      buildTextMask();
      gridCols = Math.ceil(W / GRID_SPACING) + 2;
      gridRows = Math.ceil(H / GRID_SPACING) + 2;
      initSprings();
    }

    let rafMain: number;
    let maskReady = false;

    function startAfterFont() {
      if (maskReady) return;
      maskReady = true;
      fullInit();
      startTime = performance.now();
      rafMain = requestAnimationFrame(animate);
    }

    const fragmentSpawnTracker = new Set<number>();

    function animate(time: number) {
      rafMain = requestAnimationFrame(animate);

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const elapsed = time - startTime;
      const t = time * WARP_SPEED;
      const st = time * SIZE_SPEED;

      const waveT = Math.min(elapsed / WAVE_DURATION, 1);
      const waveEaseOut = 1 - Math.pow(1 - waveT, 2.5);
      const waveFront = 1.3 - waveEaseOut * 1.6;

      const fissionProgress = Math.max(0, Math.min(1, (elapsed - FISSION_START) / FISSION_DURATION));
      const postFission = elapsed - FISSION_START;
      const warpMult = elapsed > 400 ? Math.min(1, (elapsed - 400) / 1500) : 0;

      const cursorR = isMouseDown ? CURSOR_RADIUS * 1.4 : CURSOR_RADIUS;
      const cursorW = isMouseDown ? CURSOR_WARP * CLICK_MULT : CURSOR_WARP;
      const cSpeed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
      const cDirX = cSpeed > 1 ? mouseVX / cSpeed : 0;
      const cDirY = cSpeed > 1 ? mouseVY / cSpeed : 0;

      updateSprings();

      const opT = time * 0.00015;
      const halfSpacing = GRID_SPACING * 0.5;

      const breatheT = time * 0.0008;
      const breatheGlobal = Math.sin(breatheT * 0.6) * 2.5 + Math.sin(breatheT * 0.37) * 1.8;

      const maxPass = IS_MOBILE ? 1 : 2;
      for (let pass = 0; pass < maxPass; pass++) {
        const isInterstitial = pass === 1;
        const offX = isInterstitial ? halfSpacing : 0;
        const offY = isInterstitial ? halfSpacing : 0;

        for (let row = -1; row < gridRows; row++) {
          for (let col = -1; col < gridCols; col++) {
            const baseX = col * GRID_SPACING + offX;
            const baseY = row * GRID_SPACING + offY;

            if (isInterstitial) {
              const d = textDistAt(baseX, baseY);
              if (d > ZONE_B || d < -ZONE_A) continue;
            }

            const nx = baseX * WARP_SCALE;
            const ny = baseY * WARP_SCALE;
            const warpAngle = noise2D(nx + t, ny + t * 0.7) * Math.PI * 2;
            const warpMag = (noise2D(nx + 50, ny + 50 + t * 0.5) + 1) * 0.5;
            let dx = Math.cos(warpAngle) * warpMag * WARP_AMP * warpMult;
            let dy = Math.sin(warpAngle) * warpMag * WARP_AMP * warpMult;

            const [sdx, sdy] = getSpringDisp(col + 1, row + 1);
            dx += sdx; dy += sdy;

            const cdx = baseX - mouseX, cdy = baseY - mouseY;
            const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
            let cursorInfluence = 0;

            if (cDist < cursorR && cDist > 0) {
              const falloff = 1 - cDist / cursorR;
              const f2 = falloff * falloff;
              const f3 = f2 * falloff;
              cursorInfluence = f2;

              const ndx = cdx / cDist, ndy = cdy / cDist;
              const cross = cDirX * ndy - cDirY * ndx;
              const tangX = -ndy * Math.sign(cross), tangY = ndx * Math.sign(cross);

              let cfx = 0, cfy = 0;
              const eyeWall = Math.sin(falloff * Math.PI);
              const vortexStrength = Math.min(cSpeed / 12, 1.0);

              if (cSpeed > 1.5) {
                cfx += tangX * eyeWall * vortexStrength * cursorW * 0.7 * f2;
                cfy += tangY * eyeWall * vortexStrength * cursorW * 0.7 * f2;
              }
              if (cSpeed > 3) {
                const gust = Math.min(cSpeed * 0.08, 1.2);
                cfx += cDirX * f3 * cursorW * gust * 0.4;
                cfy += cDirY * f3 * cursorW * gust * 0.4;
              }
              cfx += ndx * f3 * cursorW * 0.08;
              cfy += ndy * f3 * cursorW * 0.08;

              if (isMouseDown) {
                cfx += ndx * f2 * cursorW * 0.6;
                cfy += ndy * f2 * cursorW * 0.6;
                cfx += tangX * eyeWall * cursorW * 0.4;
                cfy += tangY * eyeWall * cursorW * 0.4;
              }

              dx += cfx; dy += cfy;
              addSpringForce(col + 1, row + 1, cfx * 0.06, cfy * 0.06);
            }

            const finalX = baseX + dx;
            const finalY = baseY + dy;

            if (finalX < -DOT_MAX_RADIUS || finalX > W + DOT_MAX_RADIUS ||
                finalY < -DOT_MAX_RADIUS || finalY > H + DOT_MAX_RADIUS) continue;

            const dist = textDistAt(finalX, finalY);
            const distBase = textDistAt(baseX, baseY);
            const rawDToEdge = Math.min(dist, distBase);

            const breatheLocal = noise2D(baseX * 0.006 + breatheT * 0.25, baseY * 0.006 + breatheT * 0.15) * 3;
            let cursorBreathe = 0;
            if (cursorInfluence > 0) {
              cursorBreathe = -cursorInfluence * cursorInfluence * 12;
            }
            const dToEdge = rawDToEdge + breatheGlobal + breatheLocal + cursorBreathe;

            const crackX = textLeft + fissionProgress * (textRight - textLeft);
            const inTextRegion = dToEdge < 0;
            const dotReveal = inTextRegion ? Math.max(0, Math.min(1, (crackX - baseX) / 40)) : 0;
            const dotCrackTime = (baseX - textLeft) / (textRight - textLeft) * FISSION_DURATION;
            const timeSinceCrack = postFission - dotCrackTime;

            const snx = baseX * SIZE_SCALE, sny = baseY * SIZE_SCALE;
            const sizeNoise = (noise2D(snx + st + 200, sny + st * 0.6 + 200) + 1) * 0.5;

            let radius: number;
            if (isInterstitial) {
              radius = 0.5;
            } else {
              radius = NOISE_BASE + sizeNoise * NOISE_AMP;
              if (sizeNoise < 0.05) radius = 0.3;
            }

            const edgeX = (finalX - W * 0.5) / (W * 0.5);
            const edgeY = (finalY - H * 0.5) / (H * 0.5);
            const edgeDist = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
            radius *= 0.9 + edgeDist * 0.15;

            if (cursorInfluence > 0) radius *= 1 + cursorInfluence * 0.5;

            const opNoise = (noise2D(baseX * 0.002 + opT, baseY * 0.002 + opT * 0.8) + 1) * 0.5;
            let opacity = 0.5 + opNoise * 0.5;

            if (elapsed < WAVE_DURATION + 600) {
              const dotNormX = baseX / W;
              const waveNoise = noise2D(baseY * 0.006, 42) * 0.06;
              const distPastWave = (dotNormX + waveNoise) - waveFront;
              const waveAlpha = Math.max(0, Math.min(1, distPastWave / WAVE_FEATHER));
              opacity *= waveAlpha;
              radius *= 0.4 + waveAlpha * 0.6;
              if (waveAlpha < 0.01) continue;
            }

            let isTextEdge = false;
            let isGhostDot = false;

            if (fissionProgress > 0 && dToEdge < ZONE_B) {
              if (dToEdge < 0) {
                const depthInside = -dToEdge;
                if (dotReveal > 0.8 && depthInside > ZONE_A) {
                  radius *= 0.12;
                  opacity = 0.06 + Math.sin(time * 0.002 + baseX * 0.1) * 0.03;
                  isGhostDot = true;
                  if (!isInterstitial) {
                    const cellKey = col * 10000 + row;
                    if (!fragmentSpawnTracker.has(cellKey)) {
                      fragmentSpawnTracker.add(cellKey);
                      if (Math.random() < 0.12) spawnFragment(finalX, finalY, DOT_MAX_RADIUS * sizeNoise);
                    }
                  }
                } else if (dotReveal > 0) {
                  if (depthInside < ZONE_A) {
                    const zoneAT = depthInside / ZONE_A;
                    radius = Math.min(radius, DOT_MAX_RADIUS * 0.18 * (1 - zoneAT * dotReveal));
                    isTextEdge = true;
                  } else {
                    radius *= Math.max(0.05, 1 - dotReveal);
                  }
                }
              } else {
                isTextEdge = true;
                if (dotReveal > 0.5) {
                  const t2 = dToEdge / ZONE_B;
                  const maxAllowed = DOT_MAX_RADIUS * (0.25 + t2 * 0.75);
                  radius = Math.min(radius, maxAllowed);
                }
              }

              if (isTextEdge && timeSinceCrack > 0 && timeSinceCrack < FLARE_DURATION) {
                const flareT = timeSinceCrack / FLARE_DURATION;
                const flare = Math.sin(flareT * Math.PI);
                radius *= 1 + flare * 0.4;
                opacity = Math.min(1, opacity + flare * 0.3);
              }
            }

            if (radius < 0.15 && !isGhostDot) continue;

            const nearEdge = isTextEdge && fissionProgress > 0.1 && dotReveal > 0.3;
            const useAngular = nearEdge && !isInterstitial && ((col * 7 + row * 13) % 10 < 3);

            let r, g, b;
            if (isGhostDot) {
              r = g = b = 120;
            } else {
              const bright = isTextEdge && dotReveal > 0.3
                ? 0.92 + Math.random() * 0.08
                : 0.72 + sizeNoise * 0.2;
              r = g = b = Math.floor(bright * 255);
              if (cursorInfluence > 0.3) {
                const boost = (cursorInfluence - 0.3) / 0.7;
                r = g = b = Math.min(255, Math.floor(r + boost * 40));
              }
            }

            ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;

            if (useAngular) {
              ctx.save();
              ctx.translate(finalX, finalY);
              ctx.rotate(noise2D(baseX * 0.01, baseY * 0.01) * Math.PI);
              const s = radius;
              ctx.fillRect(-s, -s * 0.35, s * 2, s * 0.7);
              ctx.restore();
            } else {
              ctx.beginPath();
              ctx.arc(finalX, finalY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      updateAndDrawFragments();

      if (elapsed > WAVE_DURATION * 0.6 && !isTouchDevice) {
        for (let i = 0; i < descriptorChars.length; i++) {
          const ch = descriptorChars[i];
          const rect = ch.el.getBoundingClientRect();
          if (rect.width === 0) continue;
          const charCX = rect.left + rect.width * 0.5;
          const charCY = rect.top + rect.height * 0.5;
          const ddx = mouseX - charCX;
          const ddy = mouseY - charCY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < ILLUMINATE_RADIUS) {
            const falloff = 1 - dist / ILLUMINATE_RADIUS;
            const intensity = falloff * falloff * (3 - 2 * falloff);
            const target = intensity * ILLUMINATE_PEAK;
            ch.brightness = Math.max(ch.brightness, ch.brightness + (target - ch.brightness) * 0.3);
          } else {
            ch.brightness = Math.max(0, ch.brightness - ILLUMINATE_DECAY);
          }
          const bv = ch.brightness;
          if (bv > 0.001) {
            ch.el.style.color = `rgba(255,255,255,${bv})`;
          } else {
            ch.el.style.color = "rgba(255,255,255,0.0)";
          }
        }
      }

      mouseVX *= 0.88;
      mouseVY *= 0.88;
    }

    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('900 100px "Nunito"'),
        document.fonts.load('700 100px "Space Grotesk"'),
      ]).then(startAfterFont).catch(startAfterFont);
      setTimeout(startAfterFont, 2500);
    } else {
      setTimeout(startAfterFont, 800);
    }

    window.addEventListener("resize", fullInit);

    return () => {
      cancelAnimationFrame(rafRing);
      cancelAnimationFrame(rafMain);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", fullInit);
      descriptorEl.innerHTML = "";
    };
  }, []);

  return (
    <>
      <canvas id="particle-canvas" />
      <div className="studio-descriptor" id="studio-descriptor" />
      <div className="bottom-bar">
        <span>Tear apart. Rebuild. Repeat.</span>
        <span className="contact">hello@asunder.studio</span>
      </div>
      <div className="cursor-dot" id="cursor-dot" />
      <div className="cursor-ring" id="cursor-ring" />
    </>
  );
}
