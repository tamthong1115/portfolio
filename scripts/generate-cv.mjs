import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

async function generateCv() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    const cvHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Truong Tam Thong — Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 36px 48px;
      font-size: 13px;
    }
    header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .title {
      font-size: 14px;
      font-weight: 600;
      color: #2563eb;
      margin-top: 2px;
    }
    .contact {
      margin-top: 6px;
      font-size: 11.5px;
      color: #64748b;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .contact a {
      color: #3b82f6;
      text-decoration: none;
    }
    section {
      margin-bottom: 16px;
    }
    h2 {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .summary {
      color: #334155;
      font-size: 12.5px;
      line-height: 1.55;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      row-gap: 5px;
      font-size: 12px;
    }
    .skill-cat {
      font-weight: 600;
      color: #475569;
    }
    .skill-items {
      color: #1e293b;
    }
    .project {
      margin-bottom: 10px;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .project-title {
      font-weight: 700;
      font-size: 13px;
      color: #0f172a;
    }
    .project-role {
      font-size: 11px;
      color: #2563eb;
      font-weight: 600;
      background: #eff6ff;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .project-desc {
      font-size: 12px;
      color: #475569;
      margin-bottom: 3px;
    }
    .project-tech {
      font-size: 11px;
      color: #64748b;
    }
    .project-tech strong {
      color: #334155;
    }
  </style>
</head>
<body>
  <header>
    <h1>Truong Tam Thong</h1>
    <div class="title">Fullstack Engineer</div>
    <div class="contact">
      <span>Email: <a href="mailto:tamthong.1115@gmail.com">tamthong.1115@gmail.com</a></span>
      <span>GitHub: <a href="https://github.com/tamthong1115">github.com/tamthong1115</a></span>
      <span>LinkedIn: <a href="https://linkedin.com/in/tamthong1115">linkedin.com/in/tamthong1115</a></span>
      <span>Portfolio: <a href="https://tamthong1115.github.io/portfolio/">tamthong1115.github.io/portfolio</a></span>
    </div>
  </header>

  <section>
    <h2>Professional Summary</h2>
    <p class="summary">
      Fullstack Engineer with experience creating and scaling modern web applications across React, Next.js, TypeScript, and Java microservice ecosystems. Skilled in architecting RESTful APIs, integrating third-party payment and AI solutions, automating CI/CD pipelines, and crafting high-performance user interfaces.
    </p>
  </section>

  <section>
    <h2>Technical Skills</h2>
    <div class="skills-grid">
      <div class="skill-cat">Frontend:</div>
      <div class="skill-items">React 19, Next.js, TypeScript, JavaScript (ESNext), Tailwind CSS, Three.js, React Three Fiber, HTML5/CSS3</div>
      <div class="skill-cat">Backend:</div>
      <div class="skill-items">Java (Spring Boot 3, Spring Cloud), Node.js, Express, C#, .NET, Blazor, RESTful APIs, Microservices</div>
      <div class="skill-cat">Databases & Cache:</div>
      <div class="skill-items">PostgreSQL, MongoDB, SQL Server, Redis, Prisma ORM</div>
      <div class="skill-cat">DevOps & Tools:</div>
      <div class="skill-items">Docker, Git, GitHub Actions (CI/CD), Vitest, Playwright, Linux, Webpack/Vite</div>
    </div>
  </section>

  <section>
    <h2>Featured Projects</h2>

    <div class="project">
      <div class="project-header">
        <span class="project-title">E-Commerce Next.js Platform</span>
        <span class="project-role">Team Leader</span>
      </div>
      <p class="project-desc">Multi-vendor e-commerce platform featuring AI-powered image search, role-based merchant dashboards, and real-time inventory updates.</p>
      <p class="project-tech"><strong>Stack:</strong> Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS, Redis, Pusher, Google GenAI</p>
    </div>

    <div class="project">
      <div class="project-header">
        <span class="project-title">Hotel Booking Application</span>
        <span class="project-role">Fullstack Developer</span>
      </div>
      <p class="project-desc">End-to-end hotel search and reservation system featuring interactive Mapbox location discovery, Stripe payments, and automated test suites.</p>
      <p class="project-tech"><strong>Stack:</strong> React, Node.js, Express, MongoDB, Stripe, Mapbox, Vitest, Playwright</p>
    </div>

    <div class="project">
      <div class="project-header">
        <span class="project-title">Clinic Management System</span>
        <span class="project-role">Team Leader</span>
      </div>
      <p class="project-desc">Microservices architecture for medical clinic operations, appointment management, service catalog, and secure patient portals.</p>
      <p class="project-tech"><strong>Stack:</strong> Java, Spring Boot 3, React, PostgreSQL, Docker, Spring Cloud Gateway, Netflix Eureka</p>
    </div>

    <div class="project">
      <div class="project-header">
        <span class="project-title">Warehouse Management System (WMS)</span>
        <span class="project-role">Software Developer</span>
      </div>
      <p class="project-desc">High-volume logistics platform handling ASN processing, LPN barcode tracking, and optimized warehouse picking and packing strategies.</p>
      <p class="project-tech"><strong>Stack:</strong> Blazor, C#, .NET, PostgreSQL, SQL Server</p>
    </div>
  </section>
</body>
</html>
`;

    await page.setContent(cvHtml, { waitUntil: 'networkidle0' });

    const destPdf1 = path.resolve('public/Truong_Tam_Thong_CV.pdf');
    const destPdf2 = path.resolve('public/cv.pdf');

    await page.pdf({
      path: destPdf1,
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    });
    console.log(`✓ Generated ${destPdf1}`);

    fs.copyFileSync(destPdf1, destPdf2);
    console.log(`✓ Created alias at ${destPdf2}`);
  } finally {
    await browser.close();
  }
}

generateCv().catch((err) => {
  console.error(err);
  process.exit(1);
});
