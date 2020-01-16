# MEMON - Server
- [간단한 프로젝트 소개 노션 페이지](https://www.notion.so/Don_Juan-Memon-12538295edc74a3dbcf9493cb293d45a)
- 친구들과 밥을 먹고 한 사람이 계산하고 나중에 돈을 보내주는 더치 페이를 할 때 편하게 사용할 수 있는 어플

- [클라이언트 배포 - 구글 플레이 스토어](https://play.google.com/store/apps/details?id=com.memon.app)
- 서버는 AWS EC2, DB는 RDS 사용
- Stack : NodeJS, TypeScript, Express, PostgreSQL, Sequelize, Expo

- 함께 먹은 사람(주소록 기반)과 총 비용을 기록해서 사용할 수 있다.
![new](https://user-images.githubusercontent.com/42869930/72518459-c0db3f80-3898-11ea-9fa4-4ca9e94a5edd.gif)
- 내가 돈을 낸 사람이라면 돈을 입금해달라는 알림 푸시를 5회까지 보낼 수 있고, 돈을 내야하는 사람이라면 입금을 했으니 확인해달라는 알림 푸시를 보낼 수 있다.
![push](https://user-images.githubusercontent.com/42869930/72518500-dcdee100-3898-11ea-9ee2-4ab21df3c25d.gif)

### 디렉토리 구조
- src 폴더에 있는 타입스크립트 파일들을 컴파일하여 dist 폴더에 자바스크립트 파일로 변환
- 클라이언트의 요청을 router.ts에서 분기하여 controller로 보냄

### DB schema
![DB_schema](https://i.imgur.com/kDnqX6k.png)

### API (JSON)

|Method |End Point  |Usage |
| --------| -------- | -------- |
| POST | /main   |main page 대시보드 (줄 돈, 받을 돈)|
| POST | /users/email  |이 이메일을 갖고 있는 유저가 DB에 저장되어 있는지 확인|
| POST | /users/signup |회원가입|
| POST | /users/contacts |유저의 전화번호부 기반으로, 현재 서비스에 가입된 사람들 명단 리턴|
| POST | /payment | 새로운 결제 생성|
| POST | /payment/all | 결제 목록, 최신 순서|
| POST | /pricebook| 결제 개별 뷰 |
| PATCH | /payment/ispayed | 입금 확인으로 결제 수정 |
| POST | /users/pushtoken | 푸시 알림 보내기 |
| PATCH | /pricebook/transCompleted | 개별 결제건 입금완료 |

## 팀원

| 이름   | 역할      | TIL blog                          | github username                                |
| ------ | --------- | --------------------------------- | ---------------------------------------------- |
| 조아라 | back-end | https://grin-quokka.tistory.com/  | [grin-quokka ](https://github.com/grin-quokka) |
| 최방실 | front-end | https://dev-59inu.tistory.com/   | [59inu](https://github.com/59inu)    |
| 이해준 | front-end  | https://medium.com/@0oooceanhigh/ | [liftingturn](https://github.com/liftingturn)  |
