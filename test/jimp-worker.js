/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		lenna.crop( e.data.crop_x, e.data.crop_y, e.data.crop_w, e.data.crop_h );
		var bitwisemap = new Array(lenna.bitmap.width);
		for (i=0; i <lenna.bitmap.width; i++)
		bitwisemap[i]=new Array(lenna.bitmap.height); 
		lenna.scan(0, 0, lenna.bitmap.width, lenna.bitmap.height, function (x, y, idx) {
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
			bitwisemap[x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
			//document.writeln(green);
			// rgba values run from 0 - 255
			// e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
		});                // set JPEG quality
		
		var fruits = bitwisemap;
		for(var i = 0; i<fruits.length; i++){
			fruits[i]=fruits[i].join('');
			fruits[i].toString();
			fruits[i] = parseInt(fruits[i], 2);
			fruits[i] = toPaddedHexString(fruits[i], 2) 
			fruits[i] = "0x"+fruits[i].toUpperCase(); 
		}
		lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
			if (err) throw err;
			console.log('img'+e.data.imgid+' name='+ e.data.filename);
			self.postMessage({
				'view': src,
				'imgid': e.data.imgid,
				'filename': e.data.filename,
				'bitwisemap': bitwisemap
				'fruits': fruits
			});
			self.close();
		});
	});
});

function toPaddedHexString(num, len) {
	str = num.toString(16);
	return "0".repeat(len - str.length) + str;
}