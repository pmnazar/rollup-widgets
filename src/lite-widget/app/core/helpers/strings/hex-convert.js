define('strings/hex-convert',
	function() {
		var hexConvert = function(hex, opacity) {
		    hex = hex.replace('#','');
		    r = parseInt(hex.substring(0,2), 16);
		    g = parseInt(hex.substring(2,4), 16);
		    b = parseInt(hex.substring(4,6), 16);

		    result = 'rgba('+ r +','+ g +','+ b +','+ (opacity === 'none' ? 0.9 : opacity/100) +')';

		    return result;
	    };

		return hexConvert;
	}
);