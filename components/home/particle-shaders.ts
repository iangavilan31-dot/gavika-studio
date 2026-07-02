/**
 * One draw call. Eight formation targets blended in the vertex stage;
 * choreography only writes uniforms. Alpha stays low (additive) so the
 * field reads as light through dust, never white blowout.
 */

export const particleVertex = /* glsl */ `
uniform float uW0; uniform float uW1; uniform float uW2; uniform float uW3;
uniform float uW4; uniform float uW5; uniform float uW6; uniform float uW7;
uniform float uTime;
uniform float uTurb;
uniform float uSize;
uniform float uPixelRatio;
uniform float uReveal;

attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3;
attribute vec3 aP4; attribute vec3 aP5; attribute vec3 aP6; attribute vec3 aP7;
attribute vec4 aSeed;

varying float vAlpha;
varying float vTone;

void main() {
  float total = uW0 + uW1 + uW2 + uW3 + uW4 + uW5 + uW6 + uW7;
  vec3 pos = (aP0 * uW0 + aP1 * uW1 + aP2 * uW2 + aP3 * uW3 +
              aP4 * uW4 + aP5 * uW5 + aP6 * uW6 + aP7 * uW7) / max(total, 0.001);

  // free motion: ambient drift always, storm during morphs (uTurb raised)
  float amp = 0.045 + uTurb * (0.35 + aSeed.z * 0.45);
  vec3 drift = vec3(
    sin(pos.y * 1.35 + uTime * 0.50 + aSeed.y * 6.2831),
    sin(pos.z * 1.60 + uTime * 0.42 + aSeed.x * 6.2831),
    sin(pos.x * 1.10 + uTime * 0.58 + aSeed.w * 6.2831)
  );
  pos += drift * amp;

  // preloader: particles converge from a wider scatter as uReveal -> 1
  pos *= mix(1.9, 1.0, uReveal);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float dist = max(-mv.z, 0.1);
  gl_PointSize = uSize * uPixelRatio * (2.6 + aSeed.z * 2.2) * (10.0 / dist);
  gl_PointSize = min(gl_PointSize, 7.0 * uPixelRatio);

  // depth participation: nearer = brighter, far fades into the dark
  vAlpha = smoothstep(26.0, 6.0, dist) * (0.5 + aSeed.w * 0.5);
  vTone = aSeed.x;
}
`;

export const particleFragment = /* glsl */ `
precision mediump float;

uniform vec3 uHue;
uniform float uOpacity;

varying float vAlpha;
varying float vTone;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = smoothstep(0.5, 0.06, d);
  // a small hot core inside a soft halo
  float core = smoothstep(0.16, 0.02, d) * 0.5;
  float a = (disc * 0.16 + core) * vAlpha * uOpacity;
  vec3 col = uHue * (0.75 + vTone * 0.45);
  gl_FragColor = vec4(col * a, a);
}
`;
