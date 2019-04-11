FROM mhart/alpine-node:10
WORKDIR /usr/src
COPY . .
WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build
RUN rm -rf node_modules
WORKDIR /usr/src/app
RUN npm install --production
ENV NODE_ENV="production"
EXPOSE 5000
CMD ["npm", "start"]
