# taewoo-jo homepage

개인 홈페이지. 빌드 도구 없이 순수 HTML/CSS로 되어 있어, 파일을 push 하면 그대로 배포됩니다.

```
index.html      홈페이지 전체 내용 (여기만 고치면 됨)
style.css       스타일 (색상은 파일 맨 위 :root 변수)
cv.html         CV 원본 — 여기를 고치고 build-cv.ps1 실행
build-cv.ps1    cv.html -> assets/cv.pdf 생성 스크립트
assets/
  profile.jpg   프로필 사진 (이 이름으로 넣으면 자동 표시)
  casual.jpg    예비 사진
  cv.pdf        cv.html 에서 자동 생성됨 — 직접 고치지 말 것
  papers/       논문 PDF ({연도}-{학회}-{약칭}.pdf)
```

## CV 수정

`assets/cv.pdf` 는 `cv.html` 에서 생성된 결과물입니다. 직접 편집하지 말고:

1. `cv.html` 수정
2. `powershell -ExecutionPolicy Bypass -File build-cv.ps1`
3. commit &amp; push

## 로컬에서 보기

`index.html`을 브라우저로 열면 끝. (또는 `python -m http.server` 후 http://localhost:8000)

## GitHub Pages 배포

1. GitHub에서 **public** 저장소 생성 — 이름은 `carvenist.github.io` (본인 계정명과 정확히 일치해야 함)
2. 이 폴더에서:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial site"
   git remote add origin https://github.com/carvenist/carvenist.github.io.git
   git push -u origin main
   ```

3. 저장소 → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save
4. 1~2분 뒤 `https://carvenist.github.io` 에서 접속 가능

이후 수정은 `git add . && git commit -m "update" && git push` 하면 자동 반영.

## 방문자 통계

GoatCounter 를 씁니다 (쿠키·개인정보 수집 없음). 통계 확인:
**https://twj5349.goatcounter.com**

스니펫은 `index.html` 맨 아래에 있습니다.

## 캐시 주의

`index.html` 의 `style.css?v=3` 에서 `?v=` 는 캐시 무효화용입니다.
CSS 를 크게 고쳤는데 브라우저에 반영이 안 되면 이 숫자를 올리고 push 하세요.

## 내용 수정

- 논문 추가: `index.html`의 `<ol class="pubs">` 안에 기존 `<li>` 블록을 복사해서 맨 위에 붙여넣기
- News 추가: `<ul class="news">` 안에 한 줄 추가
- 색상 변경: `style.css` 맨 위 `--accent` 값 (라이트/다크 각각)
