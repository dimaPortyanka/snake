import * as THREE from 'three'

import { Point } from './point'

const canvas = document.querySelector('.playground') as HTMLCanvasElement
const { width, height } = canvas.getBoundingClientRect()
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(width, height)

// Define camera params
const fov = 50
const aspect = width / height
const near = 1
const far = 30
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 20
/////////////////////////////////////

const visibleHeight = 2 * camera.position.z * Math.tan(fov * 0.5 * (Math.PI / 180))
const visibleWidth = visibleHeight*aspect

const scene = new THREE.Scene()
scene.background = new THREE.Color('white')

// Add light to the scene
const color = 0xF9D71C
const intensity = 0.8

const light = new THREE.DirectionalLight(color, intensity)
light.position.set(0, 0, 20)

scene.add(light)
/////////////////////////////////////

// Create snake head element
const sideSize = 1
const snakeHeadgeometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize/4)
const snakeHeadmaterial = new THREE.MeshBasicMaterial({ color: 0x44DD88 })  // greenish blue
const snakeHeadElement = new THREE.Mesh(snakeHeadgeometry, snakeHeadmaterial)
scene.add(snakeHeadElement)
/////////////////////////////////////

// Create seed element
const seedSize = sideSize * 0.8
const seedGeometry = new THREE.BoxGeometry(seedSize, seedSize, seedSize/4)
const seedMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const seedElement = new THREE.Mesh(seedGeometry, seedMaterial)
scene.add(seedElement)
/////////////////////////////////////

// Create borders
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
const borderHorizontalGeometry = new THREE.BoxGeometry(
    1,
    visibleHeight,
    1,
)
const borderVerticalGeometry = new THREE.BoxGeometry(
    visibleWidth,
    1,
    1,
)
const borderHorizontal1 = new THREE.Mesh(
    borderHorizontalGeometry,
    borderMaterial,
)

borderHorizontal1.position.x = -visibleWidth / 2
borderHorizontal1.position.y = 0
scene.add(borderHorizontal1)

const borderHorizontal2 = new THREE.Mesh(
    borderHorizontalGeometry,
    borderMaterial,
)
borderHorizontal2.position.x = visibleWidth/2
borderHorizontal2.position.y = 0
scene.add(borderHorizontal2)

const borderVertical1 = new THREE.Mesh(
    borderVerticalGeometry,
    borderMaterial,
)
borderVertical1.position.x = 0
borderVertical1.position.y = visibleHeight / 2
scene.add(borderVertical1)

const borderVertical2 = new THREE.Mesh(
    borderVerticalGeometry,
    borderMaterial,
)
borderVertical2.position.x = 0
borderVertical2.position.y = -visibleHeight/2
scene.add(borderVertical2)

/////////////////////////////////////

export function init(): {
    visibleHeight: number,
    visibleWidth: number,
} {
    return {
        visibleHeight: Math.floor(visibleHeight),
        visibleWidth: Math.floor(visibleWidth),
    }
}

let tailElements: THREE.Mesh[] = []

const tailSideSize = sideSize * 0.8
const snakeTailgeometry = new THREE.BoxGeometry(tailSideSize, tailSideSize, tailSideSize/4)
const snakeTailMaterial = new THREE.MeshBasicMaterial({ color: 0x44aa88 })

function addTailElement() {
    const snakeNewTailSegment = new THREE.Mesh(snakeTailgeometry, snakeTailMaterial)
    tailElements.push(snakeNewTailSegment)
    scene.add(snakeNewTailSegment)
}

export function render(
    snakeHeadCoordinate: Point,
    tail: Point[],
    seedCoordinate: Point,
) {
    while (tail.length !== tailElements.length) {
        addTailElement()
    }

    camera.updateProjectionMatrix()
    snakeHeadElement.position.x = snakeHeadCoordinate.x * sideSize
    snakeHeadElement.position.y = snakeHeadCoordinate.y * sideSize
    tail.forEach((tailSegment, i) => {
        tailElements[i].position.x = tailSegment.x
        tailElements[i].position.y = tailSegment.y
    })

    seedElement.position.x = seedCoordinate.x
    seedElement.position.y = seedCoordinate.y

    renderer.render(scene, camera)
}
