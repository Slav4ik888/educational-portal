# Алгоритм получения SSL-сертификата Let's Encrypt (certbot + nginx) при наличии нескольких сайтов на сервере

## Проблема
При попытке получить сертификат через `certbot --nginx` возникает ошибка `404` или `unauthorized`, потому что:
- В `sites-enabled` присутствуют другие конфиги, конфликтующие на порту `:80`
- Certbot не может корректно выполнить `http-01` challenge из-за пересекающихся `server_name`

## Решение — временная изоляция целевого домена

### 1. Резервное копирование
```bash
# Скопировать текущий конфиг целевого домена
cp /etc/nginx/sites-available/edu-extended.thm.su /etc/nginx/sites-available/edu-extended.thm.su.backup

# Создать папку для бекапа остальных конфигов
mkdir -p /etc/nginx/sites-backup

# Переместить все конфиги из sites-enabled в backup (кроме целевого, если он там есть)
mv /etc/nginx/sites-enabled/* /etc/nginx/sites-backup/ 2>/dev/null
```

### 2. Создать минимальный временный конфиг
```bash
cat > /etc/nginx/sites-available/edu-extended.thm.su << 'EOF'
server {
    listen 80;
    server_name edu-extended.thm.su;
    root /var/www/vtempe/data/edu-extended; # путь до вашего сайта
}
EOF
```

### 3. Активировать только целевой конфиг
```bash
ln -sf /etc/nginx/sites-available/edu-extended.thm.su /etc/nginx/sites-enabled/
```

### 4. Проверить и перезагрузить nginx
```bash
nginx -t && systemctl reload nginx
```

### 5. Получить сертификат
```bash
sudo certbot --nginx -d edu-extended.thm.su
```

При запросе выбрать 2 (Redirect – автоматическое перенаправление HTTP → HTTPS)

### 6. Восстановить исходные конфиги

**Вернуть оригинальный конфиг**
```bash
cp /etc/nginx/sites-available/edu-extended.thm.su.backup /etc/nginx/sites-available/edu-extended.thm.su
```

### 7. Добавить SSL-секцию в оригинальный конфиг вручную

Certbot изменил временный минимальный конфиг, но не изменит ваш оригинальный.
Поэтому нужно вручную добавить в него:

```nginx
server {
    listen 80;
    server_name edu-extended.thm.su;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name edu-extended.thm.su;

    ssl_certificate /etc/letsencrypt/live/edu-extended.thm.su/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edu-extended.thm.su/privkey.pem;

    # ... остальные ваши настройки (root, proxy_pass, location и т.д.)
}
```

### 8. Вернуть остальные конфиги обратно

```bash
mv /etc/nginx/sites-backup/* /etc/nginx/sites-enabled/
rmdir /etc/nginx/sites-backup
```
### 9. Проверить и перезагрузить nginx
```bash
nginx -t && systemctl reload nginx
```
### 10. Проверить работу HTTPS
```bash
curl -I https://edu-extended.thm.su
```

## Важные пояснения
**Шаг	Пояснение**
Почему не работает certbot --nginx напрямую	Certbot временно модифицирует активный конфиг в sites-enabled. Если там несколько конфигов с listen 80 и одинаковыми server_name (или конфликтующими), challenge может быть направлен не туда.
Зачем выносить все конфиги кроме целевого	Чтобы на порту :80 остался ровно один server_name, который запрашивается у Let's Encrypt.
Зачем вручную добавлять SSL после получения	Certbot правит тот конфиг, который активен в момент получения. После восстановления оригинального конфига SSL-директивы из временного конфига теряются.
Обязательно ли удалять sites-backup	Нет, можно оставить на случай отката.
Итоговая структура конфига (пример с проксированием API)

```nginx
server {
    listen 80;
    server_name edu-extended.thm.su;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name edu-extended.thm.su;

    ssl_certificate /etc/letsencrypt/live/edu-extended.thm.su/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edu-extended.thm.su/privkey.pem;

    root /var/www/vtempe/data/edu-extended.thm.su/build;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:7580;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
