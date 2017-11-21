"use strict";var _extends=Object.assign||function(a){for(var c,b=1;b<arguments.length;b++)for(var d in c=arguments[b],c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);return a};function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var STEP_LENGTH=1,CELL_SIZE=10,BORDER_WIDTH=2,MAX_FONT_SIZE=500,MAX_ELECTRONS=100,CELL_DISTANCE=CELL_SIZE+BORDER_WIDTH,CELL_REPAINT_INTERVAL=[300,500],BG_COLOR="#212121",BORDER_COLOR="#212121",CELL_HIGHLIGHT="#F5F5F5",ELECTRON_COLOR="#F5F5F5",FONT_COLOR="#F5F5F5",FONT_FAMILY="Helvetica, Arial, \"Hiragino Sans GB\", \"Microsoft YaHei\", \"WenQuan Yi Micro Hei\", sans-serif",DPR=window.devicePixelRatio||1,ACTIVE_ELECTRONS=[],PINNED_CELLS=[],MOVE_TRAILS=[[0,1],[0,-1],[1,0],[-1,0]].map(function(a){var b=a[0],c=a[1];return[b*CELL_DISTANCE,c*CELL_DISTANCE]}),END_POINTS_OFFSET=[[0,0],[0,1],[1,0],[1,1]].map(function(a){var b=a[0],c=a[1];return[b*CELL_DISTANCE-BORDER_WIDTH/2,c*CELL_DISTANCE-BORDER_WIDTH/2]}),FullscreenCanvas=function(){function a(){var b=0>=arguments.length||void 0===arguments[0]?!1:arguments[0];_classCallCheck(this,a);var c=document.createElement("canvas"),d=c.getContext("2d");this.canvas=c,this.context=d,this.disableScale=b,this.resizeHandlers=[],this.handleResize=_.debounce(this.handleResize.bind(this),100),this.adjust(),window.addEventListener("resize",this.handleResize)}return a.prototype.adjust=function(){var c=this.canvas,d=this.context,f=this.disableScale,g=window,k=g.innerWidth,l=g.innerHeight;this.width=k,this.height=l;var m=f?1:DPR;this.realWidth=c.width=k*m,this.realHeight=c.height=l*m,c.style.width=k+"px",c.style.height=l+"px",d.scale(m,m)},a.prototype.clear=function(){var c=this.context;c.clearRect(0,0,this.width,this.height)},a.prototype.makeCallback=function(c){c(this.context,this)},a.prototype.blendBackground=function(c){var d=1>=arguments.length||void 0===arguments[1]?0.05:arguments[1];return this.paint(function(f,g){var k=g.realWidth,l=g.realHeight,m=g.width,n=g.height;f.globalCompositeOperation="source-over",f.globalAlpha=d,f.drawImage(c,0,0,k,l,0,0,m,n)})},a.prototype.paint=function(c){if(_.isFunction(c)){var d=this.context;return d.save(),this.makeCallback(c),d.restore(),this}},a.prototype.repaint=function(c){if(_.isFunction(c))return this.clear(),this.paint(c)},a.prototype.onResize=function(c){_.isFunction(c)&&this.resizeHandlers.push(c)},a.prototype.handleResize=function(){var c=this.resizeHandlers;c.length&&(this.adjust(),c.forEach(this.makeCallback.bind(this)))},a.prototype.renderIntoView=function(){var c=0>=arguments.length||void 0===arguments[0]?document.body:arguments[0],d=this.canvas;this.container=c,d.style.position="absolute",d.style.left="0px",d.style.top="0px",c.appendChild(d)},a.prototype.remove=function(){if(this.container)try{window.removeEventListener("resize",this.handleResize),this.container.removeChild(this.canvas)}catch(c){}},a}(),Electron=function(){function a(){var b=0>=arguments.length||void 0===arguments[0]?0:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1],d=2>=arguments.length||void 0===arguments[2]?{}:arguments[2],f=d.lifeTime,g=void 0===f?3000:f,k=d.speed,l=void 0===k?STEP_LENGTH:k,m=d.color,n=void 0===m?ELECTRON_COLOR:m;_classCallCheck(this,a),this.lifeTime=g,this.expireAt=Date.now()+g,this.speed=l,this.color=n,this.radius=BORDER_WIDTH/2,this.current=[b,c],this.visited={},this.setDest(this.randomPath())}return a.prototype.randomPath=function(){var c=this.current,d=c[0],f=c[1],g=MOVE_TRAILS.length,k=MOVE_TRAILS[_.random(g-1)],l=k[0],m=k[1];return[d+l,f+m]},a.prototype.composeCoord=function(c){return c.join(",")},a.prototype.hasVisited=function(c){var d=this.composeCoord(c);return this.visited[d]},a.prototype.setDest=function(c){this.destination=c,this.visited[this.composeCoord(c)]=!0},a.prototype.next=function(){var c=this.speed,d=this.current,f=this.destination;if(Math.abs(d[0]-f[0])<=c/2&&Math.abs(d[1]-f[1])<=c/2){f=this.randomPath();for(var g=1;this.hasVisited(f)&&g<=4;)g++,f=this.randomPath();this.setDest(f)}var l=f[0]-d[0],m=f[1]-d[1];return l&&(d[0]+=l/Math.abs(l)*c),m&&(d[1]+=m/Math.abs(m)*c),[].concat(this.current)},a.prototype.paintNextTo=function(){var c=0>=arguments.length||void 0===arguments[0]?new FullscreenCanvas:arguments[0],d=this.radius,f=this.color,g=this.expireAt,k=this.lifeTime,l=this.next(),m=l[0],n=l[1];c.paint(function(o){o.globalAlpha=Math.max(0,g-Date.now())/k,o.fillStyle=f,o.shadowColor=f,o.shadowBlur=5*d,o.globalCompositeOperation="lighter",o.beginPath(),o.arc(m,n,d,0,2*Math.PI),o.closePath(),o.fill()})},a}(),Cell=function(){function a(){var b=0>=arguments.length||void 0===arguments[0]?0:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1],d=2>=arguments.length||void 0===arguments[2]?{}:arguments[2],f=d.electronCount,g=void 0===f?_.random(1,4):f,k=d.background,l=void 0===k?ELECTRON_COLOR:k,m=d.forceElectrons,o=d.electronOptions,p=void 0===o?{}:o;_classCallCheck(this,a),this.background=l,this.electronOptions=p,this.forceElectrons=void 0!==m&&m,this.electronCount=Math.min(g,4),this.startY=b*CELL_DISTANCE,this.startX=c*CELL_DISTANCE}return a.prototype.delay=function(){var c=0>=arguments.length||void 0===arguments[0]?0:arguments[0];this.pin(1.5*c),this.nextUpdate=Date.now()+c},a.prototype.pin=function(){var c=0>=arguments.length||void 0===arguments[0]?2147483647:arguments[0];this.expireAt=Date.now()+c,PINNED_CELLS.push(this)},a.prototype.scheduleUpdate=function(){var c=0>=arguments.length||void 0===arguments[0]?CELL_REPAINT_INTERVAL[0]:arguments[0],d=1>=arguments.length||void 0===arguments[1]?CELL_REPAINT_INTERVAL[1]:arguments[1];this.nextUpdate=Date.now()+_.random(c,d)},a.prototype.paintNextTo=function(){var c=0>=arguments.length||void 0===arguments[0]?new FullscreenCanvas:arguments[0],d=this.startX,f=this.startY,g=this.background,k=this.nextUpdate;k&&Date.now()<k||(this.scheduleUpdate(),this.createElectrons(),c.paint(function(l){l.globalCompositeOperation="lighter",l.fillStyle=g,l.fillRect(d,f,CELL_SIZE,CELL_SIZE)}))},a.prototype.popRandom=function(){var c=0>=arguments.length||void 0===arguments[0]?[]:arguments[0],d=_.random(c.length-1);return c.splice(d,1)[0]},a.prototype.createElectrons=function(){var c=this.startX,d=this.startY,f=this.electronCount,g=this.electronOptions,k=this.forceElectrons;if(f)for(var l=[].concat(END_POINTS_OFFSET),m=k?f:Math.min(f,MAX_ELECTRONS-ACTIVE_ELECTRONS.length),n=0;n<m;n++){var o=this.popRandom(l),p=o[0],q=o[1];ACTIVE_ELECTRONS.push(new Electron(c+p,d+q,g))}},a}(),bgLayer=new FullscreenCanvas,mainLayer=new FullscreenCanvas,shapeLayer=new FullscreenCanvas(!0);function stripOld(){for(var f,a=0>=arguments.length||arguments[0]===void 0?1e3:arguments[0],b=Date.now(),c=0,d=ACTIVE_ELECTRONS.length;c<d;c++)f=ACTIVE_ELECTRONS[c],f.expireAt-b<a&&(ACTIVE_ELECTRONS.splice(c,1),c--,d--)}function createRandomCell(){var a=0>=arguments.length||arguments[0]===void 0?{}:arguments[0];if(!(ACTIVE_ELECTRONS.length>=MAX_ELECTRONS)){var b=mainLayer.width,c=mainLayer.height,d=new Cell(_.random(c/CELL_DISTANCE),_.random(b/CELL_DISTANCE),a);d.paintNextTo(mainLayer)}}function drawGrid(){bgLayer.paint(function(a,b){var c=b.width,d=b.height;a.fillStyle=BG_COLOR,a.fillRect(0,0,c,d),a.fillStyle=BORDER_COLOR;for(var f=CELL_SIZE;f<d;f+=CELL_DISTANCE)a.fillRect(0,f,c,BORDER_WIDTH);for(var g=CELL_SIZE;g<c;g+=CELL_DISTANCE)a.fillRect(g,0,BORDER_WIDTH,d)})}function iterateItemsIn(a){for(var f,b=Date.now(),c=0,d=a.length;c<d;c++)f=a[c],b>=f.expireAt?(a.splice(c,1),c--,d--):f.paintNextTo(mainLayer)}function drawItems(){iterateItemsIn(PINNED_CELLS),iterateItemsIn(ACTIVE_ELECTRONS)}var nextRandomAt;function activateRandom(){var a=Date.now();a<nextRandomAt||(nextRandomAt=a+_.random(300,1e3),createRandomCell())}function handlePointer(){function a(l,m){var n=d,o=n[0],p=n[1];return d=[l,m],l===o&&m===p}function b(l,m){var n=m.clientX,o=m.clientY,p=Math.floor(o/CELL_DISTANCE),q=Math.floor(n/CELL_DISTANCE);if(!(l&&a(p,q))){var s=new Cell(p,q,{background:CELL_HIGHLIGHT,forceElectrons:!0,electronCount:l?2:4,electronOptions:{speed:3,lifeTime:l?500:1e3,color:CELL_HIGHLIGHT}});s.paintNextTo(mainLayer)}}function c(l){return Array.from(l).filter(function(m){var n=m.identifier,o=m.clientX,p=m.clientY,q=f[n];return f[n]={clientX:o,clientY:p},!q||o!==q.clientX||p!==q.clientY})}var d=[],f={},g={touchend:function(m){var n=m.changedTouches;n?Array.from(n).forEach(function(o){var p=o.identifier;delete f[p]}):f={}}};["mousedown","touchstart","mousemove","touchmove"].forEach(function(l){var m=/move/.test(l),n=/touch/.test(l),o=b.bind(null,m);g[l]=function(q){n?c(q.touches).forEach(o):o(q)}});var k=Object.keys(g);return k.forEach(function(l){document.addEventListener(l,g[l])}),function(){k.forEach(function(m){document.removeEventListener(m,g[m])})}}function prepaint(){drawGrid(),mainLayer.paint(function(a,b){var c=b.width,d=b.height;a.fillStyle="#fff",a.fillRect(0,0,c,d)}),mainLayer.blendBackground(bgLayer.canvas,0.9)}function render(){mainLayer.blendBackground(bgLayer.canvas),drawItems(),activateRandom(),shape.renderID=requestAnimationFrame(render)}var shape={lastText:"",lastMatrix:null,renderID:void 0,isAlive:!1,get electronOptions(){return{speed:2,color:FONT_COLOR,lifeTime:_.random(300,500)}},get cellOptions(){return{background:FONT_COLOR,electronCount:_.random(1,4),electronOptions:this.electronOptions}},get explodeOptions(){return _extends({},this.cellOptions,{electronOptions:_extends({},this.electronOptions,{lifeTime:_.random(500,1500)})})},init:function(){var b=this,c=0>=arguments.length||arguments[0]===void 0?document.body:arguments[0];this.isAlive||(bgLayer.onResize(drawGrid),mainLayer.onResize(prepaint),mainLayer.renderIntoView(c),shapeLayer.onResize(function(){b.lastText&&b.print(b.lastText)}),prepaint(),render(),this.unbindEvents=handlePointer(),this.isAlive=!0)},clear:function(){var b=this.lastMatrix;this.lastText="",this.lastMatrix=null,PINNED_CELLS.length=0,b&&this.explode(b)},destroy:function(){this.isAlive&&(bgLayer.remove(),mainLayer.remove(),shapeLayer.remove(),this.unbindEvents(),cancelAnimationFrame(this.renderID),ACTIVE_ELECTRONS.length=PINNED_CELLS.length=0,this.lastMatrix=null,this.lastText="",this.isAlive=!1)},getTextMatrix:function(b){var c=1>=arguments.length||arguments[1]===void 0?{}:arguments[1],d=c.fontWeight,f=d===void 0?"bold":d,g=c.fontFamily,k=g===void 0?FONT_FAMILY:g,l=shapeLayer.width,m=shapeLayer.height;shapeLayer.repaint(function(t){t.textAlign="center",t.textBaseline="middle",t.font=f+" "+MAX_FONT_SIZE+"px "+k,console.log(t.measureText(b));var u=l/t.measureText(b).width,v=Math.min(MAX_FONT_SIZE,0.8*(MAX_FONT_SIZE*u));t.font=f+" "+v+"px "+k,t.fillText(b,l/2,m/2)});for(var n=shapeLayer.context.getImageData(0,0,l,m).data,o=[],p=0;p<m;p+=CELL_DISTANCE)for(var s,q=0;q<l;q+=CELL_DISTANCE)s=n[4*(q+p*l)+3],0<s&&o.push([Math.floor(p/CELL_DISTANCE),Math.floor(q/CELL_DISTANCE)]);return o},print:function(b,c){var d=this,f=!!this.lastText;if(this.clear(),0!==b&&!b)return void(f&&this.spiral({reverse:!0,lifeTime:500,electronCount:2}));this.spiral(),this.lastText=b;var g=this.lastMatrix=_.shuffle(this.getTextMatrix(b,c));g.forEach(function(k){var l=k[0],m=k[1],n=new Cell(l,m,d.cellOptions);n.scheduleUpdate(200),n.pin()})},spiral:function(){for(var b=0>=arguments.length||void 0===arguments[0]?{}:arguments[0],c=b.radius,d=b.increment,f=void 0===d?0:d,g=b.reverse,l=b.lifeTime,m=void 0===l?250:l,n=b.electronCount,o=void 0===n?1:n,p=b.forceElectrons,s=mainLayer.width,t=mainLayer.height,u=Math.floor(s/CELL_DISTANCE),v=Math.floor(t/CELL_DISTANCE),z=Math.floor(u/2),A=Math.floor(v/2),B=1,C=_.random(360),D=void 0===c?Math.floor(Math.min(u,v)/3):c,E=void 0!==g&&g?15:-15,F=Math.abs(360/E);B<=F;){var G=A+Math.floor(D*Math.sin(C/180*Math.PI)),H=z+Math.floor(D*Math.cos(C/180*Math.PI)),I=new Cell(G,H,{electronCount:o,forceElectrons:void 0===p||p,background:CELL_HIGHLIGHT,electronOptions:{lifeTime:m,speed:3,color:CELL_HIGHLIGHT}});I.delay(16*B),B++,C+=E,D+=f}},explode:function(b){if(stripOld(),b)for(var c=b.length,d=Math.min(50,_.random(Math.floor(c/20),Math.floor(c/10))),f=0;f<d;f++){var g=b[f],k=g[0],l=g[1],m=new Cell(k,l,this.explodeOptions);m.paintNextTo(mainLayer)}else for(var d=_.random(10,20),f=0;f<d;f++)createRandomCell(this.explodeOptions)}},timer;function queue(){var a="PLASTUER",b=0,c=a.length;(function f(){b>=c||(shape.print(a.slice(0,++b)),timer=setTimeout(f,1e3+b))})()}function countdown(){var a=_.range(3,0,-1),b=0,c=a.length;(function f(){return b>=c?(shape.clear(),galaxy()):void(shape.print(a[b++]),setTimeout(f,1e3+b))})()}function galaxy(){shape.spiral({radius:0,increment:1,lifeTime:100,electronCount:1}),timer=setTimeout(galaxy,16)}function ring(){shape.spiral(),timer=setTimeout(ring,16)}shape.init(),shape.print(new URLSearchParams(location.search.slice(1)).get("domain")||"j113203"),document.addEventListener("touchmove",function(a){return a.preventDefault()});