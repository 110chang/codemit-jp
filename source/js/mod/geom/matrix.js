/*
*
*   geom.Matrix r2
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare'
], function(inherit, compare) {
	var Matrix = {
	 		structure: null,
	 		
		 	init: function(array){
				if(array.length === undefined || array.length < 1){
					throw new Error('arguments must be array')
				}
				if (typeof array[0] ==='number') {
					var i = 0, a = [];
					
					for (; i < array.length; i++) {
						a[i] = [array[i]];
					}
					array = a;
				}
				this.structure = array;
				
				return this;
			},
			get: function(i, j) {
				if (i === undefined) {
					i = 0;
					//throw new Error('arguments not enough');
				}
				if (j === undefined) {
					j = 0;
					//throw new Error('arguments not enough');
				}
				return this.structure[i][j];
			},
			set: function(value, i, j) {
				if (typeof value !== 'number') {
					throw new Error('Invalid arguments.')
				}
				if (i === undefined) {
					i = 0;
					//throw new Error('arguments not enough');
				}
				if (j === undefined) {
					j = 0;
					//throw new Error('arguments not enough');
				}
				return this.structure[i][j] = value;
			},
			isEqual: function(matrix) {
				if(!compare(matrix, this)){
					throw new Error('arguments must be Matrix')
				}
				var here  = this.structure,
					there = matrix.structure,
					i, j;
				
				if(here.length === there.length && here[0].length === there[0].length) {
					for (i = 0; i < here.length; i++) {
						for (var j = 0; j < here[i].length; j++){
							if (here[i][j] !== there[i][j]) {
								return false;
							}
						}
					}
					return true;
				}
				return false;
			},
			isSquare: function() {
				return this.structure.length === this.structure[0].length;
			},
			sum: function(matrix, destructive) {
				if(!compare(matrix, this)){
					throw new Error('arguments must be Matrix')
				}
				var r	 = [],
					s1	 = this.structure,
					s2	 = matrix.structure,
					d	 = destructive || false,
					i, j;
				
				if (s1.length !== s2.length && s1[0].length !== s2[0].length) {
					throw new Error('Type of matrix is different.');
				}
				for (var i = 0; i < s1.length; i++) {
					r[i] = [];
					
					for (j = 0; j < s1[i].length; j++) {
						r[i][j] = s1[i][j] + s2[i][j];
					}
				}
				if (d) {
					this.structure = r;
				} else {
					return inherit(Matrix).init(r);
				}
				
			},
			sub: function(matrix, destructive){
				if(!compare(matrix, this)){
					throw new Error('arguments must be Matrix')
				}
				var r	 = [],
					s1	 = this.structure,
					s2	 = matrix.structure,
					d	 = destructive || false,
					i, j;
				
				if (s1.length !== s2.length && s1[0].length !== s2[0].length) {
					throw new Error('Type of matrix is different.');
				}
				for (i = 0; i < s1.length; i++) {
					r[i] = [];
					
					for (j = 0; j < s1[i].length; j++) {
						r[i][j] = s1[i][j] - s2[i][j];
					}
				}
				if (d) {
					this.structure = r;
				} else {
					return inherit(Matrix).init(r);
				}
			},
			scalarMultiply: function(num){
				if(typeof num !== 'number'){
					throw new Error('arguments must be Number')
				}
				var r = [],
					s = this.structure,
					i, j;
				
				for(i = 0; i < s.length; i++) {
					r[i] = [];
					
					for(j = 0; j < s[i].length; j++) {
						r[i][j] = s[i][j] * num;
					}
				}
				return inherit(Matrix).init(r);
			},
			multiply: function(matrix, destructive){
				var r	 = [],
					s1	 = this.structure,
					s2	 = matrix.structure,
					d	 = destructive || false,
					i, j, k, ik, kj, iMax, jMax, kMax;//, rijStr;
				
				if (s1[0].length !== s2.length) {
					throw new Error('Can not define a matrix product');
				}
				iMax = s1.length;
				jMax = s2[0].length;
				kMax = iMax > jMax ? iMax : jMax;
				
				for (i = 0; i < iMax; i++) {
					r[i] = [];
					
					for(j = 0; j < jMax; j++) {
						
						if (r[i][j] === undefined) {
							r[i][j] = 0;
						}//rijStr = '';
						for(k = 0; k < kMax; k++) {
							ik = s1[i][k];
							kj = s2[k][j];
							
							if (ik === undefined || kj === undefined) {
								continue;
							}
							r[i][j] += ik * kj;
							//rijStr += 'a[' + i + '' + k + '] b[' + k + '' + j + '] + ';
						}
					}
				}
				if (d) {
					this.structure = r;
				} else {
					return inherit(Matrix).init(r);
				}
			},
			transpose: function(destructive){
				var r = [],
					s = this.structure,
					d = destructive || false,
					i, j;
				
				for(i = 0; i < s[0].length; i++) {
					r[i] = [];
					for(j = 0; j < s.length; j++){
						r[i][j] = s[j][i];
					}
				}
				if (d) {
					this.structure = r;
				} else {
					return inherit(Matrix).init(r);
				}
			},
			invert: function(matrix) {
				if(!compare(matrix, this)){
					throw new Error('arguments must be Matrix')
				}
				// To Do
			},
			toString: function() {
				var str	 = '',
					s	 = this.structure,
					i, j;
				
				for (i = 0; i < s.length; i++) {
					str += '[ ';
					for ( var j = 0; j < s[i].length; j++) {
						str += s[i][j];
						if (j < s[i].length - 1) {
							str += ', ';
						}
					}
					str += ' ]\n';
				}
				return str;
			}
		};
	
	return Matrix;
});
