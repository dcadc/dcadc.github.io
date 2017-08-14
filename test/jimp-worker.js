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
		var monkey = new Array(e.data.region_data.length);

		var font = new Array(e.data.region_data.length);
		var imgsrc = new Array(e.data.region_data.length);
		for(var regno = 0; regno < e.data.region_data.length; regno++){
			lenna = lenna_bkp.clone();
for (var i = 0; i < 5; i++)	console.log('e.data.region_data[regno][i]' + typeof e.data.region_data[regno][i] + 'val' + e.data.region_data[regno][i]);
			monkey[regno] ={
				region_number:  new Number(),
				map_of_bits: new Array(),
				original:  new Number(),
				extracted:  new String(),
				number_of_chars:  new Number(),
			};
			lenna.crop( e.data.region_data[regno][0],
						e.data.region_data[regno][1],
						e.data.region_data[regno][2],
						e.data.region_data[regno][3] );
			
			monkey[regno].map_of_bits = new Array(lenna.bitmap.width);
			for (var i=0; i <lenna.bitmap.width; i++)
				monkey[regno].map_of_bits[i]=new Array(lenna.bitmap.height); 
			
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
				monkey[regno].map_of_bits[x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
			});
			
			monkey[regno].extracted = monkey[regno].map_of_bits.slice(0);
			font[regno] = JSON.parse(JSON.stringify(bmpfont1));
			
			if ( e.data.region_data[regno][3] == font[regno].height) {
				for(var i = 0; i < monkey[regno].extracted.length; i++){
					monkey[regno].extracted[i]=monkey[regno].extracted[i].join('');
					monkey[regno].extracted[i].toString();
					monkey[regno].extracted[i] = parseInt(monkey[regno].extracted[i], 2);
					monkey[regno].extracted[i] = toPaddedHexString(monkey[regno].extracted[i], 2);
					monkey[regno].extracted[i] = "x"+monkey[regno].extracted[i].toUpperCase()+"x"; 
				}
				
				monkey[regno].extracted = monkey[regno].extracted.join('');
				monkey[regno].original = monkey[regno].extracted.slice(0);
				
				for(var i = font[regno].data.length-1; i >= 0; i--){
					if((font[regno].data[i]) != null){
						if((font[regno].data[i].length) > 0){
							console.log('i:'+i+' font[regno].data[i]:'+font[regno].data[i]);
							for(var j = 0; j < font[regno].data[i].length; j++){
								font[regno].data[i][j] = toPaddedHexString(font[regno].data[i][j], 2);
								font[regno].data[i][j] = "x"+font[regno].data[i][j].toUpperCase()+"x";
							}
							font[regno].data[i] = font[regno].data[i].join('');
							monkey[regno].extracted = monkey[regno].extracted.replace(new RegExp(font[regno].data[i], 'g'), "&#"+ i +";");
						}
					}
				}
			}
			lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
				if (err) throw err;
				imgsrc[regno] = src;
			});	
			
			monkey[regno].number_of_chars = monkey[regno].extracted.match(new RegExp("[&#]{2}(4[89]|5[0-7]|6[5-9]|[78][0-9]|90|9[7-9]|1[01][0-9]|12[0-2])[;]{1}", "g")) || []0).length;
			
console.log('img:'+e.data.imgid+' name:'+ e.data.filename+' region:'+regno+ ' cropped.x:'+monkey[regno].map_of_bits.length+ ' cropped.y:'+monkey[regno].map_of_bits[0].length+' font:'+font[regno]+' valid chars:'+monkey[regno].number_of_chars);
		}
		self.postMessage({
			'view': imgsrc,
			'imgid': e.data.imgid,
			'filename': e.data.filename,
			'monkey': monkey, 
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