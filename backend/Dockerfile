FROM node:20-alpine

# Install g++ and other build tools required for compiling C++ code
RUN apk update && apk add --no-cache g++ make

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Create temp directory for code execution
RUN mkdir -p temp

EXPOSE 5000
CMD [ "node", "server.js" ]
