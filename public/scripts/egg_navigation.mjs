import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { gsap } from "gsap";

let theta = 0;
const radius = 100;
let canvas, scene, camera, renderer, egg, raycaster, pointer, sphereInter, direction_texts, touch_direction, eggStaticVector, eggBoundingBox, eggSize, myfog, light, lightVecter, cameraStartVector, footer, listener, audioLoader, tranSound;
let eastArch, westArch, northArch, southArc, arches = [];
let isMoving = false;
let lastEggDirection = '';
let frame = 0;

main ();

function main () {

canvas = document.querySelector('#home_page_canvas')
const loading_modal = document.querySelector('#loading_title');
footer = document.querySelector('#footer')
direction_texts = document.querySelectorAll('.direction_title');
// direction_texts.forEach(text=>{
//     text.style.display = 'none';
// })
// direction_text.innerHTML = '';
scene = new THREE.Scene();
myfog = {value:0.001}
scene.fog = new THREE.FogExp2( 0xe2c3a5, myfog.value);
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });

listener = new THREE.AudioListener();
camera.add(listener);

raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 3;

pointer = new THREE.Vector2();

// const sphereInterProps = {
//     radius: 3,

// }


renderer.setSize(window.innerWidth, window.innerHeight);
eggStaticVector = new THREE.Vector3();
eggStaticVector.set(0,-1,0);
canvas.style.cursor = 'progress';
{
const color = 0xbffdff;
// const intensity = 6;
light = new THREE.SpotLight(color,750);
// console.log(light);
// light.rotation.z = 45;
light.distance = 50;
light.castShadow = true;
light.focus = 0.5;
light.decay = 2;
light.angle = Math.PI*0.0225;
const hemiSkyColor = 0xdef3f4;
const hemiGroundColor = 0x9e9783;
const hemisLight = new THREE.HemisphereLight(hemiSkyColor, hemiGroundColor, 4);
scene.add(hemisLight);
lightVecter = new THREE.Vector3(11,35,0);
// {x:5, y:29, z:-13}
light.position.copy(lightVecter);
// light.target.copy(eggStaticVector);
// light.target.position = eggStaticVector;
// light.target.y = eggStaticVector.y;
// light.target.z = eggStaticVector.z;
// console.log(light.target);
// light.rotation.set(0,-Math.PI/4,Math.PI/2);
// const spotLightHelper = new THREE.SpotLightHelper( light );
// scene.add( spotLightHelper );
scene.add(light);
}
audioLoader = new THREE.AudioLoader();

const gtlfLoader = new GLTFLoader();
gtlfLoader.load('models/chosen_egg.glb', (gltf) => {
    audioLoader.load('./audio/movement/Egg Crushing.mp3', (eggcrush) => {
    tranSound = new THREE.Audio(listener);
    tranSound.setBuffer(eggcrush);
    tranSound.setVolume(0);
    // console.log(gltf);
    canvas.style.cursor = 'initial';
    loading_modal.style.display = 'none';
    footer.style.display = 'block';
    egg = gltf.scene;
    // console.log(egg);
    egg.castShadow = true;
    egg.position.copy(eggStaticVector);
    gsap.to(eggStaticVector, {
        // delay: rnd(5,7,true),
        duration: rnd(2,5,true),
        y: eggStaticVector.y+rnd(-0.25,0.25,false),
        onUpdate: function() {
            egg.position.copy(eggStaticVector);
        },
        yoyo:true,
        repeat: -1,
        repeatRefresh:true,
        ease: "power1.inOut",
})
// const objLoader = new OBJLoader();
// objLoader.load('models/egg_compressed_scaled.obj', (root) => {
//     canvas.style.cursor = 'initial';
//     loading_modal.style.display = 'none';
//     footer.style.display = 'block';
//     egg = root;
//     // egg.scaleX = 0.5;
//     // eggLoa   dTime = Date.now();
//     egg.castShadow = true;
//     egg.position.copy(eggStaticVector);
//     // light.target.set(egg.position.x,egg.position.y,egg.position.z);
//     // const eggRot = gsap.to(egg.rotation, {
//     //     duration: rnd(1,2,false),
//     //     y: Math.PI,
//     //     onUpdate: function() {
//     //         // console.log(egg.rotation.x);
//     //         render();
//     //     },
//     //     yoyo:true,
//     //     repeat:-1,
//     //     repeatRefresh: true,
//     // });
//     gsap.to(eggStaticVector, {
//         // delay: rnd(5,7,true),
//         duration: rnd(2,5,true),
//         y: eggStaticVector.y+rnd(-3,3,false),
//         onUpdate: function() {
//             egg.position.copy(eggStaticVector);
//         },
//         yoyo:true,
//         repeat: -1,
//         repeatRefresh:true,
//         ease: "power1.inOut",
//         // repeatDelay:true,
//     });
    
    eggBoundingBox = new THREE.Box3().setFromObject(egg);
    // const xCenter = (eggBoundingBox.max.x + eggBoundingBox.min.x) / 2;
    // const yCenter = (eggBoundingBox.max.y + eggBoundingBox.min.y) / 2;
    const eggWidth = eggBoundingBox.max.x - eggBoundingBox.min.x;
    const eggHeight = eggBoundingBox.max.y - eggBoundingBox.min.y;
    const eggWidthRadius = eggWidth/2;
    const eggHeightRadius = eggHeight/2;
    eastArch = ellipseInit(eggBoundingBox.max.x,0,eggWidthRadius/3,eggHeightRadius*1.25,-Math.PI/2,1);
    // console.log(eggWidth);
    eastArch.position.y = 0.85;
    arches.push({arch:eastArch, name:'East'});
    westArch = ellipseInit(eggBoundingBox.min.x, 0,eggWidthRadius/3,eggHeightRadius*1.25,Math.PI/2,1);
    westArch.position.y = -.35;
    arches.push({arch:westArch, name:'West'});
    northArch = ellipseInit(0,eggBoundingBox.max.y,eggWidthRadius*1.25,eggHeightRadius/3,Math.PI/4,1);
    northArch.position.y = -0.35;
    arches.push({arch:northArch, name:'North'});
    southArc = ellipseInit(0, eggBoundingBox.min.y,eggWidthRadius*1.25,eggHeightRadius/3, -Math.PI*0.75,1);
    southArc.position.y = 0.175;
    arches.push({arch:southArc, name:'South'});
    arches.forEach(arch=>{
        // arch.arch.position.z = egg.position.z + 5;
        arch.arch.visible = false;
        scene.add(arch.arch);
    })
    scene.add(gltf.scene);
    // eggRot.play();
  })
})
;


cameraStartVector = new THREE.Vector3();
cameraStartVector.set(0,0,4);
camera.position.copy(cameraStartVector);

// const controls = new OrbitControls( camera, canvas );
// controls.target.set( 0, 5, 0 );
// controls.update();

requestAnimationFrame(animate);
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener ('resize',onWindowResize);
window.addEventListener('click', onMouseClick);

const about_button = document.getElementById('home-about-open');
const about_button_container = document.getElementById('about-button-container');
const about_modal = document.getElementById('about-modal');
about_modal.style.display = 'none';
const about_modal_close = document.getElementById('home-close-button');
about_button.addEventListener('click',() => {
    // about_button.classList.add('hide');
    // about_modal.classList.remove('')
    about_button_container.style.display = 'none';
    about_modal.style.display = 'block';
});
about_modal_close.addEventListener('click',() => {
    about_button_container.style.display = 'inline-block';
    about_modal.style.display = 'none';
});
}

function onWindowResize () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerMove ( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate (time) {
    time*=0.0001;
    render();
    // if (!isEggMoving) {
    requestAnimationFrame( animate );
// }
}


function render () {
    camera.updateMatrixWorld();
    raycaster.setFromCamera( pointer, camera );
    // const maxFrame = 100
    // const per = frame / maxFrame;
    // const r = Math.PI * 2 * per;
    // light.position.set(Math.cos(r) * 5, 5, Math.sin(r) * 5 );
    // frame = (frame + 1) % maxFrame;
    if (egg ) {
    // egg.rotation.y += 0.01;
    const intersects = raycaster.intersectObject(egg);
    if ( intersects.length > 0 ) {
     onEggTouch(intersects);
    } else {
        canvas.style.cursor = 'default';
        lastEggDirection = '';
        touch_direction = '';
        // sphereInter.visible = false;
        if (arches) {
            arches.forEach(arch=>arch.arch.visible=false);
        }
        if (direction_texts) {
            direction_texts.forEach(text=>{
                text.style.display = 'none';
            })
        }

    }}
    if (resizeRendererToDisplaySize(renderer)) {
        //const canvas = renderer.domElement;
        //console.log(camera.position);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        }
    
    renderer.render( scene, camera );

}

function onEggTouch (intersects) {
    canvas.style.cursor = 'pointer';
    // console.log(intersects[0].object);
    // sphereInter.visible = true;
    // sphereInter.position.copy( intersects[ 0 ].point );
    const interNormal = intersects[0].normal;
    if (typeof direction_texts != null) {
    touch_direction = directionDetermn(interNormal);
    // console.log(touch_direction);
    if (touch_direction.length>0 && !isMoving) {
        if (touch_direction !== lastEggDirection) {
        let endVector = new THREE.Vector3();
        switch(touch_direction) {
            case 'East':
                endVector.set(egg.position.x-0.2,egg.position.y,egg.position.z);
            break;
            case 'West':
                endVector.set(egg.position.x+0.2,egg.position.y,egg.position.z);
            break;
            case 'North':
                endVector.set(egg.position.x,egg.position.y-0.2,egg.position.z);
            break;
            case 'South':
                endVector.set(egg.position.x,egg.position.y+0.2,egg.position.z);
            break;
            default:
            break;
        }
        arches.forEach(arch=> {
            if(arch.name === touch_direction) {
                arch.arch.visible = true;
            } else {
                arch.arch.visible = false;
            }
        })
        // isEggMoving = true;
        // requestAnimationFrame(()=>animateMovement(egg.position,endVector,Date.now(), 0,rnd(2000,4000,true)));
        lastEggDirection = touch_direction;
        direction_texts.forEach(text => {
            if ('direction_title_'+touch_direction===text.id) {
                text.style.display = 'block';
            } else {
                text.style.display = 'none';
            }
            
        });
    }
            } else {
                canvas.style.cursor = 'default';
                // canvas.style.cursor = 'initial';
                // lastEggDirection = touch_direction;
                touch_direction = '';
                if (arches) {
                    arches.forEach(arch=>arch.arch.visible=false);
                }
                direction_texts.forEach(text=>{
                    text.style.display = 'none';
                })
    } 
    
}
}

function onMouseClick () {
    // isEggMoving = true;
    // if (touch_direction != '') {
    //     direction_texts.forEach(text=>{
    //     text.style.display = 'none';
    // })
    // // }
    const about_button_container = document.getElementById('about-button-container');
    // const about_modal = document.getElementById('about-modal');
    // if (about_button_container.style.display !== 'none') {
    //     console.log(about_modal.style.display);
    //     about_modal.style.display = 'none';
    //     about_button_container.style.display = 'inline-block';
    // }
    let endVector = new THREE.Vector3()
    endVector.set(cameraStartVector.x,cameraStartVector.y,cameraStartVector.z);
    if (touch_direction!== '') {
        isMoving = true;
    }
    // console.log(touch_direction);
    switch (touch_direction) {
        case 'South':
            gsap.to(camera.rotation,{
                duration: 1.5,
                x: Math.PI*0.35,
                onUpdate: function () {
                    // camera.rotation.x = x;
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                },
                onComplete: function() {
                    window.open('./direction_south.html',"_self");
                },
                ease: "power1.inOut",
            })
            // endVector.y+=10;
            // requestAnimationFrame(()=>pageMoveAnimation(0,Math.PI/2,Date.now(),0,30000, './direction_south.html'));
            // window.open('./direction_south.html',"_self");
        break;
        case 'North':
            // requestAnimationFrame(()=>pageMoveAnimation(0,-Math.PI/2,Date.now(),0,30000, './direction_north.html'));
            // window.open('./direction_north.html',"_self");
            gsap.to(camera.rotation,{
                duration: 1.5,
                x: -Math.PI*0.35,
                onUpdate: function () {
                    // camera.rotation.x = x;
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                },
                onComplete: function() {
                    window.open('./direction_north.html',"_self");
                },
                ease: "power1.inOut",
            })
        break;
        case 'East':
            footer.style.display = 'none';
            about_button_container.style.display ='none';
            setTimeout(()=> {
                tranSound.play();
                fadeIn(tranSound.getVolume(),0.45,intCalculator(250,tranSound.getVolume(),0.45));
            },500);
            // window.open('./direction_west_east.html',"_self");
            gsap.to(camera.position,{
                duration: 4.5,
                z: -0.75,
                onUpdate: function () {
                    // camera.rotation.x = x;
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                },
                onComplete: function() {
                    setTimeout(()=>window.open('./direction_west_east.html',"_self"),10);
                    
                },
                ease: "power1.inOut",
            })
        break;
        case 'West':
            footer.style.display = 'none';
            about_button_container.style.display ='none';
            setTimeout(()=> {
                tranSound.play();
                fadeIn(tranSound.getVolume(),0.45,intCalculator(250,tranSound.getVolume(),0.45));
            },500);
            // window.open('./direction_west_east.html',"_self");
            gsap.to(camera.position,{
                duration: 4.5,
                z: -0.75,
                onUpdate: function () {
                    // camera.rotation.x = x;
                    camera.updateProjectionMatrix();
                    renderer.render(scene, camera);
                },
                onComplete: function() {
                    setTimeout(()=>window.open('./direction_west_east.html',"_self"),10);
                },
                ease: "power1.inOut",
            })
        break;
        default:
        break;
    }
}

function resizeRendererToDisplaySize (renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;

    const width  = Math.floor( window.innerWidth);
    const height = Math.floor( window.innerHeight);
    const needResize = canvas.width * pixelRatio !== width || canvas.height * pixelRatio !== height;
    if (needResize) {
      renderer.setSize(width, height);
    }
    return needResize;
  }

function directionDetermn (point) {
    const west_thresh = -0.58;
    const east_thresh = 0.58;
    const north_thresh = 0.6;
    const south_thresh = -0.05;
    let direction = ''
    if (point.x<west_thresh && point.y > north_thresh){
        direction = 'North'
    } else if (point.x<west_thresh && point.y < south_thresh) {
        direction = 'South'
    } else if (point.x<west_thresh) {
        direction = 'West'
    } else if (point.x>east_thresh && point.y > north_thresh) {
        direction = 'North'
    } else if (point.x>east_thresh && point.y < south_thresh) {
        direction = 'South'
    } else if (point.x>east_thresh) {
        direction = 'East'
    } else if (point.y > north_thresh) {
        direction = 'North'
    } else if (point.y < south_thresh) {
        direction = 'South'
    } 
    return direction;
}
function rnd (min,max,isInt) {
 return isInt ? Math.floor(Math.random() * max) + min : Math.random() * max + min;
}


// function pageMoveAnimation (startDeg, endDeg, startTime, elapsedTime, duration, link) {
//     elapsedTime += (Date.now() - startTime);
//     const alpha = gameLoop(Date.now());
//     if (elapsedTime<duration) {
//         const larpedVal = lerp(startDeg,endDeg,.0005);
//         // console.log(alpha);
//         camera.rotation.x += larpedVal; 
//         camera.updateProjectionMatrix();
//         renderer.render(scene, camera);
//         requestAnimationFrame(()=>pageMoveAnimation(larpedVal,endDeg,startTime,elapsedTime,duration,link));
//     } else {
//         window.open(link,"_self");
//     }
// }
// function animateMovement (startVector, endVector, startTime, elapsedTime, duration) {
//     elapsedTime += (Date.now() - startTime);
//     let newVector = new THREE.Vector3();
//     if (elapsedTime<duration ) {
//     newVector.lerpVectors(startVector,endVector,elapsedTime/duration);
//     egg.position.copy(newVector);
//     renderer.render(scene, camera);
//     requestAnimationFrame(()=>animateMovement(newVector,endVector,startTime,elapsedTime,duration));
//     } else {
//         newVector.copy(endVector);
//         egg.position.copy(newVector);
//         renderer.render(scene,camera);
//         if (!egg.position.equals(eggStaticVector)) {
//             const randomInterval = rnd(1000,2000,true);
//             requestAnimationFrame(()=>animateMovement(egg.position,eggStaticVector,Date.now(),0,rnd(2000,4000,true)));
//         } else {
//             isEggMoving = false;
//             requestAnimationFrame(animate);    
//         }
//     }

        
// }

function ellipseInit (x,y,xRadius, yRadius, rotation, delta) {
    let curve = new THREE.EllipseCurve(
        x, y,             // ax, aY
        xRadius, yRadius, // xRadius, yRadius
        0+rotation, ((1/2 * Math.PI)+rotation)*delta, // aStartAngle, aEndAngle
        false        // aClockwise
    );
    
    let points = curve.getSpacedPoints( 20 );
    
    // let path = new THREE.Path();
    let geometry = new THREE.BufferGeometry().setFromPoints( points ); 
    let material = new THREE.LineBasicMaterial( { color : 0x333332, linewidth: 3, transparent: true } );
    const line = new THREE.Line( geometry, material );
    // console.log(line.position);
    line.position.z = eggStaticVector.z;
    return line;
}

// function lerp (a,b,alpha) {
//     return a+alpha*(b-a)
// }

// function gameLoop(lastLoop) { 
//     const thisLoop = Date.now();
//     return 1000 / (thisLoop - lastLoop);
// }

// gsap.to(myfog, {
//     duration: rnd(5,8,true),
//     value: 0.001, // The end value
//     onUpdate: function() {
//       // New fog with current myfog value
//       scene.fog = new THREE.FogExp2(0xe2c3a5, myfog.value);
//     },
//     // These just infinitely repeat the animation
//     yoyo: true,
//     repeatRefresh: true,
//     repeat: -1,
//   });

//   gsap.to(lightVecter, {
//     delay: rnd (2,5,true),
//     duration: rnd(5,15,true),
//     x: 5+rnd(-2,2,false),
//     y: 29+rnd(-2,10,false),
//     z: -13+rnd(-2,5,false),
//     onUpdate: function() {
//         light.position.copy(lightVecter);
//     },
//     yoyo:true,
//     repeatRefresh: true,
//     repeatDelay: true,
//     repeat: -1,

//   });

function intCalculator (duration, startVal, endVal) {
    return (endVal-startVal)/duration
}
function fadeIn (vol, end, interval) {
    if (vol+interval < end) {
        vol += interval;
        tranSound.setVolume(vol);
        console.log(tranSound.getVolume());
        setTimeout(()=>fadeIn (vol,end,interval),1);

    } else {
        tranSound.setVolume(end);
    }

}

