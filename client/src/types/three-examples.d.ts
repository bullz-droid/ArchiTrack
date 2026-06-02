declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, Vector2 } from 'three'

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement: HTMLElement)
    readonly domElement: HTMLElement
    enabled: boolean
    target: Vector2
    enableZoom: boolean
    enablePan: boolean
    autoRotate: boolean
    autoRotateSpeed: number
    update(): boolean
    dispose(): void
  }
}
