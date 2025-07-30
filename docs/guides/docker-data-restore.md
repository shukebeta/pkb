# Docker Data Restore from Backup

Steps to restore Docker data from a tar.gz backup:

```bash
# 1. Stop Docker services properly
sudo systemctl stop docker.socket
sudo systemctl stop docker.service

# 2. Extract docker data in one command
sudo tar -xzpf /backup/old-var-backup.tar.gz -C / var/lib/docker

# 3. Start Docker services
sudo systemctl start docker.service
sudo systemctl start docker.socket

# 4. Verify restoration
docker volume ls
docker images
docker ps -a
```

## Notes

- Must stop both `docker.socket` and `docker.service` before extraction
- Extract with `-p` flag to preserve permissions
- Verify all containers, images, and volumes are restored correctly