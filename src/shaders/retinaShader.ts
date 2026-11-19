export const retinaVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const retinaFragmentShader = `
  uniform float uSeverity; // 0.0 to 4.0
  uniform float uScanLine; // 0.0 to 1.0
  uniform float uTime;
  uniform bool uHeatmap;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple pseudo-random hash
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal Brownian Motion for blood vessels
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Normal fundus base color: deep reddish-orange
    vec3 fundusBase = vec3(0.72, 0.22, 0.08);

    // Optic disc (bright yellowish-orange circle on nasal side)
    vec2 opticDiscPos = vec2(0.35, 0.5);
    float dDisc = length(uv - opticDiscPos);
    float opticDisc = smoothstep(0.09, 0.05, dDisc);
    vec3 discColor = vec3(0.98, 0.82, 0.45);

    // Macula / Fovea (darker red area temporal to disc)
    vec2 maculaPos = vec2(0.65, 0.5);
    float dMacula = length(uv - maculaPos);
    float macula = smoothstep(0.18, 0.02, dMacula);
    vec3 maculaColor = vec3(0.45, 0.08, 0.03);

    // Blood vessel network radiating from optic disc
    vec2 vesselCoord = (uv - opticDiscPos) * 12.0;
    float angle = atan(vesselCoord.y, vesselCoord.x);
    float r = length(vesselCoord);
    float vesselNoise = fbm(vec2(angle * 3.0, r * 2.0));
    float vessels = smoothstep(0.48, 0.52, vesselNoise) * smoothstep(0.05, 0.2, dDisc);
    vec3 vesselColor = vec3(0.35, 0.02, 0.01);

    // Compose healthy retina
    vec3 color = mix(fundusBase, maculaColor, macula * 0.7);
    color = mix(color, discColor, opticDisc * 0.9);
    color = mix(color, vesselColor, vessels * 0.85);

    // Pathological features based on uSeverity (0 = Normal, 1 = Mild, 2 = Moderate, 3 = Severe, 4 = Proliferative)
    if (uSeverity >= 1.0) {
      // Microaneurysms (tiny dark red dots)
      float dots = step(0.97, hash(floor(uv * 70.0)));
      color = mix(color, vec3(0.2, 0.0, 0.0), dots * 0.8);
    }

    if (uSeverity >= 2.0) {
      // Hard exudates (yellowish lipid deposits)
      float exudates = step(0.94, hash(floor(uv * 45.0 + vec2(13.0, 7.0))));
      color = mix(color, vec3(0.95, 0.9, 0.3), exudates * 0.9);

      // Blot hemorrhages
      float blot = step(0.96, vnoise(uv * 25.0));
      color = mix(color, vec3(0.3, 0.02, 0.02), blot * 0.8);
    }

    if (uSeverity >= 3.0) {
      // Cotton wool spots (soft white fluffy ischemic patches)
      float cws = smoothstep(0.75, 0.85, vnoise(uv * 18.0 + vec2(4.0, 9.0)));
      color = mix(color, vec3(0.85, 0.88, 0.9), cws * 0.85);

      // Venous beading / tortuous vessels
      float tortuous = step(0.55, fbm(uv * 30.0));
      color = mix(color, vec3(0.25, 0.0, 0.0), tortuous * 0.4);
    }

    if (uSeverity >= 4.0) {
      // Proliferative Neovascularization (frond-like new vessels, vitreous hemorrhage risk)
      float neovasc = step(0.65, fbm(uv * 50.0 + vec2(uTime * 0.05)));
      color = mix(color, vec3(0.8, 0.05, 0.05), neovasc * 0.9);
    }

    // Scanning laser bar
    float scanDist = abs(uv.y - uScanLine);
    float laser = smoothstep(0.015, 0.0, scanDist);
    color += vec3(0.133, 0.827, 0.933) * laser * 1.5;

    // Optional Grad-CAM Heatmap overlay
    if (uHeatmap && uSeverity > 0.0) {
      float lesionHeat = fbm(uv * 6.0 + vec2(uSeverity * 0.5));
      vec3 heatColor = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), lesionHeat);
      color = mix(color, heatColor, 0.4 * (uSeverity / 4.0));
    }

    // Vignette / eyeball curvature shading
    float rim = 1.0 - smoothstep(0.2, 0.5, length(uv - 0.5));
    color *= (0.5 + 0.5 * rim);

    gl_FragColor = vec4(color, 1.0);
  }
`
