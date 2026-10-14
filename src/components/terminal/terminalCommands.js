import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { SCREEN_THEMES } from '../../data/screenThemes';

export const COMMAND_LIST = [
  'help',
  'about',
  'skills',
  'projects',
  'project',
  'contact',
  'resume',
  'neofetch',
  'theme',
  'lamp',
  'sound',
  'matrix',
  'clear',
  'cls',
  'whoami',
  'date',
  'echo',
  'uname',
  'exit',
];

export function executeCommand(inputStr, context) {
  const trimmed = inputStr.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      return {
        type: 'output',
        content: `
AVAILABLE COMMANDS:
  help                    Show this list of commands
  about | bio             Who is Truong Tam Thong?
  skills                  Technical skills breakdown (Frontend, Backend, 3D, DevOps)
  projects                List featured portfolio projects
  project <1-4 | id>      View technical case details of a project
  contact                 Get email, GitHub, and LinkedIn links
  resume | cat resume     Download Truong_Tam_Thong_Resume.pdf
  neofetch                Display system info & retro ASCII badge
  theme [name]            Switch CRT phosphor theme: cyan | green | amber | magenta
  lamp [on | off]         Toggle desk lamp in the 3D scene
  sound [on | off]        Toggle audio clicks & terminal chirps
  matrix                  Enter Matrix digital rain easter egg (press 'q' to exit)
  clear | cls             Clear terminal display
  whoami                  Display current session user
  date                    Show system date and time
  echo <text>             Print text to terminal
  exit                    Close this terminal session

TIP: Use [TAB] for command autocompletion and [UP/DOWN] arrows for command history.
`,
      };

    case 'about':
    case 'bio':
      return {
        type: 'output',
        content: `
NAME:     ${profile.name}
ROLE:     ${profile.title}
LOCATION: Ho Chi Minh City, Vietnam

TAGLINE:
  ${profile.tagline}

BIO:
  ${profile.bio}
`,
      };

    case 'skills':
      return {
        type: 'output',
        content: `
CORE TECHNICAL EXPERTISE:

  [Frontend Development]
  • React 19, Next.js (App Router), TypeScript, JavaScript (ESNext)
  • Tailwind CSS v4, HTML5, Semantic Web, CSS Grid / Flexbox
  • Three.js, React Three Fiber (@react-three/fiber), Drei, GSAP, Lenis

  [Backend & APIs]
  • Java 17/21, Spring Boot 3, Spring Cloud Gateway, Hibernate / JPA
  • Node.js, Express, RESTful APIs, Microservices Architecture

  [Databases & Caching]
  • PostgreSQL, MongoDB, Redis, Prisma ORM

  [DevOps & Engineering Practices]
  • Docker, Git / GitHub Actions CI/CD, Vite, Vitest, Playwright
  • Web Accessibility (WCAG 2.1 AA, Axe-core), Lighthouse 95+ Performance
`,
      };

    case 'projects':
      return {
        type: 'output',
        content: `
FEATURED PROJECTS:
${projects
  .map(
    (p, idx) => `
  [${idx + 1}] ${p.title} (${p.role})
      ID:       ${p.id}
      Stack:    ${p.stack.slice(0, 5).join(', ')}...
      Repo:     ${p.links.repo || 'Private'}
      Summary:  ${p.summary}
`
  )
  .join('')}
Type 'project <1-${projects.length}>' or 'project <id>' for full architecture details.
`,
      };

    case 'project': {
      if (args.length === 0) {
        return {
          type: 'error',
          content: "Usage: project <1-4> or project <id>\nExample: 'project 1' or 'project ecommerce-platform'",
        };
      }

      const query = args[0].toLowerCase();
      let found = null;

      const num = parseInt(query, 10);
      if (!isNaN(num) && num >= 1 && num <= projects.length) {
        found = projects[num - 1];
      } else {
        found = projects.find((p) => p.id.toLowerCase() === query || p.id.toLowerCase().includes(query));
      }

      if (!found) {
        return {
          type: 'error',
          content: `Project not found: '${query}'. Type 'projects' to see all valid IDs.`,
        };
      }

      return {
        type: 'output',
        content: `
=============================================================
  ${found.title.toUpperCase()}
=============================================================
Role:         ${found.role}
Repository:   ${found.links.repo || 'Private'}
Live Demo:    ${found.links.live || 'Available upon request'}

Summary:
  ${found.summary}

Full Tech Stack:
  ${found.stack.map((t) => `• ${t}`).join('\n  ')}
`,
      };
    }

    case 'contact':
      return {
        type: 'output',
        content: `
GET IN TOUCH:
  • Email:    ${profile.email}
  • GitHub:   ${profile.links.github}
  • LinkedIn: ${profile.links.linkedin}
`,
      };

    case 'resume':
    case 'cv':
      if (typeof window !== 'undefined' && profile.resume) {
        const link = document.createElement('a');
        link.href = profile.resume;
        link.download = 'Truong_Tam_Thong_Resume.pdf';
        link.target = '_blank';
        link.click();
      }
      return {
        type: 'output',
        content: `
Downloading Truong_Tam_Thong_Resume.pdf...
If download does not begin automatically, direct link:
${profile.resume}
`,
      };

    case 'cat':
      if (args[0] && (args[0].toLowerCase() === 'resume' || args[0].toLowerCase() === 'resume.pdf' || args[0].toLowerCase() === 'cv')) {
        return executeCommand('resume', context);
      }
      return {
        type: 'error',
        content: `cat: ${args[0] || ''}: No such file. Try 'cat resume'.`,
      };

    case 'neofetch':
      return {
        type: 'output',
        content: `
        .------------------.          thong@portfolio-desk
       /  .--------------.  \\         --------------------
      /  /                \\  \\        OS: PortfolioOS v1.0 [x86_64]
     |  |   >_ READY       |  |       Host: Retro Computer Workspace (GLB 1.47MB)
     |  |                  |  |       Kernel: React 19.2.8 + Vite 8.3.0
      \\  \\                /  /        Uptime: 99.99%
       \\  '--------------'  /         Shell: retro-sh (VT100)
        '------------------'          Resolution: 3D Viewport (dpr: 1.5)
           / /        \\ \\             Engine: Three.js r186 + R3F v9
         (===)        (===)           Active Theme: ${context.currentTheme?.label || 'Cyber Cyan'}
                                      Desk Lamp: ${context.lampOn ? 'ON (14 lx)' : 'OFF'}
                                      Sound FX: ${context.soundEnabled ? 'Enabled' : 'Muted'}
`,
      };

    case 'theme': {
      if (args.length === 0) {
        return {
          type: 'output',
          content: `
CURRENT THEME: ${context.currentTheme?.label} (${context.currentTheme?.id})

AVAILABLE THEMES:
${SCREEN_THEMES.map((t) => `  • ${t.id.padEnd(10)} - ${t.label} (${t.emissive})`).join('\n')}

Usage: theme <cyan | green | amber | magenta>
`,
        };
      }

      const target = args[0].toLowerCase();
      const match = SCREEN_THEMES.find((t) => t.id === target);
      if (match) {
        if (context.setThemeById) {
          context.setThemeById(match.id);
        }
        return {
          type: 'output',
          content: `CRT theme switched to: ${match.label} [${match.emissive}]`,
        };
      }
      return {
        type: 'error',
        content: `Unknown theme: '${target}'. Available options: cyan, green, amber, magenta.`,
      };
    }

    case 'lamp': {
      if (args.length === 0) {
        if (context.toggleLamp) context.toggleLamp();
        return {
          type: 'output',
          content: `Desk lamp toggled. State is now: ${!context.lampOn ? 'ON' : 'OFF'}`,
        };
      }

      const sub = args[0].toLowerCase();
      if (sub === 'on') {
        if (context.setLampState) context.setLampState(true);
        return { type: 'output', content: '💡 Desk lamp turned ON.' };
      }
      if (sub === 'off') {
        if (context.setLampState) context.setLampState(false);
        return { type: 'output', content: '🌑 Desk lamp turned OFF.' };
      }
      if (sub === 'toggle') {
        if (context.toggleLamp) context.toggleLamp();
        return { type: 'output', content: `Desk lamp toggled: ${!context.lampOn ? 'ON' : 'OFF'}` };
      }

      return { type: 'error', content: "Usage: lamp [on | off | toggle]" };
    }

    case 'sound': {
      if (args.length === 0 || args[0].toLowerCase() === 'toggle') {
        if (context.toggleSound) context.toggleSound();
        return { type: 'output', content: `Sound effects: ${!context.soundEnabled ? 'ENABLED' : 'MUTED'}` };
      }
      const state = args[0].toLowerCase();
      if (state === 'on') {
        if (!context.soundEnabled && context.toggleSound) context.toggleSound();
        return { type: 'output', content: '🔊 Audio effects enabled.' };
      }
      if (state === 'off') {
        if (context.soundEnabled && context.toggleSound) context.toggleSound();
        return { type: 'output', content: '🔇 Audio effects muted.' };
      }
      return { type: 'error', content: "Usage: sound [on | off | toggle]" };
    }

    case 'matrix':
      return {
        type: 'system',
        action: 'start_matrix',
        content: 'Entering Matrix Digital Rain stream...',
      };

    case 'whoami':
      return {
        type: 'output',
        content: 'guest@portfolio-visitor (permissions: read-only, explore: granted)',
      };

    case 'date':
      return {
        type: 'output',
        content: new Date().toUTCString(),
      };

    case 'echo':
      return {
        type: 'output',
        content: args.join(' '),
      };

    case 'uname':
      return {
        type: 'output',
        content: 'PortfolioOS 1.0.0-react19-threejs x86_64 GNU/Linux',
      };

    case 'clear':
    case 'cls':
      return {
        type: 'system',
        action: 'clear',
        content: '',
      };

    case 'exit':
    case 'quit':
      if (context.closeTerminal) {
        context.closeTerminal();
      }
      return {
        type: 'system',
        action: 'exit',
        content: 'Closing terminal session...',
      };

    default:
      return {
        type: 'error',
        content: `command not found: '${command}'. Type 'help' for available commands.`,
      };
  }
}

export default executeCommand;
