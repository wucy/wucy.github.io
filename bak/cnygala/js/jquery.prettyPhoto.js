(function($) {
	$.prettyPhoto = {version:"3.0"};
	$.fn.prettyPhoto = function(pp_settings) {
		pp_settings = jQuery.extend({
			animation_speed:"fast",
			opacity:0.8,
			show_title:true,
			allow_resize:true,
			default_width:500,
			default_height:344,
			counter_separator_label:"/",
			theme:"facebook",
			overlay_gallery:true,
			keyboard_shortcuts:true,
			changepicturecallback:function(){},
			callback:function(){},
			markup:'<div class="pp_pic_holder"> <div class="ppt">&nbsp;</div> <div class="pp_content_container"> <div class="pp_content"> <div class="pp_loaderIcon"></div> <div class="pp_fade"> <div class="pp_hoverContainer"> <a class="pp_next" href="#"><span>next</span></a> <a class="pp_previous" href="#"><span>prev</span></a> </div> <div id="pp_full_res"></div> <div class="pp_details clearfix"> <p class="pp_description"></p> <a class="pp_close" href="#">Close</a> <div class="pp_nav"> <a href="#" class="pp_arrow_previous">Previous</a> <p class="currentTextHolder">0/0</p> <a href="#" class="pp_arrow_next">Next</a> </div> </div> </div> </div> </div> </div> <div class="pp_overlay"></div>', 
			gallery_markup:'<div class="pp_gallery"> <a href="#" class="pp_arrow_previous">Previous</a> <ul> {gallery} </ul> <a href="#" class="pp_arrow_next">Next</a> </div>',
			image_markup:'<img id="fullResImage" src="" />'
		}, 
		pp_settings);
		var matchedObjects = this, percentBased = false, correctSizes, pp_open, pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth, windowHeight = $(window).height(), windowWidth = $(window).width(), doresize = true, scroll_pos = _get_scroll();
		$(window).unbind("resize.pp").bind("resize.pp", function() {
			_center_overlay();
			_resize_overlay()
		});
		if(pp_settings.keyboard_shortcuts) {
			$(document).unbind("keydown.pp").bind("keydown.pp", function(e) {
				if(typeof $pp_pic_holder != "undefined") {
					if($pp_pic_holder.is(":visible")) {
						switch(e.keyCode) {
							case 37:
								$.prettyPhoto.changePage("previous");
								return false;
							case 39:
								$.prettyPhoto.changePage("next");
								return false;
							case 27:
								if(!settings.modal) {
									$.prettyPhoto.close()
								}
								return false;
						}
					}
				}
			});
		}
		$.prettyPhoto.initialize = function() {
			settings = pp_settings;
			_buildOverlay(this);
			if(settings.allow_resize) {
				$(window).bind("scroll.pp", function() {
					_center_overlay();
				})
			}
			_center_overlay();
			set_position = jQuery.inArray($(this).attr("href"), pp_images);
			$.prettyPhoto.open();
			return false
		};
		$.prettyPhoto.open = function(event) {
			if(typeof settings == "undefined") {
				settings = pp_settings;
				_buildOverlay(event.target);
				pp_images = $.makeArray(arguments[0]);
				pp_titles = arguments[1] ? $.makeArray(arguments[1]) : $.makeArray("");
				pp_descriptions = arguments[2] ? $.makeArray(arguments[2]) : $.makeArray("");
				isSet = pp_images.length > 1 ? true : false;
				set_position = 0
			}
			if($.browser.msie && $.browser.version == 6) {
				$("select").css("visibility", "hidden")
			}
			$(".pp_loaderIcon").show();
			if($ppt.is(":hidden")) {
				$ppt.css("opacity", 0).show()
			}
			$pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);
			$pp_pic_holder.find(".currentTextHolder").text(set_position + 1 + settings.counter_separator_label + $(pp_images).size());
			$pp_pic_holder.find(".pp_description").show().html(unescape(pp_descriptions[set_position]));
			$pp_pic_holder.fadeIn(function() {
				imgPreloader = "";
				imgPreloader = new Image;
				nextImage = new Image;
				if(isSet && set_position > $(pp_images).size()) {
					nextImage.src = pp_images[set_position + 1];
				}
				prevImage = new Image;
				if(isSet && pp_images[set_position - 1]) {
					prevImage.src = pp_images[set_position - 1];
				}
				$pp_pic_holder.find("#pp_full_res")[0].innerHTML = settings.image_markup;
				$pp_pic_holder.find("#fullResImage").attr("src", pp_images[set_position]);
				imgPreloader.onload = function() {
					correctSizes = _fitToViewport(imgPreloader.width, imgPreloader.height);
					_showContent();
				};
				imgPreloader.onerror = function() {
					alert("Image cannot be loaded. Make sure the path is correct and image exist.");
					$.prettyPhoto.close();
				};
				imgPreloader.src = pp_images[set_position];
				if(!imgPreloader) {
					$pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject;
					_showContent();
				}
			});
			return false
		};
		$.prettyPhoto.changePage = function(direction) {
			currentGalleryPage = 0;
			if(direction == "previous") {
				set_position--;
				if(set_position < 0) {
					set_position = 0;
					return
				}
			}else {
				if(direction == "next") {
					set_position++;
					if(set_position > $(pp_images).size() - 1) {
						set_position = 0;
					}
				}else {
					set_position = direction;
				}
			}
			if(!doresize) {
				doresize = true;
			}
			$(".pp_contract").removeClass("pp_contract").addClass("pp_expand");
			_hideContent(function() {
				$.prettyPhoto.open();
			})
		};
		$.prettyPhoto.changeGalleryPage = function(direction) {
			if(direction == "next") {
				currentGalleryPage++;
				if(currentGalleryPage > totalPage) {
					currentGalleryPage = 0;
				}
			}else {
				if(direction == "previous") {
					currentGalleryPage--;
					if(currentGalleryPage < 0) {
						currentGalleryPage = totalPage;
					}
				}else {
					currentGalleryPage = direction;
				}
			}
			itemsToSlide = currentGalleryPage == totalPage ? pp_images.length - totalPage * itemsPerPage : itemsPerPage;
			$pp_pic_holder.find(".pp_gallery li").each(function(i) {
				$(this).animate({left:i * itemWidth - itemsToSlide * itemWidth * currentGalleryPage})
			});
		};
		$.prettyPhoto.close = function() {
			$("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(settings.animation_speed, function() {
				$(this).remove()
			});
			$pp_overlay.fadeOut(settings.animation_speed, function() {
				if($.browser.msie && $.browser.version == 6) {
					$("select").css("visibility", "visible")
				}
				$(this).remove();
				$(window).unbind("scroll.pp");
				settings.callback();
				doresize = true;
				pp_open = false;
				delete settings
			})
		};
		_showContent = function() {
			$(".pp_loaderIcon").hide();
			$ppt.fadeTo(settings.animation_speed, 1);
			projectedTop = scroll_pos["scrollTop"] + (windowHeight / 2 - correctSizes["containerHeight"] / 2);
			if(projectedTop < 0) {
				projectedTop = 0
			}
			$pp_pic_holder.find(".pp_content").animate({height:correctSizes["contentHeight"]}, settings.animation_speed);
			$pp_pic_holder.animate({top:projectedTop, left:windowWidth / 2 - correctSizes["containerWidth"] / 2, width:correctSizes["containerWidth"]}, settings.animation_speed, function() {
				$pp_pic_holder.find(".pp_hoverContainer,#fullResImage").height(correctSizes["height"]).width(correctSizes["width"]);
				$pp_pic_holder.find(".pp_fade").fadeIn(settings.animation_speed);
				if(isSet && _getFileType(pp_images[set_position]) == "image") {
					$pp_pic_holder.find(".pp_hoverContainer").show()
				}else {
					$pp_pic_holder.find(".pp_hoverContainer").hide()
				}
				if(correctSizes["resized"]) {
					$("a.pp_expand,a.pp_contract").fadeIn(settings.animation_speed)
				}
				settings.changepicturecallback();
				pp_open = true
			});
			_insert_gallery()
		};
		function _hideContent(callback) {
			$pp_pic_holder.find("#pp_full_res object,#pp_full_res embed").css("visibility", "hidden");
			$pp_pic_holder.find(".pp_fade").fadeOut(settings.animation_speed, function() {
				$(".pp_loaderIcon").show();
				callback()
			})
		}
		function _fitToViewport(width, height) {
			resized = false;
			_getDimensions(width, height);
			imageWidth = width, imageHeight = height;
			if((pp_containerWidth > windowWidth || pp_containerHeight > windowHeight) && doresize && settings.allow_resize && !percentBased) {
				resized = true, fitting = false;
				while(!fitting) {
					if(pp_containerWidth > windowWidth) {
						imageWidth = windowWidth - 200;
						imageHeight = height / width * imageWidth
					}else {
						if(pp_containerHeight > windowHeight) {
							imageHeight = windowHeight - 200;
							imageWidth = width / height * imageHeight
						}else {
							fitting = true
						}
					}
					pp_containerHeight = imageHeight, pp_containerWidth = imageWidth
				}
				_getDimensions(imageWidth, imageHeight)
			}
			return{width:Math.floor(imageWidth), height:Math.floor(imageHeight), containerHeight:Math.floor(pp_containerHeight), containerWidth:Math.floor(pp_containerWidth) + 10, contentHeight:Math.floor(pp_contentHeight), contentWidth:Math.floor(pp_contentWidth), resized:resized}
		}
		function _getDimensions(width, height) {
			width = parseFloat(width);
			height = parseFloat(height);
			$pp_details = $pp_pic_holder.find(".pp_details");
			$pp_details.width(width);
			detailsHeight = parseFloat($pp_details.css("marginTop")) + parseFloat($pp_details.css("marginBottom"));
			$pp_details = $pp_details.clone().appendTo($("body")).css({position:"absolute", top:-1E4});
			detailsHeight += $pp_details.height();
			detailsHeight = detailsHeight <= 34 ? 36 : detailsHeight;
			if($.browser.msie && $.browser.version == 7) {
				detailsHeight += 8
			}
			$pp_details.remove();
			pp_contentHeight = height + detailsHeight;
			pp_contentWidth = width;
			pp_containerHeight = pp_contentHeight + $ppt.height() + $pp_pic_holder.find(".pp_top").height() + $pp_pic_holder.find(".pp_bottom").height();
			pp_containerWidth = width
		}
		function _getFileType(itemSrc) {
			return"image"
		}
		function _center_overlay() {
			if(doresize && typeof $pp_pic_holder != "undefined") {
				scroll_pos = _get_scroll();
				titleHeight = $ppt.height(), contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();
				projectedTop = windowHeight / 2 + scroll_pos["scrollTop"] - contentHeight / 2;
				$pp_pic_holder.css({top:projectedTop, left:windowWidth / 2 + scroll_pos["scrollLeft"] - contentwidth / 2})
			}
		}
		function _get_scroll() {
			if(self.pageYOffset) {
				return{scrollTop:self.pageYOffset, scrollLeft:self.pageXOffset}
			}else {
				if(document.documentElement && document.documentElement.scrollTop) {
					return{scrollTop:document.documentElement.scrollTop, scrollLeft:document.documentElement.scrollLeft}
				}else {
					if(document.body) {
						return{scrollTop:document.body.scrollTop, scrollLeft:document.body.scrollLeft}
					}
				}
			}
		}
		function _resize_overlay() {
			windowHeight = $(window).height(), windowWidth = $(window).width();
		}
		function _insert_gallery() {
			if(isSet && settings.overlay_gallery && _getFileType(pp_images[set_position]) == "image") {
				itemWidth = 52 + 5;
				navWidth = 38;
				itemsPerPage = Math.floor((correctSizes["containerWidth"] - 100 - navWidth) / itemWidth);
				itemsPerPage = itemsPerPage < pp_images.length ? itemsPerPage : pp_images.length;
				totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;
				if(totalPage == 0) {
					navWidth = 0;
					$pp_pic_holder.find(".pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous").hide()
				}else {
					$pp_pic_holder.find(".pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous").show()
				}
				galleryWidth = itemsPerPage * itemWidth + navWidth;
				$pp_pic_holder.find(".pp_gallery").width(galleryWidth).css("margin-left", -(galleryWidth / 2));
				$pp_pic_holder.find(".pp_gallery ul").width(itemsPerPage * itemWidth).find("li.selected").removeClass("selected");
				goToPage = Math.floor(set_position / itemsPerPage) <= totalPage ? Math.floor(set_position / itemsPerPage) : totalPage;
				if(itemsPerPage) {
					$pp_pic_holder.find(".pp_gallery").hide().show().removeClass("disabled")
				}else {
					$pp_pic_holder.find(".pp_gallery").hide().addClass("disabled")
				}
				$.prettyPhoto.changeGalleryPage(goToPage);
				$pp_pic_holder.find(".pp_gallery ul li:eq(" + set_position + ")").addClass("selected")
			}else {
				$pp_pic_holder.find(".pp_content").unbind("mouseenter mouseleave");
				$pp_pic_holder.find(".pp_gallery").hide()
			}
		}
		function _buildOverlay(caller) {
			galleryRegExp = /\[(?:.*)\]/;
			isSet = true;
			pp_images = jQuery.map(matchedObjects, function(n, i) {
				return $(n).attr("href")
			});
			pp_thumbs = jQuery.map(matchedObjects, function(n, i) {
				return $(n).find("img").attr("src")
			});
			pp_titles = jQuery.map(matchedObjects, function(n, i) {
				return $(n).find("img").attr("alt") ? $(n).find("img").attr("alt") : ""
			});
			pp_descriptions = jQuery.map(matchedObjects, function(n, i) {
				return $(n).attr("title") ? $(n).attr("title") : ""
			});
			$("body").append(settings.markup);
			$pp_pic_holder = $(".pp_pic_holder"), $ppt = $(".ppt"), $pp_overlay = $("div.pp_overlay");
			if(isSet && settings.overlay_gallery) {
				currentGalleryPage = 0;
				toInject = "";
				for(var i = 0;i < pp_images.length;i++) {
					var regex = new RegExp("(.*?).(jpg|jpeg|png|gif)$");
					var results = regex.exec(pp_thumbs[i]);
					if(!results) {
						classname = "default"
					}else {
						classname = ""
					}
					toInject += "<li class='" + classname + "'><a href='#'><img src='" + pp_thumbs[i] + "' width='50' alt='' /></a></li>"
				}
				toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);
				$pp_pic_holder.find("#pp_full_res").after(toInject);
				$pp_pic_holder.find(".pp_gallery .pp_arrow_next").click(function() {
					$.prettyPhoto.changeGalleryPage("next");
					return false
				});
				$pp_pic_holder.find(".pp_gallery .pp_arrow_previous").click(function() {
					$.prettyPhoto.changeGalleryPage("previous");
					return false
				});
				$pp_pic_holder.find(".pp_content").hover(function() {
					$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn()
				}, function() {
					$pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut()
				});
				itemWidth = 52 + 5;
				$pp_pic_holder.find(".pp_gallery ul li").each(function(i) {
					$(this).css({position:"absolute", left:i * itemWidth});
					$(this).find("a").unbind("click").click(function() {
						$.prettyPhoto.changePage(i);
						return false
					})
				})
			}
			$pp_pic_holder.attr("class", "pp_pic_holder ");
			$pp_overlay.css({opacity:0}).bind("click", function() {
				if(!settings.modal) {
					$.prettyPhoto.close()
				}
			});
			$("a.pp_close").bind("click", function() {
				$.prettyPhoto.close();
				return false
			});
			$pp_pic_holder.find(".pp_previous, .pp_nav .pp_arrow_previous").bind("click", function() {
				$.prettyPhoto.changePage("previous");
				return false
			});
			$pp_pic_holder.find(".pp_next, .pp_nav .pp_arrow_next").bind("click", function() {
				$.prettyPhoto.changePage("next");
				return false
			});
			_center_overlay()
		}
		return this.unbind("click").click($.prettyPhoto.initialize)
	}
})(jQuery);