# 2022 캡스톤디자인 7-4
git clone -> npm install -> node ./src/mainkp.js  
내부 포트번호 : 8880

## Link
| regist                  | login                    | match             | match list         | class                             | class list          |
|:-----------------------:|:------------------------:|:-----------------:|:------------------:|:---------------------------------:|:-------------------:|
|[사용자 등록](#사용자-등록)|     [로그인](#로그인)     |[방만들기](#방만들기)|[방리스트](#방리스트)|       [고수 등록](#고수-등록)      |  [모든 방](#고수-방)  |
|[사용자 삭제](#사용자-삭제)|   [로그아웃](#로그아웃)   |  [방참가](#방참가)  | [내방](#내방리스트) |      [방 등록](#고수-방-등록)      |  [내 방](#내-고수-방) |
|[사용자 정보](#사용자-정보)|[로그인 상태](#로그인-상태)|[참가취소](#참가취소)| [게임방](#게임별-방) |      [방 참가](#고수-방-참가)      |[종목별 방](#종목별-방)|
|                         |                          |[참가자들](#참가자들)|                    |[참가/방 취소](#참가-취소-or-방-취소)|                     |
|                         |                          |                    |                   |   [참가자리스트](#초보-참가자들)    |                      |

## DB 
<img width="100%" src="https://user-images.githubusercontent.com/33221641/207627598-530b3bb7-8410-43e8-b98b-336436e95dc5.png"/>

#
## 사용자 등록
이메일, 닉네임 중복 금지  
url : http://IP:PORT/user/singup  
### header :
> POST 형식  
> content-type : application/json  
### body : 
> email : (이메일)  
> pw : (비밀번호)  
> name : (이름)  
> nickname : (닉네임)
### return : 
|     cause      | status | content                                  |
|:-------------:|:------:|------------------------------------------|
|    정보부족   |   404  | "Please fill it up"                      |
|   email 중복  |   202  | "email ${email} is already exists"       |
| nickname 중복 |   202  | "nickname ${nickname} is already exists" |
|   생성 성공   |   200  | "${email} has been created."             |
|      오류     |   202  | "something wrong in signup"              |
#
## 로그인
url : http://IP:PORT/user/login  
### header :
> POST 형식  
> content-type : application/json  
### body :
> email : (이메일)  
> pw : (비밀번호)  
### return : 
|    cause    | status | content                                    |
|:-----------:|:------:|--------------------------------------------|
| 로그인 성공 |   200  | { "email": "email", "nickname":"nickname", "score": 10, "credit : 10} |
| 로그인 실패 |   401  | "Unauthorized"                             |
#
## 현재 로그인 상태
url : http://IP:PORT/user/islogin  
### header :
> Get 형식    
### return : 
|    cause     | status | content |
|:------------:|:------:|--------|
| 로그인 상태   |   200  |  true  |
| 비로그인 상태 |   202  |  false |
#
## 로그아웃
로그인 되어있는 상태에서  
url : http://IP:PORT/user/logout
### header : 
> GET 형식
### return : 
|     cause     | status | content |
|:-------------:|:------:|---------|
| 로그아웃 성공 |   200  | "logout" |
#
## 사용자 삭제
로그인 되어있는 상태에서  
url : http://IP:PORT/user/signout
### header : 
> DELETE 형식
### return :
|      cause     | status | content        |
|:--------------:|:------:|----------------|
| 회원탈퇴 성공  |   200  | "sign out"     |
|  비로그인 상태 |   401  | "log in first" |
#
## 사용자 정보
로그인 되어있는 상태에서  
url : http://IP:PORT/user/detail  
nickname 과 email 반환  
### header : 
> GET 형식  
### return :
|     cause     | status | content                                   |
|:-------------:|:------:|-------------------------------------------|
|   요청 성공   |   200  | { "nickname":"nickname", "email":"email"} |
| 비로그인 상태 |   401  | "log in first"                            |
#
###
###
#
## 방만들기
로그인 되어있는 상태에서  
url : http://IP:PORT/match/start  
생성된 방 번호 반환  
### header : 
> POST 형식  
> content-type : application/json  
### body :
> game : (게임 종류)  (농구, 축구 등)  
> lati : (위도)  
> longi : (경도)  
> (json) content : {(추가 정보)  (목표 시간 등)}   
### return : 
|    cause     | status | content        |
|:------------:|:------:|:--------------:|
| 로그인 성공   |   200  | ${room_id}     |
| 비로그인 상태 |   401  | "log in first" |
#
## 방참가
로그인 되어있는 상태에서  
url : http://IP:PORT/match/attend(room_id)
### header :  
> GET 형식  
### return :
|    cause         | status | content                      |
|:----------------:|:------:|:----------------------------:|
|    방 참가 성공   |   200  | "${nickname} attend ${game}" |
| room_id 형식 오류 |   402  |          "put integer"       |
| 해당 room_id 없음 |   202  |            "no room"         |
|   비로그인 상태   |   401  |         "log in first"       |
#
## 참가취소
로그인 되어있는 상태에서  
url : http://IP:PORT/match/attend(room_id)
### header :
> DELETE 형식
### return :
|    cause         | status | content                  |
|:----------------:|:------:|:------------------------:|
|  참가 취소 성공   |   200  |  "cancel participation"  |
|   본인 방 취소    |   200  | "delete room ${room_id}" |
|    이미 참가 X    |   202  |     "already deleted"    |
| room_id 형식 오류 |   402  |      "put integer"       |
| 해당 room_id 없음 |   202  |        "no room"         |
|   비로그인 상태   |   401  |      "log in first"      |
#
## 참가자들
url : http://IP:PORT/match/part(room_id)  
list : 참여자 닉네임, 참여 일시 리스트 반환 
number : 참여자 수 반환
### header :
> GET 형식
### return :
|    cause         | status | content                                                        |
|:----------------:|:------:|:--------------------------------------------------------------:|
|     요청 성공     |   200  | {"list": ["sample", "2022-12-15 10:00:00", ... ], "number": 2} |
| room_id 형식 오류 |   402  |                        "put integer"                           |
| 해당 room_id 없음 |   202  |                          "no room"                             |
|   비로그인 상태   |   401  |                        "log in first"                          | 
#
## 방리스트
url : http://IP:PORT/match/all(offset)  
각 offset마다 10개씩 반환 (0: 1~10, 1: 11~20)
### header :
> GET 형식
### return :
|    cause         | status | content                                                                                   |
|:----------------:|:------:|:-----------------------------------------------------------------------------------------:|
|     요청 성공     |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "content":${content}, "createdAt":${생성시간} }, ...] |
| room_id 형식 오류 |   402  |                                     "put integer"                                         |
#
## 내방리스트
로그인 되어있는 상태에서
url : http://IP:PORT/match/mylist
### header :
> GET 형식
### return :
|    cause     | status | content                                                                                   |
|:------------:|:------:|:-----------------------------------------------------------------------------------------:|
|   요청 성공   |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "content":${content}, "createdAt":${생성시간} }, ...] |
| 비로그인 상태 |   401  |  'log in first' |
#
## 게임별 방
url : http://IP:PORT/match/list(game)
### header :
> GET 형식
### return :
|    cause     | status | content                                                                                   |
|:------------:|:------:|:-----------------------------------------------------------------------------------------:|
|   요청 성공   |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "content":${content}, "createdAt":${생성시간} }, ...] |
#
###
###
#
## 고수 등록
로그인 되어있는 상태에서
url : http://IP:PORT/class/register
### header :
> POST 형식  
> content-type : application/json  
### body : 
> game : (종목)  (농구, 축구 등)  
> (json) content : { ()}
### return :
|     cause    | status | content                                      |
|:------------:|:------:|:--------------------------------------------:|
|   생성 성공   |   200  | "${nickname} is registered as ${game} gosu." |
| 비로그인 상태 |   401  |               "log in first"                 | 
#
## 고수 방 등록
로그인 되어있는 상태에서
url : http://IP:PORT/class/start
### header :
> POST 형식  
> content-type : application/json  
### body :
> game : (게임 종류)  (농구, 축구 등)  
> lati : (위도)  
> longi : (경도)  
> limit : (최대 사람 수)
> (json) content : {(추가 정보)  (목표 시간 등)}  
### return :
|     cause       | status | content             |
|:---------------:|:------:|:-------------------:|
|   생성 성공      |   200  |    "${room id}"     |
| 해당 종목 고수 X |   402  | register gosu first |
| 비로그인 상태    |   401  |    "log in first"   |
#
## 고수 방 참가
로그인 되어있는 상태에서  
url : http://IP:PORT/class/attend(room_id)
### header :  
> GET 형식  
### return :
|    cause         | status | content                      |
|:----------------:|:------:|:----------------------------:|
|    방 참가 성공   |   200  | "${nickname} attend ${game}" |
|      본인 방      |  401   |          "your class"        |
| 해당 room_id 없음 |   202  |            "no room"         |
|   비로그인 상태   |   401  |         "log in first"       |
| room_id 형식 오류 |   402  |          "put integer"       |
#
## 참가 취소 or 방 취소
로그인 되어있는 상태에서  
url : http://IP:PORT/class/attend(room_id)
### header :
> DELETE 형식
### return :
|    cause         | status | content                  |
|:----------------:|:------:|:------------------------:|
|  참가 취소 성공   |   200  |  "cancel participation"  |
|   본인 방 취소    |   200  | "delete room ${room_id}" |
|    이미 참가 X    |   202  |     "already deleted"    |
| room_id 형식 오류 |   402  |      "put integer"       |
| 해당 room_id 없음 |   202  |        "no room"         |
|   비로그인 상태   |   401  |      "log in first"      |
#
## 초보 참가자들
url : http://IP:PORT/class/part(room_id)  
list : 참여자 닉네임, 참여 일시 리스트 반환 
number : 참여자 수 반환
### header :
> GET 형식
### return :
|    cause         | status | content                                                        |
|:----------------:|:------:|:--------------------------------------------------------------:|
|     요청 성공     |   200  | {"list": ["sample", "2022-12-15 10:00:00", ... ], "number": 2}  (list에는 닉네임과 참가시간, number는 참가자 수)|
| room_id 형식 오류 |   402  |                        "put integer"                           |
| 해당 room_id 없음 |   202  |                          "no room"                             |
|   비로그인 상태   |   401  |                        "log in first"                          | 
#
## 고수 방
url : http://IP:PORT/class/all(offset)  
각 offset마다 10개씩 반환 (0: 1~10, 1: 11~20)
### header :
> GET 형식
### return :
|    cause         | status | content                                                                                   |
|:----------------:|:------:|:-----------------------------------------------------------------------------------------:|
|     요청 성공     |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "limit":${수제한},  "content":${content}, "createdAt":${생성시간} }, ...] |
| room_id 형식 오류 |   402  |                                     "put integer"                                         |
#
## 내 고수 방
로그인 되어있는 상태에서
url : http://IP:PORT/class/mylist
### header :
> GET 형식
### return :
|    cause     | status | content                                                                                   |
|:------------:|:------:|:-----------------------------------------------------------------------------------------:|
|   요청 성공   |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "limit":${수제한}, "content":${content}, "createdAt":${생성시간} }, ...] |
| 비로그인 상태 |   401  |  'log in first' |
#
## 종목별 방
url : http://IP:PORT/class/list(game)
### header :
> GET 형식
### return :
|    cause     | status | content                                                                                   |
|:------------:|:------:|:-----------------------------------------------------------------------------------------:|
|   요청 성공   |   200  | [{"id":${room_id}, "game":${game}, "lati":${위도}, "longi":${경도}, "content":${content}, "createdAt":${생성시간} }, ...] |
#
## 유저 신고
로그인 되어있는 상태에서
url : http://IP:PORT/report/(nickname)
### header : 
> POST 형식
### body : 
> content : 신고 내용
### return :
|   cause      | status |  content           |
|:------------:|:------:|:------------------:|
|   신고 완료   |  200   |     "reported"     |
|  중복된 요청  |  201   | "already reported" |
|   대상 없음   |  400   |     "no target"    |
| 비로그인 상태 |  401   |    "log in first"  |
#
## 신고 당한 내역
로그인 되어있는 상태에서  
url : http://IP:PORT/reported    
### header : 
> GET 형식   
### return :
|   cause      | status |   content                                                      |
|:------------:|:------:|:--------------------------------------------------------------:|
|   신고 내역   |  200   | {"list" : [${신고 내용}, ${신고 시간}, ... },], "number":(횟수)} |
| 비로그인 상태 |  401   |                           "log in first"                       |
#
## 내 신고 내역
로그인 되어있는 상태에서  
url : http://IP:PORT/myreport  
### header :
> GET 형식
### return : 
|   cause      | status |   content                                                      |
|:------------:|:------:|:--------------------------------------------------------------:|
|   신고 내역   |  200   | {"list" : [${신고 내용}, ${신고 시간}, ... },], "number":(횟수)} |
| 비로그인 상태 |  401   |                           "log in first"                       |
