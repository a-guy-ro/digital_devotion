import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
// import { gsap } from "gsap";
import { MeshToonMaterial } from 'three';




let canvas, scene, camera, renderer, gradientCapsuleElement, dlRight, dlLeft, controls, eggshells, eggpowder, eggpowdersmall, raycaster, pointer, rightMirror, leftMirror, trackNamePH, trackQueuePH, trackCounter=0, ulQueue, currentDrag, nowPlaying, listener,  audioLoader;
let objects = [], letters = [], lettersQueue = [], firstPlay = false, firstInter = false, touchType = 'mouse' ;
let dracoLoader = new DRACOLoader();
const playingPH = 'click on any object'

    // Specify path to a folder containing WASM/JS decoding libraries.
    // It is recommended to always pull your Draco JavaScript and WASM decoders
    // from the below URL. Users will benefit from having the Draco decoder in
    // cache as more sites start using the static URL.

main();

function main() {
    canvas = document.querySelector('#east_west_page_canvas')
    const loading_modal = document.querySelector('#loading_title');
    // const footer = document.querySelector('#footer')

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,0.1, 100000 )
    renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  listener = new THREE.AudioListener();
  camera.add(listener);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.set(0, 2750, 5000);
  camera.updateProjectionMatrix();

  {
  const light = new THREE.HemisphereLight( 0xfaf5e7,0xeae7fa,2 ); // soft white light
  light.position.set(-5,30,0);
  scene.add( light );
  
  dlLeft = new THREE.DirectionalLight(0xfff0bd,1.2);
  dlLeft.position.set(-2000, 0, -0.38);
  // const dlhelper = new THREE.DirectionalLightHelper(dlLeft);
  scene.add(dlLeft);
  
  dlRight = new THREE.DirectionalLight(0xecffff,0.8);
  dlRight.position.set(0, -1000, -1000);
  // const dlRighthelper = new THREE.DirectionalLightHelper(dlRight);

//   dl.target.set(0,1500,300);
  scene.add(dlRight);
    // scene.add(dlRighthelper);
  }

  raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 3;
  pointer = new THREE.Vector2();

dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
const gtlfLoader = new GLTFLoader();
const dracpGtlfLoader = new GLTFLoader();
audioLoader = new THREE.AudioLoader();
dracpGtlfLoader.setDRACOLoader(dracoLoader);
gtlfLoader.load('./models/eggshellscene_cone_external_joined.glb', (gltf)=> {
  gtlfLoader.load('./models/eggshells_dense.glb', (gtlf_2) => {
    gtlfLoader.load('./models/eggshells_dense.glb', (smallpowder) => {
      gtlfLoader.load('./models/eggshells_dense.glb', (powder_1) => {
        gtlfLoader.load('./models/eggshells_dense.glb', (powder_2) => {
          gtlfLoader.load('./models/eggshells_dense.glb', (powder_3) => {
            gtlfLoader.load('./models/eggshells_dense.glb', (powder_4) => {
              // gtlfLoader.load('./models/eggshells_dense.glb', (powder_5) => {
  gtlfLoader.load('./models/disc_2.glb', (disc) => { 
    gtlfLoader.load('./models/mirror_2.glb', (mirror) => { 
      gtlfLoader.load('./models/fools_gold_2_deci.glb', (fools_gold)=> {
        dracpGtlfLoader.load('./models/flowers_newnew_joined_comp_4.glb', (flowers)=> {
          gtlfLoader.load('./models/scarab_new.glb', (scarab)=> {
            dracpGtlfLoader.load('./models/drum_com_3.glb', (drum)=>{
              gtlfLoader.load('./models/staff_joined.glb', (staff)=>{
                // audioLoader.load('./audio/elemental/Saturn spiral fade out.mp3', (saturn) => {
                  // audioLoader.load('./audio/elemental/Fire crackles at night.mp3', (firecrack) => {
                  //   audioLoader.load('./audio/elemental/Waterfone Water gentle.mp3', (waterfone) => {
                  //     audioLoader.load('./audio/elemental/Badagry water collect.mp3', (badagry) => {
                  //       audioLoader.load('./audio/elemental/Seaweed Rattle.mp3', (seaweed) => {
                  //         audioLoader.load('./audio/elemental/Wind Chiming.mp3', (wind) => {
                  //           audioLoader.load('./audio/elemental/Pestle Mortar Egg Crush.mp3', (pestle) => {
                              

  loading_modal.style.display = 'none';
  eggshells = gltf.scene;
  eggpowder = gtlf_2.scene;
  // eggpowdersmall = smallpowder.scene;

  const powders = [smallpowder.scene, powder_1.scene, powder_2.scene, powder_3.scene, powder_4.scene];

  eggshells.children[0].children.forEach(mesh=> {
    mesh.material.transparent = true;
    mesh.material.opacity = 0;
  })
  // console.log(eggpowder);
  eggpowder.children[0].children.forEach(mesh=>{
    if (mesh.isMesh) {
      mesh.material.transparent = true;
      mesh.material.opacity = 0;
    }
  })
  powders.forEach((powder,ndx)=> {
    powder.children[0].children.forEach((mesh)=> {
      if (mesh.isMesh) {
        mesh.material.transparent = true;
      mesh.material.opacity = 0;
      if (ndx ===0) {
        mesh.geometry.scale(0.65,0.65,0.65);
        // powder.rotateY(Math.PI*0.45);  
      }  else {
        mesh.geometry.scale(0.85,0.85,0.85);
      }
      }
      
    })
    if (ndx ===0) {
      // mesh.geometry.scale(0.65,0.65,0.65);
      powder.rotateY(Math.PI*0.45);  
      powder.position.set(-4,20,-2);
    } else if (ndx ===1) {
      powder.rotateY(Math.PI*0.25);
      powder.position.set(-12,18,10);
    } else if (ndx === 2) {
      powder.rotateY(Math.PI*0.65);
      powder.position.set(10,13,7);
    } else if (ndx === 3) {
      powder.rotateY(Math.PI*0.55);
      powder.position.set(-7,6,-7);
    } else if (ndx === 4) {
      powder.rotateY(Math.PI*0.65);
      powder.position.set(10,5,-5);
    } else if (ndx === 5) {
      powder.rotateY(Math.PI*0.15);
      powder.position.set(-15,15,10);
    }
  })
  // eggpowdersmall.children[0].children.forEach(mesh=>{
  //   if (mesh.isMesh) {
  //     mesh.material.transparent = true;
  //     mesh.material.opacity = 0;
  //     mesh.geometry.scale(0.65,0.65,0.65);
  //     // console.log(mesh.material);
  //   }
  // })
  // eggpowdersmall.rotateY(Math.PI*0.45);

  eggshells.castShadow = true;
  eggshells.position.set(0,-3,-2);
  eggpowder.castShadow = true;
  eggpowder.position.set(3,-3,-2);
  eggpowder.rotateY(Math.PI*-0.5);
  // eggpowdersmall.position.set(-2,5,-2);

{
  const discObject = {
    name: 'disc',
    object: disc.scene,
    locVec: new THREE.Vector3(9.5,15,-7.25),
    sound: 7,
    // elemental: saturn,
    posAudio: '',
    sound_title: 'letter_part_7',
    rotateZ: Math.PI,
    img: [{index: 8, timecode: '00:00', hasAppeared: false}],
    elementalMenu: '00:00',
    scale:1.5
  }
  console.log(discObject);
  objects.push(discObject);
  const foolsGoldObject = {
    name: 'fools_gold',
    object: fools_gold.scene,
    locVec: new THREE.Vector3(-6.5, 15,-1),
    sound: 6,
    // elemental: wind,
    posAudio: '',
    sound_title: 'letter_part_6',
    rotateZ: 0,
    img: [{index: 7, timecode: '00:00', hasAppeared: false}],
    elementalMenu: '00:00',
    scale:2.5
  }
  foolsGoldObject.object.rotateX(Math.PI*0.5)
  objects.push(foolsGoldObject);
  const mirrorObject = {
    name: 'mirror',
    object: mirror.scene,
    locVec: new THREE.Vector3(7,17,1),
    sound: 3,
    // elemental: seaweed,
    posAudio: '',
    sound_title: 'letter_part_3',
    rotateZ: 0,
    img: [{index: 5, timecode: '00:00', hasAppeared: false},{index: 2, timecode: '00:52', hasAppeared: false}],
    imgIndex: 0,
    elementalMenu: '00:00',
    scale:1.5
  }
  {
  rightMirror = new Reflector(new THREE.CircleGeometry(0.78*mirrorObject.scale,32*4), {
    color: new THREE.Color(0x131313),
    textureWidth: window.innerWidth * window.devicePixelRatio * 0.15,
    textureHeight: window.innerHeight * window.devicePixelRatio * 0.15,
  })
  rightMirror.position.copy(mirrorObject.locVec);
  rightMirror.position.x +=0.05;
  rightMirror.position.y +=0.635;
  rightMirror.position.z +=1.38;
  rightMirror.rotateZ(mirrorObject.rotateZ);
  rightMirror.rotateY(-Math.PI*0.02)
  rightMirror.rotateX(Math.PI);
  rightMirror.visible = false;
  // rightMirror.geometry.scale(mirrorObject.scale,mirrorObject.scale);
  scene.add(rightMirror);
  leftMirror = new Reflector(new THREE.CircleGeometry(0.78*mirrorObject.scale,32*4), {
    color: new THREE.Color(0x131313),
    textureWidth: window.innerWidth * window.devicePixelRatio * 0.15,
    textureHeight: window.innerHeight * window.devicePixelRatio * 0.15,
  })
  leftMirror.position.copy(mirrorObject.locVec);
  leftMirror.position.x +=1.53;
  leftMirror.position.y +=0.7;
  leftMirror.position.z -= 0.05;
  leftMirror.rotateZ(mirrorObject.rotateZ);
  leftMirror.rotateY(Math.PI*0.5)
  leftMirror.rotateX(Math.PI);
  leftMirror.visible = false;
  // leftMirror.geometry.scale(mirrorObject.scale,mirrorObject.scale);
  scene.add(leftMirror);
}
  objects.push(mirrorObject);


const flowersObject = {
  name: 'flowers',
  object: flowers.scene,
  locVec: new THREE.Vector3(1,27,6),
  sound: 1,
  // elemental: badagry,
  posAudio: '',
  sound_title: 'letter_part_1',
  rotateZ: 0,
  img: [{index: 6, timecode: '00:00', hasAppeared: false}],
  elementalMenu: 'no',
  scale:1
}

flowersObject.object.rotateX(Math.PI*0.75);
flowersObject.object.rotateY(Math.PI*0.5);
objects.push(flowersObject);

const scarabObject = {
  name:'scarab',
  object: scarab.scene,
  locVec: new THREE.Vector3(-10,23,-8),
  sound:5,
  // elemental: pestle,
  posAudio: '',
  sound_title: 'letter_part_5',
  rotateZ: Math.PI,
  img: [{index: 4, timecode: '00:00', hasAppeared: false},{index: 9, timecode: '00:22', hasAppeared: false}],
  imgIndex: 0,
  elementalMenu: '00:00',
  scale: 2.2
}
scarabObject.object.rotateX(-Math.PI*0.15);
scarabObject.object.children[0].material.color = new THREE.Color(0xc0c0c0);
objects.push(scarabObject);
const drumObject = {
  name:'drum',
  object: drum.scene,
  locVec: new THREE.Vector3(-12,25,8),
  sound:2,
  // elemental: waterfone,
  posAudio: '',
  sound_title: 'letter_part_2',
  rotateZ: 0,
  img: [{index: 1, timecode: '00:00', hasAppeared: false}],
  elementalMenu: '00:58',
  scale: 3
}
drumObject.object.rotateX(Math.PI*0.25);

objects.push(drumObject);
const staffObject = {
  name:'staff',
  object: staff.scene,
  locVec: new THREE.Vector3(-1,16,-6),
  sound:4,
  // elemental: firecrack,
  posAudio: '',
  sound_title: 'letter_part_4',
  rotateZ: Math.PI,
  img: [{index: 3, timecode: '00:00', hasAppeared: false}],
  elementalMenu: '00:00',
  scale: 2.5
  // -Math.PI*0.35
}
staffObject.object.rotateX(-Math.PI*0.65);
// staffObject.object.rotateY(Math.PI*0.15);

objects.push(staffObject);
}
objects.forEach (object=> {
    // if (object.object.children.length === 1) {
    object.object.children[0].children.forEach(mesh=>{
      if (mesh.isMesh) {
        
        // mesh.material.transparent = true;
        // mesh.material.opacity = 0;
        mesh.geometry.scale(object.scale,object.scale,object.scale);
        if (object.name !== 'fools_gold') {
          // console.log(mesh);
          mesh.material.metalness = 0;
         if (object.name === 'scarab') { 
            mesh.material.color.set(0xF7F2EE);
            // mes//h.geometry.scale(2,2,2);
            console.log(mesh);
            // mesh.material.metalness = 0.75;
          } 
          
        } else {
          mesh.material.metalness = 1;
          // mesh.geometry.scale(2,2,2);
        } 
        
      }
    })
  // } else {
    object.object.children.forEach (mesh=>{
      if (mesh.isMesh) {
        // mesh.material.transparent = true;
        // mesh.material.opacity = 0;
        mesh.geometry.scale(object.scale,object.scale,object.scale);
        if (object.name === 'scarab') { 
          mesh.material.color.set(0xF7F2EE);
          mesh.material.metalness = 0.67;
          // mesh.geometry.scale(1.5,1.5,1.5);
        } else if (object.name !== 'fools_gold') {
          mesh.material.metalness = 0;
        }  else {
          mesh.material.metalness = 0.75;
          mesh.material.color.set(0xE6D063)
          // mesh.geometry.scale(2,2,2);
        } 
      }
    })
  // }
    object.isHovered = false;
    object.object.rotateZ(object.rotateZ);
    object.object.position.copy(object.locVec);
    object.object.visible = false;
    // if (typeof object.elemental !== 'string') {
    //   const currentElemental = new THREE.PositionalAudio( listener );
    //   const posVolOffset = 1.2;
    //   currentElemental.setBuffer(object.elemental);
    //   currentElemental.setRefDistance(3);
    //   if (object.name === 'disc') {
    //     currentElemental.setVolume(0.05*posVolOffset);  
    //     object.posAudioVol = 0.05*posVolOffset;
    //   } else if (object.name === 'flowers') {
    //     currentElemental.setVolume(0.1*posVolOffset);  
    //     object.posAudioVol = 0.1*posVolOffset;
    //   } else if (object.name === 'drum') {
    //     currentElemental.setVolume(0.3*posVolOffset);  
    //     object.posAudioVol = 0.3*posVolOffset;
    //   } else {
    //     currentElemental.setVolume(0.25*posVolOffset);
    //     object.posAudioVol = 0.25*posVolOffset;
    //   }
      

    //   object.posAudio = currentElemental;
    //   object.object.add(object.posAudio);
    // }
    
    scene.add(object.object);

  })
{
const gradientCapsule = new THREE.CapsuleGeometry(3000,300,50,100);
const backgroundTexture = new THREE.TextureLoader().load('./images/skybox_east_west/gradient_texture.png');
const capsuleMaterial = new THREE.MeshPhongMaterial({
    // color: new THREE.Color(0xFFFFFF), 
    // emissive: new THREE.Color(0xFDF5DD),
    map: backgroundTexture,
    emissiveMap: backgroundTexture,
    specular: new THREE.Color(0xa275ac), 
    // shininess: 60, 
    // reflectivity:1, 
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0,
    side:THREE.BackSide, 
    // wireframe: true,
})

gradientCapsuleElement = new THREE.Mesh(gradientCapsule, capsuleMaterial);
gradientCapsuleElement.position.y = eggshells.position.y + 800;
gradientCapsuleElement.position.z = eggshells.position.z - 1000;
scene.add(gradientCapsuleElement);
}
scene.add(eggshells);
scene.add(eggpowder);
powders.forEach(powder=>scene.add(powder));
// scene.add(eggpowdersmall);
const cameraStartVector = new THREE.Vector3(0,-12.25,0);
camera.position.copy(cameraStartVector);
camera.lookAt(eggshells.position.x,eggshells.position.y+5,eggshells.position.z);
camera.updateProjectionMatrix();
const introDiv = document.querySelector('.intro-modal');
const introBtn = document.querySelector('.intro-start-button');
const playercontainer = document.querySelector('.player_container');
const playerQueueCont = document.querySelector('.player-queue-container');
const controlerContainer = document.querySelector('#controls_text_container');
const resetViewBtn = document.querySelector('.reset-view-button');

introBtn.addEventListener('click', ()=> {
introDiv.classList.add('hidden');
playercontainer.classList.remove('hidden');
controlerContainer.classList.remove('hidden');
resetViewBtn.classList.remove('hidden');
playerQueueCont.classList.remove('hidden');
setTimeout (()=>objectVisible(objects[0],0),500);

})

const gsapTL = gsap.timeline();
gsapTL.add(opacityAnimation(gradientCapsuleElement,2,1.0),0.1);
eggshells.children[0].children.forEach(mesh=> {
gsapTL.add(opacityAnimation(mesh,5,0.95),3);
});
eggpowder.children[0].children.forEach(mesh=> {
  gsapTL.add(opacityAnimation(mesh,1,0.95,()=>{
    eggpowder.children.forEach(mesh=>{
      if (mesh.isMesh) {
      mesh.material.opacity = 0.95;
      }});
      
    // controls.enabled = true;
    // render();
  }),"<")
})
powders.forEach(powder=> {
  powder.children[0].children.forEach(mesh=> {
    gsapTL.add(opacityAnimation(mesh,1,0.95,()=>{
      powder.children.forEach(mesh=>{
        if (mesh.isMesh) {
        mesh.material.opacity = 0.95;
        }});
        // let index = 0;
        
      setTimeout(()=>introDiv.classList.remove('hidden'),500);  
      controls.enabled = true;
      render();
    }),"<")
  })
})


gsapTL.resume();
audioPlayerInit();

// window.addEventListener('keydown',() => {
//   if (!firstInter) {
//     firstInter = true;
//     objects.forEach(obj=>
//       {
//         if (typeof obj.posAudio !== 'string') {
//           // if (!obj.posAudio.isPlaying) {
//           obj.posAudio.setLoop(true);
//           obj.posAudio.play();
//           console.log(obj.posAudio);
//         // }
//       }
//     }
//     )
//   }
// })

// window.addEventListener('click', ()=> {
//   if (!firstInter) {
//     firstInter = true;
//     objects.forEach(obj=>
//       {
//         if (typeof obj.posAudio !== 'string') {
//           // if (!obj.posAudio.isPlaying) {
//           obj.posAudio.setLoop(true);
//           obj.posAudio.play();
//         // }
//       }
//     }
//     )
//   }
// });

resetViewBtn.addEventListener('click', ()=> {
  camera.position.copy(cameraStartVector);
  camera.lookAt(eggshells.position.x,eggshells.position.y+5,eggshells.position.z);
  camera.updateProjectionMatrix();
});

requestAnimationFrame(animate);
})
})
})
})
})
})
})
})
// })
// })
// })
// })
// })
// })
})
})
})
})
})
// })
// })
});
// console.log(skybox.material.opacity);

{
controls = new FlyControls( camera, renderer.domElement );
controls.movementSpeed = 10;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;
controls.enabled = false;
}

const collapBtn = document.getElementById('music-player-colllapsible');
collapBtn.addEventListener('click', ()=> onQueueClick(collapBtn))
ulQueue = document.getElementById('player_queue_ul');
// {
//   letters.push({
//     title: 'letter_1',
//     sound: ''
//   })
//   letters.push({
//     title: 'letter_2',
//     sound: ''
//   })
//   letters.push({
//     title: 'letter_3',
//     sound: ''
//   })
//   letters.push({
//     title: 'letter_4',
//     sound: ''
//   })
// }
trackNamePH = document.getElementById('player-track-name-p');
trackNamePH.innerHTML = playingPH;
trackQueuePH = document.getElementById('player_queue_ph');
//   window.addEventListener( 'pointermove', onPointerMove );
canvas.addEventListener('touchstart', (e)=> {
  camera.updateMatrixWorld();
  pointer.x = ( e.targetTouches[0].clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( e.targetTouches[0].clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( pointer, camera );
  let sumIntersects = [];
  objects.forEach(object=> {
    
    object.intersects = raycaster.intersectObject(object.object).length > 0 ? raycaster.intersectObject(object.object) : [];
    // console.log(object.intersects);
    // object.intersects.forEach(inter=>sumIntersects.push(inter));
    sumIntersects.push(object.intersects);
    if (object.intersects.length > 0) {
      object.isHovered = true;
      //window.addEventListener('click', objectClickHandle(object));
    } else {
      object.isHovered = false;
      //window.removeEventListener('click', objectClickHandle(object));
    }
      if (!object.isHovered && object.name !== 'mirror'){
        // if (object.name === 'mirror') {
        //   const yInt = Math.random()*0.001;
        //   const xInt = Math.random()*0.0001;
        //   object.object.rotation.x += xInt;
        //   leftMirror.rotation.x += xInt;
        //   rightMirror.rotation.x += xInt;
        //   object.object.rotation.y += yInt;
        //   leftMirror.rotation.y += yInt;
        //   rightMirror.rotation.y += yInt;
        // } else {
      object.object.rotation.y += Math.random()*0.001;
      object.object.rotation.x += Math.random()*0.0001;
    // }
    }
    })
    // if (sumIntersects[0].length === 0) {
    //   console.log('touch no intersect!');
    //   if (!firstInter) {
    //     firstInter = true;
    //     objects.forEach(obj=>
    //       {
    //         if (typeof obj.posAudio !== 'string') {
    //           // if (!obj.posAudio.isPlaying) {
    //           obj.posAudio.setLoop(true);
    //           obj.posAudio.play();
    //         // }
    //       }
    //     }
    //     )
    //   }
    // }
})
canvas.addEventListener('click', e=> objectClickHandle(e))
window.addEventListener ('resize',onWindowResize);
window.addEventListener( 'pointermove', onPointerMove );

  
}

function onQueueClick(btn) {
  const queueSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>queue</title><g><rect  class="icon-queue" x="2" y="2" width="17.48" height="3"/><rect class="icon-queue" x="2" y="8" width="17.48" height="3"/><rect class="icon-queue" x="2" y="14" width="17.48" height="3"/></g><rect class="icon-container" width="24" height="24"/></svg>'
  const queueDiv = document.getElementById('player_queue');
  const iconActiveSpan = document.getElementById('player-icon-active-span');
  const iconSpan = document.getElementById('player-icon-span');
  if (queueDiv.style.display === 'none') {
    queueDiv.style.display = 'block';
    iconActiveSpan.style.display = 'inline';
    iconSpan.style.display = 'none';
    // btn.classList.add('.icon-queue-active');
    // btn.classList.remove('.icon-queue');
    // btn.innerHTML = 'X';
  } else {
    queueDiv.style.display = 'none';
    iconSpan.style.display = 'inline';
    iconActiveSpan.style.display = 'none';
    // btn.classList.remove('.icon-queue-active');
    // btn.classList.add('.icon-queue');
    // btn.innerHTML = queueSVG;
  }
}
function onWindowResize () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate () {
    render();
    requestAnimationFrame( animate );
}


function render () {
  camera.updateMatrixWorld();
  raycaster.setFromCamera( pointer, camera );
    let sumIntersects = [];
    const r = Date.now() * 0.00005;
    dlRight.position.x = 700 * Math.cos( r );
    dlRight.position.z = 700 * Math.sin( r );
    dlRight.position.y = 700 * Math.sin( r );
    // uniforms[ 'time' ].value = performance.now() / 1000;
    gradientCapsuleElement.rotation.y += Math.random()*0.001;
    gradientCapsuleElement.rotation.x += Math.random()*0.0001;
    objects.forEach(object=> {
    object.intersects = raycaster.intersectObject(object.object).length > 0 ? raycaster.intersectObject(object.object) : [];
    // console.log(object.intersects);
    object.intersects.forEach(inter=>sumIntersects.push(inter));
    // sumIntersects.push(object.intersects);
    if (object.intersects.length > 0) {
      object.isHovered = true;
      //window.addEventListener('click', objectClickHandle(object));
    } else {
      object.isHovered = false;
      //window.removeEventListener('click', objectClickHandle(object));
    }
      if (!object.isHovered && object.name !== 'mirror'){
        // if (object.name === 'mirror') {
        //   const yInt = Math.random()*0.001;
        //   const xInt = Math.random()*0.0001;
        //   object.object.rotation.x += xInt;
        //   leftMirror.rotation.x += xInt;
        //   rightMirror.rotation.x += xInt;
        //   object.object.rotation.y += yInt;
        //   leftMirror.rotation.y += yInt;
        //   rightMirror.rotation.y += yInt;
        // } else {
      object.object.rotation.y += Math.random()*0.001;
      object.object.rotation.x += Math.random()*0.0001;
    // }
    }
    })
    if (sumIntersects.length > 0) {
      // console.log(sumIntersects);
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
    // console.log(controls.target);
    renderer.render( scene, camera );
    controls.update(0.005);
}

function objectClickHandle(e) {
  const playButton = document.querySelector(".player-play-btn")
  // console.log(e.target);
  objects.forEach(object=> {
    if (object.isHovered) {
      console.log(object);
      trackCounter ++;
      if (typeof nowPlaying === 'undefined') {
        nowPlaying = {
        sound: object.sound,
        title: object.sound_title,
        id: trackCounter,
        img: object.img,
        elementalMenu: object.elementalMenu,
        imgIndex: 0
        }
        trackNamePH.innerHTML = nowPlaying.title.replace(/_/g,' ');
        if (!firstPlay) {
          firstPlay = true;
          
          
            // console.log('playing ' + obj.posAudio);
          
          playButton.click();
        }
      } else {
      lettersQueue.push({
        sound: object.sound,
        title: object.sound_title,
        id: trackCounter,
        img: object.img,
        elementalMenu: object.elementalMenu,
        imgIndex: 0
      })
    }
      if (lettersQueue.length > 0) { 
        if (lettersQueue.length === 1) {
          trackQueuePH.style.display = 'none';
          ulQueue.style.display = 'block';
        }
        queueLiCreator(object.sound_title);
      }
      // console.log(lettersQueue);
    }
  })
  
}

function queueLiCreator (trackId) {
  const li = document.createElement('li');
  li.classList.add('player_queue_li');
  li.id = 'player_queue_li_' + trackCounter;
  li.draggable = true;
  const liDiv = document.createElement('section');
  liDiv.classList.add('player_queue_section');
  li.append(liDiv);
  // let sections = [];
  // for (let i=0;i<3;i++) {
  //   const thisSection = document.createElement('section');
  //   thisSection.classList.add('player_queue_section');
  //   thisSection.id = 'player_queue_section_' + trackCounter + '_' + i;
  //   liDiv.append(thisSection);
  //   sections.push(thisSection);
  // }
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('player_queue_button');
  deleteBtn.classList.add('player_queue_delete_button');
  deleteBtn.classList.add('player_queue_item');
  deleteBtn.id = 'player_queue_delete_button_' + trackCounter;
  deleteBtn.innerHTML = 'X';
  liDiv.append(deleteBtn);
  const textSpan = document.createElement('div');
  textSpan.classList.add('player_queue_title_span');
  liDiv.append(textSpan);
  const trackTitle = document.createElement('p');
  trackTitle.classList.add('player_queue_title');
  trackTitle.classList.add('player_queue_item');
  trackTitle.id = 'player_queue_title_' + trackCounter;
  trackTitle.innerHTML = trackId.replace(/_/g,' ');
  textSpan.append(trackTitle);
  const dragBtn = document.createElement('button');
  dragBtn.classList.add('player_queue_button');
  dragBtn.classList.add('player_queue_drag_button');
  dragBtn.classList.add('player_queue_item');
  dragBtn.id = 'player_queue_drag_button_' + trackCounter;
  dragBtn.innerHTML = `<span class="player-icon-span" id="player-icon-span"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><title>queue</title><g><rect  class="icon-queue" x="2" y="4" rx="0.5" ry="0.5" width="15.48" height="2"/><rect class="icon-queue" x="2" y="10" rx="0.5" ry="0.5" width="15.48" height="2"/><rect class="icon-queue" x="2" y="16"  rx="0.5" ry="0.5" width="15.48" height="2"/></g><rect class="icon-container" width="24" height="24"/></svg></span>`;
  liDiv.append(dragBtn);
  console.log(liDiv.children);
  // liDiv.children.forEach(child=>child.classList.add('player_queue_element'));
  ulQueue.append(li);
  li.addEventListener('dragstart', () => {
    currentDrag = li;
  console.log(currentDrag);
});
  li.addEventListener('dragend', e => e.preventDefault());
  
  li.ondragover = e => e.preventDefault();
  li.ondragenter = e => e.preventDefault();
  li.addEventListener('drop', e => {
    e.preventDefault();
    console.log(currentDrag);

      if (li != currentDrag) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<ulQueue.children.length; it++) {
          if (currentDrag == ulQueue.children[it]) { 
            currentpos = it; 
          }
          if (li == ulQueue.children[it]) { 
            droppedpos = it; 
          }
        }
        console.log(lettersQueue);
        const letterElmIndx = lettersQueue.map(letter=>letter.id).indexOf(Number(currentDrag.children[0].children[0].id.substring(currentDrag.children[0].children[0].id.lastIndexOf('_')+1,currentDrag.children[0].children[0].id.length)));
        const currentLetterObj = lettersQueue.splice(letterElmIndx,1)[0];
        const droppedIndx = lettersQueue.map(letter=>letter.id).indexOf(Number(deleteBtn.id.substring(deleteBtn.id.lastIndexOf('_')+1,deleteBtn.id.length)));
        lettersQueue.splice(droppedIndx+1,0,currentLetterObj);
        console.log(lettersQueue);
        if (currentpos < droppedpos) {
          li.parentNode.insertBefore(currentDrag, li.nextSibling);
        } else {
          li.parentNode.insertBefore(currentDrag, li);
        }
        
      }
  })
  
  deleteBtn.addEventListener('click',()=>{
    li.remove();
    lettersQueue.splice(lettersQueue.map((letter)=>letter.id).indexOf(Number(deleteBtn.id.substring(deleteBtn.id.lastIndexOf('_')+1,deleteBtn.id.length))),1);
  })
  


}

// function eggshellTexture () {
//   const thisCanvas = document.createElement('canvas');
//   const thisCtx = thisCanvas.getContext('2d');
//   thisCanvas.width = 300; thisCanvas.height = 300;
//   // thisCanvas.style.background = 'white';
//   thisCtx.lineWidth = 5;
//   // thisCtx
//   thisCtx.strokeStyle = '#000';
//   thisCtx.beginPath();
//   thisCtx.moveTo(thisCanvas.width-1,thisCanvas.height/2);
//   thisCtx.bezierCurveTo(thisCanvas.width-1,thisCanvas.height/2,thisCanvas.width*0.75, thisCanvas.height*0.75,thisCanvas.width*0.6,thisCanvas.height);
//   thisCtx.bezierCurveTo(thisCanvas.width*0.5,thisCanvas.height,thisCanvas.width*0.25, thisCanvas.height*0.75,1,thisCanvas.height*0.6);
//   thisCtx.bezierCurveTo(thisCanvas.width*0.25, thisCanvas.height*0.75, 1,thisCanvas.height/2,1,thisCanvas.height/2);
//   thisCtx.lineTo(1, thisCanvas.height*0.65);
//   // thisCtx.bezierCurveTo(1,thisCanvas.height*0.65,thisCanvas.width*0.2,1,thisCanvas.width*0.4,0);
//   // thisCtx.lineTo(thisCanvas.width*0.3,3); //8
//   // thisCtx.lineTo(thisCanvas.width*0.55,2); //9
//   // thisCtx.lineTo(thisCanvas.width*0.65,4); //10
//   // thisCtx.lineTo(thisCanvas.width*0.7,4); //11
//   // thisCtx.bezierCurveTo(thisCanvas.width*0.7,4,thisCanvas.width-1,thisCanvas.height*0.3,thisCanvas.width,thisCanvas.height*0.6); //11-12
//   // thisCtx.lineTo(thisCanvas.width-1,thisCanvas.height/2); //1 again
//   thisCtx.stroke();
//   const thisTexture = new THREE.CanvasTexture(thisCanvas);
//   // thisTexture.magFilter = THREE.NearestFilter;
//   // thisTexture.minFilter = THREE.NearestFilter;
//   // thisCanvas.style.display = 'block';
//   // thisCanvas.style.position = 'absolute';
//   // // thisCanvas.style.top = 0;
//   // thisCanvas.style.left = 0;
//   // thisCanvas.style.zIndex = 5;
//   // console.log(thisCanvas);
//   // document.querySelector('body').appendChild(thisCanvas);
//   return thisTexture;
  
// }


function opacityAnimation (object, duration,endval,callback) {
  return gsap.to(object.material, {
    duration: duration,
    opacity: endval,
    onUpdate: function() {
      render();
      // console.log(opacity);
    },
    onComplete: callback,
    yoyo:false,
    repeat:0,
  })
}


// function comingForward (object, duration,endval,callback) {
//   return gsap.to(object.position, {
//     duration: duration,
//     z: endval, // The end value
//     onUpdate: function() {
//       render();
//     },
//     // onComplete: callback,
//     //   // opacityAnimation(skybox,2);
//     // },
//     // These just infinitely repeat the animation
//     yoyo: false,
//     // repeatRefresh: true,
//     repeat: 0,
//     ease: "power1.inOut",
//   });
// }

// function comingDown (object, duration,endval,callback) {
//   return gsap.to(object.position, {
//     duration: duration,
//     y: endval, // The end value
//     onUpdate: function() {
//       render();
//     },
//     // onComplete: callback,
//     //   // opacityAnimation(skybox,2);
//     // },
//     // These just infinitely repeat the animation
//     yoyo: false,
//     // repeatRefresh: true,
//     repeat: 0,
//     ease: "power1.inOut",
//   });
// }

// function rnd (min,max,isInt) {
//   return isInt ? Math.floor(Math.random() * max) + min : Math.random() * max + min;
//  }

 function onPointerMove ( event ) {

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function objectVisible (obj, index) {
  obj.object.visible = true;
  // if (typeof obj.posAudio !== 'string') {
  //   obj.posAudio.setLoop(true);
  //   obj.posAudio.play();
  //   // console.log('playing ' + obj.posAudio);
  // }
  if (objects[index].name === 'mirror') {
    leftMirror.visible = true;
    rightMirror.visible = true;
  }
  if (index++ < objects.length-1) {
    setTimeout(()=>objectVisible(objects[index],index),750);
  }
}

function audioPlayerInit () {
  // load sound via <audio> tag 
const audios = [];
// ,tracks =[];
const letter_num = 7;
// const audioElement = document.querySelector("audio")
// const audioCtx = new AudioContext()
// let track; 
// Player controls and attributes 
const playButton = document.querySelector(".player-play-btn")
const nextButton = document.querySelector('.player-next-btn');
const backButton = document.querySelector('.player-back-btn');
const playIcon = playButton.querySelector(".player-icon-play");
const pauseIcon = playButton.querySelector(".player-icon-pause");
const progress = document.querySelector(".player-progress");
const progressFilled = document.querySelector(".player-progress-filled");
progressFilled.style.cursor = 'grab';
const playerCurrentTime = document.querySelector(".player-time-current");
const playerDuration = document.querySelector(".player-time-duration");
const volumeControl = document.querySelector(".player-volume");
volumeControl.style.cursor = 'grab';
const imgs = document.querySelectorAll('.letters_images_container');
const soundsMenu = document.querySelector('.adding-sounds-container');
const collapMenu = document.querySelectorAll('.adding-sounds-collapsible');
const openMenuDiv = document.querySelector('.adding-sounds-options-container');
const elementalItems = document.querySelectorAll('.adding-sounds-item');
const elementalOffset = 0.6;
let hasPlayed = false;
console.log(collapMenu)

for (let i=1; i<=letter_num; i++) {
  const currentAudioElement = document.createElement('audio');
  currentAudioElement.src = './audio/letters/Letter to Maud part ' + i +'.mp3';
  currentAudioElement.preload = 'auto';
  currentAudioElement.id = 'audio_letter_'+i;
  currentAudioElement.classList.add('audio_letter');
  
  
  currentAudioElement.addEventListener("ended", () => onEndedHandler());
  currentAudioElement.addEventListener("timeupdate", () => {
    progressUpdate();
    setTimes();
  });
  const currentAudioCtx = new AudioContext();
  const gainNode = currentAudioCtx.createGain()
  const currentTrack = currentAudioCtx.createMediaElementSource(currentAudioElement);
  currentTrack.connect(gainNode).connect(currentAudioCtx.destination);

  audios.push({
    audio: currentAudioElement,
    ctx: currentAudioCtx,
    track: currentTrack,
    gain: gainNode
});
  // tracks.push(currentTrack);
  // console.log(audios);
}

for (let i=0;i<elementalItems.length;i++) {
  const currentAudioCtx = new AudioContext();
  const currentTrack = currentAudioCtx.createMediaElementSource(elementalItems[i].children[0].children[0]);
  elementalItems[i].track = currentTrack;
  elementalItems[i].gain = currentAudioCtx.createGain();
  elementalItems[i].track.connect(elementalItems[i].gain).connect(currentAudioCtx.destination);
  elementalItems[i].children[0].addEventListener('click', ()=> {
    currentAudioCtx.resume();
    elementalItems[i].gain.gain.value = volumeControl.value * elementalOffset;
    elementalItems[i].children[0].children[0].play();
    console.log(elementalItems[i].gain.gain.value);
  })}

  collapMenu.forEach(btn=> {
    // btn.style.display = 'none';
    btn.addEventListener('click', ()=> {
    if (btn.innerHTML === 'v') {
      collapMenu[1].classList.remove('adding-sounds-collapsible-hide');
      collapMenu[0].classList.add('adding-sounds-collapsible-hide');
      openMenuDiv.style.display = 'block';
    } else {
      collapMenu[0].classList.remove('adding-sounds-collapsible-hide');
      collapMenu[1].classList.add('adding-sounds-collapsible-hide');
      openMenuDiv.style.display = 'none';
    }
  })
})

// document.addEventListener("DOMContentLoaded", () => {
  // console.log('running audio script!');
  // Set times after page load 
  // if ()
  // setTimes()
  // Update progress bar and time values as audio plays 
  // audioElement.addEventListener("timeupdate", () => {
  //   progressUpdate()
  //   setTimes()
  // })
  // Play button toggle 
  playButton.addEventListener("click", () => {
    // check if context is in suspended state (autoplay policy) 
    // By default, browsers won't allow you to autoplay audio. 
    // You can override by finding the AudioContext state and resuming it after a user interaction like a "click" event. 
    if (typeof nowPlaying !== 'undefined') {
    if (audios[nowPlaying.sound-1].ctx.state === "suspended") {
      audios[nowPlaying.sound-1].ctx.resume()
      // stopElemental();
    }
    // Play or pause track depending on state 
    if (playButton.dataset.playing === "false") {
      setTimes();
      audios[nowPlaying.sound-1].gain.gain.value = volumeControl.value
      // if (n === '') {
        //  
      // }
      // track = audioCtx.createMediaElementSource(audios[nowPlaying.sound-1]);
      // stopElemental();
      audios[nowPlaying.sound-1].audio.play();
      
      console.log('playing ' + audios[nowPlaying.sound-1].audio.src);
      playButton.dataset.playing = "true";
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      if (nowPlaying.img.length === 1){ 
        if(nowPlaying.img[0].hasAppeared || nowPlaying.img[0].timecode === '00:00') {
        nowPlaying.img[0].hasAppeared = true;
        imgs[nowPlaying.img[0].index-1].classList.add('letters_images_container_show');
        imgs[nowPlaying.img[0].index-1].classList.remove('letters_images_container_hide');
        }
      } else {
        const currentIndex = nowPlaying.img[nowPlaying.imgIndex].index-1;
        nowPlaying.img[nowPlaying.imgIndex].hasAppeared = true;
        imgs[currentIndex].classList.add('letters_images_container_show');
        imgs[currentIndex].classList.remove('letters_images_container_hide');
      }
      if (!hasPlayed) {
        soundsMenu.classList.remove('letters_images_container_show');
        soundsMenu.classList.add('letters_images_container_hide');
        
        hasPlayed = true;
      }
      //  else if(nowPlaying.elementalMenu !== '00:00') {
      //   soundsMenu.classList.add('letters_images_container_show');
      //   soundsMenu.classList.remove('letters_images_container_hide');
      // }
    } else if (playButton.dataset.playing === "true") {
      audios[nowPlaying.sound-1].audio.pause();
      // playElemental();
      elementalItems.forEach(item=>item.children[0].children[0].pause());
      playButton.dataset.playing = "false";
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
      if (nowPlaying.img.length === 1) {
        if (nowPlaying.img[0].hasAppeared) {
        imgs[nowPlaying.img[0].index-1].classList.remove('letters_images_container_show');
        imgs[nowPlaying.img[0].index-1].classList.add('letters_images_container_hide');
      }
      } else {
        const currentIndex = nowPlaying.img[nowPlaying.imgIndex].index-1;
        imgs[currentIndex].classList.remove('letters_images_container_show');
        imgs[currentIndex].classList.add('letters_images_container_hide');

      }
      
    }
  }
  })

  nextButton.addEventListener("click", ()=> {
    console.log('next!');
    audios[nowPlaying.sound-1].audio.currentTime = audios[nowPlaying.sound-1].audio.duration-0.1;
    // progressUpdate();
    // audios[nowPlaying.sound-1].audio.pause();
    // onEndedHandler();
  });

  backButton.addEventListener("click",()=>{
    if (audios[nowPlaying.sound-1].audio.currentTime > 0) {
      audios[nowPlaying.sound-1].audio.currentTime = 0;
      progressUpdate();
    }
    

  })
  // if the track ends, reset the player 
  
  // Bridge the gap between gainNode and AudioContext so we can manipulate volume (gain) 
  
  // volumeControl = document.querySelector(".player-volume")
  volumeControl.addEventListener("change", () => {
    if (typeof nowPlaying !== 'undefined') {
      audios[nowPlaying.sound-1].gain.gain.value = volumeControl.value
  }
    elementalItems.forEach(item=>item.gain.gain.value = volumeControl.value * elementalOffset);
    // objects.forEach(object=> {
    //   if (object.posAudio !== '') {
    //     object.posAudio.setVolume(object.posAudioVol*volumeControl.value);
    //   }
    // })
  })

  
  // Display currentTime and duration properties in real-time 
  function setTimes() {
    playerCurrentTime.textContent = new Date(audios[nowPlaying.sound-1].audio.currentTime * 1000)
      .toISOString()
      .substring(11, 19)
    playerDuration.textContent = new Date(audios[nowPlaying.sound-1].audio.duration * 1000)
      .toISOString()
      .substring(11, 19)
  }
  // Update player timeline progress visually 
  function progressUpdate() {
    // console.log('prog!!!');
    const percent = (audios[nowPlaying.sound-1].audio.currentTime / audios[nowPlaying.sound-1].audio.duration) * 100;

    progressFilled.style.flexBasis = `${percent}%`;
    // if (nowPlaying.img.length === 1) {
      if (nowPlaying.img[0].timecode === playerCurrentTime.textContent.substring(3,8) && !nowPlaying.img[0].hasAppeared) {
        nowPlaying.img[0].hasAppeared = true;
        imgs[nowPlaying.img[0].index-1].classList.add('letters_images_container_show');
        imgs[nowPlaying.img[0].index-1].classList.remove('letters_images_container_hide');
      }
    // } else 
    if (nowPlaying.img.length > 1) {
      if (nowPlaying.img[1].timecode === playerCurrentTime.textContent.substring(3,8) && !nowPlaying.img[1].hasAppeared) {
        console.log(nowPlaying.imgIndex);
      let currentIndex = nowPlaying.img[nowPlaying.imgIndex].index-1;
      imgs[currentIndex].classList.remove('letters_images_container_show');
      imgs[currentIndex].classList.add('letters_images_container_hide');
      // nowPlaying.img[imgIndex].hasAppeared = false;
      nowPlaying.imgIndex = 1;
      currentIndex = nowPlaying.img[nowPlaying.imgIndex].index-1;
      console.log(imgs[currentIndex]);
      imgs[currentIndex].classList.add('letters_images_container_show');
      imgs[currentIndex].classList.remove('letters_images_container_hide');
      nowPlaying.img[nowPlaying.imgIndex].hasAppeared = true;
    }
    if (nowPlaying.elementalMenu !== '00:00' && nowPlaying.elementalMenu === playerCurrentTime.textContent.substring(3,8)) {
      soundsMenu.classList.add('letters_images_container_show');
      soundsMenu.classList.remove('letters_images_container_hide');
    }
  }}
  // Scrub player timeline to skip forward and back on click for easier UX 
  let mousedown = false
  function scrub(event) {
    const scrubTime =
      (event.offsetX / progress.offsetWidth) * audios[nowPlaying.sound-1].audio.duration;
    audios[nowPlaying.sound-1].audio.currentTime = scrubTime;
  }

  function onEndedHandler () {
    console.log('ended!');
    progressFilled.style.flexBasis = "0%"
    audios[nowPlaying.sound-1].currentTime = 0;
    hasPlayed = false;
    nowPlaying.img.forEach(img=> {
      img.hasAppeared = false;
      imgs[img.index-1].classList.remove('letters_images_container_show');
      imgs[img.index-1].classList.add('letters_images_container_hide');
    })
    if (nowPlaying.elementalMenu === '00:00') {
      soundsMenu.classList.add('letters_images_container_show');
      soundsMenu.classList.remove('letters_images_container_hide');
    }

    // if (nowPlaying.img === 'no' && nowPlaying.elementalMenu !== '00:00') {
    //   // playElemental();
    // }
    
    // audios[nowPlaying.sound-1].audio.duration = audios[nowPlaying.sound-1].audio.duration;
    if (lettersQueue.length > 0) {
      nowPlaying = lettersQueue.shift();
      ulQueue.children[0].remove();
      trackNamePH.innerHTML = nowPlaying.title.replace(/_/g,' ');
      // console.log(nowPlaying);
      setTimes();
      
      // progressUpdate();
      // audioElement = audios[nowPlaying.sound-1];
      audios[nowPlaying.sound-1].gain.gain.value = volumeControl.value;
      if (playButton.dataset.playing === 'false') {
        playButton.dataset.playing = "true";
        pauseIcon.classList.remove("hidden");
        playIcon.classList.add("hidden");
      }
      audios[nowPlaying.sound-1].audio.play();
      // if (nowPlaying.img.length === 1){ 
      //   if(nowPlaying.img[0].hasAppeared || nowPlaying.img[0].timecode === '00:00') {
      //   nowPlaying.img[0].hasAppeared = true;
      //   imgs[nowPlaying.img[0].index-1].classList.add('letters_images_container_show');
      //   imgs[nowPlaying.img[0].index-1].classList.remove('letters_images_container_hide');
      //   }
      // } else {
      //   const currentIndex = nowPlaying.img[nowPlaying.imgIndex].index-1;
      //   nowPlaying.img[nowPlaying.imgIndex].hasAppeared = true;
      //   imgs[currentIndex].classList.add('letters_images_container_show');
      //   imgs[currentIndex].classList.remove('letters_images_container_hide');
      // }
      if (!hasPlayed) {
        soundsMenu.classList.remove('letters_images_container_show');
        soundsMenu.classList.add('letters_images_container_hide');
        
        hasPlayed = true;
      }
      // setTimeout(()=>audios[nowPlaying.sound-1].audio.play(),50);
    //   if (nowPlaying.img !== 'no') {
    //     if (nowPlaying.img.timecode === '00:00') {
    //     setTimeout(()=>{
    //     imgs[nowPlaying.img.index-1].classList.add('letters_images_container_show');
    //     imgs[nowPlaying.img.index-1].classList.remove('letters_images_container_hide');
    //   },2000);
    // }
    //     }
      if (lettersQueue.length === 0) {
        // trackQueuePH = 'Click on an object to add audio letters to the queue';
        trackQueuePH.style.display = 'block';
        ulQueue.style.display = 'none';
      }
    } else {
      console.log('no more tracks queued!');
      firstPlay = false;
      playerCurrentTime.innerHTML = '00:00';
      playerDuration.innerHTML = '00:00';
      nowPlaying = undefined;
      console.log(typeof nowPlaying);
      trackNamePH.innerHTML = playingPH;
      playButton.dataset.playing = "false"
      pauseIcon.classList.add("hidden")
      playIcon.classList.remove("hidden")
    }
    
  }
  progress.addEventListener("click", scrub)
  progress.addEventListener("mousemove", (e) => mousedown && scrub(e))
  progress.addEventListener("mousedown", () => (mousedown = true))
  progress.addEventListener("mouseup", () => (mousedown = false))
// })
function stopElemental () {
  // objects.forEach(obj=>
  //   {
  //     if (typeof obj.posAudio !== 'string') {
  //       // if (!obj.posAudio.isPlaying) {
  //       fadeVol(obj.posAudioVol*volumeControl.value,0,0.01,obj.posAudio);
  //       // obj.posAudio.stop();
        
  //     // }
  //   }
  // }
  // )
}
function playElemental () {
  // objects.forEach(obj=>
  //   {
  //     if (typeof obj.posAudio !== 'string') {
  //       // if (!obj.posAudio.isPlaying) {
  //       obj.posAudio.setLoop(true);
  //       obj.posAudio.play();
  //       fadeVol(0,obj.posAudioVol*volumeControl.value,0.01,obj.posAudio);
  //     // }
  //   }
  // }
  // )
}

function fadeVol (vol, end, interval, soundElement) {
//   // if (end > vol) {}
//   if (Math.abs(end-vol) > interval) {
//     if (end > vol) {
//       vol += interval;
//     } else {
//       vol -= interval;
//     }
//       soundElement.setVolume(vol);
//       // console.log(soundElement.getVolume());
//       setTimeout(()=>fadeVol (vol,end,interval, soundElement),1);

//   } else {
//       soundElement.setVolume(end);
//       if (end === 0) {
//         soundElement.stop();
//       }
//   }

}
}

