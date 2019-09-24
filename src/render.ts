import * as THREE from 'three'

import { Point } from './point'
import { Directions } from './directions'

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
const snakeHeadgeometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize/2)
const snakeHeadmaterial = new THREE.MeshBasicMaterial({ color: 0x44DD88 })  // greenish blue
const snakeHeadElement = new THREE.Mesh(snakeHeadgeometry, snakeHeadmaterial)
scene.add(snakeHeadElement)
/////////////////////////////////////

// Create seed element
const seedSize = sideSize * 0.8
const seedGeometry = new THREE.BoxGeometry(seedSize, seedSize, seedSize/2)
const seedMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const seedElement = new THREE.Mesh(seedGeometry, seedMaterial)
scene.add(seedElement)
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

const tailSideSize = sideSize * 0.9
const snakeTailgeometry = new THREE.BoxGeometry(tailSideSize, tailSideSize, tailSideSize/2)
const snakeTailMaterial = new THREE.MeshBasicMaterial({ color: 0x44aa88 })

function addTailElement() {
    const snakeNewTailSegment = new THREE.Mesh(snakeTailgeometry, snakeTailMaterial)
    tailElements.push(snakeNewTailSegment)
    scene.add(snakeNewTailSegment)
}

export function render(
    snakeHeadCoordinate: Point,
    tail: Directions[],
    seedCoordinate: Point,
) {
    while (tail.length !== tailElements.length) {
        addTailElement()
    }

    camera.updateProjectionMatrix()
    snakeHeadElement.position.x = snakeHeadCoordinate.x * sideSize
    snakeHeadElement.position.y = snakeHeadCoordinate.y * sideSize
    let prevPos = snakeHeadElement.position
    tail.forEach((direction, i) => {
        let curElement = tailElements[i]
        curElement.position.x = prevPos.x
        curElement.position.y = prevPos.y
        switch (direction) {
            case Directions.UP:
                curElement.position.y--
            break
            case Directions.DOWN:
                curElement.position.y++
            break
            case Directions.LEFT:
                curElement.position.x++
            break
            case Directions.RIGHT:
                curElement.position.x--
            break
        }
        prevPos = curElement.position
    })

    seedElement.position.x = seedCoordinate.x
    seedElement.position.y = seedCoordinate.y

    renderer.render(scene, camera)
}
