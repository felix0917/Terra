import * as THREE from '../../thirdparty/threejs/three.module.js'
import { OrbitControls } from '../../thirdparty/threejs/jsm/controls/OrbitControls.js';
import defaultValue from '../utils/defaultValue.js'
import EarthParam from '../constant/EarthParam.js'
import FeatureType from '../core/feature/FeatureType.js'
import Event from '../utils/Event.js';

const { EARTH_RADIUS, GALAXY_DISTANCE, SHRINK_SCALE } = EarthParam;

const earth_img = '../../assets/earth/earth2.jpg';
const galaxy_img = '../../assets/earth/galaxy.png';
const cloud_img = '../../assets/earth/cloud.jpg';

class Earth extends Event {
    constructor(options = {}) {
        super()

        /**
         * earth rotation or not
         */
        this.rotation = defaultValue(options.rotation, false);

        /**
         * load galaxy or not
         */
        this.galaxy = defaultValue(options.galaxy, true);

        /**
         * load cloud or not
         */
        this.cloud = defaultValue(options.cloud, false);

        /**
         * for debugger:The colors R, G, and B indicate the X, Y, and Z axes, respectively
         */
        this.showAxes = defaultValue(options.showAxes, false);

        /**
         * features meshes collection
         */
        this.featureMeshes = [];

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Renderer
            this.initRender();

            // Scene
            this.initScene();

            // Camera
            this.initCamera();

            // AmbientLight
            this.initLight();

            // Earth
            this.initEarth();

            // Controls
            this.initControls();

            this.onWindowResize();

            this.animate();
        })
    }

    initRender() {
        this.container = document.getElementById('terra-container');
        this.container.setAttribute('style', `
            border: none;
            cursor: pointer;
            width: 100%;
            height: 100vh;
            background-color: #EEEEEE;
        `)
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.renderer
        });

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, 1.0);
    }

    initScene() {
        this.scene = new THREE.Scene();

        if (this.showAxes) {
            let axesHelper = new THREE.AxesHelper(20);
            this.scene.add(axesHelper);
        }

        this.fire('scene.loaded');
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 31;
        this.camera.lookAt({ x: 0, y: 0, z: 0 });
    }

    initLight() {
        this.light = new THREE.AmbientLight(0xFFFFFF);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
    }

    initEarth() {
        let earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS * SHRINK_SCALE, 40, 30);
        let earthMater = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(earth_img),
            side: THREE.DoubleSide
        });

        this.earthMesh = new THREE.Mesh(earthGeometry, earthMater);
        this.earthMesh.rotation.y = -(Math.PI / 2).toFixed(2);
        this.scene.add(this.earthMesh);

        // galaxy
        if (this.galaxy) {
            let galaxy = this.createGalaxy();
            this.scene.add(galaxy);
        }

        // cloud
        if (this.cloud) {
            let cloud = this.createCloud();
            this.scene.add(cloud);
        }
    }

    createGalaxy() {
        let geometry = new THREE.SphereGeometry(GALAXY_DISTANCE * SHRINK_SCALE, 40, 30);
        let texture = new THREE.TextureLoader().load(galaxy_img);
        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });

        this.galaxyMesh = new THREE.Mesh(geometry, material);
        return this.galaxyMesh;
    }

    createCloud() {
        let geometry = new THREE.SphereGeometry(EARTH_RADIUS * SHRINK_SCALE + 0.2, 40, 30);
        let material = new THREE.MeshPhongMaterial({
            alphaMap: new THREE.TextureLoader().load(cloud_img),
            transparent: true,
            opacity: 0.2
        });

        this.cloudsMesh = new THREE.Mesh(geometry, material);
        return this.cloudsMesh;
    }

    initControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.renderer.clear();
    }

    onWindowResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        this.orbitControls.update();

        if (this.rotation) {
            this.earthMesh && (this.earthMesh.rotation.y -= 0.0015);

            this.cloudsMesh && (this.cloudsMesh.rotation.y -= 0.003);

            this.updateMeshs();
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    updateMeshs() {
        this.featureMeshes.forEach(mesh => {
            mesh.rotation.y -= 0.0015;
        })
    }

    addFeature(feature) {
        let featureType = feature.type;
        switch (featureType) {
            case FeatureType.POINT:
                this.addPoint(feature);
                break;
            case FeatureType.VOLUME:
                this.addVolume(feature);
                break;
        }
    }

    addPoint(feature) {
        // this.on('scene.loaded', () => {
        this.scene.add(feature.mesh);
        this.featureMeshes.push(feature.mesh);
        // })
    }

    addVolume(feature) {
        this.scene.add(feature.objects);
    }
}

export default Earth;