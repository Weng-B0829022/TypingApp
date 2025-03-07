# 使用官方 Node.js LTS 版本作為基礎映像
FROM node:lts

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果有的話）
COPY package*.json ./

# 安裝依賴，包括 SQLite3
RUN npm install && npm install sqlite3

# 複製應用程式程式碼
COPY . .

# 暴露應用程式使用的端口（根據你的應用程式需求調整，例如 3000）
EXPOSE 3000

#