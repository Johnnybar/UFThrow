import * as THREE from 'three';
import DragControls from 'drag-controls';
DragControls.install({
    THREE: THREE
});

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
var objects = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 1000;

function init() {
    scene.add(new THREE.AmbientLight(0x0f0f0f));

    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);

    scene.add(light);

    // var geometry = new THREE.BoxGeometry(40, 40, 40);
    var points = [];

    for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(10 + Math.sin(i * 0.7) * 30, i * 2));
    }

    var geometry = new THREE.LatheGeometry(points);
    var sphereGeometry = new THREE.SphereGeometry(40, 40, 40);

    // for (var i = 0; i < 50; i++) {
    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
    }));
    var target = new THREE.Mesh(sphereGeometry, new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff
    }));

    target.position.x = 800;
    const targetStartPos = target.position.x;
    target.castShadow = true;
    target.receiveShadow = true;
    object.position.x = -1000;
    object.rotation.x = 100;

    // object.position.x = Math.random() * 1000 - 500;
    // object.position.y = Math.random() * 600 - 300;
    // object.position.z = Math.random() * 800 - 400;

    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object, target);

    objects.push(object);
    // }

    var controls = new DragControls(objects, camera, renderer.domElement);
    controls.addEventListener('dragstart', dragStartCallback);
    controls.addEventListener('dragend', function (event) {
        dragendCallback(event, targetStartPos);
    });
}
let curObj;
let startPos;
let distance;
let speed = 15;
function dragStartCallback(event) {
    speed = 10;
    curObj = event.object;
    
    startPos = curObj.position.x;
    // startColor = event.object.material.color.getHex();
    // event.object.material.emissive.set(0x2194ce);
}

function dragendCallback(event, arg) {
    distance = (event.object.position.x - startPos) / 10;
    curObj = event.object;
    // curObj.rotation.x = Math.PI / 2;
    // curObj.rotation.y = Math.PI / 2;
    // curObj.rotation.z = Math.PI / 2;

    clockMove(arg);
    // event.object.material.color.setHex(0xc418bd);
    // curObj = event.object;
    // requestAnimationFrame(move);

}



function clockMove(arg) {

    // var pos = orbitCalculation(50);
    let throwDistance = Math.floor(distance) * 50;

    if (curObj.position.x < startPos + throwDistance) {
        // console.log('here', startPos,  throwDistance, curObj.position.x)
        curObj.position.x += speed;
        curObj.position.z +=4;

        // //basically, easing function
        if (speed > 1 && curObj.position.x > startPos + throwDistance - 500) {
            
            speed -= 0.1;
        }
        requestAnimationFrame(() => clockMove(arg));
    } else {
        throwEndCallback(arg);
    }

    // console.log(curObj.position.x, throwDistance);


    // if (curObj.position.x > Math.abs(throwDistance) * 2) {
    //     cancelAnimationFrame(clockMove);
    // }
    // curObj.position.y = (curObj.position.y  + pos.z/200) ;
    // setTimeout(clockMove, 5);
}


function throwEndCallback(targetStartPos) {

    if (curObj.position.x < targetStartPos + 150 && curObj.position.x > targetStartPos - 150) {
        alert('you hit the target! ', targetStartPos, curObj.position.x);
        if(curObj.position.x >= -1000 ){
            curObj.position.x -=50;
            curObj.position.z = -135;

            requestAnimationFrame(throwEndCallback)
        }
    } else {
        if(curObj.position.x >= -1000 ){
            curObj.position.x -=50;
            curObj.position.z = -135;

            requestAnimationFrame(throwEndCallback)
        }
        // console.log('in bottom if ', curObj.position.x);


    }
}


// function move(timestamp) {
//     curObjId = curObj.id;
// if (!start) start = timestamp;
// var progress = timestamp - start
// // console.log(progress);
// curObj.position.x += Math.min(progress / 10, 200)
// curObj.position.z += Math.min(progress / 10, 200)
// curObj.position.y -= Math.min(progress / 10, 200)
// if (progress < 200) {
//     requestAnimationFrame(move);     
// }
// else {
//     start = null;
//     if(curObj.id !== curObjId)
//     requestAnimationFrame(move); 
// }

// };

// var orbitCalculation = function (radius) {
//     return {
//         x: (Math.sin((Date.now() % 60000) / 6000 * Math.PI * 2) * radius),
//         z: (Math.cos((Date.now() % 60000) / 6000 * Math.PI * 2) * radius)
//     };
// }

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

init();
animate();