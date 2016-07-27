var GoSquared = {};
$(function(){

	var ie = !!(/MSIE/.test(navigator.userAgent));
	
	
	var gsTracker;
	var initPageLoaded = false;
	var initPage = '';
	GoSquared.acct = "GSN-658434-X";
	$.getScript("//d1l6p2sc9645hc.cloudfront.net/tracker.js");
	if(navigator.userAgent.indexOf('MSIE 6')>0)return;
	if(window.location.hash=="")window.location.href='./#'+p;
	GoSquared.load = function(T){
		T.Cancel();
		gsTracker = T;
		if(initPageLoaded){
			T.TrackView(initPage);
		}
	}

	var intro_css = {
		'#main_logo':{
			opacity:0,
			top:'50%',
			marginTop:-150,
			position:'fixed',
			left:'50%',
			marginLeft:-150,
			width:300
		},
		'#main_title':{
			opacity:0,
			top:'50%',
			position:'fixed',
			marginTop:20
		},
		'#date_title':{
			opacity:0,
			top:'50%',
			position:'fixed',
			marginTop:60
		},
		'.footer':{
			opacity:0
		},
		'#menu':{
			opacity:0
		},
		'.black_overlay':{
			opacity:1
		},
		'.loading':{
			display:'block',
			opacity:0
		},
		'#home_filler':{
			height:$(window).height()/2
		},
		'#sponsors':{
			opacity:0
		}
	};

	var intro_keyframes = [
		{time:0,		selector:'.loading',	params:{opacity:1}, duration:400},
		{time:500,		fn:completeIntro}
	];
	var intro_continued_keyframes = [
		{time:0,		selector:'.loading',	params:{opacity:0}, duration:300},
		{time:1000, 	selector:'#main_logo', 	params:{opacity:1}, duration:2000},
		{time:3500,		selector:'#main_title', params:{opacity:1}, duration:1000},
		{time:4500,		selector:'#date_title',	params:{marginTop:60,opacity:1},	duration:1000},
		{time:6000,		fn:repositionLogoAndTitles},
		{time:6000,		selector:'.black_overlay',	params:{opacity:0},		duration:2000},
		{time:7500,		selector:'#main_logo',	params:{top:80,marginTop:0},	duration:500},
		{time:7500,		selector:'#main_title',	params:{top:250,marginTop:0},	duration:500},
		{time:7500,		selector:'#date_title',	params:{top:286,marginTop:0},	duration:500},
		{time:7500,		selector:'#home_filler',params:{height:346},	duration:500},
		{time:8500,		selector:'#menu',		params:{opacity:1},	duration:1000},
		{time:8500,		selector:'.footer',		params:{opacity:1},	duration:500},
		{time:8500,		selector:'#sponsors',	params:{opacity:1},	duration:1000},
		{time:8500,		fn:repositionLogoAndTitles2}
	];

	function completeIntro(skip){
		if(!preload_images[0].loaded){
			setTimeout(completeIntro.bind(this,skip),250);
			return false;
		}
		var bgdiv = $('<div/>',{
			'class':'background_image'
		}).appendTo('body');
		$('<img/>',{
			src:preload_images[0].src
		}).appendTo(bgdiv);
		$('.background_image').resizenow();
		runAnimation(intro_continued_keyframes,skip);
	}

	try{
		(function(a){return a}).bind(document)
	}catch(e){
		Function.prototype.bind=function(o){
			var b=this,args=[];
			for(var n=1;n<arguments.length;n+=1)args.push(arguments[n]);
			return function(){
				var a = args.concat([]);
				for(var i=0;i<arguments.length;i+=1)a.push(arguments[i]);
				return b.apply(o,a);
			}
		}
	}
	
	function switchImages(newImg){
		var bgdiv = $('.background_image');
		if(bgdiv.length==0){
			bgdiv = $('<div/>',{
				'class':'background_image'
			}).appendTo('body');
		}
		var curr_img = bgdiv.children('img');
		if(newImg==''){
			curr_img.remove();
			return;
		}
		var new_img = $('<img/>',{
			src:newImg,
			'class':'newimg',
			css:{
				opacity:0
			},
			load:function(){
				curr_img.remove();
				$(this).removeClass('newimg').css({opacity:1});
				$('.background_image').resizenow();
			}
		}).prependTo(bgdiv);
	}

	function repositionLogoAndTitles(){
		var selectors = ['#main_logo','#main_title','#date_title'];
		for(var i =0;i<selectors.length;i+=1){
			$elem = $(selectors[i]);
			$elem.css({top:$elem.offset().top-+ie*15,marginTop:0});
		}
		$('.loading').css({display:'none'});
	}
	
	function repositionLogoAndTitles2(){
		$('#main_logo').css({
			position:'',
			margin:'',
			left:'',
			top:'',
			marginTop:''
		});
		$('#main_title').css({
			position:'',
			margin:'',
			left:'',
			top:'',
			marginTop:''
		});
		$('#date_title').css({
			position:'',
			margin:'',
			left:'',
			top:'',
			marginTop:''
		});
		$('#home_filler').css({
			height:100
		});
		$('.black_overlay').remove();
	}

	function executeKeyframe(frame){
		$(frame.selector).animate(frame.params,frame.duration);
	}

	var keyframeTimeouts = [];
	
	function runAnimation(keyframes,skip){
		if(skip){
			for(var i=0;i<keyframeTimeouts.length;i+=1){
				clearTimeout(keyframeTimeouts[i]);
			}
			keyframeTimeouts = [];
		}
		for(var i = 0; i<keyframes.length; i+=1){
			if(keyframes[i].fn !== undefined){
				if(!skip){
					keyframeTimeouts.push(setTimeout(keyframes[i].fn.bind(this,skip),keyframes[i].time));
				}else{
					keyframes[i].fn(true);
				}
			}else{
				if(!skip){
					keyframeTimeouts.push(setTimeout(executeKeyframe.bind(this,keyframes[i]),keyframes[i].time));
				}else{
					$(keyframes[i].selector).stop(true,true).css(keyframes[i].params);
				}
			}
		}
	}

	var pages = {
		home:{bg:'images/bg.jpg','class':'home',page:'home'},
		news:{bg:'images/bg.jpg','class':'home',page:'home'},
		committee:{bg:'images/bg.jpg','class':'committee',page:'committee'},
		tickets:{bg:'images/bg.jpg','class':'tickets',page:'tickets'},
		//tickets_faq:{bg:'images/bg.jpg','class':'tickets_faq',page:'tickets_faq'},
		work:{bg:'images/bg.jpg','class':'work',page:'work'},
		gallery:{bg:'images/bg.jpg','class':'gallery',page:'gallery'},
		food:{bg:'images/bg.jpg','class':'food',page:'food'},
		about:{bg:'images/After-the-Ball-1905.jpg','class':'about',page:'about'},
		sponsorship:{bg:'images/_DSC1037.jpg','class':'sponsorship',page:'sponsorship'},
		ents:{bg:'images/_DSC0927.jpg','class':'ents',page:'ents'},
		charity:{bg:'images/_DSC0985.jpg','class':'charity',page:'charity'}
	};

	var preload_images = [
		{src:pages.home.bg,loaded:false}
	];

	var currentPage = $('body').attr('class');
	var originalClass = currentPage;

	var popover = false;
	var popoverVisible = false;
	var popoverPage = false;
	
	function loadPopover(path,isInit){
		popoverVisible = true;
		if(!popover){
			popover = $('<div/>',{
				'class':'popover'
			}).appendTo('body');
			$('<img/>',{
				'class':'loader',
				src:'images/prettyPhoto/dark_rounded/loader.gif'
			}).appendTo(popover);
			$('<div/>',{
				'class':'popup-content'
			}).appendTo(popover);
			$('<a/>',{
				href:'#tickets',
				'class':'close'
			}).appendTo(popover);
		}
		popover.children('.popup-content').html('');
		popover.children('.loader').css({display:'block'});
		var ww = $(window).width();
		var wh = $(window).height();
		popover.css({
			display:'block',
			top:wh/2-17,
			bottom:wh/2-17,
			width:'',
			opacity:1
		});
		popover.children('.close').css({opacity:0});
		$.ajax({
			url:'index.php?p='+path.replace('/','_'),
			data:{type:'content'},
			dataType:'json',
			success:function(data){
				popover.children('.loader').css({display:'none'});
				popover.children('.popup-content').css({opacity:0}).html('<div>'+data.content+'</div>');
				var w = Math.min(1024,ww-50);
				if(isInit){
					popover.css({
						width:w,
						top:30,
						bottom:30
					});	
					popover.children('.popup-content, .close').css({opacity:1});
				}else{
					popover.animate({
						width:w,
						top:30,
						bottom:30
					},{
						duration:500,
						complete:function(){
							popover.children('.popup-content, .close').animate({opacity:1});
						}
					})
				}
			}
		});
	}
	
	function dismissPopover(){
		popoverVisible = false;
		popover.animate({
			opacity:0
		},{
		duration:500,
		complete:function(){
			popover.children('.popup-content').html('');
			popover.css({display:'none'});
		}});
	}
	
	function switchToPage(pageName,isInit){
		var parts = pageName.split('/');
		if(parts.length>1){
			loadPopover(pageName,isInit);
		}
		if(parts.length==1&&popoverVisible){
			dismissPopover();
		}
		pageName=parts[0];
		if(pages[pageName]===undefined){
			alert('Invalid page!');
			return;
		}
		init=false;
		var page = pages[pageName];
		if(page['class']==currentPage)return;
		prefetchedContent = '';
		fetchPageContent(page.page);
		if(isInit){
			switchClass(true);
			$('.content').css({opacity:0});
			$('body').removeClass(currentPage).addClass(pageName);
			currentPage = pageName;
			switchImages(page.bg);
		}else{
			$('.content').animate({opacity:0},{duration:500,complete:switchClass.bind(this)});
			if(currentPage=='home'){
				$('#menu').animate({opacity:0},450);
			}
			if(pageName=='home'){
				$('#menu').animate({opacity:0,top:-100},450);
			}
			setTimeout(switchImages.bind(this,page.bg),750);
		}
	}
	
	function fetchPageContent(page){
		var a = window.ad===undefined?'0':window.ad;
		$.ajax({
			url:'index.php',
			data:{p:page,type:'content',g:a},
			dataType:'json',
			success:function(data){prefetchedContent=data;}
		});
	}
	
	var prefetchedContent = '';

	function switchClass(isInit){
		if(prefetchedContent==''){
			setTimeout(switchClass.bind(this,isInit),250);
			return;
		}
		className = prefetchedContent['class'];
		var wh = $('.wrapper2').height();
		$('.content').html(prefetchedContent.content);
		if(isInit===true){
			$('.content').css({opacity:1});
		}else{
			$('.wrapper2').css({overflow:'hidden',height:wh});
			setTimeout(function(){
				$('.content').animate({opacity:1},750);
				var mt = className=='home'?50:150;
				if(currentPage=='home'){
					$('#menu').css({top:-100}).animate({top:25,opacity:1},450);
					mt = 150;
				}
				if(className=='home'){
					$('#menu').css({top:''}).animate({opacity:1},500);
					mt = 50;
				}
				$('body').removeClass(currentPage).addClass(className);
				var wh2 = $('.wrapper2').css({height:''}).height();
				$('.wrapper2').css({height:wh,marginTop:currentPage=='home'?50:150}).animate({height:wh2,marginTop:mt},{duration:500,complete:function(){$(this).css({overflow:'',height:''});$('.background_image').resizenow()}});
				currentPage = className;
			},250);
		}
		if(className=='gallery')init_gallery();
		if(className=='food')init_food();
		if(className=='tickets')init_tickets();
		//document.title = "Trinity May Ball 2013 - "+prefetchedContent.title;
		if(gsTracker){
			gsTracker.TrackView('/'+prefetchedContent.page,document.title);
		}else{
			initPageLoaded = true;
			initPage = '/'+prefetchedContent.page;
		}
	}

	var init = true;
	for(var i=0;i<preload_images.length;i+=1){
		var im = new Image();
		im.src = preload_images[i].src;
		im.onload = (function(){this.loaded = true}).bind(preload_images[i]);
	}
	$('#menu a').each(function(){
		var $t = $(this);
		var className = $t.parent().attr('class');
		$t.attr({href:'#'+className});
		var tip = $('<div/>',{
			'class':'tip',
			text:$t.text()
		}).appendTo($t.parent());
		$t.hover(
			function(){
				tip.css({marginLeft:-tip.width()/2}).stop().animate({opacity:1},250);
			},
			function(){
				tip.stop().animate({opacity:0},500)
			}
		);
		if(/MSIE/.test(navigator.userAgent))tip.addClass('ie');
	});
	
	function init_gallery(){
		$('.gallery_demo_unstyled').addClass('gallery_demo'); // adds new class name to maintain degradability

		$('div.gallery li a').prettyPhoto({
			theme:'dark_rounded'
		}).hover(function(){
			$(this).stop().animate({opacity:1},200);
		},function(){
			$(this).stop().animate({opacity:.8},200);
		});
		$('.next').click(function(){$.galleria.next()});
		$('.prev').click(function(){$.galleria.prev()});
	}
	
	function init_tickets(){
		$('.sections div').css({
			position:'relative',
			overflow:'hidden',
			height:0
		});
		$('.sections h3').click(function(){
			var section = $(this).attr('class')
			var $section = $(this).parent().children('#'+section);var p = false;
			if($section.hasClass('active'))p=true;
			$(this).parent().children('.active').removeClass('active').stop().animate({height:0},500);
			if(p)return;
			var h = $section.css({height:''}).height();
			$section.stop().addClass('active').css({height:0}).animate({height:h},{duration:500,complete:function(){$section.css({height:''})}});
		});
	}
	
	function init_food(){
		var bigmenu = $('<img/>',{
			'src':'images/2011-menu-large.png',
			css:{
				display:'none',
				position:'absolute',
				top:0,
				width:'auto',
				left:0
			}
		}).appendTo('body');
		$('#dining_menu').click(function(){
			var offset = $(this).parent().offset();
			var sp = $(document).scrollTop();
			var w = $(window).width();
			var h = $(window).height();
			var iw = bigmenu.width();
			var ih = bigmenu.height();
			var $t = $(this).css({visibility:'hidden'});
			bigmenu.css({
				display:'block',
				position:'fixed',
				cursor:'pointer',
				top:offset.top-sp+10,
				left:offset.left,
				height:250,
				zIndex:1000
			}).animate({
				top:10,
				height:h-20,
				left:(w-iw/ih*(h-20))/2
			},750).click(sendMenuBack);
			var overlay = $('<div/>',{
				css:{
					background:'black',
					zIndex:500,
					opacity:0,
					position:'fixed',
					cursor:'pointer',
					top:0,
					bottom:0,
					left:0,
					right:0
				}
			}).insertBefore(bigmenu).animate({opacity:.8},750).click(sendMenuBack);
			function sendMenuBack(){
				var offset = $('#dining_menu').parent().offset();
				var sp = $(document).scrollTop();
				bigmenu.animate({
					top:offset.top-sp+10,
					left:offset.left,
					height:250
				},{
					duration:500,
					complete:function(){
						$t.css({visibility:''});
						bigmenu.css({display:'none'});
						overlay.remove();
					}
				});
				overlay.animate({opacity:0},500);
			}
		});
	}
	
	$.history.init(function(hash){
		if(hash=="")hash=originalClass;
		switchToPage(hash,init);
	});
	var currentHash = window.location.hash.replace(/^#/, '');
	if(currentHash==currentPage||currentHash==''){
		initPageLoaded = true;
		initPage = '/'+currentPage;
	}
	if(currentPage=="home" && (currentHash=='' || currentHash=='home')){
		runAnimation(intro_keyframes,(navigator.userAgent.indexOf('MSIE 6')>0));
		$('.black_overlay').click(function(){
			runAnimation(intro_keyframes,true);
		});
		for(var i in intro_css){
			if(intro_css.hasOwnProperty(i)){
				$(i).css(intro_css[i]);
			}
		}
	}
	$(window).bind("resize", function(){
		$('.background_image').resizenow();
	});
});
(function($){
	$.fn.resizenow = function() {
		var t = $(this);
		var options = $.extend($.fn.supersized.defaults, $.fn.supersized.options);
		var imagewidth = t.width();
		var imageheight = t.height();
		var w = $(window);
		var browserwidth = w.width();
		var browserheight = w.height();
		var c = t.children('img:first-child').css({height:'',width:''}).removeAttr('height').removeAttr('width');
		var ratio = c.height()/c.width();
	  	return t.each(function() {
			var offset;
			if ((browserheight/browserwidth) > ratio){
			    t.height(browserheight);
			    t.width(browserheight / ratio);
			    c.height(browserheight);
			    c.width(browserheight / ratio);
			} else {
			    t.width(browserwidth);
			    t.height(browserwidth * ratio);
			    c.width(browserwidth);
			    c.height(browserwidth * ratio);
			}
			if (options.vertical_center == 1){
				c.css({left:(browserwidth - t.width())/2,top:(browserheight - t.height())/2});
			}
			return false;
		});
	};
	$.fn.supersized={};		
	$.fn.supersized.defaults = { 
			startwidth: 4,  
			startheight: 3,
			vertical_center: 1
	};
	
})(jQuery);

