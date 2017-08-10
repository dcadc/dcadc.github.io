/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
    Jimp.read(e.data).then(function (lenna) {
		lenna.crop( 71, 47, 163, 20 );
		lenna.scan(0, 0, aaa.bitmap.width, aaa.bitmap.height, function (x, y, idx) {
				// x, y is the position of this pixel on the image
				// idx is the position start position of this rgba tuple in the bitmap Buffer
				// this is the image

				var red   = this.bitmap.data[ idx + 0 ];
				var green = this.bitmap.data[ idx + 1 ];
				var blue  = this.bitmap.data[ idx + 2 ];
				var alpha = this.bitmap.data[ idx + 3 ];
				if (green != 255) {
					for (i = 0; i < 3; i++) { 
						this.bitmap.data[ idx + i ] = 0;
					}
				} else { 
					for (i = 0; i < 3; i++) { 
						this.bitmap.data[ idx + i ] = 255;
					}
				}
				//document.writeln(green);
				// rgba values run from 0 - 255
				// e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
			});                // set JPEG quality
      lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
                if (err) throw err;
                self.postMessage(src);
                self.close();
         });
    });
});

