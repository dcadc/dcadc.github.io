/* eslint-env worker */
/* global Jimp */

importScripts("../js/jimp.min.js");
importScripts("./8x6bitmapfont.js");
//importScripts("https://cdn.rawgit.com/oliver-moran/jimp/7d388b7a/browser/lib/jimp.min.js");
self.addEventListener("message", function (e) {
	Jimp.read(e.data.cmd).then(function (lenna) {
		var lenna_bkp = lenna.clone();
		var monkey = new Array(e.data.region_data.length);
		var font = JSON.parse(JSON.stringify(bmpfont1));			//clone the font
		for(var region_id = 0; region_id < e.data.region_data.length; region_id++){
			lenna = lenna_bkp.clone();
			for (var i = 0; i < 5; i++)	console.log('e.data.region_data[region_id][i]' + typeof e.data.region_data[region_id][i] + 'val' + e.data.region_data[region_id][i]);
			monkey[region_id] ={
				region_id:		new Number(),
				img_src:		new String(),
				map_of_bits: 	new Array(),
				most_valid_offs:new Number(),
				original:  		new String(),
				extracted:  	new String(),
				number_of:  	new Object(),
				sub_region:  	new Array(),
			};
			monkey[region_id].number_of ={
				chars:			new Number(),
				valid_chars:	new Number(),
			};
			if(e.data.region_data[region_id][2]!=lenna.bitmap.width && e.data.region_data[region_id][3]!=lenna.bitmap.height){
			lenna.crop( e.data.region_data[region_id][0],
						e.data.region_data[region_id][1],
						e.data.region_data[region_id][2],
						e.data.region_data[region_id][3] );
			}
			
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
			
			var new_region = prescan(monkey[region_id].map_of_bits, font.width, font.height);
			new_region = JSON.parse(JSON.stringify( new_region ));
			
			lenna.crop(	new_region.x,	new_region.y,	new_region.w,	new_region.h);

			monkey[region_id].map_of_bits = new Array(lenna.bitmap.width);
			for (var i=0; i <lenna.bitmap.width; i++)
				monkey[region_id].map_of_bits[i]=new Array(lenna.bitmap.height); 
		
			lenna.scan(0, 0, lenna.bitmap.width, lenna.bitmap.height, function (x, y, idx) {
				monkey[region_id].map_of_bits[x][y] = ( this.bitmap.data[ idx ] == 255 ) ? (1) : (0) ;
			});
			
			if ( lenna.bitmap.height == font.height) {
				monkey[region_id].most_valid_offs = -1;														//no subregion detection
				monkey[region_id].extracted = CalculateColumn(monkey[region_id].map_of_bits, font.height);
				monkey[region_id].original = monkey[region_id].extracted.slice(0);							//clone the undecoded string 
				monkey[region_id].extracted = SearchandReplace(monkey[region_id].extracted, font.data, font.height);
			}
			else if ( lenna.bitmap.height > font.height) {
				//var subregion_num = lenna.bitmap.height-font.height+1;
				//var srolling_temp = new Array(subregion_num);
				//for(var offset = 0; offset < (subregion_num); offset++){
				var subregion_num = lenna.bitmap.height - font.height + 1;
				var srolling_temp = new Array(subregion_num);
				for(var offset = 0; offset < (subregion_num); offset++){
					srolling_temp[offset] ={
						offset:			offset,
						map_of_bits: 	new Array(),
						original:  		new String(),
						extracted:  	new String(),
						number_of:  	new Object(),
					};
					srolling_temp[offset].number_of ={
						chars:  		new Number(),
						valid_chars:	new Number(),
					};
					srolling_temp[offset].map_of_bits = OffsetMapofBits(monkey[region_id].map_of_bits, font.height, offset);	//refresh offset in the map_of_bits
					srolling_temp[offset].extracted = CalculateColumn(srolling_temp[offset].map_of_bits, font.height);
					srolling_temp[offset].original = srolling_temp[offset].extracted.slice(0);									//clone the undecoded string 
					srolling_temp[offset].extracted = SearchandReplace(srolling_temp[offset].extracted, font.data, font.height);
					srolling_temp[offset].number_of.chars = CountNumberofChars(srolling_temp[offset].extracted);				//this actually calculates for fun only
					srolling_temp[offset].number_of.valid_chars = CountNumberofValidChars(srolling_temp[offset].extracted);		//valid chars means [0-9A-Za-z]
					//console.log('srolling_temp['+offset+'].valid_chars:'+srolling_temp[offset].number_of.valid_chars);
				}
				srolling_temp = srolling_temp.sort(function (a, b) { return a.number_of.valid_chars < b.number_of.valid_chars ? 1 : -1;});	//sorting the most valid data at the top
				console.log('srolling_temp[sorted].valid_chars:'+srolling_temp[0].number_of.valid_chars);
				console.log('srolling_temp[sorted+].valid_chars:'+srolling_temp[srolling_temp.length-1].number_of.valid_chars);
				if(srolling_temp.filter(function(a){ return a.number_of.valid_chars > 5;}).length > 1){											//see if there is more than one line decoded
					monkey[region_id].sub_region = srolling_temp.filter(function(a){ return a.number_of.valid_chars > 5;});						//apply to .sub_region
					monkey[region_id].sub_region = monkey[region_id].sub_region.sort(function (a, b) { return a.offset > b.offset ? 1 : -1;});	//sort .sub_region with offsets
					monkey[region_id].most_valid_offs = Math.max.apply(Math,monkey[region_id].sub_region.map(function(a){return a.offset;}));
					monkey[region_id].original = "";
					monkey[region_id].extracted = "";
					for(var i = 0; i < monkey[region_id].sub_region.length; i++){
						monkey[region_id].original 	= monkey[region_id].original +monkey[region_id].sub_region[i].original+"\n";
						monkey[region_id].extracted	= monkey[region_id].extracted+monkey[region_id].sub_region[i].extracted+"\n";
						monkey[region_id].number_of.chars += monkey[region_id].sub_region[i];
						monkey[region_id].number_of.valid_chars += monkey[region_id].sub_region[i];
					}
				}
				else{
					Object.assign(monkey[region_id], srolling_temp[0]);															//only one line detected, no .sub_region
					monkey[region_id].most_valid_offs = srolling_temp[0].offset;												//apply which offset is this region
				}
				monkey[region_id] = JSON.parse(JSON.stringify(monkey[region_id]));												//latch the whole object
			}
			else{
				monkey[region_id].original = "not enough height";
				monkey[region_id].extracted = "";
			}
			//lenna.crop(	new_region.x,	new_region.y,	new_region.w,	new_region.h);
			lenna.getBase64(Jimp.MIME_JPEG, function (err, src) {
				if (err) throw err;
				monkey[region_id].img_src = src;
			});	
			
			monkey[region_id].number_of.chars = CountNumberofChars(monkey[region_id].extracted);
			monkey[region_id].number_of.valid_chars = CountNumberofValidChars(monkey[region_id].extracted);
			
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

function prescan(map_obj, fw, fh) {
	var map = JSON.parse(JSON.stringify(map_obj));	//preventing call by ref on non-primitive type (clone)
	var jmp_row = Math.round(fh/3);
	var h_lines = new Array();
	var line_region ={
		x:			new Number(),
		y:			new Number(),
		w: 			new Number(),
		h: 			new Number(),
	}
	for(var i = 0; i < map[0].length; i+=jmp_row){						//horizontal scan	
		h_lines[i] = arrayColumn(map, i);
		h_lines[i] = h_lines[i].join('');							//make array of rows
		//console.log('line['+i+']: '+h_lines[i]);
		h_lines[i] = h_lines[i].replace(/(.)\1\1\1/gi, "");
		//console.log('line-rep['+i+']: '+h_lines[i]+'len: ('+h_lines[i].length+')'); 
		h_lines[i] = (h_lines[i].length > fw*10)?1:0;
	}
	line_region.y = Math.max(0, h_lines.indexOf(1) - fh); 
	line_region.h = Math.min(map_obj[0].length - line_region.y, h_lines.lastIndexOf(1) - line_region.y + fh); 
	console.log('new_reg_y: '+line_region.y+' new_reg_h: '+line_region.h); 
	
	map = JSON.parse(JSON.stringify(map_obj));
	var v_lines = new Array(line_region.h);
	for(var i = 0; i < map_obj.length; i++){				//vertical scan
		v_lines[i] = map[i].slice(line_region.y, line_region.y+line_region.h);
		v_lines[i] = v_lines[i].join('');							//make array of rows
		//console.log('line['+i+']: '+v_lines[i]);
		v_lines[i] = ( (v_lines[i].match(/1/g) || []).length > Math.round(fh/3))?1:0;
	}
	line_region.x = Math.max(0, v_lines.indexOf(1) - fw); 
	line_region.w = Math.min(map_obj.length - line_region.x, v_lines.lastIndexOf(1) - line_region.x + fw); 
	console.log('new_reg_x: '+line_region.x+' new_reg_w: '+line_region.w); 
	return line_region;												//join all the HEX columns into string
}

function toPaddedHexString(num, len) {
	str = num.toString(16);
	return "0".repeat(len - str.length) + str;
}

function OffsetMapofBits(map_obj, fh, dh) {
	var map = JSON.parse(JSON.stringify(map_obj));	//preventing call by ref on non-primitive type (clone)
	map
	for(var i = 0; i < map.length; i++)			//for each columns
		map[i] = map[i].slice(dh, dh+fh);		//recalculate rows from offset value to fontheight+offset
	return map;									//join all the HEX columns into string
}

function CalculateColumn(map_obj, fh) {
	var map = JSON.parse(JSON.stringify(map_obj));	//preventing call by ref on non-primitive type (clone)
	for(var i = 0; i < map.length; i++){		//for each columns to be packed
		//console.log('map['+i+']:'+map[i]);
		map[i] = map[i].join('');				//join the binary value of columns
		map[i] = parseInt(map[i], 2);			//prase the joined binary columns into decimal int
		map[i] = toPaddedHexString(map[i], Math.ceil(fh/4));	//prase the decimal int to HEX with padding zeros
		map[i] = "x"+map[i].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
	}
	return map.join('');						//join all the HEX columns into string
}

function SearchandReplace(col_obj, fon_dat, fh) {
	var fon = JSON.parse(JSON.stringify(fon_dat));	//preventing call by ref on non-primitive type (clone)
	var col = JSON.parse(JSON.stringify(col_obj));	//preventing call by ref on non-primitive type (clone)
	for(var i = fon.length-1; i >= 0; i--){							//for each symbol to be packed
		if((fon[i]) != null){										//bypass undefined(i.e. control symbols)
			if((fon[i].length) > 0){								//bypass unknown fonts
				for(var j = 0; j < fon[i].length; j++){				//matching the payload
					fon[i][j] = toPaddedHexString(fon[i][j], Math.ceil(fh/4));	//prase the decimal int to HEX with padding zeros
					fon[i][j] = "x"+fon[i][j].toUpperCase()+"x"; 	//wrap the uppercased HEX column data with x & x
				}
				fon[i] = fon[i].join('');							//font is in string, ready to be replaced
				col = col.replace(new RegExp(fon[i], 'g'), "&#"+ i +";");		//the main purpose of the whole crap
			}
		}
	}
	return col;
}

function arrayColumn( arr, n ){
	return 	arr.map(function(x){ return x[n];});
}

function CountNumberofChars(decoded_str) {
	return 	(decoded_str.match(new RegExp("([&#]{2})([0-9]{1,3})([;]{1})", "g")) || []).length
}

function CountNumberofValidChars(decoded_str) {
	return 	(decoded_str.match(new RegExp("([&#]{2})(4[89]|5[0-7]|6[5-9]|[78][0-9]|90|9[7-9]|1[01][0-9]|12[0-2])([;]{1})", "g")) || []).length
}