# 로컬과 같은 버전
FROM node:12.14

# 도커 이미지 만든 사람
LABEL maintainer="joingaram@gmail.com"

# 4000포트로 도커 데몬에 연결
EXPOSE 4000

# 작업 디렉토리 & 자동으로 작업 디렉토리로 현재 위치 변경
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn cache clean & yarn install --network-timeout 100000
COPY . .

CMD ["yarn", "start"]

# 도커 이미지 빌드
# docker build -t test-server -f ./config/docker/Dockerfile .
# 가끔 패키지 다운 안되면 docker-machine restart 하기