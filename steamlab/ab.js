/*==============================
 Sticky Navigation
==============================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
        header.style.background = "rgba(255,255,255,.98)";

    }else{

        header.style.boxShadow = "none";
        header.style.background = "rgba(255,255,255,.95)";

    }

});


/*==============================
 Fade Animation
==============================*/

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

sections.forEach(section=>{

    observer.observe(section);

});


/*==============================
 Back To Top
==============================*/

const topBtn = document.getElementById("topBtn");

if(topBtn){

    window.addEventListener("scroll",()=>{

        if(window.scrollY > 500){

            topBtn.classList.add("active");

        }else{

            topBtn.classList.remove("active");

        }

    });

    topBtn.onclick = ()=>{

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    };

}


/*==============================
 Contact Form
==============================*/

const contactForm = document.getElementById("contactForm");

if(contactForm){

    contactForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if(name === "" || email === "" || phone === "" || subject === "" || message === ""){

            alert("Please fill in all the fields.");
            return;

        }

        alert("Thank you, " + name + "! Your message has been sent successfully.");

        contactForm.reset();

    });

}
