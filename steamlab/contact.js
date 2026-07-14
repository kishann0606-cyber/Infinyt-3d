// ==========================
// SUPABASE CONNECTION
// ==========================

const SUPABASE_URL = "https://hadonhlztjitdqtxckgq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZG9uaGx6dGppdGRxdHhja2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NzMyMTcsImV4cCI6MjA5ODU0OTIxN30.svAgJLYltuvFhv4oTSovkPYYmn67KQmo52MvYE88XuU"; // Paste your anon key

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("✅ Supabase Connected");

// ==========================
// SCROLL ANIMATION
// ==========================

const cards = document.querySelectorAll(".info-card");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

cards.forEach((card) => observer.observe(card));

// ==========================
// GOOGLE MAP SCROLL
// ==========================

function goToMap() {
    document.getElementById("map").scrollIntoView({
        behavior: "smooth"
    });
}

// Make function available to HTML
window.goToMap = goToMap;

// ==========================
// CONTACT FORM
// ==========================

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const full_name = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log("Sending data...");

    const { data, error } = await client
        .from("steam_lab_request")
        .insert([
            {
                full_name,
                email,
                phone,
                subject,
                message
            }
        ]);

    console.log("Data:", data);
    console.log("Error:", error);

    fetch("https://ipapi.co/json/");
    
});
