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
        if(file.path.indexOf("config") > -1){
            console.log(file.path,isOtherSuffixFile);
        }
        if(!isOtherSuffixFile){
            if(!isCurrentSuffix){
                var fileExtName = path.extname(file.path);
                var currentFileWithSuffix = path.dirname(file.path)+"/"+path.basename(file.path).replace(fileExtName,"."+suffix+fileExtName);
                
                fs.access(currentFileWithSuffix,fs.R_OK,function(err){
                    if(err){
                        this.self.push(this.file);
                    }
                    this.callback();
                }.bind({callback:cb,file:file,self:this}));
            }else{
                file.path = file.path.replace("."+suffix+".",".");
                this.push(file);
                cb();
            }   
        }else{
            cb();   
        }
    });
};

var isIncludeSuffix = function(path,suffix){
    return path.indexOf("."+suffix+".") > -1;
}
