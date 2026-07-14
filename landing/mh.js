/* ==========================================
   INFINYT 3D - app.js
========================================== */

// ===============================
// ELEMENTS
// ===============================

const logoContainer = document.getElementById("logoContainer");
const hero = document.querySelector(".hero");
const splitContainer = document.getElementById("splitContainer");
const pages = document.getElementById("pages");

const steamBtn = document.getElementById("steamBtn");
const designBtn = document.getElementById("designBtn");


// ===============================
// LOGO CLICK
// ===============================

if (logoContainer) {

    logoContainer.addEventListener("click", () => {

        logoContainer.classList.add("split-active");

        gsap.to(hero, {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {

                hero.style.display = "none";

                splitContainer.classList.add("active");

            }
        });

    });

}


// ===============================
// OPEN STEAM PAGE
// ===============================

if (steamBtn) {

    steamBtn.addEventListener("click", () => {

        splitContainer.style.display = "none";

        pages.classList.add("active");

        document.querySelector(".steam").style.display = "flex";

        document.querySelector(".design").style.display = "none";

    });

}


// ===============================
// OPEN DESIGN PAGE
// ===============================

if (designBtn) {

    designBtn.addEventListener("click", () => {

        splitContainer.style.display = "none";

        pages.classList.add("active");

        document.querySelector(".design").style.display = "flex";

        document.querySelector(".steam").style.display = "none";

    });

}


// ===============================
// THREE.JS BACKGROUND
// ===============================

const canvas = document.getElementById("bgCanvas");

if (canvas) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({

        canvas: canvas,

        alpha: true,

        antialias: true

    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles

    const geometry = new THREE.BufferGeometry();

    const vertices = [];

    for (let i = 0; i < 2500; i++) {

        vertices.push(

            (Math.random() - 0.5) * 20,

            (Math.random() - 0.5) * 20,

            (Math.random() - 0.5) * 20

        );

    }

    geometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(vertices, 3)

    );

    const material = new THREE.PointsMaterial({

        color: 0x00d9ff,

        size: 0.04,

        transparent: true,

        opacity: 0.8

    });

    const particles = new THREE.Points(

        geometry,

        material

    );

    scene.add(particles);


    function animate() {

        requestAnimationFrame(animate);

        particles.rotation.y += 0.0007;

        particles.rotation.x += 0.0003;

        renderer.render(scene, camera);

    }

    animate();


    window.addEventListener("resize", () => {

        camera.aspect =

            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    });

}


// ===============================
// CUSTOM CURSOR
// ===============================

const cursor = document.querySelector(".cursor");

const cursorRing = document.querySelector(".cursor-ring");

if (cursor && cursorRing) {

    document.addEventListener("mousemove", e => {

        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";

    });

}


// ===============================
// BUTTON HOVER
// ===============================

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("mouseenter", () => {

        if (cursor) cursor.classList.add("active");

        if (cursorRing) cursorRing.classList.add("active");

    });

    button.addEventListener("mouseleave", () => {

        if (cursor) cursor.classList.remove("active");

        if (cursorRing) cursorRing.classList.remove("active");

    });

});


// ===============================
// FADE UP ANIMATION
// ===============================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".fade-up").forEach(item => {

    observer.observe(item);

});
document.getElementById("enterBtn").addEventListener("click", function () {
    window.location.href = "homepage.html";
});