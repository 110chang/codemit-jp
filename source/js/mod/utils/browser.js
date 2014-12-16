/*
*
*   Utils.Browser r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var _userAgent	 = navigator.userAgent,
		_is_IE		 = /MSIE/.test(_userAgent),
		_is_iPhone	 = /iPhone/.test(_userAgent),
		_is_iPad	 = /iPad/.test(_userAgent),
		_is_Android	 = /Android/.test(_userAgent),
		_is_Mobile	 = /Mobile/.test(_userAgent), // Android only
		_is_windows	 = /Win/.test(navigator.platform),
		_is_mac		 = /Mac/.test(navigator.platform),
		_is_WebKit	 = /Chrome|Safari/.test(_userAgent),
// Detect IE in JS using conditional comments (lt IE10)
// via http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
		_ie = (function() { 
			var undef, v = 3, div = document.createElement('div');
			while (
				div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
				div.getElementsByTagName('i')[0]
			);
			return v > 4 ? v : undef;
		}()),
		
		Browser = {
			IE			 : _is_IE,
			iPhone		 : _is_iPhone,
			iPad		 : _is_iPad,
			Android		 : _is_Android,
			WebKit		 : _is_WebKit,
			platform	 : {
				windows	 : _is_windows,
				mac		 : _is_mac
			},
			ie			 : _ie,
			mobile		 : _is_iPhone || _is_iPad || _is_Android,
			smallScreen	 : _is_iPhone || (_is_Android && _is_Mobile),
			tablet		 : _is_iPad || (_is_Android && !_is_Mobile),
			
			__test__: function(userAgent) {
				if (!userAgent) {
					throw new Error('Require test string.');
				}
				_userAgent = userAgent;
				_is_IE = /MSIE/.test(_userAgent);
				_is_iPhone = /iPhone/.test(_userAgent);
				_is_iPad = /iPad/.test(_userAgent);
				_is_Android = /Android/.test(_userAgent);
				_is_Mobile = /Mobile/.test(_userAgent); // Android only
				_is_windows = /Win/.test(navigator.platform);
				_is_mac = /Mac/.test(navigator.platform);
				_is_WebKit = /Chrome|Safari/.test(_userAgent);
				
				this.IE			 = _is_IE;
				this.iPhone		 = _is_iPhone;
				this.iPad		 = _is_iPad;
				this.Android	 = _is_Android;
				this.WebKit		 = _is_WebKit;
				this.platform	 = {
					windows	 : _is_windows,
					mac		 : _is_mac
				};
				this.mobile		 = _is_iPhone || _is_iPad || _is_Android;
				this.smallScreen = _is_iPhone || (_is_Android && _is_Mobile);
				this.tablet		 = _is_iPad || (_is_Android && !_is_Mobile);
				
				return this;
			}
		};
	
	return Browser;
});
