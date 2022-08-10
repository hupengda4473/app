(function ($) {
    $.fn.qrcode = function (options, func) {
        // if options is string,
        if (typeof options === 'string') {
            options = {text: options};
        } else if (typeof options.text === 'undefined' && typeof options.textArray === 'undefined' && typeof options === 'object') {
            options = {textArray: options};
        }

        // set default values
        // typeNumber < 1 for automatic calculation
        options = $.extend({}, {
            width       : 256,//长，单个二维码
            height      : typeof options.width === 'number' ? options.width : 256,//高，单个二维码
            typeNumber  : -1,
            correctLevel: QRErrorCorrectLevel.H,//L，M，Q和H。其中，L最低，H最高。修改最后的字母就好
            background  : "#ffffff",
            foreground  : "#000000",

            rowNumber: typeof options.rowNumber === 'number' ? options.rowNumber : 3,
            colNumber: typeof options.colNumber === 'number' ? options.colNumber : Math.ceil((typeof options.textArray === 'object' ? options.textArray.length : 1) / (typeof options.rowNumber === 'number' ? options.rowNumber : 3)),
            spacing_x: 30,
            spacing_y: typeof options.spacing_x === 'number' ? options.width : 30
        }, options);

        // create canvas element
        var canvas = document.createElement('canvas');
        //canvas.width = (options.width + options.spacing_x) * options.rowNumber - options.spacing_x;
        canvas.width = options.width;//2017-1-22 xwp修改，上面一行是原版
        //canvas.height = (options.height + options.spacing_y) * options.colNumber - options.spacing_y;
        //canvas.height = (options.height + options.spacing_y) * options.colNumber;
        canvas.height = options.height;//2017-1-22 xwp修改，上面一行是原版
        console.log(canvas);
        var ctx = canvas.getContext('2d');

        var createCanvas = function (text, offset_x, offset_y, i) {
            // create the qrcode itself
            var qrcode = new QRCode(options.typeNumber, options.correctLevel);
            qrcode.addData(text);
            qrcode.make();

            // compute tileW/tileH based on options.width/options.height
            var tileW = options.width / qrcode.getModuleCount();
            var tileH = options.height / qrcode.getModuleCount();

            // draw in the canvas
            for (var row = 0; row < qrcode.getModuleCount(); row++) {
                for (var col = 0; col < qrcode.getModuleCount(); col++) {
                    ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                    ctx.fillRect(Math.round(col * tileW) + offset_x, Math.round(row * tileH) + offset_y, w, h);
                }
            }
            if (typeof func === 'function') {
                func(canvas, i)
            }
        };

        return this.each(function () {
            if (typeof options.textArray === 'object') {
                var offset_x = options.width + options.spacing_x;
                var offset_y = options.height + options.spacing_y;
                for (var i = 0; i < options.textArray.length; i++) {
                    createCanvas(options.textArray[i],
                        i % options.rowNumber * offset_x,
                        Math.floor(i / options.rowNumber) * offset_x, i);
                }
            } else {
                createCanvas(options.text, 0, 0, 0);
            }
            $(canvas).appendTo(this);
        });
    };
})(jQuery);
