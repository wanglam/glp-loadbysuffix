var path = require('path')
, gutil = require('gulp-util')
, through = require('through2')
, crypto = require('crypto')
, fs = require("fs");

module.exports = function (options) {
    var suffix = options.suffix;
    var allSuffix = options.allSuffix;

    return through.obj(function (file, enc, cb) {
        var isOtherSuffixFile = false;
        var isCurrentSuffix = isIncludeSuffix(file.path,suffix);

        if(!isCurrentSuffix){
            allSuffix.forEach(function(oneSuffix){
                if(isIncludeSuffix(this.path,oneSuffix)){
                    isOtherSuffixFile = true;
                }
            }.bind({path:file.path}));
        }
        if(!isOtherSuffixFile){
            if(!isCurrentSuffix){
                var noSuffixFilename = getNoSuffixFilename(getNoExtName(path.basename(file.path)),allSuffix);
                fs.readdir(path.dirname(file.path), function(err,data){
                    if(err){
                        this.callback();
                    }else{
                        var existsCurrentSuffixFlag = false;
                        var currentSuffix = this.currentSuffix;
                        
                        data.forEach(function(oneFile){
                            if(getNoSuffixFilename(getNoExtName(oneFile),allSuffix) === noSuffixFilename && isIncludeSuffix(oneFile,currentSuffix)){
                                existsCurrentSuffixFlag = true;
                            }
                        })
                        if(!existsCurrentSuffixFlag){
                            this.self.push(this.file);
                        }
                        this.callback();
                    }
                }.bind({callback:cb,currentSuffix:suffix,file:file,self:this}))
            }else{
                file.path = getNoSuffixFilename(file.path,allSuffix);
                this.push(file);
                cb();
            }   
        }else{
            cb();   
        }
    });
};

var getNoSuffixFilename = function(filename,allSuffix){
    allSuffix.forEach(function(oneSuffix){
        filename = filename.replace("."+oneSuffix+".",".");
    });
    if(/\.$/.test(filename)){
        filename = filename.replace(/\.$/,"");
    }
    return filename;
}

var isIncludeSuffix = function(path,suffix){
    return path.indexOf("."+suffix+".") > -1;
}

var getNoExtName = function(s){
    return s.replace(new RegExp("\\"+path.extname(s)+"$"),".")
}
