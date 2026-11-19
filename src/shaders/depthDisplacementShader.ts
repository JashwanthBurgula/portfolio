export const depthDisplacementVertexShader = `
  uniform vec2 uMouse;
  uniform float uProgress;
  uniform float uDisplacement;
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Procedural pseudo-depth gradient (centered head and torso)
    float radial = 1.0 - smoothstep(0.0, 0.7, length(uv - vec2(0.5, 0.55)));
    float noise = snoise(uv * 4.0 + vec2(uTime * 0.1, 0.0)) * 0.1;
    float depth = clamp(radial + noise, 0.0, 1.0);

    // Mouse tilt and displacement
    pos.z += depth * uDisplacement;
    pos.x += (uMouse.x * depth * 0.35);
    pos.y += (uMouse.y * depth * 0.35);

    // Dissolve into particles / waves based on progress
    float dissolveWave = sin(pos.y * 5.0 + uTime * 2.0) * uProgress * 0.5;
    pos.z += dissolveWave;

    vElevation = depth;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const depthDisplacementFragmentShader = `
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec2 uv = vUv;

    // Chromatic aberration based on mouse displacement
    float shift = length(uMouse) * 0.008;
    vec4 colR = uHasTexture ? texture2D(uTexture, uv + vec2(shift, 0.0)) : vec4(1.0);
    vec4 colG = uHasTexture ? texture2D(uTexture, uv) : vec4(1.0);
    vec4 colB = uHasTexture ? texture2D(uTexture, uv - vec2(shift, 0.0)) : vec4(1.0);

    vec4 texColor = vec4(colR.r, colG.g, colB.b, colG.a);

    // If no real texture, render a futuristic procedural biometric avatar plane
    if (!uHasTexture || texColor.a < 0.05) {
      // High-tech stylized hologram silhouette
      float headDist = length((uv - vec2(0.5, 0.65)) * vec2(1.0, 1.25));
      float shoulders = smoothstep(0.45, 0.0, abs(uv.x - 0.5)) * smoothstep(0.4, 0.0, uv.y);
      float silhouette = (1.0 - smoothstep(0.18, 0.22, headDist)) + shoulders;
      silhouette = clamp(silhouette, 0.0, 1.0);

      // Cyber scanlines
      float scanline = sin(uv.y * 120.0 + uTime * 4.0) * 0.15 + 0.85;

      // Neural net grid dots
      vec2 gridUv = fract(uv * 32.0);
      float dots = smoothstep(0.1, 0.0, length(gridUv - 0.5));

      vec3 base = mix(uColorA, uColorB, vElevation);
      vec3 finalColor = base * scanline + dots * 0.2 * uColorA;

      float alpha = silhouette * 0.85 * uOpacity;
      gl_FragColor = vec4(finalColor, alpha);
    } else {
      // Photo with subtle cyber tint and vignette
      float vig = 1.0 - length(uv - 0.5) * 0.6;
      vec3 tinted = mix(texColor.rgb, uColorA * 0.5 + texColor.rgb * 0.5, 0.1);
      gl_FragColor = vec4(tinted * vig, texColor.a * uOpacity);
    }
  }
`
