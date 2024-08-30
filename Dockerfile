# 第一階段：構建 Vite 應用
FROM node:14 AS build

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有源文件
COPY . .

# 構建應用
RUN npm run build

# 第二階段：使用 Nginx 提供靜態文件服務
FROM nginx:alpine

# 複製構建的文件到 Nginx 的 html 文件夾
COPY --from=build /app/dist /usr/share/nginx/html

# 複製簡化的 Nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 8080

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
