# dockerfile로 이미지 생성 방법 ---> docker build -t [생성할 이미지명]:[태그명] [dockerfile 경로]
# 도커는 이미지를 빌드할 때 자동으로 캐시를 생성하고 다른 이미지를 빌드할 때 내부의 캐시를 사용하여 빌드 속도를 높인다.
# 캐시 사용시 build 로그에 Using cache가 표시됨
# 이미지 캐시 필요 없으면 docker build 커맨드에서 --no-cache 옵션을 쓰자

# 도커 이미지 레이어 구조
# build 로그를 보면 도커 파일 명령어의 첫 번째 행부터 실행하여 이미지를 여러개 생성하게 되는데
# 생성된 이미지는 다른 이미지와 공유된다. 베이스 이미지를 기반으로 여러 이미지가 생성된 경우
# 베이스 이미지의 레이어가 공유된다.
# node 이미지를 사용해서 빌드(NODE, NPM있음)
# FROM -> 베이스 이미지 지정
# FROM [이미지명]
# FROM [이미지명]:[태그명]
# FROM [이미지명]@[Digest]  cf) Digest: 도커 Hub에 업로드할 때 자동으로 부여받는 식별자
FROM node:12.14
# MAINTAINER [작성자] -> 이 파일 작성한 사용자 이름 메일
# MAINTAINER (deprecated)
LABEL maintainer="joingaram@gmail.com"

# 앱 4000포트에 바인딩 되어 있으므로 EXPOSE로 docker 데몬에 매핑
# nonroot로 변경시 ou cannot use privileged (1-1023) ports anymore.
EXPOSE 4000


# 컨테이너 안에서 앱 실행하기 위해 app이라는 기본적인 권한의 유저를 만듬
# 이렇게 하지 않으면 컨테이너 안의 모든 프로세스들은 루트 권한으로 실행되게 되는 데 
# 이렇게 되면 보안상 좋지 않다.
# Ubuntu/Debian의 경우 /var/lib/docker에 docker image, container가 쌓임
# root(/)가 꽉차게 되면 문제가 될 수 있으니 root(/)가 아닌 다른 path에 정보가 쌓이도록 변경해야함
# Usage: useradd [options] 계정명
# --create-home, -m: create user's home directory
# --user-group, -U: create a group with same name as the user
# --shell, -s: login shell of the new account -> 초기화 파일 기능을 이용해 사용자의 환경을 설정할 수 있다.
# 로그인 할 때 이 초기화 파일이 실행되서 사용자의 초기 환경이 설정된다.
# Linuxr계열의 OS에서 사용중인 계정의 정보는 "/etc/passwd"에서 확인할 수 있다.
# 그리고 각 계정 뒤에는 시스템 경로가 적여 있다.
# 그 중 하나, /bin/false: 로그인을 허용하나 쉘, ssh터널, 홈 디렉토리 제공하지 않는다. 주로 메일만 사용가능한 계정을 만들 때 씀
# -r, --system: create system account
# -u, --uid [UID]: user ID of the new account
# -g, --gid [GROUP]: name or ID of primary group of the new account
RUN useradd -r -u 1001 -g root nonroot && mkdir /home/nonroot
WORKDIR /usr/src/app
RUN chown -R nonroot:root /home/nonroot && chown -R nonroot:root /usr/local && chmod -R g+rwX /usr/src/app
USER nonroot

# 리눅스 주요 디렉터리
# /usr 각종 프로그램과 커널 소스 저장되는 디렉터리

# 이미지 안에 앱의 작업 디렉터리 생성


# chown {소유권자}:{그룹식별자} {소유권 변경하고 싶은 디렉토리명} -> 파일/디렉토리 소유권 변경 명령어
# -R: 하위 디렉토리 및 파일들도 소유권 변경하고 싶을 때
# chown:소유권 변경 vs chmod: 권한(읽기,쓰기 ,실행) 변경
# File permissions. What directories should be writable by the application? Adapt them by giving writing permissions to the non-root users. 
# nonroot변경시 권한 줘야함.
# RUN chmod -R g+rwX /var/log

# 앱 의존성 설치(package.json, yark.lock 파일 생성)
COPY package.json .
COPY yarn.lock .
#RUN npm install -g nodemon
RUN yarn install
# 프로덕션 위한 코드 빌드 시에는 아래 코드 사용
# RUN npm ci --only=production

# 앱 소스 추가
COPY . .



# CMD: 데몬 실행, 런타임 정의, 앱 실행 명령어 정의
CMD ["yarn", "dev"]


# RUN - 이미지를 생성하기 위해 실행되는 커맨드
# CMD - 컨테이너에서 실행되는 커맨드, 한 개의 CMD 명령어만 입력가능, 여러 개 입력시 마지막 커맨드만 적용
# shell 형식 vs Exec 형식
# shell 형식 RUN yarn start ==> docker container에서 /bin/sh -c로 커맨드 실행시키는 방식과 동일
# Exec는 shell 거치지 않고 바로 실행, 커맨드 값에 $HOME 등의 환경변수 입력 불가, JSON 형식으로 입력

# ENV 환경변수 설정
# ENV [KEY] [값]
# ENV [KEY]=[값]
# ENV 명령어로 설정한 환경변수는 컨테이너 실행 시 docker run 커맨드의 env 옵션을 사용해 변경 가능

# WORKDIR 작업디렉토리 설정
# RUN, CMD, ENTRYPOINT, COPY, ADD 명령어를 실행할 작업 디렉토리 설정

# 파일 시스템 설정
#앱 실행 위해서는 이미지에 앱 실행 모듈 심고 각종 로그 및 데이터베이스의 영구 데이터를 관리할 수 있어야함
# ADD -> 이미지에 호스트의 파일과 디렉토리 추가, 원격파일 다운로드 파일 압출 풀기 가능
# COPY -> 복사

# 도커파일 저장위치 -> 빈 디렉토리에 넣어두고 이미지를 생성하는 게 좋음, 왜냐? DOCKERFILE 로 이미지 만들면
# 도커 BUILD 컨맨드는 도커 파일을 포함한 디렉터리를 모두 도커 데몬으로 전송하기 때문
# 즉 루트디렉토리를 소스 레파지토리로 사용하면 루트 디렉토리의 모든 컨텐츠를 오커 데몬으로 보내므로 처리속도 느려짐
# 도커 빌드에 피룡 없는 파일은 도커파일과 동일한 디렉토리에 두지 않기
# 도커에서 BUILD하면 해당 디렉토리의 모든 파일이 도커 데몬으로 전송되는데 만약 빌드 할 때 제외하고자 하는 파일이 있다면 DOCKERIGNORE 파일을 사용