# taewoo-jo homepage

개인 홈페이지. 빌드 도구 없이 순수 HTML/CSS로 되어 있어, 파일을 push 하면 그대로 배포됩니다.

```
index.html      전체 내용 (여기만 고치면 됨)
style.css       스타일 (색상은 파일 맨 위 :root 변수)
assets/
  profile.jpg   프로필 사진 (이 이름으로 넣으면 자동 표시)
  cv.pdf        CV
```

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

## 내용 수정

- 논문 추가: `index.html`의 `<ol class="pubs">` 안에 기존 `<li>` 블록을 복사해서 맨 위에 붙여넣기
- News 추가: `<ul class="news">` 안에 한 줄 추가
- 색상 변경: `style.css` 맨 위 `--accent` 값 (라이트/다크 각각)
