/// <reference types="vite/client" />

// 3Dmol.js type declarations
declare module '3dmol' {
  export function createViewer(element: HTMLElement, options?: ViewerOptions): Viewer
  export const SurfaceType: {
    VDW: string
    SAS: string
    MS: string
    SES: string
  }

  interface ViewerOptions {
    backgroundColor?: string
    antialias?: boolean
    id?: string
  }

  interface Viewer {
    addModel(data: string, format: string): Model
    setStyle(sel: object, style: object): void
    addSurface(type: string, style: object): void
    zoomTo(): void
    render(): void
    spin(axis: string | boolean, speed?: number): void
    zoom(factor: number): void
    rotate(angle: number, axis?: string): void
    center(sel?: object): void
    clear(): void
  }

  interface Model {
    setStyle(style: object): void
  }
}
