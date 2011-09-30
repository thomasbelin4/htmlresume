var isPaused=false;var cvController=null;var cloudController=null;const gravity=new CVVector(0,0.5);const speedDown=new CVVector(0.95,0.95);var popup=null;const floatPrecision=5;const nbClouds=5;const cloudSpeedClasses=["highSpeed","middleHighSpeed","slowSpeed","middleSlowSpeed","middleSpeed"];function keyPressed(a){switch(a.charCode){case 112:isPaused=!isPaused}if(!isPaused){runExpAnim()}}function initCV(){document.onkeypress=keyPressed;cvController=new CVController("mainContainer");cvController.init();cloudController=new CloudController("divMe");cloudController.init();runExpAnim()}function runExpAnim(){cvController.step();if(!isPaused){requestAnimFrame(runExpAnim)}}function Word(b,a){this.text=b;this.desc=a}Word.prototype={text:null,desc:null,getHTMLDescription:function(){return"<h1>"+this.text+"</h1><p>"+this.desc+"</p>"},};var arrayOfWords=[new Word("Musicien","Guitariste passioné depuis maintenant 7 ans, je joue régulièrement en groupe."),new Word("Créatif","Un minimum d'originalité demande un minimum de créativité."),new Word("Consciencieux","Je ne me contente jamais de faire quelque chose qui fonctionne. Je fais tout pour qu'il fonctionne le mieux possible."),new Word("Sportif",'Parce que le crédo : "Un corps sain dans un esprit sain" semble très important à mes yeux, je pratique régulièrement le jogging.'),new Word("Determiné","J'aime me lancer des défis, et je me donne les moyens de relever ces défis."),new Word("Impliqué","Quand je fais quelque chose je le fais à fond.")];function Popup(a){this.htmlText=a;this.createDomElement()}Popup.prototype={htmlText:"",domElement:null,contentElement:null,addedToDom:false,createDomElement:function(){var a=document.createElement("div");a.id="popup";a.className="hidden";var b=document.createElement("div");b.id="popupContent";a.appendChild(b);this.contentElement=b;var c=(function(){this.hide()}).bind(this);a.onclick=c;this.domElement=a},setInnerHtml:function(a){this.htmlText=a},show:function(){this.contentElement.innerHTML=this.htmlText;if(!this.addedToDom){document.body.appendChild(this.domElement);this.addedToDom=true}this.domElement.className=""},hide:function(){this.domElement.className="hidden"}};function Experience(a){this.model=a;this.speedVector=new CVVector(0,0);this.position=new CVPoint(10,0);this.createDomElement()}Experience.prototype={model:null,speedVector:null,position:null,previousPosition:null,domElement:null,addedToDoc:false,mousePoint:null,selected:false,update:function(){this.speedVector.addVector(gravity)},drawInContext:function(b){if(!this.addedToDoc){b.appendChild(this.domElement);this.addedToDoc=true}if(!this.selected){this.previousPosition=new CVPoint(this.position.x,this.position.y);this.speedVector.applyToPoint(this.position)}var a=false;var c=this.domElement.style;var d=this.previousPosition;var e=this.position;if(d.y.toPrecision(floatPrecision)!=e.y.toPrecision(floatPrecision)){c.top=e.y+"px";a=true}if(d.y.toPrecision(floatPrecision)!=e.y.toPrecision(floatPrecision)){c.left=e.x+"px";a=true}return a},createDomElement:function(){var d=this.model;var b=document.createElement("div");b.className="experience type_"+d.type;b.id="exp_"+d.id;var a=document.createElement("span");a.className="type";a.innerHTML=d.typeStr;b.appendChild(a);var c=document.createElement("div");c.className="title";c.innerHTML=d.title;b.appendChild(c);var e=document.createElement("div");e.className="description";e.innerHTML="<p>"+d.descriptionShort+"</p>";b.appendChild(e);b.onmousedown=(function(f){this.mouseDown(f)}).bind(this);b.onmouseup=(function(){this.mouseUp()}).bind(this);b.onclick=(function(f){this.showDetails()}).bind(this);this.domElement=b},immobilize:function(){this.speedVector.dx=0;this.speedVector.dy=0},getWidth:function(){return this.domElement.clientWidth},mouseDown:function(a){if(typeof(a.preventDefault)!=undefined){a.preventDefault()}this.immobilize();this.domElement.style.zIndex=1;this.selected=true;this.mousePoint=new CVPoint(a.clientX,a.clientY);this.moving=false;document.onmousemove=(function(b){this.mouseMove(b)}).bind(this)},mouseUp:function(){this.selected=false;this.domElement.style.zIndex=0;document.onmousemove=null},mouseMove:function(c){if(this.selected){var a=new CVPoint(c.clientX,c.clientY);var b=a.getVector(this.mousePoint);this.mousePoint=a;b.applyToPoint(this.position);this.drawInContext(null);this.moving=true}},getHTMLDesc:function(){var c=this.model;var b="";var a="";var d="";if(c.image){b="<img src='"+c.image+"' />"}if(c.other){a='<h2>Compétences aquises</h2><div class="other">'+c.other+"</p></div>"}if(c.description){d='<h2>Description</h2><div class="description"><p>'+this.model.description+"</p></div>"}return"<h1>"+this.model.title+"</h1>"+b+d+a},showDetails:function(){if(!this.moving){showPopup(this.getHTMLDesc())}}};function Link(b,a,c){this.startElem=b;this.endElem=a;this.strengthVector=new CVVector(0,0);this.size=c}Link.prototype={startElem:null,endElem:null,strengthVector:null,size:100,elasticity:0.05,update:function(){if(!this.endElem.selected){this.endElem.update();var a=this.getHeight();var e=this.getWidth();var c=this.getCurrentSize();var d=Math.max(0,c-this.size);var g=this.elasticity*d;var f=c!=0?Math.abs(e/c):0;var b=c!=0?Math.abs(a/c):0;f=e<=0?-f:f;b=a<=0?-b:b;this.strengthVector.dx=f*g;this.strengthVector.dy=g*b;this.endElem.speedVector.addVector(this.strengthVector);this.endElem.speedVector.multVector(speedDown)}},drawInContext:function(c){var g=this.startElem;var f=this.endElem;var b=g.offsetLeft+parseInt(g.clientWidth/2);var a=0;var e=f.position.x+parseInt(f.getWidth()/2);var d=f.position.y+a;c.moveTo(b,a);c.lineTo(e,d)},getCurrentSize:function(){return Math.sqrt(Math.pow(this.getWidth(),2)+Math.pow(this.getHeight(),2))},getWidth:function(){var d=this.startElem;var c=this.endElem;var a=d.offsetLeft+Math.floor(d.clientWidth/2);var b=c.position.x+Math.floor(c.getWidth()/2);return a-b},getHeight:function(){var d=this.startElem;var c=this.endElem;var a=d.offsetTop+d.clientHeight;var b=c.position.y+a;return a-b}};function Cloud(a){this.containerHeight=a;this.createDomElement()}Cloud.prototype={text:null,containerHeight:0,domElement:null,speedClassName:"",createDomElement:function(){var a=document.createElement("div");a.className="cloud";var b=(function(){this.startAnim()}).bind(this);a.addEventListener("webkitTransitionEnd",b,true);a.addEventListener("OTransitionEnd",b,true);a.addEventListener("transitionend",b,true);var c=(function(){this.showDetails()}).bind(this);a.onclick=c;this.domElement=a},computeSpeedClass:function(){var a=Math.floor(Math.random()*cloudSpeedClasses.length);this.speedClassName=cloudSpeedClasses[a]},launchAnim:function(){this.computeSpeedClass();this.domElement.className=this.speedClassName+" cloud";this.domElement.style.left="100%"},startAnim:function(){this.reinit();var a=(function(){this.launchAnim()}).bind(this);window.setTimeout(a,1)},reinit:function(){if(this.word){arrayOfWords.push(this.word)}var a=Math.floor(Math.random()*arrayOfWords.length);this.word=arrayOfWords.splice(a,1)[0];this.domElement.innerHTML=this.word.text;var b=Math.floor(Math.random()*(this.containerHeight-this.domElement.clientHeight));this.domElement.className="cloud";this.domElement.style.top=b+"px";this.domElement.style.left="-20%"},showDetails:function(){showPopup(this.word.getHTMLDescription())},};function CVController(a){this.container=document.getElementById(a);this.skillsContainer=document.createElement("div");this.skillsContainer.id="skillsContainer";this.container.parentNode.insertBefore(this.skillsContainer,this.container.parentNode.firstChild);var c=document.createElement("canvas");c.id="linkCanvas";var e=parseInt(getComputedStyle(this.container,null).getPropertyValue("height"));var d=parseInt(getComputedStyle(this.container,null).getPropertyValue("width"));c.style.height=e+"px";c.style.width=d+"px";c.height=e;c.width=d;this.linkCanvas=c;this.container.appendChild(c);var b=c.getContext("2d");b.lineCap="round";b.lineWidth=1;b.strokeStyle="white";this.linkContext=b;this.experienceContainer=document.createElement("div");this.experienceContainer.id="experienceContainer";this.container.appendChild(this.experienceContainer)}CVController.prototype={container:null,linkCanvas:null,linkContext:null,skillsContainer:null,experienceContainer:null,ajaxModel:null,linksArray:[],experienceArray:[],init:function(){var b=getXmlHttpRequest();var a="";b.onreadystatechange=function(){if(b.readyState==4){if(b.status==200){a=JSON.parse(b.responseText)}else{console.log("Error: returned status code "+b.status+" "+xhr.statusText)}}};b.open("GET","requests/getDatas.php",false);b.send(null);this.ajaxModel=a;this.draw()},draw:function(){for(var c in this.ajaxModel.skills){var b=this.ajaxModel.skills[c];var g="skill_"+b.id;a=document.createElement("div");a.id=g;a.className="skill";a.innerHTML=b.name;this.skillsContainer.appendChild(a)}for(var d in this.ajaxModel.experience){var h=this.ajaxModel.experience[d];var e=new Experience(h);this.experienceArray.push(e);for(var c in h.skills){var b=h.skills[c];var g="skill_"+b.id;var a=document.getElementById(g);var f=new Link(a,e,b.size);this.linksArray.push(f)}}this.refresh()},step:function(){this.update();this.refresh()},update:function(){for(var b in this.linksArray){var a=this.linksArray[b];a.update()}},refresh:function(){var b=false;for(var g in this.experienceArray){var f=this.experienceArray[g];var a=f.drawInContext(this.experienceContainer);b=b||a}if(b){var c=this.linkContext;c.clearRect(0,0,c.canvas.clientWidth,c.canvas.clientHeight);c.beginPath();for(var e in this.linksArray){var d=this.linksArray[e];d.drawInContext(c)}c.closePath();c.stroke()}}};function CloudController(a){this.container=document.getElementById(a);this.arrayOfWords=["Créatif","Dynamique","Musicien","Sportif","Ouvert d'esprit","Social","Consciencieux"];this.visibleCloud=[]}CloudController.prototype={container:null,arrayOfWords:null,visibleCloud:null,init:function(){for(var b=0;b<nbClouds;b++){var c=parseInt(getComputedStyle(this.container,null).getPropertyValue("height"));var a=new Cloud(c);this.visibleCloud.push(a);this.container.appendChild(a.domElement)}this.startAllAnim()},startAllAnim:function(){for(cloudIndex in this.visibleCloud){var a=this.visibleCloud[cloudIndex];a.startAnim()}}};function CVPoint(a,b){this.x=a;this.y=b}CVPoint.prototype={x:0,y:0,getVector:function(a){return new CVVector(this.x-a.x,this.y-a.y)}};function CVVector(b,a){this.dx=b;this.dy=a}CVVector.prototype={dx:0,dy:0,applyToPoint:function(a){a.x+=this.dx;a.y+=this.dy},addToVector:function(a){a.dx+=this.dx;a.dy+=this.dy;a.minifyPrecision()},multToVector:function(a){a.dx*=this.dx;a.dy*=this.dy;a.minifyPrecision()},addVector:function(a){this.dx+=a.dx;this.dy+=a.dy;this.minifyPrecision()},multVector:function(a){this.dx*=a.dx;this.dy*=a.dy;this.minifyPrecision()},minifyPrecision:function(){this.dx=parseFloat(this.dx.toFixed(floatPrecision));this.dy=parseFloat(this.dy.toFixed(floatPrecision))},getAddedVector:function(a){return new CVVector(parseFloat((this.dx+a.dx).toPrecision(floatPrecision)),parseFloat((this.dy+a.dy).toPrecision(floatPrecision)))},getMultVector:function(a){return new CVVector(parseFloat((this.dx*a.dx).toPrecision(floatPrecision)),parseFloat((this.dy*a.dy).toPrecision(floatPrecision)))},};function showPopup(a){if(!popup){popup=new Popup(a)}popup.setInnerHtml(a);popup.show()}function hidePopup(){popup.hide()}if(!Function.prototype.bind){Function.prototype.bind=function(a){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable")}var e=Array.prototype.slice.call(arguments,1),d=this,b=function(){},c=function(){return d.apply(this instanceof b?this:a||window,e.concat(Array.prototype.slice.call(arguments)))};b.prototype=this.prototype;c.prototype=new b();return c}}window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(b,a){window.setTimeout(b,1000/60)}})();function getXmlHttpRequest(){var a=null;if(window.XMLHttpRequest){a=new XMLHttpRequest()}else{if(window.ActiveXObject){a=new ActiveXObject("Microsoft.XMLHTTP")}else{alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...")}}return a};