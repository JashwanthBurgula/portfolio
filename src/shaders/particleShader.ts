export const particleVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute vec3 aRandomness;
  attribute float aAlpha;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vAlpha = aAlpha;

    vec3 pos = position;

    // Disperse particles according to uProgress (drifting rightwards towards Intro)
    float disperse = uProgress * 2.8;
    pos += aRandomness * disperse;
    pos.x += uProgress * 1.5; // Drift right towards cols 1-5

    // Subtle wave turbulence
    pos.x += sin(uTime * 1.5 + pos.y * 3.0) * (0.04 + uProgress * 0.3);
    pos.y += cos(uTime * 1.2 + pos.x * 3.0) * (0.04 + uProgress * 0.3);
    pos.z += sin(uTime * 1.0 + pos.z * 2.0) * (0.04 + uProgress * 0.3);

    // Mouse repulsion in XY plane
    vec2 dir = pos.xy - uMouse;
    float dist = length(dir);
    if (dist < 1.0) {
      float force = (1.0 - dist) / 1.0;
      pos.xy += normalize(dir) * force * 0.25;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size calculation
    gl_PointSize = aScale * uPixelRatio * (28.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    // Strictly off-white #F5F3EE to Signal Red #FF3B30
    vColor = mix(vec3(0.96, 0.95, 0.93), vec3(1.0, 0.231, 0.188), clamp(pos.y * 0.5 + 0.5 + uProgress * 0.5, 0.0, 1.0));
  }
`

export const particleFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`
