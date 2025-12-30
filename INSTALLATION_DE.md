# PrintStock - Installation auf Proxmox

## Schnellstart

### 1. Proxmox LXC Container erstellen
- Ubuntu 22.04
- 2 CPU Cores
- 4GB RAM
- 20GB Speicher

### 2. Docker installieren
```bash
ssh root@container-ip
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

### 3. Repository klonen
```bash
cd /opt
git clone https://github.com/dein-username/printstock.git
cd printstock
```

### 4. Konfigurieren
```bash
cp .env.example .env
nano .env
# WICHTIG: POSTGRES_PASSWORD ändern!
# WICHTIG: NEXT_PUBLIC_API_URL auf deine Container-IP setzen
```

### 5. Starten
```bash
docker-compose up -d --build
```

### 6. Logs prüfen
```bash
docker-compose logs -f
```

### 7. Zugreifen
Browser: `http://deine-container-ip`

## Fehlerbehebung

### Container starten nicht
```bash
docker-compose logs
docker-compose ps
```

### Datenbank-Probleme
```bash
docker-compose restart db
docker-compose logs db
```

### Neustart
```bash
docker-compose restart
```

## Wartung

### Backup erstellen
```bash
docker-compose exec db pg_dump -U printstock printstock > ./backups/backup-$(date +%Y%m%d).sql
```

### Update
```bash
git pull origin main
docker-compose up -d --build
```

## Support

Bei Problemen: GitHub Issues
