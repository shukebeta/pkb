# 从备份恢复 Docker 数据

从 tar.gz 备份恢复 Docker 数据的步骤：

```bash
# 1. 正确停止 Docker 服务
sudo systemctl stop docker.socket
sudo systemctl stop docker.service

# 2. 一条命令解压 docker 数据
sudo tar -xzpf /backup/old-var-backup.tar.gz -C / var/lib/docker

# 3. 启动 Docker 服务
sudo systemctl start docker.service
sudo systemctl start docker.socket

# 4. 验证恢复结果
docker volume ls
docker images
docker ps -a
```

## 注意事项

- 解压前必须停止 `docker.socket` 和 `docker.service`
- 使用 `-p` 标志解压以保留权限
- 验证所有容器、镜像和卷都已正确恢复