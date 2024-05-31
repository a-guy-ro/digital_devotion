
// import * as files from '../images/screenshots/imgs_links_sheet.json' assert { type: 'json' };
let links, images =[], movesCount = 0, moveThresh = 10;
let mouseMove = {x:0, y:0};
let lastMousePoses = [];
let rs = 1;
let doubleTap = false;
let touchType = 'mouse';
// let dist = {x:0,y:0};
const imgUrls = [
{title:'Contemporaryand Instagram.png', id:'a'}, 
{title: 'call and response.png', id: 'b'}, 
{title: 'Maud Sulter within the frame.jpg', id: 'c'}, 
{title:'Evan Ife Instagram Post.jpg', id:'d'}, 
{title: 'Tate Maud Sulter Zabat.png', id:'e'}
];

const path = './images/screenshots/';
const json = [
    {
        "link": "https://maudsulterpassion.wordpress.com/publications/",
        "image": "Maud publications.jpg",
        "title": "Selected Publications on Maud Sulter"
    },
    {
        "link": "https://maudsulterpassion.wordpress.com/selected-writings/",
        "image": "Maud writing.jpg",
        "title": "Selected Writings on Maud Sulter"
    },
    {
        "link": "https://www.vam.ac.uk/articles/zabat-photographs-by-maud-sulter",
        "image": "",
        "title": "See the full series of ‘Zabat’ photographs here"
    },
    // {
    //     "link": "https://onlinelibrary.wiley.com/doi/abs/10.1111/1467-8365.12583",
    //     "image": "Mauld Sulter Estate Instagram.jpg",
    //     "title": "Read ‘Call and Response’ by Maud Sulter via Wiley online library here"
    // },
    {
        "link": "https://autograph.org.uk/blog/texts/art-of-devotion-belief-faith-and-spirit-in-creative-practice/",
        "image": "Art of Devotion Autograph ABP.jpg",
        "title": "Art of Devotion blog for Autograph ABP"
    },
    {
        "link": "https://awarewomenartists.com/en/artiste/maud-sulter/",
        "image": "Maud Sulter.jpg",
        "title": "AWARE: Archives of Women Artists, Research and Exhibitions"
    },
    {
        "link": "https://www.instagram.com/p/COnwNcQLX95",
        "image": "Bernadine Evaristo on Maud Instagram.jpg",
        "title": "Bernadine Evaristo on Maud via instagram"
    },
    {
        "link": "https://www.instagram.com/p/CwiNMIYMgs0",
        "image": "Contemporaryand Instagram.jpg",
        "title": "Contemporaryand artist portrait on Maud via instagram"
    },
    {
        "link": "https://www.tate.org.uk/art/artworks/sulter-les-bijoux-ix-p82555",
        "image": "Tate Maud Sulter Zabat.png",
        "title": "Les Bijoux photographic series, Tate Collection"
    },
    {
        "link": "https://artuk.org/learn/learning-resources/maud-sulter-and-the-subversive-portrait",
        "image": "ArtUK Subversive Frame.png",
        "title": "Maud Sulter and the subversive portrait, learning resource ArtUK "
    },
    {
        "link": "https://womensart.murrayedwards.cam.ac.uk/event/maud-sulter-centre-frame/",
        "image": "Murray Edwards Exhibition.jpg",
        "title": "Maud Sulter The Centre of the Frame exhibition, Murray Edwards College Cambridge 2021-22"
    },
    {
        "link": "https://www.impressions-gallery.com/event/maud-sulter-passion/",
        "image": "Impressions Gallery Maud Passion.jpg",
        "title": "Maud Sulter Passion exhibition, Impression Gallery, 2016"
    },
    {
        "link": "https://www.impressions-gallery.com/wp-content/uploads/2019/09/Exhibition-Guide_Final_lores.pdf ",
        "image": "",
        "title": "Impression Gallery Exhibition guide"
    },
    {
        "link": "https://www.hasta-standrews.com/features/2022/2/13/rendering-the-invisible-visible-maud-sulters-zabat",
        "image": "Maud Sulter’s Zabat by Beth James.jpg",
        "title": "‘Rendering the Invisible Visible: Maud Sulter’s Zabat’ By Beth James"
    },
    {
        "link": "https://en.wikipedia.org/wiki/Maud_Sulter",
        "image": "Maud Sulter Wiki.png",
        "title": "Wikipedia"
    },
    {
        "link": " https://search.worldcat.org/title/26504957",
        "image": "",
        "title": "Worldcat"
    }
]
main();

function main () {
    // console.log(files);
    window.addEventListener('touchstart',()=> touchType = 'touch');
    const linksList = document.querySelector('#south_list');
    const framesContainer = document.querySelector('.frames_container');
    const vids = document.querySelectorAll('#player');
    // if (window) {
    //     rs = window.devicePixelRatio;
    // }
    
    vids.forEach(vid=>{
        vid.addEventListener('dragover',e=>e.preventDefault());
        vid.addEventListener('dragenter',e=>e.preventDefault());
        vid.addEventListener('dragleave',e=>e.preventDefault());
        vid.addEventListener('mouseover',e=>e.preventDefault());
        vid.addEventListener('mouseenter',e=>e.preventDefault());
    });
    // vids.forEach(vid=>vid.addEventListener('dragenter',e=>e.preventDefault()));
    // vids.forEach(vid=>vid.addEventListener('dragover',e=>e.preventDefault()));
    linksList.addEventListener('dragover',e=>e.preventDefault());
    linksList.addEventListener('dragenter',e=>e.preventDefault());
    linksList.addEventListener('dragleave',e=>e.preventDefault());
    // fetch('../images/screenshots/imgs_links_sheet.json')
    // .then((response) => response.json())
    // .then((json) => {
        // const json = JSON.parse(imgs_links_sheet);
        json.forEach((file,indx)=>{
            if (file.image !== '') {
        let firstTouch = false;
        const currentLi = document.createElement('li');
        currentLi.classList.add('list_itme');
        currentLi.id = 'list_item_' + indx;
        const currentBtn = document.createElement('button');
        currentBtn.type = 'button';
        currentBtn.classList.add('south_img_btn');
        currentBtn.innerHTML = file.title;
        currentLi.append(currentBtn);
        linksList.append(currentLi);
        const currentLink = document.createElement('a');
        currentLink.target = '_blank';
        currentLink.rel = 'noopener noreferrer';
        currentLink.href = file.link;
        framesContainer.append(currentLink);
        const img = document.createElement('img');
        img.src = path + file.image;
        img.classList.add('south_img');
        img.id = 'south_img_' + indx;
        img.classList.add('frame_hide');
        const currentWidth = window.innerWidth*rnd(0.25,0.45,false);
        // const currentHeight = rnd(20,30,true);
        img.width = currentWidth;
        const cloned = document.createElement('img');
        cloned.src = img.src;
        cloned.width = 1;
        cloned.style.opacity = 0;
        document.body.appendChild(cloned);

        // img.style.display = 'inherit';
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('south_img_div');
        imgDiv.appendChild(img);
        imgDiv.draggable = true;
        // create an empty <span>
        let startDist = {x:0,y:0}; 
        let d1;
// your DataTransfer code here--assume we put it in a variable called 'dt'
        let isEnlarging = false;
        let dragMove = false;
        imgDiv.addEventListener('mouseover', e => {
            firstTouch = true;
            let dist = {x:0,y:0}
            mouseMoveHandler(e);
            currentDist(imgDiv, dist);
            if (dist.x > img.width*0.95 && dist.y > img.height *0.95) {
                imgDiv.style.cursor = 'nwse-resize';
            } else if ((dist.x > img.width*0.95 && dist.y<img.height*0.05)) {
                imgDiv.style.cursor = 'nesw-resize';
            } else {
                imgDiv.style.cursor = 'grab';
            }
            
        });
        imgDiv.addEventListener('mouseleave', ()=> firstTouch = false);
        imgDiv.addEventListener('dragstart', e => {    
            mouseMoveHandler(e);
            console.log(e);
            console.log(window.devicePixelRatio);
            currentDist(imgDiv,startDist);
            console.log('ondragstart!');
            e.dataTransfer.effectAllowed = "move";
            
            const dt = e.dataTransfer;
            dt.setDragImage(cloned, 0, 0);
            imgDiv.style.zIndex = 6;
            if ((startDist.x > img.width*0.95 && startDist.y > img.height *0.95)||(startDist.x > img.width*0.95 && startDist.y<img.height*0.05)) {
                isEnlarging = true
                
            } else {
                isEnlarging = false;
            }
        });
        imgDiv.addEventListener('touchstart', e => {   
            if (e.touches.length === 2) {
                e.preventDefault();
                
                d1 = 1;
                // dist(e);
              } else if (!firstTouch) { 
            firstTouch = true;
            setTimeout(()=>firstTouch = false,100);
            mouseMoveHandler(e);
            console.log(e);
            console.log(window.devicePixelRatio);
            currentDist(imgDiv,startDist);
            console.log('ontouchstart!');
            // e.dataTransfer.effectAllowed = "move";
            
            // const dt = e.dataTransfer;
            // dt.setDragImage(cloned, 0, 0);
            imgDiv.style.zIndex = 6;
            // if ((startDist.x > img.width*0.95 && startDist.y > img.height *0.95)||(startDist.x > img.width*0.95 && startDist.y<img.height*0.05)) {
            //     isEnlarging = true
                
            // } else {
            //     isEnlarging = false;
            // }
        } else {
                firstTouch = false;
                window.open(currentLink.href,"_blank");
            }
        });
        imgDiv.addEventListener('drag', (e) => {
            e.preventDefault();
            
            if (!isEnlarging) {
            imgDiv.style.cursor = 'drag';
            const currentLeft = ((e.clientX-startDist.x)/window.innerWidth)*100;            
            const currentTop = ((e.clientY-startDist.y)/window.innerHeight)*100;
            imgDiv.style.left = currentLeft + '%';
            imgDiv.style.top = currentTop + '%';
            // console.log(imgDiv.style);
            // console.log(e.clientX);
        } else {
            
            const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
            const currentWidth =  e.clientX - currentLeft;
            if (currentWidth>0) {
            imgDiv.width = currentWidth;
            img.width = currentWidth;
        }
            // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);

        }
        });
        imgDiv.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                //get the ratio
            if (!dragMove) {
                const rf = 1;
                dragMove = true;
            } else {
                const rf = dist(e) / d1 * rs;
            }
            // if (rf > 2) {
            //     rf = 1;
            // }
            
            imgDiv.style.transform = "scale(" + rf + ")";
            } else if (!firstTouch) {
            e.preventDefault();
            
            if (!isEnlarging) {
            imgDiv.style.cursor = 'drag';
            const currentLeft = ((e.touches[0].pageX-startDist.x)/window.innerWidth)*100;            
            const currentTop = ((e.touches[0].pageY-startDist.y)/window.innerHeight)*100;
            imgDiv.style.left = currentLeft + '%';
            imgDiv.style.top = currentTop + '%';
            // console.log(imgDiv.style);
            // console.log(e.clientX);
        } else {
            
        //     // const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
        //     // const currentWidth =  e.touches[0].pageX - currentLeft;
        //     // if (currentWidth>0) {
        //     // imgDiv.width = currentWidth;
        //     // img.width = currentWidth;
        // }
            // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);

        }}
        });
        imgDiv.addEventListener('dragend', (e) => {
            e.preventDefault();
            // imgDiv.style.cursor = 'pointer';
            imgDiv.style.zIndex  = rnd(1,5,true);
            const lastLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
            if (!isEnlarging) {
                if (e.clientX < lastLeft + 50)
                {const currentLeft = ((e.clientX-startDist.x)/window.innerWidth)*100;            
                const currentTop = ((e.clientY-startDist.y)/window.innerHeight)*100;
                imgDiv.style.left = currentLeft + '%';
                imgDiv.style.top = currentTop + '%';
                console.log(e);}
            } 
            else {
                if (e.clientX < lastLeft + 50){
                const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
                const currentWidth =  e.clientX - currentLeft;
                imgDiv.width = currentWidth;
                img.width = currentWidth;}
                // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
    
            }
        });
        imgDiv.addEventListener('touchend', (e) => {
            dragMove = false;
            if (!firstTouch) {
            e.preventDefault();
            // imgDiv.style.cursor = 'pointer';
            imgDiv.style.zIndex  = rnd(1,5,true);
            const lastLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
            if (!isEnlarging) {
                if (e.touches[0].pageX < lastLeft + 50)
                {const currentLeft = ((e.touches[0].pageX-startDist.x)/window.innerWidth)*100;            
                const currentTop = ((e.touches[0].pageY-startDist.y)/window.innerHeight)*100;
                imgDiv.style.left = currentLeft + '%';
                imgDiv.style.top = currentTop + '%';
                console.log(e);}
            } 
            // else {
            //     if (e.clientX < lastLeft + 50){
            //     const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
            //     const currentWidth =  e.touches[0].pageX - currentLeft;
            //     imgDiv.width = currentWidth;
            //     img.width = currentWidth;}
            //     // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
    
            // }
        }
        });
          
        imgDiv.addEventListener('dragover',  e => e.preventDefault());
        imgDiv.addEventListener('dragenter', e => e.preventDefault());
        currentLink.appendChild(imgDiv);
        // if (touchType === 'touch') {
        // currentLink.addEventListener('touchstart', ()=> {
        //     // webkitURL.pr
        //     if (firstTouch) {
        //         window.open(currentLink.href,"_blank");
        //     }
        // });}
        currentBtn.addEventListener('click', (e)=>onLinkHover(e, imgDiv, currentBtn));
    } else {
        const currentLi = document.createElement('li');
        currentLi.classList.add('list_itme');
        currentLi.id = 'list_item_' + indx;
        const currentLink = document.createElement('a');
        currentLink.target = '_blank';
        currentLink.rel = 'noopener noreferrer';
        currentLink.href = file.link;
        currentLink.innerHTML = file.title;
        currentLink.classList.add('south_img_btn');
        currentLink.classList.add('south_img_btn_a');
        currentLi.append(currentLink);
        linksList.append(currentLi);

    }
        })
     
        function dist(a) {
            let zw = a.touches[0].pageX - a.touches[1].pageX, zh = a.touches[0].pageY - a.touches[1].pageY;
            return Math.sqrt(zw * zw + zh * zh);
          }
        // console.log(json)
    // });
//     links = document.querySelectorAll('a');
//     const buttons = document.querySelectorAll('.south_img_btn');
 
//     console.log(imgUrls);
//     links.forEach((link, ndx)=>{
//         if (ndx < links.length-1) {
//         // console.log(link);
//         // const iframe = document.createElement('iframe');
//         // iframe.src = link.href;
//         // iframe.classList.add('links_frames');
//         // iframe.id = 'links_frame_'+link.innerText;
//         // iframe.title = link.innerText;
//         // iframe.classList.add('frame_hide');
//         link.target = '_blank';
//         link.rel = 'noopener noreferrer';
//         const img = document.createElement('img');
//         img.src = path + imgUrls[ndx].title;
//         img.classList.add('south_img');
//         img.id = 'south_img_' + imgUrls[ndx].id;
//         img.classList.add('frame_hide');
//         const currentWidth = window.innerWidth*rnd(0.15,0.25,false);
//         // const currentHeight = rnd(20,30,true);
//         img.width = currentWidth;
//         const cloned = document.createElement('img');
//         cloned.src = img.src;
//         cloned.width = 1;
//         cloned.style.opacity = 0;
//         document.body.appendChild(cloned);

//         // img.style.display = 'inherit';
//         const imgDiv = document.createElement('div');
//         imgDiv.classList.add('south_img_div');
//         imgDiv.appendChild(img);
//         imgDiv.draggable = true;
//         // create an empty <span>
//         let startDist = {x:0,y:0}; 

// // your DataTransfer code here--assume we put it in a variable called 'dt'
//         let isEnlarging = false;
//         imgDiv.onmouseover = e => {
//             let dist = {x:0,y:0}
//             mouseMoveHandler(e);
//             currentDist(imgDiv, dist);
//             // if (lastMousePoses.length === moveThresh && lastMousePoses[0].x == mouseMove.x && lastMousePoses[0].y == mouseMove.y) {
//             //     imgDiv.style.cursor = 'pointer';
//             // }
//             // else 
//             if (dist.x > img.width*0.95 && dist.y > img.height *0.95) {
//                 imgDiv.style.cursor = 'nwse-resize';
//             } else if ((dist.x > img.width*0.95 && dist.y<img.height*0.05)) {
//                 imgDiv.style.cursor = 'nesw-resize';
//             } else {
//                 imgDiv.style.cursor = 'grab';
//             }
//             // setTimeout(()=>imgDiv.style.cursor = 'pointer',1000);
//             // if (lastMousePoses.length < moveThresh) {
//             //     lastMousePoses.push(mouseMove);
//             // } else {
//             //     lastMousePoses.shift();
//             //     lastMousePoses.push(mouseMove);
//             // }
//             // console.log(lastMousePoses);
            
//         }
//         imgDiv.ondragstart = e => {    
//             mouseMoveHandler(e);
            
            
//             currentDist(imgDiv,startDist);
//             console.log('ondragstart!');
//             e.dataTransfer.effectAllowed = "move";
            
//             const dt = e.dataTransfer;
//             dt.setDragImage(cloned, 0, 0);
//             imgDiv.style.zIndex = 6;
//             if ((startDist.x > img.width*0.95 && startDist.y > img.height *0.95)||(startDist.x > img.width*0.95 && startDist.y<img.height*0.05)) {
//                 isEnlarging = true
                
//             } else {
//                 isEnlarging = false;
//             }
//         }
//         imgDiv.ondrag = (e) => {
//             e.preventDefault();
            
//             if (!isEnlarging) {
//             imgDiv.style.cursor = 'drag';
//             const currentLeft = ((e.clientX-startDist.x)/window.innerWidth)*100;            
//             const currentTop = ((e.clientY-startDist.y)/window.innerHeight)*100;
//             imgDiv.style.left = currentLeft + '%';
//             imgDiv.style.top = currentTop + '%';
//         } else {
            
//             const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
//             const currentWidth =  e.clientX - currentLeft;
//             if (currentWidth>0) {
//             imgDiv.width = currentWidth;
//             img.width = currentWidth;
//         }
//             // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);

//         }
//         }
//         imgDiv.ondragend = (e) => {
//             e.preventDefault();
//             // imgDiv.style.cursor = 'pointer';
//             imgDiv.style.zIndex  = rnd(1,5,true);
//             if (!isEnlarging) {
//                 const currentLeft = ((e.clientX-startDist.x)/window.innerWidth)*100;            
//                 const currentTop = ((e.clientY-startDist.y)/window.innerHeight)*100;
//                 imgDiv.style.left = currentLeft + '%';
//                 imgDiv.style.top = currentTop + '%';
//             } else {
//                 const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
//                 const currentWidth =  e.clientX - currentLeft;
//                 imgDiv.width = currentWidth;
//                 img.width = currentWidth;
//                 // window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
    
//             }
//         }
          
//         imgDiv.ondragover = e => e.preventDefault();
//         imgDiv.ondragenter = e => e.preventDefault();
//         link.appendChild(imgDiv);
//         images.push(imgDiv);
//         buttons[ndx].onclick = (e)=>onLinkHover(e, imgDiv);
//         // link.onclick = (e)=>onLinkHover(e, iframe);
//         // link.onmouseleave = () => onLinkLeave(iframe);
//     }
// });
    
    // buttons.forEach(btn => {
    //     btn.onclick = (e)=>onLinkHover
    // })
}

function onLinkHover(e, iframe, btn) {
    e.preventDefault();
    let isShown = false;
    iframe.classList.forEach((item) => {
        if (item === 'frame_show') {
            isShown = true;
        }
    });
    if (!isShown) {
    btn.classList.add('south_img_btn_clicked');
    const currentWidth = rnd(20,30,true);
    const currentHeight = rnd(20,30,true);
    const currentWidthpx = window.innerWidth*rnd(0.325,0.375,false);
    iframe.width = currentWidthpx;
    iframe.children[0].width = currentWidthpx;
    iframe.style.left = rnd(18,90-currentWidth,true)+'%';
    iframe.style.top = rnd(2,50,true)+'%';
    iframe.style.zIndex  = rnd(1,5,true);
    iframe.classList.remove('frame_hide');
    iframe.children[0].classList.remove('frame_hide');
    iframe.classList.add('frame_show');
    iframe.children[0].classList.add('frame_show');
    console.log(iframe);
    } else {
        onLinkLeave(iframe);
        btn.classList.remove('south_img_btn_clicked');
    }
   return false;
}

function onLinkLeave(iframe) {
    iframe.classList.add('frame_hide');
    iframe.classList.remove('frame_show');
}
function rnd (min,max,isInt) {
    return isInt ? Math.floor(Math.random() * max) + min : Math.random() * max + min;
   }
function currentDist (imgDiv, dist) {
const currentLeft = window.innerWidth*(Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100);
console.log((Number(imgDiv.style.left.slice(0,imgDiv.style.left.indexOf('%')))/100));
const currentTop = window.innerHeight*(Number(imgDiv.style.top.slice(0,imgDiv.style.top.indexOf('%')))/100);
if (currentLeft > 0) {
dist.x = mouseMove.x - currentLeft;
}
if (currentTop > 0) {
dist.y = mouseMove.y - currentTop;
}
console.log(dist);
}
function mouseMoveHandler (e) {
    mouseMove.x = e.clientX || e.touches[0].pageX;
    mouseMove.y = e.clientY || e.touches[0].pageY;
}