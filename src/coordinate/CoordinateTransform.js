import EarthParam from '../constant/EarthParam.js'
import * as THREE from '../../thirdparty/threejs/three.module.js'

const { EARTH_RADIUS, SHRINK_SCALE } = EarthParam;

class CoordinateTransform {
    /**
     * 大地坐标系转空间直角坐标系
     */
    static cartographicToXYZ = (lat, lng, alt = 0) => {
        let lat_degree = THREE.Math.degToRad(lat);
        let lng_degree = THREE.Math.degToRad(lng);

        let distance = (EARTH_RADIUS + alt) * SHRINK_SCALE;
        let projectionDist = distance * Math.cos(lng_degree);

        let point = new THREE.Vector3();
        point.x = projectionDist * Math.sin(lat_degree);
        point.y = distance * Math.sin(lng_degree);
        point.z = projectionDist * Math.cos(lat_degree);

        return point;
    }
}

export default CoordinateTransform;