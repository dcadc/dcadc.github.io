<!DOCTYPE html>
<html>
<body>

<p>Click the button to parse different strings.</p>

<button onclick="myFunction()">Try it</button>

<p id="demo"></p>

<script>
function myFunction() {
	var a = parseInt("10") + "<br>";
	var b = parseInt("10.00") + "<br>";
	var c = parseInt("10.33") + "<br>";
	var d = parseInt("34 45 66") + "<br>";
	var e = parseInt("   60   ") + "<br>";
	var f = parseInt("40 years") + "<br>";
	var g = parseInt("He was 40") + "<br>";

	var h = parseInt("10", 10)+ "<br>";
	var i = parseInt("010")+ "<br>";
	var j = parseInt("10", 8)+ "<br>";
	var k = parseInt("0x10")+ "<br>";
	var l = parseInt("10", 16)+ "<br>";

	var n = a + b + c + d + e + f + g + "<br>" + h + i + j + k +l;
    var emp = new Array(127);
    emp[0] = [0x59, 0x59, 0x55];
    emp[1] = [];
    emp[2] = [0x5, 0x9, 0x55];
	console.log('0000000000emp[0]'+typeof emp[0]+' val='+emp[0]+' len='+emp[0].length);
	console.log('0000000000emp[1]'+typeof emp[1]+' val='+emp[1]+' len='+emp[1].length);
	console.log('0000000000emp[2]'+typeof emp[2]+' val='+emp[2]+' len='+emp[2].length);
	console.log('0000000000emp[3]'+typeof emp[3]+' val='+emp[3]);//+' len='+emp[3].length
	console.log(((typeof emp[3]) != 'undefined')?'T':'F');//+' len='+emp[3].length
	console.log(((emp[1].length))?'T':'F');
	var fruits = toPaddedHexString(emp[0][1], 2);
	console.log('0000000000'+typeof fruits+' val='+fruits);
	fruits = fruits.toUpperCase();
	console.log('0000000000'+typeof fruits+' val='+fruits);
	document.getElementById("demo").innerHTML = fruits;
	}
	

	function toPaddedHexString(num, len) {
		str = num.toString(16);
		return "0".repeat(len - str.length) + str;
	}
</script>

</body>
</html>
