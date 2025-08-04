node.js 설치
node -v
npm-v

npm init
npm install gulp-cli -g

npm install gulp@4.0.2 -D


// html
npm i gulp-nunjucks-render -D
npm i gulp-plumber -D
npm i gulp-cached -D
npm i gulp-data -D
npm i fs -D
npm i del@6.0.0 -D

// shorthand
npm i gulp-nunjucks-render gulp-plumber gulp-cached gulp-data fs del@6.0.0 -D

npx -p touch nodetouch gulpfile.js
gulp dev // 바벨 문서까지 만든 후 scripts dev 확인용

// js
npm i @babel/register @babel/core @babel/preset-env -D

gulp dev // 바벨 정상설치 확인 // Loaded external module: @babel/register



npm i gulp-webserver -D
gulp dev // 서버열리는 것 확인


npm i path -D


// css
npm install gulp-sass -D
npm install dart-sass -D
npm install gulp-dependents -D
npm install autoprefixer@9.8.5 -D
npm install gulp-postcss -D
npm install gulp-sourcemaps -D
npm install gulp-minify-css -D
npm install gulp-rename -D

// shorthand
npm i gulp-sass dart-sass gulp-dependents autoprefixer@9.8.5 gulp-postcss gulp-sourcemaps gulp-minify-css gulp-rename -D


// shorthand
npm i gulp-bro babelify uglifyify gulp-minify -D

// shorthand
npm i gulp-imagemin@7.1.0 gulp-newer -D
