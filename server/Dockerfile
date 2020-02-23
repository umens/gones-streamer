FROM node:13-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock ./

RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3002

RUN npm install pm2 -g

CMD ["npx", "pm2", "start", "ecosystem.config.js", "--no-daemon", "--env", "production"]
