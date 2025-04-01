FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build 

EXPOSE $PORT $GRPC_PORT

CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi" ]
