# AP-1 

마이리얼트립 스웨거 허브 AP-1

마리트 3.0 에서 사용되는 swagger의 결과물(OpenAPI 3.0)을 하나의 툴로서 관리하고 

도메인 기반의 로그인을 지원함으로써 

인증코드를 매번 넣지 않고도 실제 API 테스트를 용이하게 하는 툴입니다. 


### 시작하기 - `yarn start`

시작하기에 앞서 로컬의 도메인을 하나 설정 해준다. 

 127.0.0.1 local.dev-myrealtrip.com 

 그런 다음 아래의 명령어를 실행해서 어플리케이션을 실행해주자. 


```sh
yarn 
yarn start 
open http://local.dev-myrealtrip.com:5300
```

초기 시작시 최신 swagger 파일을 업데이트 하고 시작합니다. 




### 빌드하기 - `yarn build`

빌드한 결과물을 build/ 에 만듭니다. static 형태로 되어 있기 때문에 순수 SPA 로 동작합니다. 


### 배포하기 - `yarn deploy` 

현재 브랜치를 배포합니다. 