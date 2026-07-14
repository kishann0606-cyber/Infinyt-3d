/* ==========================================
   INFINYT3D WEBSITE ANIMATIONS
========================================== */



/* ==========================
   HEADER SCROLL EFFECT
========================== */

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 60){

        header.style.background = "rgba(2,10,22,.95)";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.45)";

    }else{

        header.style.background = "rgba(4,12,28,.75)";
        header.style.boxShadow = "none";

    }

});


/* ==========================
   HERO PARALLAX
========================== */

const heroImage = document.querySelector(".hero-right img");

window.addEventListener("mousemove",(e)=>{

    const x = (window.innerWidth/2 - e.pageX)/35;
    const y = (window.innerHeight/2 - e.pageY)/35;

    heroImage.style.transform =
    `translate(${x}px,${y}px)`;

});


/* ==========================
   BUTTON RIPPLE EFFECT
========================== */

document.querySelectorAll(".primary-btn,.learn-btn").forEach(btn=>{

btn.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";
ripple.style.height=size+"px";

ripple.style.left=(e.clientX-rect.left-size/2)+"px";
ripple.style.top=(e.clientY-rect.top-size/2)+"px";

ripple.classList.add("ripple");

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},700);

});

});


/* ==========================
   SCROLL REVEAL
========================== */

const revealElements=document.querySelectorAll(

".hero-left,.hero-right,.product-card"

);

const reveal=()=>{

const trigger=window.innerHeight*0.85;

revealElements.forEach(el=>{

const top=el.getBoundingClientRect().top;

if(top<trigger){

el.classList.add("show");

}

});

};

window.addEventListener("scroll",reveal);

reveal();


/* ==========================
   FLOATING GLOW FOLLOWER
========================== */

const glow=document.createElement("div");

glow.className="cursor-glow";

document.body.appendChild(glow);

window.addEventListener("mousemove",(e)=>{

glow.style.left=e.clientX+"px";

glow.style.top=e.clientY+"px";

});


/* ==========================
   NUMBER COUNTER
========================== */

const counters=document.querySelectorAll(".count");

const counterObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter=entry.target;

const target=+counter.dataset.target;

let count=0;

const speed=target/120;

const update=()=>{

count+=speed;

if(count<target){

counter.innerText=Math.floor(count);

requestAnimationFrame(update);

}else{

counter.innerText=target;

}

};

update();

counterObserver.unobserve(counter);

}

});

});

counters.forEach(c=>counterObserver.observe(c));
/*==============================
WHY CARD ANIMATION
==============================*/

const whyCards = document.querySelectorAll(".why-card");

const whyObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:0.2
});

whyCards.forEach(card=>whyObserver.observe(card));
/*==============================
PROJECT ANIMATION
==============================*/

const projectCards = document.querySelectorAll(".project-card");

const projectObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:0.2
});

projectCards.forEach(card=>projectObserver.observe(card));
/*=========================================
        PAUSE TESTIMONIAL SLIDER
=========================================*/

const slider = document.querySelector(".testimonial-track");

slider.addEventListener("mouseenter",()=>{

slider.style.animationPlayState="paused";

});

slider.addEventListener("mouseleave",()=>{

slider.style.animationPlayState="running";

});
/*========================================
        LOADER
========================================*/

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

setTimeout(()=>{

loader.style.opacity="0";

loader.style.visibility="hidden";

},1200);

});


/*========================================
      SCROLL PROGRESS
========================================*/

window.addEventListener("scroll",()=>{

const winScroll=document.documentElement.scrollTop;

const height=

document.documentElement.scrollHeight-

document.documentElement.clientHeight;

const scrolled=(winScroll/height)*100;

document.getElementById("progressBar").style.width=scrolled+"%";

});


/*========================================
      BACK TO TOP
========================================*/

const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};


/*========================================
        PARTICLES
========================================*/

const particles=document.getElementById("particles");

for(let i=0;i<35;i++){

let particle=document.createElement("span");

particle.classList.add("particle");

particle.style.left=Math.random()*100+"%";

particle.style.width=Math.random()*8+3+"px";

particle.style.height=particle.style.width;

particle.style.animationDuration=(Math.random()*10+8)+"s";

particle.style.animationDelay=Math.random()*5+"s";

particles.appendChild(particle);

}
/*==========================================
    3D CARD EFFECT
==========================================*/

document.querySelectorAll(

'.product-card,.steam-card,.why-card,.testimonial-card,.project-card'

).forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=((x/rect.width)-0.5)*18;

const rotateX=((y/rect.height)-0.5)*-18;

card.style.transform=

`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
scale(1.04)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="perspective(1000px) rotateX(0) rotateY(0)";

});

});


/*==========================================
      SPOTLIGHT
==========================================*/

const spotlight=document.createElement("div");

spotlight.className="spotlight";

document.body.appendChild(spotlight);

window.addEventListener("mousemove",(e)=>{

spotlight.style.left=e.clientX+"px";

spotlight.style.top=e.clientY+"px";

});


/*==========================================
      SCROLL REVEAL
==========================================*/

const sections=document.querySelectorAll("section");

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate([

{

opacity:0,

transform:"translateY(80px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],{

duration:900,

fill:"forwards"

});

}

});

},{
threshold:.15
});

sections.forEach(section=>observer.observe(section));
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hadonhlztjitdqtxckgq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZG9uaGx6dGppdGRxdHhja2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzMyMTcsImV4cCI6MjA5ODU0OTIxN30.svAgJLYltuvFhv4oTSovkPYYmn67KQmo52MvYE88XuU';

const supabase = createClient(supabaseUrl, supabaseKey);
const fileInput = document.getElementById("zipFile");

async function uploadZip() {
    const file = fileInput.files[0];

    const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`zip/${file.name}`, file);

    if (error) {
        console.log(error);
    } else {
        console.log("Uploaded successfully!", data);
    }
}