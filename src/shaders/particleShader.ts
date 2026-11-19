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

    // Disperse particles according to uProgress
    float disperse = uProgress * 2.5;
    pos += aRandomness * disperse;

    // Curl noise simulation
    pos.x += sin(uTime * 1.5 + pos.y * 3.0) * (0.05 + uProgress * 0.4);
    pos.y += cos(uTime * 1.2 + pos.x * 3.0) * (0.05 + uProgress * 0.4);
    pos.z += sin(uTime * 1.0 + pos.z * 2.0) * (0.05 + uProgress * 0.4);

    // Mouse repulsion in XY plane
    vec2 dir = pos.xy - uMouse;
    float dist = length(dir);
    if (dist < 1.2) {
      float force = (1.2 - dist) / 1.2;
      pos.xy += normalize(dir) * force * 0.3;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size calculation with perspective attenuation
    gl_PointSize = aScale * uPixelRatio * (28.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    // Color gradient cyan to red
    vColor = mix(vec3(0.133, 0.827, 0.933), vec3(1.0, 0.231, 0.188), clamp(pos.y * 0.5 + 0.5, 0.0, 1.0));
  }
`

export const particleFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`
