angular.module('entourageApp')
	.directive('contenteditable', ['$sce', function($sce) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {
			  	if (!ngModel) return;

				ngModel.$render = function() {
					element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
				};

				element.on('blur keyup change', function(event) {
					console.info(event);
					scope.$evalAsync(read);
				});

				element.on("paste", function(e) {
				    if (e.originalEvent && e.originalEvent.clipboardData) {
					    var text = e.originalEvent.clipboardData.getData("text/plain");
				    }
				    else if (e.clipboardData) {
				    	var text = e.clipboardData.getData("text/plain");
				    }

				    if (text) {
				    	document.execCommand("insertHTML", false, text);
				    	e.preventDefault();
				    }
				});

				element.bind("keydown", function(event) {
					if (event.altKey && event.keyCode  === 13) {
						scope.$evalAsync(addNewLine);
					}
				});

				function addNewLine(){
					element.append('<div><br></div>');
					var sel = window.getSelection();
					var range = window.getSelection().getRangeAt(0);
			        range.setStart(element[0].childNodes[element[0].childNodes.length - 1], 0);
			        range.collapse(true);
			        console.info(sel, range, element[0]);
					sel.removeAllRanges();
					sel.addRange(range);
				}

			  	read();

				function read() {
				    var html = element.html();
				    html = html.replace(/<div>(.[^<]*)<\/div>?/gi, '\n$1').replace(/<br>/g, '\n').trim()
				    ngModel.$setViewValue(html);
				}
			}
		};
	}])
	.directive('fileread', function () {
		return {
	  		scope: {
		    	fileread: "="
	  		},
			link: function (scope, element, attributes) {
				element.bind("change", function (changeEvent) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.fileread = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		}
	})
	.directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if (event.keyCode  === 13) {
					scope.$apply(function(){
						scope.$eval(attrs.ngEnter, {'event': event});
					});
					event.preventDefault();
				}
			});
		};
	})
	.directive('ngAltEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown", function(event) {
				if (event.keyCode  === 13) {
					if (event.altKey) {
						element[0].value = element[0].value + '\r\n';
					}
					else {
						scope.$apply(function(){
							scope.$eval(attrs.ngAltEnter, {'event': event});
						});
						event.preventDefault();
					}
				}
			});
		};
	})
	.directive('autofocus', function($timeout) {
		return {
		    link: function(scope, element) {
			    $timeout(function() {
			    	element[0].focus();
		    	});
		    }
		};
	});
