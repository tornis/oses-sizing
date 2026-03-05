# Docker Deployment Guide

Este guia explica como executar a aplicação OSES Sizing usando Docker.

## Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

## Estrutura dos Arquivos

- `Dockerfile` - Configuração multi-stage para build otimizado
- `docker-compose.yml` - Orquestração do container
- `.dockerignore` - Arquivos ignorados no build

## Como Usar

### 1. Build e Execução com Docker Compose (Recomendado)

```bash
# Build e iniciar o container
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar o container
docker-compose down
```

A aplicação estará disponível em: `http://localhost:3000`

### 2. Build e Execução Manual com Docker

```bash
# Build da imagem
docker build -t oses-sizing .

# Executar o container
docker run -d \
  --name oses-sizing-app \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  oses-sizing

# Ver logs
docker logs -f oses-sizing-app

# Parar e remover o container
docker stop oses-sizing-app
docker rm oses-sizing-app
```

## Persistência de Dados

O banco de dados SQLite é persistido através de um volume Docker:
- **Local**: `./data`
- **Container**: `/app/data`

Os dados dos usuários são mantidos mesmo após reiniciar ou recriar o container.

## Variáveis de Ambiente

As seguintes variáveis podem ser configuradas no `docker-compose.yml`:

- `NODE_ENV=production` - Ambiente de execução
- `NEXT_TELEMETRY_DISABLED=1` - Desabilita telemetria do Next.js
- `PORT=3000` - Porta da aplicação

## Health Check

O container inclui um health check que verifica se a aplicação está respondendo:
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos
- **Retries**: 3 tentativas
- **Start Period**: 40 segundos

## Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker-compose logs

# Verificar status
docker-compose ps
```

### Permissões do banco de dados

Se houver problemas de permissão com o SQLite:

```bash
# Ajustar permissões da pasta data
chmod 755 ./data
```

### Rebuild completo

```bash
# Rebuild sem cache
docker-compose build --no-cache
docker-compose up -d
```

## Produção

Para deploy em produção, considere:

1. **Reverse Proxy**: Use Nginx ou Traefik na frente da aplicação
2. **SSL/TLS**: Configure certificados HTTPS
3. **Backup**: Faça backup regular da pasta `./data`
4. **Recursos**: Ajuste limites de CPU e memória no `docker-compose.yml`

Exemplo com limites de recursos:

```yaml
services:
  oses-sizing:
    # ... outras configurações
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Comandos Úteis

```bash
# Rebuild e restart
docker-compose up -d --build

# Ver uso de recursos
docker stats oses-sizing-app

# Executar comando dentro do container
docker exec -it oses-sizing-app sh

# Backup do banco de dados
docker cp oses-sizing-app:/app/data/users.db ./backup-users.db
```
