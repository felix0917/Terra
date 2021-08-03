## Terra

![index](./assets/readme/index.gif)

基于Three.js实现的数字地球，支持大地坐标系（经纬度）数据的加载

### Usage

```js
import Terra from './src/index.js'   

let earth = new Terra.Earth({
    cloud: false,
    galaxy: true,
    rotation: true,
});

let data = [];
axios.get('./assets/json/china-point.json').then(res => {
    let rs = res.data;
    for (let i = 0; i < rs[0].length; i++) {
        let geoCoord = rs[0][i].geoCoord;
        data.push(geoCoord);
    }

    let points = new Terra.Point({
        dataset: data,
        size: 0.4,
        shape: 'circle'
    });

    earth.addFeature(points)
})
```

