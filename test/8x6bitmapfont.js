/*
"31": "",    "32": " ",    "33": "!",    "34": "\"",    "35": "#",    
"36": "$",    "37": "%",    "38": "&",    "39": "'",    "40": "(",    
"41": ")",    "42": "*",    "43": "+",    "44": ",",    "45": "-",    
"46": ".",    "47": "/",    "48": "0",    "49": "1",    "50": "2",    
"51": "3",    "52": "4",    "53": "5",    "54": "6",    "55": "7",    
"56": "8",    "57": "9",    "58": ":",    "59": ";",    "60": "<",    
"61": "=",    "62": ">",    "63": "?",    "64": "@",    "65": "A",    
"66": "B",    "67": "C",    "68": "D",    "69": "E",    "70": "F",    
"71": "G",    "72": "H",    "73": "I",    "74": "J",    "75": "K",    
"76": "L",    "77": "M",    "78": "N",    "79": "O",    "80": "P",    
"81": "Q",    "82": "R",    "83": "S",    "84": "T",    "85": "U",    
"86": "V",    "87": "W",    "88": "X",    "89": "Y",    "90": "Z",    
"91": "[",    "92": "//",    "93": "]",    "94": "^",    "95": "_",    
"96": "`",    "97": "a",    "98": "b",    "99": "c",    "100": "d",    
"101": "e",    "102": "f",    "103": "g",    "104": "h",    "105": "i",    
"106": "j",    "107": "k",    "108": "l",    "109": "m",    "110": "n",    
"111": "o",    "112": "p",    "113": "q",    "114": "r",    "115": "s",    
"116": "t",    "117": "u",    "118": "v",    "119": "w",    "120": "x",    
"121": "y",    "122": "z",    "123": "{",    "124": "|",    "125": "}",    
"126": "~",    "127": ""
*/
var bmpfont1 = new Object();
	bmpfont1.width = 6;
	bmpfont1.height = 8;
	bmpfont1.data = new Array(127);

bmpfont1.data[32]  = [0x00,0x00,0x00,0x00,0x00,0x00];	//[32] 
bmpfont1.data[33]  = [];	//[33]!
bmpfont1.data[34]  = [];	//[34]\/
bmpfont1.data[35]  = [];	//[35]#
bmpfont1.data[36]  = [];	//[36]$
bmpfont1.data[37]  = [];	//[37]%
bmpfont1.data[38]  = [];	//[38]&
bmpfont1.data[39]  = [];	//[39]'
bmpfont1.data[40]  = [];	//[40](
bmpfont1.data[41]  = [];	//[41])
bmpfont1.data[42]  = [];	//[42]*
bmpfont1.data[43]  = [];	//[43]+
bmpfont1.data[44]  = [];	//[44],
bmpfont1.data[45]  = [0x00,0x08,0x08,0x08,0x08,0x00];	//[45]-
bmpfont1.data[46]  = [0x00,0x00,0x03,0x03,0x00,0x00];	//[46].
bmpfont1.data[47]  = [0x00,0x03,0x0C,0x18,0x60,0x80];	//[47]//
bmpfont1.data[48]  = [0x3E,0x41,0x41,0x41,0x3E,0x00];	//[48]0
bmpfont1.data[49]  = [0x21,0x41,0x7F,0x01,0x01,0x00];	//[49]1
bmpfont1.data[50]  = [0x00,0x43,0x45,0x49,0x31,0x00];	//[50]2
bmpfont1.data[51]  = [0x00,0x41,0x49,0x49,0x76,0x00];	//[51]3
bmpfont1.data[52]  = [0x0C,0x14,0x24,0x7F,0x04,0x00];	//[52]4
bmpfont1.data[53]  = [0x00,0x79,0x49,0x49,0x46,0x00];	//[53]5
bmpfont1.data[54]  = [0x1E,0x25,0x49,0x49,0x46,0x00];	//[54]6
bmpfont1.data[55]  = [0x00,0x43,0x4C,0x50,0x60,0x00];	//[55]7
bmpfont1.data[56]  = [0x36,0x49,0x49,0x59,0x26,0x00];	//[56]8
bmpfont1.data[57]  = [0x31,0x49,0x49,0x4A,0x3C,0x00];	//[57]9
bmpfont1.data[58]  = [];	//[58]:
bmpfont1.data[59]  = [];	//[59];
bmpfont1.data[60]  = [];	//[60]<
bmpfont1.data[61]  = [];	//[61]=
bmpfont1.data[62]  = [0x11,0x0A,0x0A,0x04,0x04,0x00];	//[62]>
bmpfont1.data[63]  = [];	//[63]?
bmpfont1.data[64]  = [];	//[64]@
bmpfont1.data[65]  = [];	//[65]A
bmpfont1.data[66]  = [0x7F,0x49,0x49,0x49,0x36,0x00];	//[66]B
bmpfont1.data[67]  = [];	//[67]C
bmpfont1.data[68]  = [];	//[68]D
bmpfont1.data[69]  = [];	//[69]E
bmpfont1.data[70]  = [0x00,0x7F,0x48,0x48,0x40,0x00];	//[70]F
bmpfont1.data[71]  = [];	//[71]G
bmpfont1.data[72]  = [0x7F,0x08,0x08,0x08,0x7F,0x00];	//[72]H
bmpfont1.data[73]  = [];	//[73]I
bmpfont1.data[74]  = [];	//[74]J
bmpfont1.data[75]  = [];	//[75]K
bmpfont1.data[76]  = [0x00,0x7F,0x01,0x01,0x01,0x00];	//[76]L
bmpfont1.data[77]  = [0x7F,0x38,0x0E,0x30,0x7F,0x00];	//[77]M
bmpfont1.data[78]  = [];	//[78]N
bmpfont1.data[79]  = [];	//[79]O
bmpfont1.data[80]  = [];	//[80]P
bmpfont1.data[81]  = [];	//[81]Q
bmpfont1.data[82]  = [0x7F,0x48,0x4C,0x32,0x01,0x00];	//[82]R
bmpfont1.data[83]  = [0x00,0x31,0x49,0x49,0x46,0x00];	//[83]S
bmpfont1.data[84]  = [0x40,0x40,0x7F,0x40,0x40,0x00];	//[84]T
bmpfont1.data[85]  = [];	//[85]U
bmpfont1.data[86]  = [];	//[86]V
bmpfont1.data[87]  = [];	//[87]W
bmpfont1.data[88]  = [];	//[88]X
bmpfont1.data[89]  = [];	//[89]Y
bmpfont1.data[90]  = [];	//[90]Z
bmpfont1.data[91]  = [0x00,0x00,0xFF,0x80,0x80,0x00];	//[91][
bmpfont1.data[92]  = [];	//[92]//
bmpfont1.data[93]  = [0x00,0x80,0x80,0xFF,0x00,0x00];	//[93]]
bmpfont1.data[94]  = [];	//[94]^
bmpfont1.data[95]  = [];	//[95]_
bmpfont1.data[96]  = [];	//[96]`
bmpfont1.data[97]  = [0x00,0x13,0x15,0x15,0x0F,0x01];	//[97]a
bmpfont1.data[98]  = [];	//[98]b
bmpfont1.data[99]  = [];	//[99]c
bmpfont1.data[100] = [0x0E,0x11,0x11,0x12,0xFF,0x00];	//[100]d
bmpfont1.data[101] = [0x0E,0x15,0x15,0x15,0x0D,0x00];	//[101]e
bmpfont1.data[102] = [0x00,0x10,0x7F,0x90,0x90,0x00];	//[102]f
bmpfont1.data[103] = [0x0E,0x11,0x11,0x12,0x1F,0x00];	//[103]g
bmpfont1.data[104] = [];	//[104]h
bmpfont1.data[105] = [];	//[105]i
bmpfont1.data[106] = [];	//[106]j
bmpfont1.data[107] = [0x00,0xFF,0x04,0x0A,0x11,0x00];	//[107]k
bmpfont1.data[108] = [];	//[108]l
bmpfont1.data[109] = [0x1F,0x10,0x1F,0x10,0x1F,0x00];	//[109]m
bmpfont1.data[110] = [];	//[110]n
bmpfont1.data[111] = [0x0E,0x11,0x11,0x11,0x0E,0x00];	//[111]o
bmpfont1.data[112] = [];	//[112]p
bmpfont1.data[113] = [];	//[113]q
bmpfont1.data[114] = [0x00,0x1F,0x08,0x10,0x18,0x00];	//[114]r
bmpfont1.data[115] = [];	//[115]s
bmpfont1.data[116] = [];	//[116]t
bmpfont1.data[117] = [];	//[117]u
bmpfont1.data[118] = [];	//[118]v
bmpfont1.data[119] = [];	//[119]w
bmpfont1.data[120] = [];	//[120]x
bmpfont1.data[121] = [];	//[121]y
bmpfont1.data[122] = [0x11,0x13,0x15,0x19,0x11,0x00];	//[122]z
bmpfont1.data[123] = [];	//[123]{
bmpfont1.data[124] = [];	//[124]|
bmpfont1.data[125] = [];	//[125]}
bmpfont1.data[126] = [];	//[126]~
bmpfont1.data[127] = [];	//[127]
