"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const cursorDot = document.getElementById("cursor-dot") as HTMLElement;
    const cursorRing = document.getElementById("cursor-ring") as HTMLElement;
    const descriptorEl = document.getElementById("studio-descriptor") as HTMLElement;

    // Build per-character descriptor
    const DESCRIPTOR_TEXT = "A Creative Studio For The Agentic Era";
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
      e.preventDefault();
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
    document.addEventListener("touchmove", onTouchMove, { passive: false });
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

    // Preload logo
    const logoImg = new Image();
    logoImg.src = "/asunder-logo.png";

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

    // ── Animation modes ──
    const MODES = [
      { // Flow – the original organic drift
        warpScale: 0.003, warpSpeed: 0.00025, warpAmpMult: 1.6,
        sizeScale: 0.004, sizeSpeed: 0.0002,
        noiseBase: 0.7, noiseAmp: 0.9,
        cursorRadius: 200, cursorWarp: 80, clickMult: 2.5,
        tint: [0.78, 0.88, 1] as [number, number, number], // cool blue
        waveDir: "left", // reveal left→right
      },
      { // Ember – slow, warm drift
        warpScale: 0.002, warpSpeed: 0.00015, warpAmpMult: 2.2,
        sizeScale: 0.004, sizeSpeed: 0.0002,
        noiseBase: 0.7, noiseAmp: 0.9,
        cursorRadius: 260, cursorWarp: 60, clickMult: 2.0,
        tint: [0.78, 0.88, 1] as [number, number, number], // cool blue
        waveDir: "center", // reveal from centre outward
      },
      { // Storm – tight, fast, electric
        warpScale: 0.005, warpSpeed: 0.0005, warpAmpMult: 1.2,
        sizeScale: 0.004, sizeSpeed: 0.0002,
        noiseBase: 0.7, noiseAmp: 0.9,
        cursorRadius: 170, cursorWarp: 110, clickMult: 3.0,
        tint: [0.78, 0.88, 1] as [number, number, number], // cool blue
        waveDir: "top", // reveal top→bottom
      },
    ];
    const MODE = MODES[Math.floor(Math.random() * MODES.length)];

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

      NOISE_BASE = MODE.noiseBase;
      NOISE_AMP = MODE.noiseAmp;
      ZONE_A = Math.round(FONT_SIZE * 0.14);
      ZONE_B = Math.round(FONT_SIZE * 0.45);
      WARP_AMP = GRID_SPACING * MODE.warpAmpMult;
    }

    const WARP_SCALE = MODE.warpScale;
    const WARP_SPEED = MODE.warpSpeed;
    const SIZE_SCALE = MODE.sizeScale;
    const SIZE_SPEED = MODE.sizeSpeed;
    const CURSOR_RADIUS = MODE.cursorRadius;
    const CURSOR_WARP = MODE.cursorWarp;
    const CLICK_MULT = MODE.clickMult;

    let startTime = 0;
    let gridCols = 0, gridRows = 0;

    let textMask: Uint8Array | null = null;
    let textDist: Float32Array | null = null;
    let textW = 0, textH = 0;

    function buildTextMask() {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const octx = off.getContext("2d")!;

      // Scale logo to fit viewport width with margins
      const targetW = IS_MOBILE ? Math.min(W * 0.75, 360) : Math.min(W * 0.343, 396);
      const scale = targetW / logoImg.naturalWidth;
      const logoH = logoImg.naturalHeight * scale;
      const lx = (W - targetW) / 2;
      const ly = H / 2 - logoH / 2;

      // Draw logo into mask canvas — alpha channel becomes the mask
      octx.drawImage(logoImg, lx, ly, targetW, logoH);

      // Mild blur+contrast to smooth aliasing edges into organic blobs
      const blurAmt = Math.max(1, Math.round(logoH * 0.015));
      const blobCanvas = document.createElement("canvas");
      blobCanvas.width = W; blobCanvas.height = H;
      const bctx = blobCanvas.getContext("2d")!;
      bctx.filter = `blur(${blurAmt}px)`;
      bctx.drawImage(off, 0, 0);
      bctx.filter = "none";
      bctx.globalCompositeOperation = "source-over";
      bctx.filter = `blur(${Math.round(blurAmt * 0.5)}px) contrast(4)`;
      bctx.drawImage(blobCanvas, 0, 0);
      bctx.filter = "none";
      bctx.globalCompositeOperation = "source-over";


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

      const warpMult = elapsed > 400 ? Math.min(1, (elapsed - 400) / 1500) : 0;

      const cursorR = isMouseDown ? CURSOR_RADIUS * 1.4 : CURSOR_RADIUS;
      const cursorW = isMouseDown ? CURSOR_WARP * CLICK_MULT : CURSOR_WARP;
      const cSpeed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
      const cDirX = cSpeed > 1 ? mouseVX / cSpeed : 0;
      const cDirY = cSpeed > 1 ? mouseVY / cSpeed : 0;


      updateSprings();

      const opT = time * 0.00015;
      const halfSpacing = GRID_SPACING * 0.5;

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
                cfx += ndx * f2 * cursorW * 0.8;
                cfy += ndy * f2 * cursorW * 0.8;
              }

              dx += cfx; dy += cfy;
              addSpringForce(col + 1, row + 1, cfx * 0.06, cfy * 0.06);
            }

            const finalX = baseX + dx;
            const finalY = baseY + dy;

            if (finalX < -DOT_MAX_RADIUS || finalX > W + DOT_MAX_RADIUS ||
                finalY < -DOT_MAX_RADIUS || finalY > H + DOT_MAX_RADIUS) continue;

            // Radiation decay on click
            if (isMouseDown && cursorInfluence > 0.05) {
              const distNorm = 1 - cursorInfluence;
              const seed = (col * 7919 + row * 104729) >>> 0;
              const r1 = (seed & 0xffff) / 0xffff;
              const r2 = ((seed >> 8) & 0xffff) / 0xffff;
              const n1 = noise2D(baseX * 0.04 + time * 0.008, baseY * 0.04 + r1 * 50);
              const n2 = noise2D(baseX * 0.1 + time * 0.015 + 300, baseY * 0.1 + r2 * 80);
              const flicker = n1 * 0.6 + n2 * 0.4;
              const killChance = cursorInfluence * 0.9;
              if (flicker < killChance * 2 - 1 + distNorm * 0.7) continue;
            }

            // Organic moat: boundary distorts with noise
            const logoD = textDistAt(finalX, finalY);
            const moatNoise = (noise2D(baseX * 0.012 + t * 0.4, baseY * 0.012 + t * 0.25) + 1) * 0.5;
            const dynamicMoat = 8.8 + moatNoise * 19.8;
            if (logoD < dynamicMoat) continue;

            const snx = baseX * SIZE_SCALE, sny = baseY * SIZE_SCALE;
            const sizeNoise = (noise2D(snx + st + 200, sny + st * 0.6 + 200) + 1) * 0.5;

            let radius: number;
            if (isInterstitial) {
              radius = 0.7;
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
              let dotNorm: number, waveNoise: number;
              if (MODE.waveDir === "top") {
                dotNorm = baseY / H;
                waveNoise = noise2D(baseX * 0.006, 42) * 0.06;
              } else if (MODE.waveDir === "center") {
                const cx = (baseX - W * 0.5) / (W * 0.5);
                const cy = (baseY - H * 0.5) / (H * 0.5);
                dotNorm = Math.sqrt(cx * cx + cy * cy);
                waveNoise = noise2D(baseX * 0.004 + baseY * 0.004, 42) * 0.06;
              } else {
                dotNorm = baseX / W;
                waveNoise = noise2D(baseY * 0.006, 42) * 0.06;
              }
              const distPastWave = (dotNorm + waveNoise) - waveFront;
              const waveAlpha = Math.max(0, Math.min(1, distPastWave / WAVE_FEATHER));
              opacity *= waveAlpha;
              radius *= 0.4 + waveAlpha * 0.6;
              if (waveAlpha < 0.01) continue;
            }

            if (radius < 0.15) continue;

            let r, g, b;
            {
              const bright = 0.72 + sizeNoise * 0.2;
              r = Math.floor(bright * 255 * MODE.tint[0]);
              g = Math.floor(bright * 255 * MODE.tint[1]);
              b = Math.floor(bright * 255 * MODE.tint[2]);
              if (cursorInfluence > 0.3) {
                const boost = (cursorInfluence - 0.3) / 0.7;
                r = Math.min(255, Math.floor(r + boost * 40));
                g = Math.min(255, Math.floor(g + boost * 40));
                b = Math.min(255, Math.floor(b + boost * 40));
              }
            }

            ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
            ctx.beginPath();
            ctx.arc(finalX, finalY, Math.max(0.1, radius), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── Logo interior: dense dot fill ──
      const LOGO_SPACING = IS_MOBILE ? 2.5 : 3;
      const logoCols = Math.ceil(W / LOGO_SPACING);
      const logoRows = Math.ceil(H / LOGO_SPACING);
      for (let row = 0; row < logoRows; row++) {
        for (let col = 0; col < logoCols; col++) {
          const bx = col * LOGO_SPACING;
          const by = row * LOGO_SPACING;

          // Only draw inside the logo mask
          const ix = Math.round(bx), iy = Math.round(by);
          if (ix < 0 || ix >= textW || iy < 0 || iy >= textH) continue;
          if (textMask![iy * textW + ix] < 120) continue;

          // Slight noise warp so it breathes
          const lnx = bx * 0.008, lny = by * 0.008;
          const lwarp = noise2D(lnx + t * 0.5, lny + t * 0.3) * LOGO_SPACING * 0.6;
          const lwarpY = noise2D(lnx + 100 + t * 0.4, lny + 100 + t * 0.25) * LOGO_SPACING * 0.6;
          const fx = bx + lwarp;
          const fy = by + lwarpY;

          // Skip if warped outside logo
          const fix = Math.round(fx), fiy = Math.round(fy);
          if (fix < 0 || fix >= textW || fiy < 0 || fiy >= textH) continue;
          const fMask = textMask![fiy * textW + fix];
          if (fMask < 80) continue;

          // Cursor interaction
          const cdx2 = fx - mouseX, cdy2 = fy - mouseY;
          const cDist2 = Math.sqrt(cdx2 * cdx2 + cdy2 * cdy2);
          let logoCI = 0;
          if (cDist2 < CURSOR_RADIUS && cDist2 > 0) {
            const f = 1 - cDist2 / CURSOR_RADIUS;
            logoCI = f * f;
          }

          const logoRadius = 0.8 + logoCI * 0.4;

          const logoOpNoise = (noise2D(bx * 0.003 + opT, by * 0.003 + opT * 0.7) + 1) * 0.5;
          let logoOpacity = 0.7 + logoOpNoise * 0.3;

          // Wave reveal
          if (elapsed < WAVE_DURATION + 600) {
            let dotNorm: number, waveNoise: number;
            if (MODE.waveDir === "top") {
              dotNorm = by / H;
              waveNoise = noise2D(bx * 0.006, 42) * 0.06;
            } else if (MODE.waveDir === "center") {
              const cx = (bx - W * 0.5) / (W * 0.5);
              const cy = (by - H * 0.5) / (H * 0.5);
              dotNorm = Math.sqrt(cx * cx + cy * cy);
              waveNoise = noise2D(bx * 0.004 + by * 0.004, 42) * 0.06;
            } else {
              dotNorm = bx / W;
              waveNoise = noise2D(by * 0.006, 42) * 0.06;
            }
            const distPastWave = (dotNorm + waveNoise) - waveFront;
            const waveAlpha = Math.max(0, Math.min(1, distPastWave / WAVE_FEATHER));
            logoOpacity *= waveAlpha;
            if (waveAlpha < 0.01) continue;
          }

          // Brighter than background dots, with the cool tint
          const lBright = 0.85 + logoOpNoise * 0.15;
          const lr = Math.floor(lBright * 255 * MODE.tint[0]);
          const lg = Math.floor(lBright * 255 * MODE.tint[1]);
          const lb = Math.floor(lBright * 255 * MODE.tint[2]);

          // Under cursor: chaotic radiation decay outward from cursor
          if (logoCI > 0.05) {
            const distNorm = 1 - logoCI; // 0 at center, ~1 at edge
            // Per-dot random seed for chaos
            const seed = (col * 7919 + row * 104729) >>> 0;
            const r1 = (seed & 0xffff) / 0xffff;
            const r2 = ((seed >> 8) & 0xffff) / 0xffff;
            // Multiple overlapping noise frequencies for erratic flicker
            const n1 = noise2D(bx * 0.04 + time * 0.008, by * 0.04 + r1 * 50);
            const n2 = noise2D(bx * 0.1 + time * 0.015 + 300, by * 0.1 + r2 * 80);
            const flicker = n1 * 0.6 + n2 * 0.4; // -1 to 1
            // More likely to vanish near center, falls off with distance
            const killChance = logoCI * 0.85;
            if (flicker < killChance * 2 - 1 + distNorm * 0.8) continue;
          }

          ctx.fillStyle = `rgba(${lr},${lg},${lb},${logoOpacity})`;
          ctx.beginPath();
          ctx.arc(fx, fy, logoRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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

    const logoReady = new Promise<void>((resolve) => {
      if (logoImg.complete && logoImg.naturalWidth > 0) resolve();
      else { logoImg.onload = () => resolve(); logoImg.onerror = () => resolve(); }
    });

    if (document.fonts && document.fonts.load) {
      Promise.all([
        logoReady,
        document.fonts.load('700 100px "Space Grotesk"'),
      ]).then(startAfterFont).catch(startAfterFont);
      setTimeout(startAfterFont, 2500);
    } else {
      setTimeout(startAfterFont, 800);
    }

    const onResize = () => { fullInit(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRing);
      cancelAnimationFrame(rafMain);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      descriptorEl.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Grain texture overlay */}
      <svg className="grain-overlay" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <canvas id="particle-canvas" />

      <div className="scroll-container">
        {/* Hero */}
        <section className="hero-section">
          <div id="wordmark-wrap" className="wordmark-wrap">
            <div className="studio-descriptor" id="studio-descriptor" />
          </div>
        </section>
      </div>

      <div className="cursor-dot" id="cursor-dot" />
      <div className="cursor-ring" id="cursor-ring" />
    </>
  );
}
