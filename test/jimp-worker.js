/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
importScripts("./8x6bitmapfont.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		var lenna_bkp = lenna.clone();
		var monkey = new Array(e.data.region_data.length);
		var font = JSON.parse(JSON.stringify(bmpfont1));
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
			font = JSON.parse(JSON.stringify(bmpfont1));
			
			if ( e.data.region_data[region_id][3] == font.height) {

				monkey[region_id].extracted = calculateColumn(monkey[region_id].extracted);
				monkey[region_id].original = monkey[region_id].extracted.slice(0);							//clone the undecoded string 
				
				monkey[region_id].extracted = SearchandReplace(monkey[region_id].extracted, font.data);
			}
			else if ( e.data.region_data[region_id][3] > font.height) {
				monkey[region_id].extracted = calculateColumn(monkey[region_id].extracted);
				monkey[region_id].original = monkey[region_id].extracted.slice(0);							//clone the undecoded string 
				
				monkey[region_id].extracted = SearchandReplace(monkey[region_id].extracted, font.data);
				
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
console.log(' font:'+font+' chars:'+monkey[region_id].number_of.chars+' valid chars:'+monkey[region_id].number_of.valid_chars);
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

function calculateColumn(map) {
	for(var i = 0; i < map.length; i++){		//for each columns
		map[i] = map[i].join('');				//join the binary value of columns
		map[i] = parseInt(map[i], 2);			//prase the joined binary columns into decimal int
		map[i] = toPaddedHexString(map[i], 2);	//prase the decimal int to HEX with padding zeros
		map[i] = "x"+map[i].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
	}
	return map.join('');						//join all the HEX columns into string
}

function SearchandReplace(col, fon) {
	for(var i = fon.length-1; i >= 0; i--){							//for each symbol
		if((fon[i]) != null){										//bypass undefined(i.e. control symbols)
			if((fon[i].length) > 0){								//bypass unknown fonts
				//console.log('i:'+i+' fon[i]:'+fon[i]);
				for(var j = 0; j < fon[i].length; j++){				//matching the payload
					fon[i][j] = toPaddedHexString(fon[i][j], 2);	//prase the decimal int to HEX with padding zeros
					fon[i][j] = "x"+fon[i][j].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
				}
				fon[i] = fon[i].join('');							//font is in string, ready to be replaced
				col = col.replace(new RegExp(fon[i], 'g'), "&#"+ i +";");
			}
		}
	}
	return col;
}