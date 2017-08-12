/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
importScripts("./8x6bitmapfont.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		var lenna_bkp = new Jimp();
		Object.assign(lenna_bkp, lenna);
		console.log(typeof lenna+' bkp is '+typeof lenna_bkp);
		console.log( lenna+' bkp is '+ lenna_bkp);
		var bitwisemap = new Array(e.data.region_data.length);
		var fruits = new Array(e.data.region_data.length);
		var fruits_orig = new Array(e.data.region_data.length);
		var font = new Array(e.data.region_data.length);
		var imgsrc = new Array(e.data.region_data.length);
		for(var regno = 0; regno < e.data.region_data.length; regno++){
			Object.assign(lenna, lenna_bkp);
			for (var i = 0; i < 5; i++)
				console.log('e.data.region_data[regno][i]' + typeof e.data.region_data[regno][i] + 'val' + e.data.region_data[regno][i]);
			
			lenna.crop( e.data.region_data[regno][0], e.data.region_data[regno][1], e.data.region_data[regno][2], e.data.region_data[regno][3] );
			
			bitwisemap[regno] = new Array(lenna.bitmap.width);
			for (var i=0; i <lenna.bitmap.width; i++)
				bitwisemap[regno][i]=new Array(lenna.bitmap.height); 
			lenna.scan(0, 0, lenna.bitmap.width, lenna.bitmap.height, function (x, y, idx) {
				// x, y is the position of this pixel on the image
				// idx is the position start position of this rgba tuple in the bitmap Buffer
				// this is the image
				var red   = this.bitmap.data[ idx + 0 ];
				var green = this.bitmap.data[ idx + 1 ];
				var blue  = this.bitmap.data[ idx + 2 ];
				var alpha = this.bitmap.data[ idx + 3 ];
				if (green != 255) {
					for (var i = 0; i < 3; i++) { 
						this.bitmap.data[ idx + i ] = 0;
					}
				} else { 
					for (var i = 0; i < 3; i++) { 
						this.bitmap.data[ idx + i ] = 255;
					}
				}
				bitwisemap[regno][x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
				//document.writeln(green);
				// rgba values run from 0 - 255
				// e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
			});
			fruits[regno] = bitwisemap[regno].slice(0);
			if ( e.data.region_data[regno][3] == 8) {
				/*
				for(var i = 0; i < fruits[regno].length; i++){
					fruits[regno][i]=fruits[regno][i].join('');
					fruits[regno][i].toString();
					fruits[regno][i] = parseInt(fruits[regno][i], 2);
					fruits[regno][i] = toPaddedHexString(fruits[regno][i], 2);
					fruits[regno][i] = "0x"+fruits[regno][i].toUpperCase(); 
				}
				*/
				for(var i = 0; i < fruits[regno].length; i++){
					fruits[regno][i]=fruits[regno][i].join('');
					fruits[regno][i].toString();
					fruits[regno][i] = parseInt(fruits[regno][i], 2);
					fruits[regno][i] = toPaddedHexString(fruits[regno][i], 2);
					fruits[regno][i] = "x"+fruits[regno][i].toUpperCase()+"x"; 
				}
				fruits[regno] = fruits[regno].join('');
				fruits_orig[regno] = fruits[regno].slice(0);
				font[regno] = bmpfont1.slice(0);
				for(var i = font[regno].length-1; i >= 0; i--){
					if((typeof font[regno][i]) != 'undefined'){
						if((font[regno][i].length) > 0){						
							for(var j = 0; j < font[regno][i].length; j++){
								font[regno][i][j] = toPaddedHexString(font[regno][i][j], 2);
								font[regno][i][j] = "x"+font[regno][i][j].toUpperCase()+"x";
							}
							font[regno][i] = font[regno][i].join('');
							//fruits[regno] = font[regno][48];
							fruits[regno] = fruits[regno].replace(new RegExp(font[regno][i], 'g'), "&#"+ i +";");
						}
					}
				}
			}
			lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
				if (err) throw err;
				imgsrc[regno] = src;
			});	
		}
		console.log('img'+e.data.imgid+' name='+ e.data.filename+ ' cropped.x'+bitwisemap.length+ ' cropped.y'+bitwisemap[0].length+' bmpfont'+font[regno]);
		self.postMessage({
			'view': src,
			'imgid': e.data.imgid,
			'filename': e.data.filename,
			'bitwisemap': bitwisemap,
			'fruits_orig': fruits_orig,
			'fruits': fruits
		});
		self.close();
	});
});

function toPaddedHexString(num, len) {
	str = num.toString(16);
	return "0".repeat(len - str.length) + str;
}