/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
importScripts("./8x6bitmapfont.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		var lenna_bkp = lenna.clone();
		var monkey = new Array(e.data.region_data.length);
		var font = new Array(e.data.region_data.length);
		for(var region_id = 0; region_id < e.data.region_data.length; region_id++){
			lenna = lenna_bkp.clone();
for (var i = 0; i < 5; i++)	console.log('e.data.region_data[region_id][i]' + typeof e.data.region_data[region_id][i] + 'val' + e.data.region_data[region_id][i]);
			monkey[region_id] ={
				region_idber:  new Number(),
				img_src:		new String(),
				map_of_bits: 	new Array(),
				original:  		new String(),
				extracted:  	new String(),
				number_of:  	new Object(),
			};
			monkey[region_id].number_of ={
				chars:  new Number(),
				valid_chars:  new Number(),
			};
			
			lenna.crop( e.data.region_data[region_id][0],
						e.data.region_data[region_id][1],
						e.data.region_data[region_id][2],
						e.data.region_data[region_id][3] );
			
			monkey[region_id].map_of_bits = new Array(lenna.bitmap.width);
			for (var i=0; i <lenna.bitmap.width; i++)
				monkey[region_id].map_of_bits[i]=new Array(lenna.bitmap.height); 
			
			lenna.scan(0, 0, lenna.bitmap.width, lenna.bitmap.height, function (x, y, idx) {
				// x, y is the position of this pixel on the image
				// idx is the position start position of this rgba tuple in the bitmap Buffer
				if(lenna.getPixelColor(x, y)==e.data.region_data[region_id][4]){
					lenna.setPixelColor(0xFFFFFFFF, x, y);
				}
				else{
					lenna.setPixelColor(0x000000FF, x, y);
				}
				monkey[region_id].map_of_bits[x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
			});
			
			monkey[region_id].extracted = monkey[region_id].map_of_bits.slice(0);
			font[region_id] = JSON.parse(JSON.stringify(bmpfont1));
			
			if ( e.data.region_data[region_id][3] == font[region_id].height) {
				for(var i = 0; i < monkey[region_id].extracted.length; i++){								//for each columns
					monkey[region_id].extracted[i]=monkey[region_id].extracted[i].join('');					//join the binary value of columns
					monkey[region_id].extracted[i] = parseInt(monkey[region_id].extracted[i], 2);			//prase the joined binary columns into decimal int
					monkey[region_id].extracted[i] = toPaddedHexString(monkey[region_id].extracted[i], 2);	//prase the decimal int to HEX with padding zeros
					monkey[region_id].extracted[i] = "x"+monkey[region_id].extracted[i].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
				}
				
				monkey[region_id].extracted = monkey[region_id].extracted.join('');							//join all the HEX columns into string
				monkey[region_id].original = monkey[region_id].extracted.slice(0);							//clone the undecoded string 
				
				for(var i = font[region_id].data.length-1; i >= 0; i--){
					if((font[region_id].data[i]) != null){
						if((font[region_id].data[i].length) > 0){
//console.log('i:'+i+' font[region_id].data[i]:'+font[region_id].data[i]);
							for(var j = 0; j < font[region_id].data[i].length; j++){
								font[region_id].data[i][j] = toPaddedHexString(font[region_id].data[i][j], 2);
								font[region_id].data[i][j] = "x"+font[region_id].data[i][j].toUpperCase()+"x";
							}
							font[region_id].data[i] = font[region_id].data[i].join('');
							monkey[region_id].extracted = monkey[region_id].extracted.replace(new RegExp(font[region_id].data[i], 'g'), "&#"+ i +";");
						}
					}
				}
			}
			else if ( e.data.region_data[region_id][3] > font[region_id].height) {
				for(var i = 0; i < monkey[region_id].extracted.length; i++){								//for each columns
					monkey[region_id].extracted[i]=monkey[region_id].extracted[i].join('');					//join the binary value of columns
					monkey[region_id].extracted[i] = parseInt(monkey[region_id].extracted[i], 2);			//prase the joined binary columns into decimal int
					monkey[region_id].extracted[i] = toPaddedHexString(monkey[region_id].extracted[i], 2);	//prase the decimal int to HEX with padding zeros
					monkey[region_id].extracted[i] = "x"+monkey[region_id].extracted[i].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
				}
				
				monkey[region_id].extracted = monkey[region_id].extracted.join('');							//join all the HEX columns into string
				monkey[region_id].original = monkey[region_id].extracted.slice(0);							//clone the undecoded string 
				
				SearchandReplace(monkey[region_id].extracted, font[region_id].data);
				
			}
			else{
				monkey[region_id].original = "not enough height";
				monkey[region_id].extracted = "";
			}
			
			lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
				if (err) throw err;
				monkey[region_id].img_src = src;
			});	
			
			monkey[region_id].number_of.chars = (monkey[region_id].extracted.match(new RegExp("([&#]{2})([0-9]{1,3})([;]{1})", "g")) || []).length;
			monkey[region_id].number_of.valid_chars = (monkey[region_id].extracted.match(new RegExp("([&#]{2})(4[89]|5[0-7]|6[5-9]|[78][0-9]|90|9[7-9]|1[01][0-9]|12[0-2])([;]{1})", "g")) || []).length;
			
console.log('img:'+e.data.imgid+' name:'+ e.data.filename+' region:'+region_id+ ' cropped.x:'+monkey[region_id].map_of_bits.length+ ' cropped.y:'+monkey[region_id].map_of_bits[0].length);
console.log(' font:'+font[region_id]+' chars:'+monkey[region_id].number_of.chars+' valid chars:'+monkey[region_id].number_of.valid_chars);
		}
		self.postMessage({
			'imgid': e.data.imgid,
			'filename': e.data.filename,
			'monkey': monkey
		});
		self.close();
	});
});

function toPaddedHexString(num, len) {
	str = num.toString(16);
	return "0".repeat(len - str.length) + str;
}

function SearchandReplace(col, fon) {
	for(var i = fon.length-1; i >= 0; i--){
		if((fon[i]) != null){
			if((fon[i].length) > 0){
				//console.log('i:'+i+' fon[i]:'+fon[i]);
				for(var j = 0; j < fon[i].length; j++){
					fon[i][j] = toPaddedHexString(fon[i][j], 2);
					fon[i][j] = "x"+fon[i][j].toUpperCase()+"x";
				}
				fon[i] = fon[i].join('');
				col = col.replace(new RegExp(fon[i], 'g'), "&#"+ i +";");
			}
		}
	}
}