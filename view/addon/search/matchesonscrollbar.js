var _0x10fb=['Pos','maxMatches','length','max','changeEnd','min','updateAfterChange','clear','off','change','../../lib/codemirror','../scroll/annotatescrollbar','function','amd','./searchcursor','defineExtension','options','className','CodeMirror-search-match','annotation','annotateScrollbar','query','caseFold','gap','firstLine','lastLine','matches','update','findMatches','changeHandler','onChange','prototype','from','line','splice','getSearchCursor'];(function(_0x149ce2,_0x17c300){var _0x2c1ce9=function(_0x2f1721){while(--_0x2f1721){_0x149ce2['push'](_0x149ce2['shift']());}};_0x2c1ce9(++_0x17c300);}(_0x10fb,0xe2));var _0x1116=function(_0x29cd51,_0x443437){_0x29cd51=_0x29cd51-0x0;var _0x51f069=_0x10fb[_0x29cd51];return _0x51f069;};(function(_0x27ba76){if(typeof exports=='object'&&typeof module=='object')_0x27ba76(require(_0x1116('0x0')),require('./searchcursor'),require(_0x1116('0x1')));else if(typeof define==_0x1116('0x2')&&define[_0x1116('0x3')])define([_0x1116('0x0'),_0x1116('0x4'),_0x1116('0x1')],_0x27ba76);else _0x27ba76(CodeMirror);}(function(_0x107f9d){'use strict';_0x107f9d[_0x1116('0x5')]('showMatchesOnScrollbar',function(_0xaacb3f,_0x31e9d3,_0x12a110){if(typeof _0x12a110=='string')_0x12a110={'className':_0x12a110};if(!_0x12a110)_0x12a110={};return new _0x21b5fb(this,_0xaacb3f,_0x31e9d3,_0x12a110);});function _0x21b5fb(_0xcc06ea,_0x12d6d0,_0x544f21,_0x5dcd6e){this['cm']=_0xcc06ea;this[_0x1116('0x6')]=_0x5dcd6e;var _0x44ea5d={'listenForChanges':![]};for(var _0x2c2d4e in _0x5dcd6e)_0x44ea5d[_0x2c2d4e]=_0x5dcd6e[_0x2c2d4e];if(!_0x44ea5d[_0x1116('0x7')])_0x44ea5d[_0x1116('0x7')]=_0x1116('0x8');this[_0x1116('0x9')]=_0xcc06ea[_0x1116('0xa')](_0x44ea5d);this[_0x1116('0xb')]=_0x12d6d0;this[_0x1116('0xc')]=_0x544f21;this[_0x1116('0xd')]={'from':_0xcc06ea[_0x1116('0xe')](),'to':_0xcc06ea[_0x1116('0xf')]()+0x1};this[_0x1116('0x10')]=[];this[_0x1116('0x11')]=null;this[_0x1116('0x12')]();this[_0x1116('0x9')][_0x1116('0x11')](this[_0x1116('0x10')]);var _0x49aea7=this;_0xcc06ea['on']('change',this[_0x1116('0x13')]=function(_0xf5bab4,_0x169ee6){_0x49aea7[_0x1116('0x14')](_0x169ee6);});}var _0xf17a4=0x3e8;_0x21b5fb[_0x1116('0x15')]['findMatches']=function(){if(!this[_0x1116('0xd')])return;for(var _0x3549d0=0x0;_0x3549d0<this[_0x1116('0x10')]['length'];_0x3549d0++){var _0x69b3b7=this[_0x1116('0x10')][_0x3549d0];if(_0x69b3b7[_0x1116('0x16')][_0x1116('0x17')]>=this[_0x1116('0xd')]['to'])break;if(_0x69b3b7['to'][_0x1116('0x17')]>=this[_0x1116('0xd')]['from'])this[_0x1116('0x10')][_0x1116('0x18')](_0x3549d0--,0x1);}var _0x3b1d5f=this['cm'][_0x1116('0x19')](this['query'],_0x107f9d[_0x1116('0x1a')](this[_0x1116('0xd')][_0x1116('0x16')],0x0),this[_0x1116('0xc')]);var _0x4b5494=this[_0x1116('0x6')]&&this[_0x1116('0x6')][_0x1116('0x1b')]||_0xf17a4;while(_0x3b1d5f['findNext']()){var _0x69b3b7={'from':_0x3b1d5f[_0x1116('0x16')](),'to':_0x3b1d5f['to']()};if(_0x69b3b7[_0x1116('0x16')]['line']>=this[_0x1116('0xd')]['to'])break;this['matches'][_0x1116('0x18')](_0x3549d0++,0x0,_0x69b3b7);if(this[_0x1116('0x10')][_0x1116('0x1c')]>_0x4b5494)break;}this[_0x1116('0xd')]=null;};function _0x5f0331(_0x203478,_0x5c6a6d,_0x16fff6){if(_0x203478<=_0x5c6a6d)return _0x203478;return Math[_0x1116('0x1d')](_0x5c6a6d,_0x203478+_0x16fff6);}_0x21b5fb['prototype'][_0x1116('0x14')]=function(_0x181a99){var _0x3d6b22=_0x181a99['from'][_0x1116('0x17')];var _0x4ed783=_0x107f9d[_0x1116('0x1e')](_0x181a99)[_0x1116('0x17')];var _0x497456=_0x4ed783-_0x181a99['to'][_0x1116('0x17')];if(this[_0x1116('0xd')]){this[_0x1116('0xd')][_0x1116('0x16')]=Math[_0x1116('0x1f')](_0x5f0331(this[_0x1116('0xd')]['from'],_0x3d6b22,_0x497456),_0x181a99[_0x1116('0x16')]['line']);this['gap']['to']=Math[_0x1116('0x1d')](_0x5f0331(this[_0x1116('0xd')]['to'],_0x3d6b22,_0x497456),_0x181a99[_0x1116('0x16')][_0x1116('0x17')]);}else{this[_0x1116('0xd')]={'from':_0x181a99[_0x1116('0x16')][_0x1116('0x17')],'to':_0x4ed783+0x1};}if(_0x497456)for(var _0x1cfc90=0x0;_0x1cfc90<this[_0x1116('0x10')]['length'];_0x1cfc90++){var _0x125baa=this[_0x1116('0x10')][_0x1cfc90];var _0xed74b3=_0x5f0331(_0x125baa[_0x1116('0x16')][_0x1116('0x17')],_0x3d6b22,_0x497456);if(_0xed74b3!=_0x125baa[_0x1116('0x16')][_0x1116('0x17')])_0x125baa['from']=_0x107f9d['Pos'](_0xed74b3,_0x125baa[_0x1116('0x16')]['ch']);var _0x3d2e63=_0x5f0331(_0x125baa['to'][_0x1116('0x17')],_0x3d6b22,_0x497456);if(_0x3d2e63!=_0x125baa['to'][_0x1116('0x17')])_0x125baa['to']=_0x107f9d[_0x1116('0x1a')](_0x3d2e63,_0x125baa['to']['ch']);}clearTimeout(this[_0x1116('0x11')]);var _0x1008b1=this;this['update']=setTimeout(function(){_0x1008b1[_0x1116('0x20')]();},0xfa);};_0x21b5fb[_0x1116('0x15')][_0x1116('0x20')]=function(){this['findMatches']();this[_0x1116('0x9')][_0x1116('0x11')](this[_0x1116('0x10')]);};_0x21b5fb[_0x1116('0x15')][_0x1116('0x21')]=function(){this['cm'][_0x1116('0x22')](_0x1116('0x23'),this[_0x1116('0x13')]);this[_0x1116('0x9')]['clear']();};}));