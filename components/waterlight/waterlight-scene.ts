// @ts-nocheck -- This is the original Purrl Waterlight shader study, isolated in an iframe route.
import * as THREE from 'three'

const stage = document.querySelector('#water-stage')
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
stage.appendChild(renderer.domElement)
stage.dataset.waterlightReady = 'true'

const scene = new THREE.Scene()
scene.background = new THREE.Color('#061013')

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 180)
camera.position.set(0, 1.28, 6.2)
const cameraLook = new THREE.Vector3(0, -4.9, -12)
camera.lookAt(cameraLook)

const bedTexture = new THREE.TextureLoader().load('/waterlight/riverbed-albedo-v3.png')
bedTexture.colorSpace = THREE.SRGBColorSpace
bedTexture.wrapS = THREE.MirroredRepeatWrapping
bedTexture.wrapT = THREE.MirroredRepeatWrapping
bedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

function createNoiseTexture(size = 128) {
  const data = new Uint8Array(size * size * 4)
  let seed = 0x6d2b79f5
  const randomByte = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return seed >>> 24
  }
  for (let index = 0; index < data.length; index += 1) data[index] = randomByte()
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

const noiseTexture = createNoiseTexture()

const SIMULATION_SIZE = 512
const SIMULATION_SUBSTEPS = 4
const INTERACTION_PATCH_SIZE = 7.4
const WATER_WIDTH = 120
const WATER_LENGTH = 160
const WATER_NEAR_Z = 15

function createSimulationTarget() {
  return new THREE.WebGLRenderTarget(SIMULATION_SIZE, SIMULATION_SIZE, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
  })
}

let simulationRead = createSimulationTarget()
let simulationWrite = createSimulationTarget()

const simulationUniforms = {
  uPreviousState: { value: simulationRead.texture },
  uNoise: { value: noiseTexture },
  uTexel: { value: new THREE.Vector2(1 / SIMULATION_SIZE, 1 / SIMULATION_SIZE) },
  uPointer: { value: new THREE.Vector2(.5, .5) },
  uPreviousPointer: { value: new THREE.Vector2(.5, .5) },
  uDirection: { value: new THREE.Vector2(0, -1) },
  uStrength: { value: 0 },
  uSpray: { value: 0 },
  uRadius: { value: .025 },
  uFrameScale: { value: 1 },
}

const simulationMaterial = new THREE.ShaderMaterial({
  uniforms: simulationUniforms,
  depthTest: false,
  depthWrite: false,
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    precision highp float;
    uniform sampler2D uPreviousState;
    uniform sampler2D uNoise;
    uniform vec2 uTexel;
    uniform vec2 uPointer;
    uniform vec2 uPreviousPointer;
    uniform vec2 uDirection;
    uniform float uStrength;
    uniform float uSpray;
    uniform float uRadius;
    uniform float uFrameScale;
    varying vec2 vUv;

    float gaussian(float value, float width) {
      return exp(-(value * value) / max(width * width, .0000001));
    }

    void main() {
      vec4 mediumNoise = texture2D(uNoise, vUv * .16 + vec2(.07, .21));
      vec4 detailNoise = texture2D(uNoise, vUv * .56 + vec2(.43, .12));
      vec2 storedFlow = texture2D(uPreviousState, vUv).rg;
      vec2 backgroundDrift = ((mediumNoise.rg - .5) * .10 + vec2(.014, -.004)) * uTexel;
      vec2 advectedUv = clamp(vUv - storedFlow * .36 * uFrameScale - backgroundDrift * uFrameScale,
        uTexel, 1.0 - uTexel);
      vec4 state = texture2D(uPreviousState, advectedUv);
      vec2 flow = state.rg;
      float height = state.b;
      float waveVelocity = state.a;

      vec4 leftState = texture2D(uPreviousState, advectedUv - vec2(uTexel.x, 0.0));
      vec4 rightState = texture2D(uPreviousState, advectedUv + vec2(uTexel.x, 0.0));
      vec4 downState = texture2D(uPreviousState, advectedUv - vec2(0.0, uTexel.y));
      vec4 upState = texture2D(uPreviousState, advectedUv + vec2(0.0, uTexel.y));
      vec2 propagationDirection = normalize(uDirection + vec2(.000001));
      vec2 propagationSide = vec2(-propagationDirection.y, propagationDirection.x);
      vec2 alongOffset = propagationDirection * uTexel * 1.35;
      vec2 acrossOffset = propagationSide * uTexel * .90;
      float alongLaplacian = texture2D(uPreviousState, advectedUv - alongOffset).b
        + texture2D(uPreviousState, advectedUv + alongOffset).b - 2.0 * height;
      float acrossLaplacian = texture2D(uPreviousState, advectedUv - acrossOffset).b
        + texture2D(uPreviousState, advectedUv + acrossOffset).b - 2.0 * height;
      float directionalLaplacian = alongLaplacian * .55 + acrossLaplacian * .04;
      vec2 flowLaplacian = leftState.rg + rightState.rg + downState.rg + upState.rg - 4.0 * flow;
      vec2 heightGradient = vec2(rightState.b - leftState.b, upState.b - downState.b) * .5;
      float divergence = ((rightState.r - leftState.r) + (upState.g - downState.g)) * .5;
      float curl = ((rightState.g - leftState.g) - (upState.r - downState.r)) * .5;

      float mediumCoarse = mediumNoise.b;
      float mediumDetail = detailNoise.b;
      float medium = mediumCoarse * .74 + mediumDetail * .26;
      float propagation = mix(.002, .008, medium);
      waveVelocity += directionalLaplacian * propagation * uFrameScale;
      waveVelocity *= pow(mix(.90, .95, mediumCoarse), uFrameScale);
      flow -= heightGradient * .09 * uFrameScale;
      flow += flowLaplacian * .035 * uFrameScale;
      vec2 tangent = vec2(-heightGradient.y, heightGradient.x);
      flow += tangent / max(length(tangent), .00001) * curl * (mediumDetail - .5) * .10 * uFrameScale;
      flow *= pow(mix(.93, .975, mediumCoarse), uFrameScale);
      height += waveVelocity * .42 * uFrameScale - divergence * .12 * uFrameScale;
      height *= pow(.978, uFrameScale);

      vec2 metric = vec2(.75, 1.0);
      vec2 segment = uPointer - uPreviousPointer;
      vec2 segmentMetric = segment * metric;
      float segmentLengthSq = max(dot(segmentMetric, segmentMetric), .0000001);
      float segmentT = clamp(dot((vUv - uPreviousPointer) * metric, segmentMetric) / segmentLengthSq, 0.0, 1.0);
      vec2 closest = mix(uPreviousPointer, uPointer, segmentT);
      vec2 delta = (vUv - closest) * metric;
      vec2 direction = normalize(uDirection * metric + vec2(.000001));
      vec2 sideDirection = vec2(-direction.y, direction.x);
      float forward = dot(delta, direction);
      float lateral = dot(delta, sideDirection);

      float front = gaussian(forward - uRadius * .34, uRadius * .13)
        * gaussian(lateral, uRadius * .24);
      float trench = gaussian(forward + uRadius * .02, uRadius * .45)
        * gaussian(lateral, uRadius * .105);
      float shoulderLeft = gaussian(forward + uRadius * .01, uRadius * .50)
        * gaussian(lateral - uRadius * .31, uRadius * .058);
      float shoulderRight = gaussian(forward + uRadius * .01, uRadius * .50)
        * gaussian(lateral + uRadius * .34, uRadius * .064);
      float dropletLeft = gaussian(forward - uRadius * .12, uRadius * .27)
        * gaussian(lateral - uRadius * .78, uRadius * .07);
      float dropletRight = gaussian(forward - uRadius * .12, uRadius * .27)
        * gaussian(lateral + uRadius * .76, uRadius * .075);
      float pathPulse = .12 + .88 * smoothstep(.46, .79, .5 + .5 * sin(segmentT * 27.0
        + vUv.x * 9.0 + detailNoise.a * 6.0));
      float breakupCoarse = mix(mediumNoise.a, detailNoise.r, .38);
      float breakupDetail = detailNoise.g;
      float textureBreakup = .012 + 1.50 * smoothstep(.43, .69, breakupCoarse * .72 + breakupDetail * .28);
      float capillaryBreakup = .76 + .24 * sin(lateral / max(uRadius, .0001) * 2.7
        + forward / max(uRadius, .0001) * 1.8 + segmentT * 4.0);
      float sideBias = mix(.58, 1.42, detailNoise.a);
      float leftShard = smoothstep(.45, .66, detailNoise.r + mediumNoise.a * .20);
      float rightShard = smoothstep(.48, .69, detailNoise.g + mediumNoise.r * .18);
      float shoulders = (shoulderLeft * sideBias * leftShard
        + shoulderRight * (2.0 - sideBias) * rightShard) * mix(.10, 1.0, uSpray);
      float droplets = (dropletLeft * (2.0 - sideBias) * rightShard
        + dropletRight * sideBias * leftShard) * uSpray * uSpray;
      float impulse = (front * .36 + shoulders * .94 + droplets * .62 - trench * 1.20)
        * textureBreakup * capillaryBreakup * pathPulse;
      vec2 outward = normalize(delta + vec2(.000001));
      vec2 dragMomentum = direction * (front * .34 + trench * .20);
      vec2 splashMomentum = outward * (shoulders * 1.50 + droplets * 2.05);
      vec2 asymmetricKick = sideDirection * (shoulderRight - shoulderLeft) * .58;
      flow += (dragMomentum + splashMomentum + asymmetricKick)
        * textureBreakup * pathPulse * uStrength * .0024;
      waveVelocity += impulse * uStrength * .0155;
      height += (front * .12 + shoulders * .36 - trench * .72)
        * textureBreakup * pathPulse * uStrength * .0215;

      float edge = smoothstep(0.0, .045, vUv.x) * smoothstep(0.0, .045, 1.0 - vUv.x)
        * smoothstep(0.0, .045, vUv.y) * smoothstep(0.0, .045, 1.0 - vUv.y);
      flow *= mix(.84, 1.0, edge);
      waveVelocity *= mix(.88, 1.0, edge);
      height *= mix(.94, 1.0, edge);

      flow = clamp(flow, vec2(-.003), vec2(.003));
      waveVelocity = clamp(waveVelocity, -.020, .020);
      height = clamp(height, -.085, .085);

      gl_FragColor = vec4(flow, height, waveVelocity);
    }
  `,
})

const simulationScene = new THREE.Scene()
const simulationCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
const simulationQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial)
simulationScene.add(simulationQuad)

function clearSimulationState() {
  const previousTarget = renderer.getRenderTarget()
  const savedClearColor = renderer.getClearColor(new THREE.Color()).clone()
  const savedClearAlpha = renderer.getClearAlpha()
  renderer.setClearColor(0x000000, 0)
  for (const target of [simulationRead, simulationWrite]) {
    renderer.setRenderTarget(target)
    renderer.clear()
  }
  renderer.setRenderTarget(previousTarget)
  renderer.setClearColor(savedClearColor, savedClearAlpha)
}

clearSimulationState()

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const uniforms = {
  uTime: { value: 0 },
  uMood: { value: 0 },
  uMotion: { value: reducedMotion ? 0.2 : 1 },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uBed: { value: bedTexture },
  uNoise: { value: noiseTexture },
  uSimulation: { value: simulationRead.texture },
  uSimulationTexel: { value: new THREE.Vector2(1 / SIMULATION_SIZE, 1 / SIMULATION_SIZE) },
  uInteractionCenter: { value: new THREE.Vector2(0, -8) },
  uInteractionSize: { value: INTERACTION_PATCH_SIZE },
}

const vertexShader = /* glsl */`
  uniform float uTime;
  uniform float uMotion;
  uniform sampler2D uSimulation;
  uniform vec2 uInteractionCenter;
  uniform float uInteractionSize;
  varying vec3 vWorldPosition;
  varying vec2 vSurfacePosition;
  varying vec2 vWaterUv;

  float waveHeight(vec2 p, float t) {
    float h = sin(dot(p, normalize(vec2(1.0, .22))) * 3.8 + t * .66) * .009;
    h += sin(dot(p, normalize(vec2(-.48, 1.0))) * 5.9 - t * .48) * .006;
    h += sin(dot(p, normalize(vec2(.72, .68))) * 8.6 + t * .31) * .004;
    h += sin(dot(p, normalize(vec2(-.86, .36))) * 12.4 - t * .22) * .0026;
    return h;
  }

  void main() {
    vec3 transformed = position;
    vec3 baseWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    vec2 surfacePosition = baseWorld.xz;
    float t = uTime * uMotion;
    float height = waveHeight(surfacePosition, t);
    vec2 interactionUv = vec2(
      (surfacePosition.x - uInteractionCenter.x) / uInteractionSize + .5,
      .5 - (surfacePosition.y - uInteractionCenter.y) / uInteractionSize
    );
#ifdef INTERACTIVE_PATCH
    float patchMask = smoothstep(0.0, .035, interactionUv.x) * smoothstep(0.0, .035, 1.0 - interactionUv.x)
      * smoothstep(0.0, .035, interactionUv.y) * smoothstep(0.0, .035, 1.0 - interactionUv.y);
    vec4 simulationState = texture2D(uSimulation, clamp(interactionUv, 0.0, 1.0));
    float simulationEnergy = abs(simulationState.b) * 10.0 + abs(simulationState.a) * 6.0
      + length(simulationState.rg) * 55.0;
    float simulationMask = smoothstep(.022, .086, simulationEnergy) * patchMask;
    float simulationHeight = simulationState.b * simulationMask;
    float liftedWater = max(simulationHeight, 0.0);
    height += liftedWater * .68 + max(simulationState.a, 0.0) * simulationMask * .065;
#endif
    transformed.z += height;
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    vSurfacePosition = surfacePosition;
    vWaterUv = interactionUv;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = /* glsl */`
  precision highp float;
  uniform float uTime;
  uniform float uMood;
  uniform vec2 uResolution;
  uniform sampler2D uBed;
  uniform sampler2D uNoise;
  uniform sampler2D uSimulation;
  uniform vec2 uSimulationTexel;
  uniform vec2 uInteractionCenter;
  uniform float uInteractionSize;
  varying vec3 vWorldPosition;
  varying vec2 vSurfacePosition;
  varying vec2 vWaterUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec3 sampleBed(vec2 uv) {
    vec3 color = texture2D(uBed, uv).rgb;
    float leftLum = dot(texture2D(uBed, uv - vec2(.0014, 0.0)).rgb, vec3(.299,.587,.114));
    float rightLum = dot(texture2D(uBed, uv + vec2(.0014, 0.0)).rgb, vec3(.299,.587,.114));
    float downLum = dot(texture2D(uBed, uv - vec2(0.0, .0014)).rgb, vec3(.299,.587,.114));
    float upLum = dot(texture2D(uBed, uv + vec2(0.0, .0014)).rgb, vec3(.299,.587,.114));
    vec3 pebbleNormal = normalize(vec3((leftLum - rightLum) * 2.4, 1.0, (downLum - upLum) * 2.4));
    vec3 bedLight = normalize(vec3(-.45, .9, .34));
    float luminance = dot(color, vec3(.299,.587,.114));
    color = mix(vec3(luminance), color, .76);
    color = mix(vec3(.035,.052,.049), color, .84);
    color *= .72 + max(dot(pebbleNormal, bedLight), 0.0) * .26;
    return color;
  }

  vec3 skyColor(vec3 direction, float mood) {
    float elevation = smoothstep(-.08, .72, direction.y);
    vec3 nightHorizon = vec3(.16, .23, .24);
    vec3 nightZenith = vec3(.012, .035, .045);
    vec3 dawnHorizon = vec3(.66, .57, .45);
    vec3 dawnZenith = vec3(.10, .23, .29);
    vec3 duskHorizon = vec3(.78, .38, .22);
    vec3 duskZenith = vec3(.12, .12, .18);
    vec3 emberHorizon = vec3(1.0, .28, .09);
    vec3 emberZenith = vec3(.19, .045, .025);
    vec3 night = mix(nightHorizon, nightZenith, elevation);
    vec3 dawn = mix(dawnHorizon, dawnZenith, elevation);
    vec3 dusk = mix(duskHorizon, duskZenith, elevation);
    vec3 ember = mix(emberHorizon, emberZenith, elevation);
    if (mood < 1.0) return mix(night, dawn, mood);
    if (mood < 2.0) return mix(dawn, dusk, mood - 1.0);
    return mix(dusk, ember, mood - 2.0);
  }

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    if (normal.y < 0.0) normal *= -1.0;
    float microX = sin(vSurfacePosition.x * 10.7 + vSurfacePosition.y * 2.1 + uTime * .82);
    microX += sin(vSurfacePosition.x * 18.4 - vSurfacePosition.y * 4.7 - uTime * .43) * .45;
    float microZ = cos(vSurfacePosition.y * 12.6 - vSurfacePosition.x * 1.7 - uTime * .67);
    microZ += sin(vSurfacePosition.y * 23.2 + vSurfacePosition.x * 3.2 + uTime * .31) * .38;
    normal = normalize(normal + vec3(microX * .012, 0.0, microZ * .008));

    float patchMask = smoothstep(0.0, .035, vWaterUv.x) * smoothstep(0.0, .035, 1.0 - vWaterUv.x)
      * smoothstep(0.0, .035, vWaterUv.y) * smoothstep(0.0, .035, 1.0 - vWaterUv.y);
    vec2 safeWaterUv = clamp(vWaterUv, 0.0, 1.0);
    vec4 ridgeFieldA = texture2D(uNoise, safeWaterUv * .18 + vec2(.13, .37));
    vec4 ridgeFieldB = texture2D(uNoise, safeWaterUv * .61 + vec2(.52, .19));
    vec2 rippleWarp = (ridgeFieldA.rg - .5) * uSimulationTexel * 6.0;
    vec2 rippleUv = clamp(safeWaterUv + rippleWarp, uSimulationTexel, 1.0 - uSimulationTexel);
    vec4 simulationState = texture2D(uSimulation, rippleUv);
    float interactionEnergy = abs(simulationState.b) * 10.0 + abs(simulationState.a) * 6.0
      + length(simulationState.rg) * 55.0;
    float interactionMask = smoothstep(.022, .086, interactionEnergy) * patchMask;
    float tearField = ridgeFieldA.b * .58 + ridgeFieldB.a * .42;
    float tornPerimeter = smoothstep(.32, .61, tearField);
    float solidCore = smoothstep(.040, .12, interactionEnergy);
    interactionMask *= mix(.12 + tornPerimeter * .88, .72 + tornPerimeter * .28, solidCore);
    float simulationHeight = simulationState.b * interactionMask;
    float simulationVelocity = simulationState.a * interactionMask;
    vec2 simulationFlow = simulationState.rg * interactionMask;
    vec4 simulationLeftState = texture2D(uSimulation, rippleUv - vec2(uSimulationTexel.x, 0.0));
    vec4 simulationRightState = texture2D(uSimulation, rippleUv + vec2(uSimulationTexel.x, 0.0));
    vec4 simulationDownState = texture2D(uSimulation, rippleUv - vec2(0.0, uSimulationTexel.y));
    vec4 simulationUpState = texture2D(uSimulation, rippleUv + vec2(0.0, uSimulationTexel.y));
    float simulationLeft = simulationLeftState.b;
    float simulationRight = simulationRightState.b;
    float simulationDown = simulationDownState.b;
    float simulationUp = simulationUpState.b;
    vec2 simulationGradient = vec2(simulationLeft - simulationRight, simulationDown - simulationUp) * interactionMask;
    float simulationCurvature = abs(simulationLeft + simulationRight + simulationDown + simulationUp
      - 4.0 * simulationState.b) * interactionMask;
    float simulationShear = abs((simulationRightState.g - simulationLeftState.g)
      - (simulationUpState.r - simulationDownState.r)) * interactionMask;
    float ridgeMacro = ridgeFieldA.r;
    float ridgeDetail = ridgeFieldB.g;
    float ridgeComposite = ridgeMacro * .70 + ridgeDetail * .30;
    float opticalBreakup = smoothstep(.49, .60, tearField) * smoothstep(.42, .56, ridgeComposite);
    float normalVariation = 1.05 * smoothstep(.32, .62, ridgeComposite);
    float capillaryEdge = smoothstep(.00035, .0015, simulationCurvature);
    float refractionStrength = normalVariation * capillaryEdge * opticalBreakup;
    float flowRefraction = smoothstep(.00012, .00125, length(simulationFlow))
      * mix(.32, 1.0, tornPerimeter);
    normal = normalize(normal + vec3(
      simulationGradient.x * 5.0 * refractionStrength + simulationFlow.x * 3.0 * flowRefraction,
      0.0,
      -simulationGradient.y * 5.0 * refractionStrength - simulationFlow.y * 3.0 * flowRefraction
    ));

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 incident = -viewDirection;
    float viewDot = clamp(dot(viewDirection, normal), 0.0, 1.0);

    vec3 sunDirectionNight = normalize(vec3(.03, .19, -.98));
    vec3 sunDirectionDawn = normalize(vec3(-.22, .24, -.95));
    vec3 sunDirectionDusk = normalize(vec3(.18, .21, -.96));
    vec3 sunDirectionEmber = normalize(vec3(.04, .23, -.97));
    vec3 sunDirection;
    if (uMood < 1.0) sunDirection = normalize(mix(sunDirectionNight, sunDirectionDawn, uMood));
    else if (uMood < 2.0) sunDirection = normalize(mix(sunDirectionDawn, sunDirectionDusk, uMood - 1.0));
    else sunDirection = normalize(mix(sunDirectionDusk, sunDirectionEmber, uMood - 2.0));

    vec3 refractedDirection = refract(incident, normal, 1.0 / 1.333);
    float bedPlane = -.72;
    float travel = (bedPlane - vWorldPosition.y) / min(refractedDirection.y, -.001);
    vec3 bedPosition = vWorldPosition + refractedDirection * travel;
    vec2 bedUv = bedPosition.xz * vec2(.68, .63) + vec2(.373, .219);
    vec3 bedColor = sampleBed(bedUv);

    float pathLength = clamp(travel, .0, 16.0);
    float warmth = smoothstep(1.15, 2.85, uMood);
    vec3 coolAbsorption = vec3(.30, .135, .10);
    vec3 warmAbsorption = vec3(.20, .15, .125);
    vec3 absorption = mix(coolAbsorption, warmAbsorption, warmth);
    vec3 transmittance = exp(-absorption * pathLength * .92);
    vec3 waterBody = mix(vec3(.014,.061,.064), vec3(.14,.046,.026), warmth);
    vec3 transmitted = bedColor * transmittance + waterBody * (1.0 - transmittance);

    float farWater = smoothstep(8.0, 54.0, -vWorldPosition.z);
    float grazingHaze = smoothstep(.40, .94, 1.0 - viewDot);
    float bedFade = clamp(farWater * .70 + grazingHaze * .18, 0.0, .86);
    transmitted = mix(transmitted, waterBody, bedFade);

    vec3 reflectedDirection = reflect(incident, normal);
    vec3 reflection = skyColor(reflectedDirection, uMood);
    float fresnel = .022 + .978 * pow(1.0 - viewDot, 5.0);

    vec3 halfVector = normalize(viewDirection + sunDirection);
    float tightSpecular = pow(max(dot(normal, halfVector), 0.0), 740.0);
    float softSpecular = pow(max(dot(normal, halfVector), 0.0), 115.0) * .18;
    float distanceFade = 1.0 - smoothstep(70.0, 128.0, -vWorldPosition.z);
    float glintBandA = .5 + .5 * sin(vSurfacePosition.y * 18.5 + microX * 2.6 - uTime * .55);
    float glintBandB = .5 + .5 * sin(vSurfacePosition.y * 7.2 + vSurfacePosition.x * 1.8 + uTime * .27);
    float glintBreakup = smoothstep(.48, .9, glintBandA * glintBandB);
    float specular = (tightSpecular * .72 + softSpecular * .48) * (.025 + glintBreakup * .975) * distanceFade;
    vec3 sunColor = mix(vec3(.82,.90,.88), vec3(1.0,.36,.13), warmth);

    float pathWidth = .90 + clamp(-vWorldPosition.z, 0.0, 92.0) * .030;
    float pathCenter = sin(vSurfacePosition.y * .055 + uTime * .16) * .36
      + sin(vSurfacePosition.y * .17 - uTime * .22) * .13;
    float pathMask = exp(-pow(abs(vSurfacePosition.x - pathCenter) / pathWidth, 1.45));
    float pathBarsA = .5 + .5 * sin(vSurfacePosition.y * 2.75 + microX * 1.8 - uTime * .62);
    float pathBarsB = .5 + .5 * sin(vSurfacePosition.y * 7.4 - microZ * 1.2 + uTime * .34);
    float pathBreakup = smoothstep(.56, .91, pathBarsA * .72 + pathBarsB * .28);
    float pathGlint = pathMask * pathBreakup * (.18 + farWater * .34) * distanceFade;

    float ridgeBreakup = 1.24 * smoothstep(.36, .64, ridgeMacro * .72 + ridgeDetail * .28);
    float ridgeSignal = length(simulationGradient) * .45 + simulationCurvature * 2.8
      + simulationShear * .65 + length(simulationFlow) * .18 + abs(simulationVelocity) * .045;
    float sharpRidge = smoothstep(.00020, .00125, ridgeSignal) * interactionMask;
    float interactionGlint = sharpRidge * capillaryEdge * max(ridgeBreakup, 0.0)
      * opticalBreakup * (.12 + fresnel * .18);

    float opticalReflection = clamp(fresnel + farWater * .28 + grazingHaze * .08, 0.0, .96);
    vec3 color = mix(transmitted, reflection, opticalReflection);
    color += sunColor * (specular + pathGlint + interactionGlint);
    float troughBreakup = smoothstep(.46, .62, ridgeFieldA.b * .54 + ridgeFieldB.r * .46);
    float separatedTrough = smoothstep(.0030, .014, -simulationHeight)
      * interactionMask * mix(.05, 1.0, troughBreakup);
    float liftedCrest = smoothstep(.0020, .010, simulationHeight)
      * sharpRidge * capillaryEdge * mix(.08, 1.0, opticalBreakup);
    color *= 1.0 - separatedTrough * .42;
    color += sunColor * liftedCrest * (.075 + fresnel * .095);
    color = mix(color, skyColor(vec3(0.0,.05,-1.0), uMood), farWater * .38);

    float vignette = 1.0 - smoothstep(.24, .72, length(gl_FragCoord.xy / uResolution - .5));
    color *= .88 + vignette * .12;
    color += (hash21(gl_FragCoord.xy + fract(uTime) * 71.0) - .5) * .006;
    color = color / (color + vec3(.62));
    color = pow(max(color, 0.0), vec3(.92));
#ifdef INTERACTIVE_PATCH
    float liftedFragment = smoothstep(.0028, .011, simulationHeight);
    float fragmentBreakup = smoothstep(.50, .64, tearField)
      * smoothstep(.46, .60, ridgeComposite);
    float layerAlpha = liftedFragment * capillaryEdge * fragmentBreakup * patchMask;
    if (layerAlpha < .10) discard;
    gl_FragColor = vec4(color + sunColor * layerAlpha * .055, .34 + layerAlpha * .46);
#else
    gl_FragColor = vec4(color, 1.0);
#endif
  }
`

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: THREE.FrontSide,
})

const interactionMaterial = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  defines: { INTERACTIVE_PATCH: 1 },
  side: THREE.FrontSide,
  transparent: true,
  depthTest: true,
  depthWrite: false,
})

const water = new THREE.Mesh(new THREE.PlaneGeometry(WATER_WIDTH, WATER_LENGTH, 360, 480), material)
water.rotation.x = -Math.PI / 2
water.position.set(0, 0, -65)
scene.add(water)

const interactionWater = new THREE.Mesh(
  new THREE.PlaneGeometry(INTERACTION_PATCH_SIZE, INTERACTION_PATCH_SIZE, 320, 320),
  interactionMaterial,
)
interactionWater.rotation.x = -Math.PI / 2
interactionWater.position.set(0, .004, -8)
interactionWater.renderOrder = 2
interactionWater.visible = false
scene.add(interactionWater)

const SPRAY_PARTICLE_COUNT = 180
const sprayPositions = new Float32Array(SPRAY_PARTICLE_COUNT * 3)
const sprayLives = new Float32Array(SPRAY_PARTICLE_COUNT)
const spraySeeds = new Float32Array(SPRAY_PARTICLE_COUNT)
const spraySizes = new Float32Array(SPRAY_PARTICLE_COUNT)
const sprayParticles = Array.from({ length: SPRAY_PARTICLE_COUNT }, () => ({
  velocity: new THREE.Vector3(),
  remaining: 0,
  lifetime: 1,
}))
for (let index = 0; index < SPRAY_PARTICLE_COUNT; index += 1) {
  sprayPositions[index * 3 + 1] = -20
  spraySeeds[index] = Math.random()
  spraySizes[index] = .5
}

const sprayGeometry = new THREE.BufferGeometry()
sprayGeometry.setAttribute('position', new THREE.BufferAttribute(sprayPositions, 3))
sprayGeometry.setAttribute('aLife', new THREE.BufferAttribute(sprayLives, 1))
sprayGeometry.setAttribute('aSeed', new THREE.BufferAttribute(spraySeeds, 1))
sprayGeometry.setAttribute('aSize', new THREE.BufferAttribute(spraySizes, 1))

const sprayMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
  },
  vertexShader: /* glsl */`
    attribute float aLife;
    attribute float aSeed;
    attribute float aSize;
    uniform float uPixelRatio;
    varying float vLife;
    varying float vSeed;

    void main() {
      vLife = aLife;
      vSeed = aSeed;
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      float perspective = clamp(10.0 / max(-viewPosition.z, .1), .72, 2.0);
      gl_PointSize = (.65 + aSize * 1.75 + aLife * .85) * uPixelRatio * perspective;
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  fragmentShader: /* glsl */`
    precision highp float;
    varying float vLife;
    varying float vSeed;

    void main() {
      vec2 centered = gl_PointCoord - .5;
      float angle = vSeed * 6.2831853;
      mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 local = rotation * centered;
      local.x *= mix(1.25, 2.05, vSeed);
      local.y *= mix(.92, 1.18, fract(vSeed * 7.13));
      float distanceToCenter = length(local);
      float body = 1.0 - smoothstep(.22, .47, distanceToCenter);
      float highlight = smoothstep(.30, .0, length(local - vec2(-.10, .11))) * .08;
      float alpha = body * .38 * smoothstep(0.0, .16, vLife) * vLife;
      if (alpha < .01) discard;
      gl_FragColor = vec4(vec3(.38, .49, .50) + highlight, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.NormalBlending,
})

const sprayPoints = new THREE.Points(sprayGeometry, sprayMaterial)
sprayPoints.frustumCulled = false
sprayPoints.renderOrder = 3
scene.add(sprayPoints)

const MAX_WATER_LIP_SAMPLES = 9
const MAX_WATER_LIP_LENGTH = .52
const WATER_LIP_VERTICES_PER_SEGMENT = 30
const waterLipPositions = new Float32Array((MAX_WATER_LIP_SAMPLES - 1) * WATER_LIP_VERTICES_PER_SEGMENT * 3)
const waterLipLives = new Float32Array((MAX_WATER_LIP_SAMPLES - 1) * WATER_LIP_VERTICES_PER_SEGMENT)
const waterLipProfiles = new Float32Array((MAX_WATER_LIP_SAMPLES - 1) * WATER_LIP_VERTICES_PER_SEGMENT)
const waterLipAlong = new Float32Array((MAX_WATER_LIP_SAMPLES - 1) * WATER_LIP_VERTICES_PER_SEGMENT)
const waterLipSeeds = new Float32Array((MAX_WATER_LIP_SAMPLES - 1) * WATER_LIP_VERTICES_PER_SEGMENT)
const waterLipGeometry = new THREE.BufferGeometry()
waterLipGeometry.setAttribute('position', new THREE.BufferAttribute(waterLipPositions, 3))
waterLipGeometry.setAttribute('aLife', new THREE.BufferAttribute(waterLipLives, 1))
waterLipGeometry.setAttribute('aProfile', new THREE.BufferAttribute(waterLipProfiles, 1))
waterLipGeometry.setAttribute('aAlong', new THREE.BufferAttribute(waterLipAlong, 1))
waterLipGeometry.setAttribute('aSeed', new THREE.BufferAttribute(waterLipSeeds, 1))
waterLipGeometry.setDrawRange(0, 0)

const waterLipMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uBed: { value: bedTexture },
    uTime: uniforms.uTime,
    uMood: uniforms.uMood,
  },
  vertexShader: /* glsl */`
    attribute float aLife;
    attribute float aProfile;
    attribute float aAlong;
    attribute float aSeed;
    varying vec3 vWorldPosition;
    varying float vLife;
    varying float vProfile;
    varying float vAlong;
    varying float vSeed;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vLife = aLife;
      vProfile = aProfile;
      vAlong = aAlong;
      vSeed = aSeed;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: /* glsl */`
    precision highp float;
    uniform sampler2D uBed;
    uniform float uTime;
    uniform float uMood;
    varying vec3 vWorldPosition;
    varying float vLife;
    varying float vProfile;
    varying float vAlong;
    varying float vSeed;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
      if (normal.y < 0.0) normal *= -1.0;
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = .025 + .975 * pow(1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0), 4.0);
      float crest = smoothstep(.05, .82, vProfile);
      float longitudinalBreak = .5 + .5 * sin(vAlong * 57.0 + vSeed * 19.0);
      longitudinalBreak *= .62 + .38 * sin(vAlong * 23.0 - vSeed * 31.0);
      float shardMask = smoothstep(.13, .43, longitudinalBreak + hash21(vWorldPosition.xz * 31.0) * .22);
      float edgeFeather = smoothstep(.0, .16, vProfile) * smoothstep(.0, .18, 1.0 - vProfile);

      vec2 bedUv = vWorldPosition.xz * vec2(.68, .63) + vec2(.373, .219);
      vec3 bed = texture2D(uBed, bedUv + normal.xz * .008).rgb;
      float warmth = smoothstep(1.15, 2.85, uMood);
      vec3 waterTint = mix(vec3(.10, .18, .19), vec3(.32, .12, .055), warmth);
      vec3 color = mix(bed * .90, waterTint, .09 + fresnel * .28);
      vec3 halfVector = normalize(viewDirection + normalize(vec3(.08, .30, -.95)));
      float specular = pow(max(dot(normal, halfVector), 0.0), 150.0);
      color += mix(vec3(.72, .84, .84), vec3(1.0, .42, .16), warmth)
        * specular * (.32 + crest * .78);

      float lifeFade = smoothstep(.0, .18, vLife);
      float alpha = lifeFade * edgeFeather * shardMask * (.11 + fresnel * .34 + crest * .16);
      if (alpha < .035) discard;
      gl_FragColor = vec4(color, clamp(alpha, 0.0, .52));
    }
  `,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  side: THREE.DoubleSide,
})

const waterLips = new THREE.Mesh(waterLipGeometry, waterLipMaterial)
waterLips.frustumCulled = false
waterLips.renderOrder = 2
scene.add(waterLips)

const waterLipSamples = []
let waterLipPhase = 0

function waterLipRandom(seed, salt = 0) {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function emitWaterLip(hit, direction, shear, pressure, physicalRadius) {
  if (shear < .24 || direction.lengthSq() < .000001) return
  const activity = THREE.MathUtils.clamp(shear, 0, 1)
  const forward = new THREE.Vector3(direction.x, 0, -direction.y).normalize()
  const previous = waterLipSamples[waterLipSamples.length - 1]
  if (previous && previous.position.distanceToSquared(hit) < .00055) return
  waterLipPhase += .173 + Math.random() * .09
  const seed = waterLipPhase
  waterLipSamples.push({
    position: hit.clone(),
    forward,
    age: 0,
    lifetime: .32 + activity * .10 + Math.random() * .04,
    width: THREE.MathUtils.clamp(physicalRadius * (1.17 + activity * .13), .040, .098),
    lift: (.032 + pressure * .038 + shear * .034) * (.80 + Math.random() * .22),
    lateralOffset: (waterLipRandom(seed, 1) - .5) * physicalRadius * .42,
    leftWidth: .72 + waterLipRandom(seed, 2) * .48,
    rightWidth: .72 + waterLipRandom(seed, 3) * .48,
    leftLift: .68 + waterLipRandom(seed, 4) * .58,
    rightLift: .68 + waterLipRandom(seed, 5) * .58,
    collapseBias: waterLipRandom(seed, 6) - .5,
    drift: forward.clone().multiplyScalar(.035 + shear * .042),
    landed: false,
    impactStrength: .10 + pressure * .055,
    landingRadius: THREE.MathUtils.clamp(physicalRadius / INTERACTION_PATCH_SIZE * .42, .0042, .0072),
    seed,
  })
  if (waterLipSamples.length > MAX_WATER_LIP_SAMPLES) waterLipSamples.shift()
  let pathLength = 0
  for (let index = waterLipSamples.length - 1; index > 0; index -= 1) {
    pathLength += waterLipSamples[index].position.distanceTo(waterLipSamples[index - 1].position)
    if (pathLength > MAX_WATER_LIP_LENGTH) {
      waterLipSamples.splice(0, index)
      break
    }
  }
}

function writeWaterLipVertex(vertexIndex, point, life, profile, along, seed) {
  const offset = vertexIndex * 3
  waterLipPositions[offset] = point.x
  waterLipPositions[offset + 1] = point.y
  waterLipPositions[offset + 2] = point.z
  waterLipLives[vertexIndex] = life
  waterLipProfiles[vertexIndex] = profile
  waterLipAlong[vertexIndex] = along
  waterLipSeeds[vertexIndex] = seed
}

function updateWaterLips(deltaSeconds) {
  for (const sample of waterLipSamples) {
    sample.age += deltaSeconds
    sample.position.addScaledVector(sample.drift, deltaSeconds)
    sample.drift.multiplyScalar(Math.pow(.10, deltaSeconds))
    const progress = sample.age / sample.lifetime
    if (!sample.landed && progress > .76) {
      sample.landed = true
      const patchDistance = Math.hypot(
        sample.position.x - interactionCenter.x,
        sample.position.z - interactionCenter.y,
      )
      if (patchDistance < INTERACTION_PATCH_SIZE * .44) {
        const landingUv = interactionUvFromHit(sample.position, new THREE.Vector2())
        const landingDirection = new THREE.Vector2(sample.forward.x, -sample.forward.z).normalize()
        pendingImpulses.push({
          previous: landingUv.clone().addScaledVector(landingDirection, -.0025),
          pointer: landingUv,
          direction: landingDirection,
          strength: sample.impactStrength,
          spray: 0,
          radius: sample.landingRadius,
        })
        if (pendingImpulses.length > 24) pendingImpulses.splice(0, pendingImpulses.length - 24)
      }
    }
  }
  while (waterLipSamples.length && waterLipSamples[0].age >= waterLipSamples[0].lifetime) waterLipSamples.shift()

  let vertexIndex = 0
  const crossSection = (sample, sideSign, trailEnvelope) => {
    const progress = THREE.MathUtils.clamp(sample.age / sample.lifetime, 0, 1)
    const life = 1 - progress
    const rise = Math.pow(Math.sin(progress * Math.PI), .72)
    const baseSide = new THREE.Vector3(-sample.forward.z, 0, sample.forward.x)
    const side = baseSide.clone().multiplyScalar(sideSign)
    const sideWidth = sideSign < 0 ? sample.leftWidth : sample.rightWidth
    const sideLift = sideSign < 0 ? sample.leftLift : sample.rightLift
    const width = sample.width * sideWidth * trailEnvelope * (1 + progress * .16)
    const base = sample.position.clone().addScaledVector(baseSide, sample.lateralOffset)
    const collapse = sample.collapseBias * progress * progress * sample.width * .34
    const inner = base.clone().addScaledVector(side, width * .10 + collapse)
    const crest = base.clone().addScaledVector(side, width * .58 + collapse)
    const outer = base.clone().addScaledVector(side, width + collapse)
    const lift = rise * sample.lift * sideLift * trailEnvelope
    inner.y = .006 + lift * .10
    crest.y = .008 + lift
    outer.y = .005 + lift * .16
    return { inner, crest, outer, life }
  }
  const writeQuad = (a0, a1, b0, b1, lifeA, lifeB, profile0, profile1, alongA, alongB, seed) => {
    const vertices = [a0, b0, a1, a1, b0, b1]
    const lives = [lifeA, lifeA, lifeB, lifeB, lifeA, lifeB]
    const profiles = [profile0, profile1, profile0, profile0, profile1, profile1]
    const alongs = [alongA, alongA, alongB, alongB, alongA, alongB]
    for (let index = 0; index < 6; index += 1) {
      writeWaterLipVertex(vertexIndex, vertices[index], lives[index], profiles[index], alongs[index], seed)
      vertexIndex += 1
    }
  }

  for (let index = 0; index < waterLipSamples.length - 1; index += 1) {
    const sampleA = waterLipSamples[index]
    const sampleB = waterLipSamples[index + 1]
    if (sampleA.position.distanceTo(sampleB.position) > .22) continue
    const alongA = index / Math.max(waterLipSamples.length - 1, 1)
    const alongB = (index + 1) / Math.max(waterLipSamples.length - 1, 1)
    const envelopeA = .12 + .88 * Math.pow(Math.max(0, Math.sin(alongA * Math.PI)), .68)
    let envelopeB = .12 + .88 * Math.pow(Math.max(0, Math.sin(alongB * Math.PI)), .68)
    if (index + 1 === waterLipSamples.length - 1) envelopeB = Math.max(envelopeB, .38)
    const collapseProgress = Math.max(sampleA.age / sampleA.lifetime, sampleB.age / sampleB.lifetime)
    for (const sideSign of [-1, 1]) {
      const breakValue = waterLipRandom(sampleA.seed + index * .37, sideSign < 0 ? 11 : 17)
      if (breakValue < .08 + collapseProgress * .38) continue
      const a = crossSection(sampleA, sideSign, envelopeA)
      const b = crossSection(sampleB, sideSign, envelopeB)
      writeQuad(a.inner, b.inner, a.crest, b.crest, a.life, b.life, 0, 1, alongA, alongB, sampleA.seed)
      writeQuad(a.crest, b.crest, a.outer, b.outer, a.life, b.life, 1, 0, alongA, alongB, sampleA.seed)
    }
  }

  if (waterLipSamples.length) {
    const head = waterLipSamples[waterLipSamples.length - 1]
    const progress = THREE.MathUtils.clamp(head.age / head.lifetime, 0, 1)
    const life = 1 - progress
    const rise = Math.pow(Math.sin(progress * Math.PI), .72)
    const side = new THREE.Vector3(-head.forward.z, 0, head.forward.x)
    const width = head.width * (.54 + life * .18)
    const center = head.position.clone()
    const front = center.clone().addScaledVector(head.forward, width * .92)
    const back = center.clone().addScaledVector(head.forward, -width * .36)
    const left = center.clone().addScaledVector(side, width * .55)
    const right = center.clone().addScaledVector(side, -width * .47)
    front.y = .008 + rise * head.lift * .34
    back.y = .006 + rise * head.lift * .10
    left.y = .008 + rise * head.lift * .72
    right.y = .008 + rise * head.lift * .58
    const headVertices = [front, left, right, back, right, left]
    const headProfiles = [.18, .82, .78, .16, .78, .82]
    for (let index = 0; index < headVertices.length; index += 1) {
      writeWaterLipVertex(vertexIndex, headVertices[index], life, headProfiles[index], 1, head.seed + .41)
      vertexIndex += 1
    }
  }

  waterLipGeometry.setDrawRange(0, vertexIndex)
  waterLipGeometry.attributes.position.needsUpdate = true
  waterLipGeometry.attributes.aLife.needsUpdate = true
  waterLipGeometry.attributes.aProfile.needsUpdate = true
  waterLipGeometry.attributes.aAlong.needsUpdate = true
  waterLipGeometry.attributes.aSeed.needsUpdate = true
}

let nextSprayParticle = 0
let lastSprayEmissionTime = 0

function emitSpray(hit, direction, spray, force, physicalRadius) {
  const now = performance.now()
  if (spray < .34 || now - lastSprayEmissionTime < 34) return
  lastSprayEmissionTime = now
  const particleCount = Math.min(3, Math.max(1, Math.floor((spray - .18) * 3.2 + Math.random())))
  const forward = new THREE.Vector3(direction.x, 0, -direction.y).normalize()
  const side = new THREE.Vector3(-forward.z, 0, forward.x)

  for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
    const index = nextSprayParticle
    nextSprayParticle = (nextSprayParticle + 1) % SPRAY_PARTICLE_COUNT
    const particle = sprayParticles[index]
    const sideJitter = (Math.random() - .5) * physicalRadius * 2.2
    const forwardJitter = (Math.random() - .5) * physicalRadius * .55
    const speed = .08 + force * .19 + Math.random() * .09
    const verticalSpeed = .055 + spray * .20 + Math.random() * .08

    sprayPositions[index * 3] = hit.x + side.x * sideJitter + forward.x * forwardJitter
    sprayPositions[index * 3 + 1] = .018 + Math.random() * .014
    sprayPositions[index * 3 + 2] = hit.z + side.z * sideJitter + forward.z * forwardJitter
    particle.velocity.copy(forward).multiplyScalar(speed)
    particle.velocity.addScaledVector(side, (Math.random() - .5) * speed * 1.15)
    particle.velocity.y = verticalSpeed
    particle.lifetime = .22 + spray * .12 + Math.random() * .08
    particle.remaining = particle.lifetime
    sprayLives[index] = 1
    spraySeeds[index] = Math.random()
    spraySizes[index] = .24 + Math.random() * .62
  }

  sprayGeometry.attributes.position.needsUpdate = true
  sprayGeometry.attributes.aLife.needsUpdate = true
  sprayGeometry.attributes.aSeed.needsUpdate = true
  sprayGeometry.attributes.aSize.needsUpdate = true
}

function updateSpray(deltaSeconds) {
  let changed = false
  for (let index = 0; index < SPRAY_PARTICLE_COUNT; index += 1) {
    const particle = sprayParticles[index]
    if (particle.remaining <= 0) continue
    particle.remaining -= deltaSeconds
    if (particle.remaining <= 0) {
      sprayLives[index] = 0
      sprayPositions[index * 3 + 1] = -20
      changed = true
      continue
    }

    const offset = index * 3
    particle.velocity.y -= .52 * deltaSeconds
    const horizontalDrag = Math.pow(.24, deltaSeconds)
    particle.velocity.x *= horizontalDrag
    particle.velocity.z *= horizontalDrag
    sprayPositions[offset] += particle.velocity.x * deltaSeconds
    sprayPositions[offset + 1] += particle.velocity.y * deltaSeconds
    sprayPositions[offset + 2] += particle.velocity.z * deltaSeconds
    sprayLives[index] = THREE.MathUtils.clamp(particle.remaining / particle.lifetime, 0, 1)
    changed = true
  }

  if (changed) {
    sprayGeometry.attributes.position.needsUpdate = true
    sprayGeometry.attributes.aLife.needsUpdate = true
  }
}

const raycaster = new THREE.Raycaster()
const pointerNdc = new THREE.Vector2()
const clock = new THREE.Clock()
const cursor = document.querySelector('.cursor-orbit')
let pointerX = window.innerWidth * .5
let pointerY = window.innerHeight * .5
let moodTarget = 0
let cameraTargetX = 0
let cameraTargetY = 1.28
let pointerIsDown = false
let hasPointerSample = false
let lastPointerTimestamp = performance.now()
let lastPointerClientX = pointerX
let lastPointerClientY = pointerY
let lastPointerSpeed = 0
const pendingImpulses = []
let previousFrameTime = 0
const lastWaterUv = new THREE.Vector2(.5, .5)
const nextWaterUv = new THREE.Vector2(.5, .5)
const pointerDirection = new THREE.Vector2(0, -1)
const interactionCenter = uniforms.uInteractionCenter.value
let interactionPatchInitialized = false

function intersectWater(clientX, clientY) {
  pointerNdc.set(clientX / window.innerWidth * 2 - 1, -(clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointerNdc, camera)
  const hit = raycaster.intersectObject(water, false)[0]
  return hit?.point ?? null
}

function interactionUvFromHit(hit, target) {
  target.set(
    THREE.MathUtils.clamp((hit.x - interactionCenter.x) / INTERACTION_PATCH_SIZE + .5, 0, 1),
    THREE.MathUtils.clamp(.5 - (hit.z - interactionCenter.y) / INTERACTION_PATCH_SIZE, 0, 1),
  )
  return target
}

function resetInteractionPatch(hit) {
  const preserveImpact = interactionPatchInitialized
  interactionCenter.set(hit.x, hit.z)
  interactionWater.position.set(hit.x, .004, hit.z)
  interactionWater.visible = false
  clearSimulationState()
  pendingImpulses.length = 0
  lastWaterUv.set(.5, .5)
  nextWaterUv.set(.5, .5)
  hasPointerSample = false
  lastPointerSpeed = 0
  if (preserveImpact) {
    pendingImpulses.push({
      previous: new THREE.Vector2(.492, .5),
      pointer: new THREE.Vector2(.508, .5),
      direction: new THREE.Vector2(1, 0),
      strength: .065,
      spray: 0,
      radius: .011,
    })
  }
  interactionPatchInitialized = true
}

function normalizedRange(value, minimum, maximum) {
  const normalized = THREE.MathUtils.clamp((value - minimum) / (maximum - minimum), 0, 1)
  return normalized * normalized * (3 - 2 * normalized)
}

function setPointer(clientX, clientY) {
  pointerX = clientX
  pointerY = clientY
  const hit = intersectWater(clientX, clientY)
  if (hit) {
    const distanceFromPatchCenter = Math.hypot(hit.x - interactionCenter.x, hit.z - interactionCenter.y)
    if (!interactionPatchInitialized || distanceFromPatchCenter > INTERACTION_PATCH_SIZE * .46) {
      resetInteractionPatch(hit)
    }
    interactionUvFromHit(hit, nextWaterUv)
    const now = performance.now()
    if (hasPointerSample) {
      const deltaSeconds = THREE.MathUtils.clamp((now - lastPointerTimestamp) / 1000, 1 / 240, .08)
      const screenDistance = Math.hypot(clientX - lastPointerClientX, clientY - lastPointerClientY)
      const screenSpeed = screenDistance / deltaSeconds
      const acceleration = Math.abs(screenSpeed - lastPointerSpeed) / deltaSeconds
      pointerDirection.copy(nextWaterUv).sub(lastWaterUv)

      if (pointerDirection.lengthSq() > .00000001 && screenDistance > .35) {
        const segmentLength = pointerDirection.length()
        pointerDirection.normalize()
        const speedForce = normalizedRange(screenSpeed, 18, 1150)
        const accelerationForce = lastPointerSpeed > 0 ? normalizedRange(acceleration, 700, 9500) : 0
        const pressBoost = pointerIsDown ? 1.26 : 1
        const pressureForce = (.30 + speedForce * .72 + accelerationForce * .16) * pressBoost
        const shearForce = (.20 + speedForce * .92 + accelerationForce * .30) * pressBoost
        const spray = THREE.MathUtils.clamp(speedForce * .42 + accelerationForce * .92 - .38, 0, 1)
        exciteReactiveAudio(pressureForce, shearForce, spray, clientX)
        const screenDepthScale = THREE.MathUtils.lerp(1, .5, THREE.MathUtils.clamp(clientY / window.innerHeight, 0, 1))
        const limitedSegmentLength = Math.min(segmentLength, .042 * screenDepthScale)
        const sampleSpacing = .0085 * screenDepthScale
        const sampleCount = THREE.MathUtils.clamp(Math.ceil(limitedSegmentLength / sampleSpacing), 1, 6)
        const segmentStart = nextWaterUv.clone().addScaledVector(pointerDirection, -limitedSegmentLength)
        const stampStrength = Math.min(pressureForce * (1.12 / Math.sqrt(sampleCount)), 1.46)
        const stampRadius = (.010 + speedForce * .011 + (pointerIsDown ? .002 : 0)) * screenDepthScale
        emitSpray(hit, pointerDirection, spray, shearForce, stampRadius * INTERACTION_PATCH_SIZE)
        emitWaterLip(hit, pointerDirection, shearForce, pressureForce, stampRadius * INTERACTION_PATCH_SIZE)

        for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
          const previousT = sampleIndex / sampleCount
          const currentT = (sampleIndex + 1) / sampleCount
          pendingImpulses.push({
            previous: segmentStart.clone().lerp(nextWaterUv, previousT),
            pointer: segmentStart.clone().lerp(nextWaterUv, currentT),
            direction: pointerDirection.clone(),
            strength: stampStrength,
            spray,
            radius: stampRadius,
          })
        }
        if (pendingImpulses.length > 24) pendingImpulses.splice(0, pendingImpulses.length - 24)
      }
      lastPointerSpeed = screenSpeed
    }
    lastWaterUv.copy(nextWaterUv)
    lastPointerTimestamp = now
    lastPointerClientX = clientX
    lastPointerClientY = clientY
    hasPointerSample = true
  }
}

window.addEventListener('pointermove', (event) => setPointer(event.clientX, event.clientY))
window.addEventListener('pointerdown', (event) => {
  pointerIsDown = true
  setPointer(event.clientX, event.clientY)
  cursor.classList.add('is-active')
})
window.addEventListener('pointerup', () => {
  pointerIsDown = false
  cursor.classList.remove('is-active')
})
window.addEventListener('pointerleave', () => {
  pointerIsDown = false
  hasPointerSample = false
  lastPointerSpeed = 0
})

const moods = [
  { name: 'midnight blue', time: '10:14 pm', eyebrow: 'night current', title: 'Follow the light', caption: 'A still surface is never truly still.' },
  { name: 'first silver', time: '05:42 am', eyebrow: 'first light', title: 'The water wakes', caption: 'Cold air, pale stone, a line of morning.' },
  { name: 'soft dusk', time: '06:27 pm', eyebrow: 'evening tide', title: 'Hold the horizon', caption: 'Every reflection belongs to two places.' },
  { name: 'copper afterglow', time: '07:11 pm', eyebrow: 'last warmth', title: 'Stay until amber', caption: 'The day leaves slowly across the surface.' },
]

const moodButtons = [...document.querySelectorAll('[data-mood]')]
const moodWheel = document.querySelector('.mood-wheel')
const centerCopy = document.querySelector('.center-copy')

function updateMoodWheel(index) {
  moodButtons.forEach((button, buttonIndex) => {
    let slot = (buttonIndex - index + moods.length) % moods.length
    if (slot >= moods.length / 2) slot -= moods.length
    button.style.setProperty('--slot', slot)
    button.dataset.distance = String(Math.abs(slot))
    button.setAttribute('aria-selected', String(buttonIndex === index))
    button.tabIndex = buttonIndex === index ? 0 : -1
  })
}

function selectMood(index) {
  const mood = moods[index]
  moodTarget = index
  updateMoodWheel(index)
  document.querySelector('#light-name').textContent = mood.name
  document.querySelector('#scene-clock').textContent = mood.time
  document.querySelector('#scene-eyebrow').textContent = mood.eyebrow
  document.querySelector('#scene-title').textContent = mood.title
  document.querySelector('#scene-caption').textContent = mood.caption
  centerCopy.classList.remove('is-changing')
  void centerCopy.offsetWidth
  centerCopy.classList.add('is-changing')
}

moodButtons.forEach((button) => button.addEventListener('click', () => selectMood(Number(button.dataset.mood))))
moodWheel.addEventListener('wheel', (event) => {
  event.preventDefault()
  const direction = Math.sign(event.deltaY || event.deltaX)
  if (direction === 0) return
  selectMood((moodTarget + direction + moods.length) % moods.length)
}, { passive: false })
moodWheel.addEventListener('keydown', (event) => {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  if (event.key === 'Home') selectMood(0)
  else if (event.key === 'End') selectMood(moods.length - 1)
  else selectMood((moodTarget + (event.key === 'ArrowDown' ? 1 : -1) + moods.length) % moods.length)
})
updateMoodWheel(0)
window.addEventListener('keydown', (event) => {
  const index = Number(event.key) - 1
  if (index >= 0 && index < moods.length) selectMood(index)
})

const soundtrack = document.querySelector('#soundtrack')
const soundToggle = document.querySelector('.sound-toggle')
const soundLabel = document.querySelector('.sound-label')
soundtrack.volume = .58

let audioContext = null
let waterFilter = null
let waterPanner = null
let waterDirectGain = null
let waterDelay = null
let waterWetGain = null
let waterAudioEnergy = 0
let waterAudioEnergyTarget = 0
let waterAudioBurst = 0
let waterAudioBurstTarget = 0
let waterAudioPan = 0
let waterAudioPanTarget = 0

function setupReactiveAudio() {
  if (audioContext) return audioContext
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  audioContext = new AudioContextClass()
  const source = audioContext.createMediaElementSource(soundtrack)
  waterFilter = audioContext.createBiquadFilter()
  waterFilter.type = 'lowpass'
  waterFilter.frequency.value = 1350
  waterFilter.Q.value = .72
  waterPanner = audioContext.createStereoPanner()
  waterDirectGain = audioContext.createGain()
  waterDirectGain.gain.value = .90
  waterDelay = audioContext.createDelay(.5)
  waterDelay.delayTime.value = .165
  const feedback = audioContext.createGain()
  feedback.gain.value = .17
  waterWetGain = audioContext.createGain()
  waterWetGain.gain.value = .025
  const compressor = audioContext.createDynamicsCompressor()
  compressor.threshold.value = -17
  compressor.knee.value = 17
  compressor.ratio.value = 3
  compressor.attack.value = .012
  compressor.release.value = .24

  source.connect(waterFilter)
  waterFilter.connect(waterPanner)
  waterPanner.connect(waterDirectGain)
  waterDirectGain.connect(compressor)
  waterPanner.connect(waterDelay)
  waterDelay.connect(feedback)
  feedback.connect(waterDelay)
  waterDelay.connect(waterWetGain)
  waterWetGain.connect(compressor)
  compressor.connect(audioContext.destination)
  soundToggle.dataset.reactiveAudio = 'ready'
  return audioContext
}

function exciteReactiveAudio(pressure, shear, burst, clientX) {
  const energy = THREE.MathUtils.clamp(pressure * .26 + shear * .46 + burst * .42 - .15, 0, 1)
  waterAudioEnergyTarget = Math.max(waterAudioEnergyTarget, energy)
  waterAudioBurstTarget = Math.max(waterAudioBurstTarget, burst)
  waterAudioPanTarget = THREE.MathUtils.clamp((clientX / window.innerWidth * 2 - 1) * .34, -.34, .34)
  soundToggle.dataset.lastWaterEnergy = energy.toFixed(3)
}

function updateReactiveAudio(deltaSeconds) {
  waterAudioEnergyTarget *= Math.pow(.075, deltaSeconds)
  waterAudioBurstTarget *= Math.pow(.025, deltaSeconds)
  const response = 1 - Math.pow(.0008, deltaSeconds)
  waterAudioEnergy += (waterAudioEnergyTarget - waterAudioEnergy) * response
  waterAudioBurst += (waterAudioBurstTarget - waterAudioBurst) * response
  waterAudioPan += (waterAudioPanTarget - waterAudioPan) * (1 - Math.pow(.018, deltaSeconds))
  if (!audioContext || !waterFilter) return
  const now = audioContext.currentTime
  const cutoff = 1250 + Math.pow(waterAudioEnergy, .68) * 4700
  waterFilter.frequency.setTargetAtTime(cutoff, now, .045)
  waterFilter.Q.setTargetAtTime(.72 + waterAudioBurst * 1.65, now, .055)
  waterDirectGain.gain.setTargetAtTime(.88 + waterAudioEnergy * .12, now, .06)
  waterWetGain.gain.setTargetAtTime(.022 + waterAudioBurst * .105, now, .08)
  waterDelay.delayTime.setTargetAtTime(.165 - waterAudioEnergy * .045, now, .08)
  waterPanner.pan.setTargetAtTime(waterAudioPan, now, .075)
}

soundToggle.addEventListener('click', async () => {
  if (soundtrack.paused) {
    try {
      const context = setupReactiveAudio()
      if (context?.state === 'suspended') await context.resume()
      await soundtrack.play()
      soundToggle.setAttribute('aria-pressed', 'true')
      soundLabel.textContent = 'sound off'
    } catch {
      soundLabel.textContent = 'tap again'
    }
  } else {
    soundtrack.pause()
    soundToggle.setAttribute('aria-pressed', 'false')
    soundLabel.textContent = 'sound on'
  }
})

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', resize)

function render() {
  const elapsed = clock.getElapsedTime()
  const deltaSeconds = previousFrameTime === 0 ? 1 / 60 : Math.min(elapsed - previousFrameTime, 1 / 20)
  previousFrameTime = elapsed

  const simulationFrameScale = THREE.MathUtils.clamp(deltaSeconds * 60, .35, 1.15) / SIMULATION_SUBSTEPS
  updateSpray(deltaSeconds)
  updateWaterLips(deltaSeconds)
  updateReactiveAudio(deltaSeconds)
  for (let step = 0; step < SIMULATION_SUBSTEPS; step += 1) {
    const impulse = pendingImpulses.shift()
    simulationUniforms.uPreviousState.value = simulationRead.texture
    if (impulse) {
      simulationUniforms.uPreviousPointer.value.copy(impulse.previous)
      simulationUniforms.uPointer.value.copy(impulse.pointer)
      simulationUniforms.uDirection.value.copy(impulse.direction)
      simulationUniforms.uStrength.value = impulse.strength
      simulationUniforms.uSpray.value = impulse.spray
      simulationUniforms.uRadius.value = impulse.radius
    } else {
      simulationUniforms.uStrength.value = 0
      simulationUniforms.uSpray.value = 0
    }
    simulationUniforms.uFrameScale.value = simulationFrameScale
    renderer.setRenderTarget(simulationWrite)
    renderer.render(simulationScene, simulationCamera)
    const completedSimulation = simulationWrite
    simulationWrite = simulationRead
    simulationRead = completedSimulation
  }
  renderer.setRenderTarget(null)
  uniforms.uSimulation.value = simulationRead.texture

  uniforms.uTime.value = elapsed
  uniforms.uMood.value += (moodTarget - uniforms.uMood.value) * .022
  camera.position.x += (cameraTargetX - camera.position.x) * .025
  camera.position.y += (cameraTargetY - camera.position.y) * .025
  camera.lookAt(cameraLook)
  const orbit = 5 + Math.sin(elapsed * 1.8) * 2
  cursor.style.transform = `translate3d(${pointerX - 17}px, ${pointerY - 17}px, 0) rotate(${orbit}deg)`
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()
