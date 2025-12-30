# PrintStock - 3D Printing Inventory Management

Self-hosted inventory management system for 3D printing materials.

## Features

- ✅ Track filament spools (brand, color, weight, price)
- ✅ Manage 3D printers and nozzles
- ✅ Usage tracking with automatic weight deduction
- ✅ Dark/Light theme
- ✅ Material summaries with statistics
- ✅ Low stock warnings
- ✅ No authentication (single-user local app)

## Quick Start on Proxmox

### 1. Create LXC Container
- Ubuntu 22.04
- 2 CPU cores
- 4GB RAM
- 20GB storage

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

### 3. Clone and Start
```bash
cd /opt
git clone https://github.com/yourusername/printstock.git
cd printstock
cp .env.example .env
nano .env  # Change password!
docker-compose up -d --build
```

### 4. Access
Open `http://your-container-ip` in your browser.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma ORM
- **Database:** PostgreSQL
- **Cache:** Redis
- **Proxy:** Nginx

## Documentation

- German installation guide: `INSTALLATION_DE.md`
- API docs: `http://your-ip/api` (Swagger)

## License

MIT
