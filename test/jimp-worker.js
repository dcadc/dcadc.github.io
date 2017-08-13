/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
importScripts("./8x6bitmapfont.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		var lenna_bkp = lenna.clone();
		var bitwisemap = new Array(e.data.region_data.length);
		var fruits = new Array(e.data.region_data.length);
		var fruits_orig = new Array(e.data.region_data.length);
		var font = new Array(e.data.region_data.length);
		var imgsrc = new Array(e.data.region_data.length);
		for(var regno = 0; regno < e.data.region_data.length; regno++){
			lenna = lenna_bkp.clone();
for (var i = 0; i < 5; i++)	console.log('e.data.region_data[regno][i]' + typeof e.data.region_data[regno][i] + 'val' + e.data.region_data[regno][i]);

			lenna.crop( e.data.region_data[regno][0],
						e.data.region_data[regno][1],
						e.data.region_data[regno][2],
						e.data.region_data[regno][3] );
			
			bitwisemap[regno] = new Array(lenna.bitmap.width);
			for (var i=0; i <lenna.bitmap.width; i++)
				bitwisemap[regno][i]=new Array(lenna.bitmap.height); 
			
			lenna.scan(0, 0, lenna.bitmap.width, lenna.bitmap.height, function (x, y, idx) {
				// x, y is the position of this pixel on the image
				// idx is the position start position of this rgba tuple in the bitmap Buffer
				// this is the image
				/*
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
				}*/
				if(lenna.getPixelColor(x, y)==e.data.region_data[regno][4]){
					lenna.setPixelColor(0xFFFFFFFF, x, y);
				}
				else{
					lenna.setPixelColor(0x000000FF, x, y);
				}
				bitwisemap[regno][x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
			});
			
			fruits[regno] = bitwisemap[regno].slice(0);
			font[regno] = JSON.parse(JSON.stringify(bmpfont1));
			
			if ( e.data.region_data[regno][3] == font[regno].height) {
				for(var i = 0; i < fruits[regno].length; i++){
					fruits[regno][i]=fruits[regno][i].join('');
					fruits[regno][i].toString();
					fruits[regno][i] = parseInt(fruits[regno][i], 2);
					fruits[regno][i] = toPaddedHexString(fruits[regno][i], 2);
					fruits[regno][i] = "x"+fruits[regno][i].toUpperCase()+"x"; 
				}
				
				fruits[regno] = fruits[regno].join('');
				fruits_orig[regno] = fruits[regno].slice(0);
				
				for(var i = font[regno].data.length-1; i >= 0; i--){
					if((font[regno].data[i]) != null){
						if((font[regno].data[i].length) > 0){
							console.log('i:'+i+' font[regno].data[i]:'+font[regno].data[i]);
							for(var j = 0; j < font[regno].data[i].length; j++){
								font[regno].data[i][j] = toPaddedHexString(font[regno].data[i][j], 2);
								font[regno].data[i][j] = "x"+font[regno].data[i][j].toUpperCase()+"x";
							}
							font[regno].data[i] = font[regno].data[i].join('');
							fruits[regno] = fruits[regno].replace(new RegExp(font[regno].data[i], 'g'), "&#"+ i +";");
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
			'view': imgsrc,
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