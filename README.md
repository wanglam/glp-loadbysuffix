# Load File By File Suffix

> It's useful for load multi version file with same name.

## USEAGE

* In gulpfile.js

```javascript
var countryCode = "sg";
var countries = ["sg","au"];
gulp.src("src/origin/**/*.*")
        .pipe(cache("cacheFor"+countryCode))
        .pipe(loadbysuffix({suffix:countryCode,allSuffix:countries}))
        .pipe(dest(countryCode))
        .pipe(gulp.dest("./src"))
```

* In normal javascript file

```javascript

    var ComponentA = require("componenta.jsx");

``` 
