# 빌드 가이드

이 프로젝트는 webpack 없이 빌드합니다:
- Client/Server: TypeScript 컴파일러 (tsc)
- UI: esbuild (dependencies 번들링 필요)

빌드 결과물은 minify되지 않아 디버깅이 가능합니다.

## 요구사항

- Node.js
- npm

## 빌드 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 빌드 실행

```bash
sh scripts/build.sh
```

또는 npm script 사용:

```bash
npm run build
```

### 3. 빌드 결과

빌드가 완료되면 `./build/` 디렉토리에 다음 파일들이 생성됩니다:

```
build/
├── dist/
│   ├── client.js
│   ├── client.js.map
│   ├── server.js
│   ├── server.js.map
│   ├── ui.js
│   ├── ui.js.map
│   └── ui.html
└── fxmanifest.lua
```

## 수동 빌드 (Windows)

mise나 다른 환경에서 직접 실행하는 경우:

```bash
# 1. 루트에서 client/server 빌드
npx tsc

# 2. UI 빌드 (esbuild로 dependencies 번들링)
npx esbuild ui/src/main.ts --bundle --sourcemap --format=esm --outfile=dist/ui.js --minify=false

# 3. UI HTML 복사
copy ui\index.html dist\ui.html

# 4. build 디렉토리 생성 및 복사
mkdir build
xcopy /E /I dist build\dist
copy fxmanifest.lua build\
```

## 특징

- **Minify 없음**: 코드가 압축되지 않아 읽기 쉽습니다
- **Source Map 포함**: 디버깅을 위한 소스맵이 생성됩니다
- **빠른 빌드**: webpack 대신 tsc와 esbuild 사용
- **UI 번들링**: @citizenfx/three 등 dependencies가 UI에 임베드됩니다

## FiveM 리소스로 사용

`build/` 디렉토리 전체를 FiveM 서버의 `resources/` 폴더에 복사하거나,
git submodule로 추가하여 사용할 수 있습니다.
