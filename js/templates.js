// HTML Preview Tool - Template Management

const templates = {
    basic: {
        name: "Basic HTML",
        description: "A minimal HTML5 boilerplate for starting any web page.",
        category: "components",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic HTML Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a basic HTML template. Start coding here!</p>
</body>
</html>`,
        css: `body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    margin: 2rem;
    background-color: #f8f9fa;
}
h1 {
    color: #343a40;
}`,
        js: `console.log('Page loaded successfully!');`
    },

    card: {
        name: "Image Card",
        description: "A responsive card component with an image and text.",
        category: "components",
        html: `<div class="card">
    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" alt="A laptop with code on the screen" class="card-img">
    <div class="card-content">
        <h2 class="card-title">Component Card</h2>
        <p class="card-body">This is a sample card component. You can use it to display products, articles, or any other content.</p>
        <a href="#" class="card-button">Learn More</a>
    </div>
</div>`,
        css: `body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #e9ecef;}
.card {
    width: 320px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    overflow: hidden;
    background: white;
    font-family: sans-serif;
    transition: transform 0.3s ease;
}
.card:hover {
    transform: translateY(-5px);
}
.card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
.card-content {
    padding: 1.5rem;
}
.card-title {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    color: #333;
}
.card-body {
    margin: 0 0 1.5rem;
    color: #666;
    line-height: 1.5;
}
.card-button {
    display: inline-block;
    background-color: #0d6efd;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.2s;
}
.card-button:hover {
    background-color: #0b5ed7;
}`,
        js: `document.querySelector('.card-button').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Button clicked! This card is interactive.');
});`
    },

    form: {
        name: "Contact Form",
        description: "A beautifully styled and modern contact form.",
        category: "components",
        html: `<form class="contact-form">
    <h3>Contact Us</h3>
    <p>We'd love to hear from you!</p>
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" required placeholder="Enter your name">
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required placeholder="Enter your email">
    </div>
    <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" rows="4" required placeholder="Your message..."></textarea>
    </div>
    <button type="submit">Send Message</button>
</form>`,
        css: `body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f4f4f4; }
.contact-form {
    width: 100%;
    max-width: 450px;
    padding: 2.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    background: white;
    font-family: 'Segoe UI', sans-serif;
}
.contact-form h3 {
    text-align: center;
    margin: 0 0 0.5rem;
    font-size: 2rem;
    color: #333;
}
.contact-form p {
    text-align: center;
    margin: 0 0 2rem;
    color: #888;
}
.form-group {
    margin-bottom: 1.5rem;
}
.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}
.form-group input, .form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 1rem;
    transition: all 0.2s ease;
}
.form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}
button[type="submit"] {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 5px;
    background-color: #0d6efd;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}
button[type="submit"]:hover {
    background-color: #0b5ed7;
}`,
        js: `document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted! (This is a demo)');
});`
    },

    blogPost: {
        name: "Blog Post",
        description: "A clean and readable layout for a blog article.",
        category: "business",
        html: `<article class="blog-post">
    <header class="post-header">
        <h1>Understanding Modern JavaScript</h1>
        <p class="post-meta">Published on <time datetime="2025-07-31">July 31, 2025</time> by Jane Doe</p>
    </header>
    <div class="post-content">
        <p>JavaScript has evolved significantly over the years. This post will explore some of the key features introduced in ES6 and beyond that every developer should know.</p>
        <h2>Arrow Functions</h2>
        <p>Arrow functions provide a more concise syntax for writing function expressions. They are especially useful for inline functions and maintaining the context of 'this'.</p>
        <pre><code>const add = (a, b) => a + b;</code></pre>
        <h2>Promises and Async/Await</h2>
        <p>Asynchronous operations are now easier to manage with Promises and the async/await syntax, making code cleaner and more readable than traditional callbacks.</p>
    </div>
</article>`,
        css: `body { background: #fff; color: #333; font-family: 'Georgia', serif; line-height: 1.8; }
.blog-post { max-width: 750px; margin: 3rem auto; padding: 0 1rem; }
.post-header { text-align: center; margin-bottom: 3rem; }
.post-header h1 { font-size: 2.8rem; margin: 0 0 1rem; }
.post-meta { color: #888; font-style: italic; }
.post-content h2 { font-size: 2rem; margin: 2.5rem 0 1rem; }
.post-content p { font-size: 1.1rem; margin-bottom: 1.5rem; }
.post-content pre { background: #f4f4f4; padding: 1.5rem; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace; }
.post-content code { font-size: 0.95rem; }`,
        js: `// No JavaScript needed for this static template.
console.log("Blog post template loaded.");`
    },

    productPage: {
        name: "Product Page",
        description: "A simple and effective product detail page.",
        category: "business",
        html: `<div class="product-container">
    <div class="product-image">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" alt="Red Sports Shoe">
    </div>
    <div class="product-details">
        <h1 class="product-title">AeroMax Runner</h1>
        <p class="product-price">$120.00</p>
        <p class="product-description">Experience ultimate comfort and performance with the new AeroMax Runner. Perfect for your daily runs and workouts. Lightweight, breathable, and stylish.</p>
        <button class="add-to-cart-btn">Add to Cart</button>
    </div>
</div>`,
        css: `body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f8f8f8; font-family: 'Lato', sans-serif; }
.product-container {
    display: flex;
    gap: 3rem;
    max-width: 900px;
    background: white;
    padding: 3rem;
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
.product-image img {
    max-width: 400px;
    border-radius: 10px;
}
.product-title { font-size: 2.5rem; margin: 0 0 1rem; }
.product-price { font-size: 2rem; color: #e74c3c; margin: 0 0 1.5rem; font-weight: bold; }
.product-description { line-height: 1.6; color: #555; margin-bottom: 2rem; }
.add-to-cart-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    background: #e74c3c;
    color: white;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}
.add-to-cart-btn:hover { background: #c0392b; }`,
        js: `document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    alert('Product added to cart!');
});`
    },
    // [새로운 템플릿 시작]
    emailNewsletter: {
        name: "Email Newsletter",
        description: "A responsive email template for newsletters, compatible with most email clients.",
        category: "business",
        html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f1f1;">
    <tr>
        <td align="center" valign="top">
            <table width="600" border="0" cellspacing="0" cellpadding="20" style="max-width: 600px; background-color:#ffffff; margin: 20px 0;">
                <tr>
                    <td align="center" style="padding: 20px 0; border-bottom: 1px solid #dddddd;">
                        <h1 style="margin:0; font-family: Arial, sans-serif; font-size: 28px; color: #333333;">Company Newsletter</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 20px;">
                        <h2 style="font-family: Arial, sans-serif; font-size: 22px; color: #333333;">This Month's Top Story</h2>
                        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 1.6;">
                            Welcome to our monthly update! We're excited to share the latest news, product updates, and insights from our team. Thank you for being a valued member of our community.
                        </p>
                        <a href="#" style="display: inline-block; background-color: #0d6efd; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px; margin-top: 10px;">
                            Read More
                        </a>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 12px; color: #888888; border-top: 1px solid #dddddd;">
                        <p style="margin: 0;">© 2025 Your Company. All rights reserved.</p>
                        <p style="margin: 5px 0 0;">
                            <a href="#" style="color: #888888;">Unsubscribe</a> | <a href="#" style="color: #888888;">View in browser</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`,
        css: `/* Most styles are inlined in the HTML for email client compatibility. 
  This CSS is for clients that support <style> blocks. 
*/
body {
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
    font-family: Arial, sans-serif;
}`,
        js: `/* JavaScript is not supported in most email clients. */`
    },

    promoBanner: {
        name: "Promotional Banner",
        description: "A responsive and eye-catching banner for promotions or announcements.",
        category: "components",
        html: `<div class="promo-banner">
    <div class="banner-text">
        <h2>Summer Sale!</h2>
        <p>Get up to 50% off on selected items. Don't miss out!</p>
        <a href="#" class="banner-cta">Shop Now</a>
    </div>
</div>`,
        css: `body { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-height: 100vh; 
    background-color: #f0f2f5; 
}
.promo-banner {
    width: 100%;
    max-width: 800px;
    padding: 4rem 2rem;
    border-radius: 15px;
    background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    color: white;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    font-family: 'Segoe UI', sans-serif;
}
.banner-text h2 {
    font-size: 3rem;
    margin: 0 0 1rem;
    font-weight: 700;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}
.banner-text p {
    font-size: 1.2rem;
    margin: 0 0 2rem;
    opacity: 0.9;
}
.banner-cta {
    display: inline-block;
    background-color: white;
    color: #ff9a9e;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
}
.banner-cta:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}`,
        js: `document.querySelector('.banner-cta').addEventListener('click', (e) => {
    e.preventDefault();
    alert("Redirecting to the shop!");
});`
    },

    newsCard: {
        name: "Card News",
        description: "A vertical card format, perfect for social media style news snippets.",
        category: "components",
        html: `<div class="news-card">
    <div class="news-card-content">
        <h1>Tech Stocks Surge on AI Breakthroughs</h1>
        <p class="news-source">Market Watch / July 31, 2025</p>
    </div>
</div>`,
        css: `body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #1a1a1a;
}
.news-card {
    width: 400px;
    aspect-ratio: 9 / 16;
    border-radius: 20px;
    background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    color: white;
    font-family: 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem;
    box-shadow: 0 15px 30px rgba(0,0,0,0.4);
}
.news-card-content h1 {
    font-size: 2.8rem;
    line-height: 1.2;
    margin: 0 0 1rem;
    font-weight: 900;
}
.news-card-content .news-source {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
    margin: 0;
}`,
        js: `// This component is primarily for visual display.`
    },

    agencyHomepage: {
        name: "Creative Agency",
        description: "A modern, professional landing page for a creative agency or portfolio.",
        category: "landing",
        html: `<header class="agency-header">
    <nav>
        <div class="logo">C R E A T I V E</div>
        <ul class="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#contact" class="contact-button">Contact</a></li>
        </ul>
    </nav>
    <div class="hero">
        <h1>We Design Experiences.</h1>
        <p>Digital solutions that captivate and convert.</p>
    </div>
</header>
<main>
    <section id="services">
        <h2>What We Do</h2>
        <div class="services-grid">
            <div class="service-card"><h3>Branding</h3><p>Crafting unique identities.</p></div>
            <div class="service-card"><h3>Web Design</h3><p>Building beautiful websites.</p></div>
            <div class="service-card"><h3>Marketing</h3><p>Reaching the right audience.</p></div>
        </div>
    </section>
</main>`,
        css: `body { 
    margin: 0; 
    font-family: 'Inter', sans-serif; 
    background-color: #0a0a0a;
    color: #f5f5f5;
}
.agency-header {
    background: #111;
    padding: 1.5rem 5%;
}
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo { font-weight: 700; letter-spacing: 2px; }
.nav-links { list-style: none; display: flex; gap: 2rem; align-items: center; }
.nav-links a { color: #f5f5f5; text-decoration: none; transition: color 0.3s; }
.nav-links a:hover { color: #007bff; }
.contact-button {
    background-color: #007bff;
    padding: 0.6rem 1.2rem;
    border-radius: 5px;
}
.contact-button:hover { color: white !important; }
.hero {
    text-align: center;
    padding: 8rem 2rem;
}
.hero h1 { font-size: 4rem; margin: 0; }
.hero p { font-size: 1.2rem; color: #aaa; }
#services {
    padding: 5rem 5%;
    text-align: center;
}
#services h2 { font-size: 2.5rem; margin-bottom: 3rem; }
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}
.service-card {
    background-color: #1a1a1a;
    padding: 2.5rem;
    border-radius: 10px;
    border: 1px solid #333;
    transition: all 0.3s;
}
.service-card:hover { transform: translateY(-10px); border-color: #007bff; }
.service-card h3 { margin: 0 0 0.5rem; }`,
        js: `// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});`
    },
    // [새로운 템플릿 끝]
    eventLanding: {
        name: "Event Landing Page",
        description: "A striking landing page for a conference or event.",
        category: "landing",
        html: `<div class="event-hero">
    <div class="hero-content">
        <h1>INNOVATE 2025</h1>
        <p class="subtitle">The Future of Technology Conference</p>
        <p class="date">October 25-27, 2025 | Metropolis Convention Center</p>
        <a href="#" class="register-btn">Register Now</a>
    </div>
</div>`,
        css: `body { margin: 0; font-family: 'Montserrat', sans-serif; }
.event-hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2062&auto=format&fit=crop') center/cover no-repeat;
}
.hero-content h1 {
    font-size: 5rem;
    margin: 0;
    letter-spacing: 5px;
    text-transform: uppercase;
}
.subtitle {
    font-size: 1.8rem;
    margin: 1rem 0;
    font-weight: 300;
}
.date {
    font-size: 1.2rem;
    margin: 2rem 0;
}
.register-btn {
    display: inline-block;
    padding: 1rem 3rem;
    border: 2px solid white;
    border-radius: 50px;
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s;
}
.register-btn:hover {
    background: white;
    color: black;
}`,
        js: ``
    },

    businessCard: {
        name: "Business Card",
        description: "An elegant and professional digital business card.",
        category: "business",
        html: `<div class="business-card">
    <div class="card-left">
        <div class="logo">JD</div>
    </div>
    <div class="card-right">
        <h2 class="name">Jane Doe</h2>
        <p class="title">Lead Developer</p>
        <div class="contact-info">
            <p><i class="fas fa-phone"></i> (123) 456-7890</p>
            <p><i class="fas fa-envelope"></i> jane.doe@example.com</p>
            <p><i class="fas fa-globe"></i> janedoe.dev</p>
        </div>
    </div>
</div>`,
        css: `body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #e9ecef; }
.business-card {
    display: flex;
    width: 480px;
    height: 280px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    font-family: 'Segoe UI', sans-serif;
}
.card-left {
    width: 35%;
    background: linear-gradient(135deg, #6f86d6, #48c6ef);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px 0 0 15px;
}
.logo {
    font-size: 4rem;
    font-weight: bold;
    color: white;
}
.card-right {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.name {
    margin: 0 0 0.5rem;
    font-size: 2.2rem;
    color: #333;
}
.title {
    margin: 0 0 1.5rem;
    font-size: 1.1rem;
    color: #666;
    border-bottom: 2px solid #6f86d6;
    padding-bottom: 0.5rem;
}
.contact-info p {
    margin: 0.8rem 0;
    color: #444;
    font-size: 1rem;
    display: flex;
    align-items: center;
}
.contact-info i {
    color: #6f86d6;
    margin-right: 1rem;
    width: 20px;
}`,
        js: `// Add Font Awesome for icons!
// You can add this to your HTML head:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">`
    },

    landing: {
        name: "SaaS Landing Page",
        description: "A clean landing page for a Software-as-a-Service.",
        category: "landing",
        html: `<header class="landing-header">
    <div class="container">
        <nav>
            <div class="logo">SaaSify</div>
            <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#" class="btn-login">Log In</a></li>
            </ul>
        </nav>
    </div>
</header>
<main>
    <section class="hero">
        <div class="container">
            <h1>The Ultimate Platform to Grow Your Business</h1>
            <p>SaaSify provides the tools you need to succeed in the digital world. Join thousands of happy customers today.</p>
            <a href="#" class="btn-primary">Get Started for Free</a>
        </div>
    </section>
</main>`,
        css: `body { margin: 0; font-family: 'Segoe UI', sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.landing-header { background: white; padding: 1.5rem 0; border-bottom: 1px solid #eee; }
nav { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.8rem; font-weight: bold; color: #0d6efd; }
nav ul { list-style: none; display: flex; gap: 2rem; align-items: center; margin: 0; padding: 0; }
nav a { text-decoration: none; color: #555; font-weight: 500; }
.btn-login {
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: all 0.2s ease;
}
.btn-login:hover {
    background: #f8f9fa;
}
.hero {
    background: #f8f9fa;
    color: #333;
    text-align: center;
    padding: 7rem 1rem;
}
.hero h1 { font-size: 3.5rem; max-width: 800px; margin: 0 auto 1.5rem; line-height: 1.2; }
.hero p { font-size: 1.25rem; max-width: 700px; margin: 0 auto 2.5rem; color: #666; }
.btn-primary {
    background: #0d6efd;
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
    transition: all 0.3s ease;
}
.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
}`,
        js: ``
    },

    portfolio: {
        name: "Minimal Portfolio",
        description: "A modern, minimalist portfolio page for developers.",
        category: "portfolio",
        html: `<main class="portfolio-container">
    <header class="portfolio-header">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" alt="Profile Picture" class="profile-pic">
        <div class="header-text">
            <h1>Anna Lee</h1>
            <p>Full-Stack Developer | Building innovative and user-friendly web applications.</p>
        </div>
    </header>
    <section class="projects">
        <h2>Selected Work</h2>
        <div class="project-grid">
            <a href="#" class="project-card"><div class="project-image" style="background-color: #ffadad;"></div><h3>Project One</h3></a>
            <a href="#" class="project-card"><div class="project-image" style="background-color: #ffd6a5;"></div><h3>Project Two</h3></a>
            <a href="#" class="project-card"><div class="project-image" style="background-color: #fdffb6;"></div><h3>Project Three</h3></a>
            <a href="#" class="project-card"><div class="project-image" style="background-color: #caffbf;"></div><h3>Project Four</h3></a>
        </div>
    </section>
</main>`,
        css: `body { background-color: #f4f7f6; font-family: 'Inter', sans-serif; }
.portfolio-container { max-width: 1100px; margin: 4rem auto; padding: 0 2rem; }
.portfolio-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 4rem; }
.profile-pic { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
.header-text h1 { margin: 0 0 0.5rem; font-size: 2.5rem; }
.header-text p { margin: 0; color: #555; font-size: 1.1rem; }
.projects h2 { font-size: 2rem; margin-bottom: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 1rem;}
.project-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.project-card { display: block; text-decoration: none; color: #333; background: white; border-radius: 8px; overflow: hidden; transition: all 0.3s ease; }
.project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
.project-image { height: 250px; }
.project-card h3 { padding: 1.5rem; margin: 0; }`,
        js: ``
    }
};

window.templates = templates;