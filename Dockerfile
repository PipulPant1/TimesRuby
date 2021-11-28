# FROM cypress/base:10
# FROM cypress/base:10
FROM cypress/browsers:node12.18.3-chrome87-ff82

WORKDIR /app
COPY package*.json /app/
COPY start.sh /app/

RUN npm install

COPY utils /app/utils/
COPY cypress /app/cypress/
COPY tests /app/tests/
COPY cypress.json /app/

ARG RUN_ON_SERVER
ENV RUN_ON_SERVER prod
RUN echo $RUN_ON_SERVER

# Admin Test Run
CMD ["sh","-c","./start.sh -s $RUN_ON_SERVER"]