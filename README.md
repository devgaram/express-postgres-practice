# 테스트 DB 실행

```
$ cd testdb
$ docker-compose up -d
```
PGADMIN
- URL: http://192.168.99.100:5555
- ID: test@gmail.com
- PASSWORD: 1234
- connection 정보
  - Host name/address: pgsql
  - port: 5432
  - username: test
  - password: 1234

# migration & seed

마이그레이션

```
./node_modules/.bin/sequelize-cli db:migrate
```

마이그레이션 취소

```
./node_modules/.bin/sequelize-cli db:migrate:undo
```

시드 - 데이터 insert
```
./node_modules/.bin/sequelize-cli db:seed:all
```