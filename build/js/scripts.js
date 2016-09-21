/* Chosen v1.6.2 | (c) 2011-2016 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
(function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),title:a.title?a.title:void 0,children:0,disabled:a.disabled,classes:a.className}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,title:a.title?a.title:void 0,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,group_label:null!=b?this.parsed[b].label:null,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers(),this.on_ready())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0,this.include_group_label_in_selected=this.options.include_group_label_in_selected||!1,this.max_shown_results=this.options.max_shown_results||Number.POSITIVE_INFINITY,this.case_sensitive_search=this.options.case_sensitive_search||!1},AbstractChosen.prototype.set_default_text=function(){return this.form_field.getAttribute("data-placeholder")?this.default_text=this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.choice_label=function(a){return this.include_group_label_in_selected&&null!=a.group_label?"<b class='group-name'>"+a.group_label+"</b>"+a.html:a.html},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(a){var b=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return b.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(a){var b=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return b.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f,g,h;for(b="",e=0,h=this.results_data,f=0,g=h.length;g>f&&(c=h[f],d="",d=c.group?this.result_add_group(c):this.result_add_option(c),""!==d&&(e++,b+=d),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(this.choice_label(c))),!(e>=this.max_shown_results));f++);return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match&&this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.style.cssText=a.style,c.setAttribute("data-option-array-index",a.array_index),c.innerHTML=a.search_text,a.title&&(c.title=a.title),this.outerHTML(c)):""},AbstractChosen.prototype.result_add_group=function(a){var b,c;return(a.search_match||a.group_match)&&a.active_options>0?(b=[],b.push("group-result"),a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.innerHTML=a.search_text,a.title&&(c.title=a.title),this.outerHTML(c)):""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.reset_single_select_options=function(){var a,b,c,d,e;for(d=this.results_data,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.selected?e.push(a.selected=!1):e.push(void 0);return e},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(a){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l;for(this.no_results_clear(),d=0,f=this.get_search_text(),a=f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),i=new RegExp(a,"i"),c=this.get_search_regex(a),l=this.results_data,j=0,k=l.length;k>j;j++)b=l[j],b.search_match=!1,e=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(e=this.results_data[b.group_array_index],0===e.active_options&&e.search_match&&(d+=1),e.active_options+=1),b.search_text=b.group?b.label:b.html,(!b.group||this.group_search)&&(b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(d+=1),b.search_match?(f.length&&(g=b.search_text.search(i),h=b.search_text.substr(0,g+f.length)+"</em>"+b.search_text.substr(g+f.length),b.search_text=h.substr(0,g)+"<em>"+h.substr(g)),null!=e&&(e.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>d&&f.length?(this.update_results_content(""),this.no_results(f)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.get_search_regex=function(a){var b,c;return b=this.search_contains?"":"^",c=this.case_sensitive_search?"":"i",new RegExp(b+a,c)},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:case 18:break;default:return this.results_search()}},AbstractChosen.prototype.clipboard_event_checker=function(a){var b=this;return setTimeout(function(){return b.results_search()},50)},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.prototype.search_results_touchstart=function(a){return this.touch_started=!0,this.search_results_mouseover(a)},AbstractChosen.prototype.search_results_touchmove=function(a){return this.touch_started=!1,this.search_results_mouseout(a)},AbstractChosen.prototype.search_results_touchend=function(a){return this.touch_started?this.search_results_mouseup(a):void 0},AbstractChosen.prototype.outerHTML=function(a){var b;return a.outerHTML?a.outerHTML:(b=document.createElement("div"),b.appendChild(a),b.innerHTML)},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)||/IEMobile/i.test(window.navigator.userAgent)||/Windows Phone/i.test(window.navigator.userAgent)||/BlackBerry/i.test(window.navigator.userAgent)||/BB10/i.test(window.navigator.userAgent)||/Android.*Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(c){var d,e;return d=a(this),e=d.data("chosen"),"destroy"===b?void(e instanceof Chosen&&e.destroy()):void(e instanceof Chosen||d.data("chosen",new Chosen(this,b)))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior()},Chosen.prototype.on_ready=function(){return this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("touchstart.chosen",function(b){return a.container_mousedown(b),b.preventDefault()}),this.container.bind("touchend.chosen",function(b){return a.container_mouseup(b),b.preventDefault()}),this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.search_results.bind("touchstart.chosen",function(b){a.search_results_touchstart(b)}),this.search_results.bind("touchmove.chosen",function(b){a.search_results_touchmove(b)}),this.search_results.bind("touchend.chosen",function(b){a.search_results_touchend(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.form_field_jq.bind("chosen:close.chosen",function(b){a.input_blur(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.search_field.bind("cut.chosen",function(b){a.clipboard_event_checker(b)}),this.search_field.bind("paste.chosen",function(b){a.clipboard_event_checker(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(this.container[0].ownerDocument).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b;return a.originalEvent&&(b=a.originalEvent.deltaY||-a.originalEvent.wheelDelta||a.originalEvent.detail),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(a){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){var c;return c=a(b.target).closest(".chosen-container"),c.length&&this.container[0]===c[0]?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results(),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}))},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(a){var b;return this.form_field.tabIndex?(b=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=b):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+this.choice_label(b)+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.reset_single_select_options(),this.form_field.options[0].selected=!0,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):this.reset_single_select_options(),b.addClass("result-selected"),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(this.choice_label(c)),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.show_search_field_default(),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,a.preventDefault(),this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").html(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c),this.form_field_jq.trigger("chosen:no_results",{chosen:this})},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:this.results_showing&&a.preventDefault();break;case 32:this.disable_search&&a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}).call(this);
if("document"in self){if(!("classList"in document.createElement("_"))||document.createElementNS&&!("classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))){(function(t){"use strict";if(!("Element"in t))return;var e="classList",i="prototype",n=t.Element[i],s=Object,r=String[i].trim||function(){return this.replace(/^\s+|\s+$/g,"")},a=Array[i].indexOf||function(t){var e=0,i=this.length;for(;e<i;e++){if(e in this&&this[e]===t){return e}}return-1},o=function(t,e){this.name=t;this.code=DOMException[t];this.message=e},l=function(t,e){if(e===""){throw new o("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(e)){throw new o("INVALID_CHARACTER_ERR","String contains an invalid character")}return a.call(t,e)},c=function(t){var e=r.call(t.getAttribute("class")||""),i=e?e.split(/\s+/):[],n=0,s=i.length;for(;n<s;n++){this.push(i[n])}this._updateClassName=function(){t.setAttribute("class",this.toString())}},u=c[i]=[],f=function(){return new c(this)};o[i]=Error[i];u.item=function(t){return this[t]||null};u.contains=function(t){t+="";return l(this,t)!==-1};u.add=function(){var t=arguments,e=0,i=t.length,n,s=false;do{n=t[e]+"";if(l(this,n)===-1){this.push(n);s=true}}while(++e<i);if(s){this._updateClassName()}};u.remove=function(){var t=arguments,e=0,i=t.length,n,s=false,r;do{n=t[e]+"";r=l(this,n);while(r!==-1){this.splice(r,1);s=true;r=l(this,n)}}while(++e<i);if(s){this._updateClassName()}};u.toggle=function(t,e){t+="";var i=this.contains(t),n=i?e!==true&&"remove":e!==false&&"add";if(n){this[n](t)}if(e===true||e===false){return e}else{return!i}};u.toString=function(){return this.join(" ")};if(s.defineProperty){var h={get:f,enumerable:true,configurable:true};try{s.defineProperty(n,e,h)}catch(d){if(d.number===-2146823252){h.enumerable=false;s.defineProperty(n,e,h)}}}else if(s[i].__defineGetter__){n.__defineGetter__(e,f)}})(self)}else{(function(){"use strict";var t=document.createElement("_");t.classList.add("c1","c2");if(!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var i,n=arguments.length;for(i=0;i<n;i++){t=arguments[i];e.call(this,t)}}};e("add");e("remove")}t.classList.toggle("c3",false);if(t.classList.contains("c3")){var i=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){if(1 in arguments&&!this.contains(t)===!e){return e}else{return i.call(this,t)}}}t=null})()}}

var latinNames = [{"Alpine Swift":"Apus melba"},{"American Wigeon":"Anas americana"},{"Aquatic Warbler":"Acrocephalus paludicola"},{"Arctic Skua":"Stercorarius parasiticus"},{"Arctic Tern":"Sterna paradisaea"},{"Avocet":"Recurvirostra avosetta"},{"Bar-tailed Godwit":"Limosa lapponica"},{"Barn Owl":"Tyto alba"},{"Barnacle Goose":"Branta leucopsis"},{"Bearded Tit":"Panurus biarmicus"},{"Bewick's Swan":"Cygnus columbianus"},{"Bittern":"Botaurus stellaris"},{"Black Grouse":"Tetrao tetrix"},{"Black Kite":"Milvus migrans"},{"Black Redstart":"Phoenicurus ochruros"},{"Black Tern":"Chlidonias niger"},{"Black-headed Gull":"Chroicocephalus ridibundus"},{"Black-necked Grebe":"Podiceps nigricollis"},{"Black-tailed Godwit":"Limosa limosa"},{"Black-throated Thrush":"Turdus atrogularis"},{"Black-winged Stilt":"Himantopus himantopus"},{"Blackbird":"Turdus merula"},{"Blackcap":"Sylvia atricapilla"},{"Blue Tit":"Cyanistes caeruleus"},{"Bluethroat":"Luscinia svecica"},{"Bonaparte's Gull":"Chroicocephalus philadelphia"},{"Brambling":"Fringilla montifringilla"},{"Brent Goose":"Branta bernicla"},{"Bullfinch":"Pyrrhula pyrrhula"},{"Buzzard":"Buteo buteo"},{"Canada Goose":"Branta canadensis"},{"Carrion Crow":"Corvus corone"},{"Caspian Gull":"Larus cachinnans"},{"Cattle Egret":"Bubulcus ibis"},{"Cetti's Warbler":"Cettia cetti"},{"Chaffinch":"Fringilla coelebs"},{"Chiffchaff":"Phylloscopus collybita"},{"Chough":"Pyrrhocorax pyrrhocorax"},{"Cirl Bunting":"Emberiza cirlus"},{"Coal Tit":"Periparus ater"},{"Collared Dove":"Streptopelia decaocto"},{"Common Gull":"Larus canus"},{"Common Rosefinch":"Carpodacus erythrinus"},{"Common Sandpiper":"Actitis hypoleucos"},{"Common Scoter":"Melanitta nigra"},{"Common Tern":"Sterna hirundo"},{"Coot":"Fulica atra"},{"Cormorant":"Phalacrocorax carbo"},{"Corn Bunting":"Emberiza calandra"},{"Corncrake":"Crex crex"},{"Crane":"Grus grus"},{"Cuckoo":"Cuculus canorus"},{"Curlew":"Numenius arquata"},{"Curlew Sandpiper":"Calidris ferruginea"},{"Dartford Warbler":"Sylvia undata"},{"Dipper":"Cinclus cinclus"},{"Dotterel":"Charadrius morinellus"},{"Dunlin":"Calidris alpina"},{"Dunnock":"Prunella modularis"},{"Egyptian Goose":"Alopochen aegyptiaca"},{"Eider":"Somateria mollissima"},{"Feral Pigeon":"Columba livia"},{"Fieldfare":"Turdus pilaris"},{"Firecrest":"Regulus ignicapilla"},{"Fulmar":"Fulmarus glacialis"},{"Gadwall":"Anas strepera"},{"Gannet":"Morus bassanus"},{"Garden Warbler":"Sylvia borin"},{"Garganey":"Anas querquedula"},{"Glaucous Gull":"Larus hyperboreus"},{"Glossy Ibis":"Plegadis falcinellus"},{"Goldcrest":"Regulus regulus"},{"Golden Oriole":"Oriolus oriolus"},{"Golden Pheasant":"Chrysolophus pictus"},{"Golden Plover":"Pluvialis apricaria"},{"Goldeneye":"Bucephala clangula"},{"Goldfinch":"Carduelis carduelis"},{"Goosander":"Mergus merganser"},{"Goshawk":"Accipiter gentilis"},{"Grasshopper Warbler":"Locustella naevia"},{"Great Black-backed Gull":"Larus marinus"},{"Great Bustard":"Otis tarda"},{"Great Crested Grebe":"Podiceps cristatus"},{"Great Grey Shrike":"Lanius excubitor"},{"Great Northern Diver":"Gavia immer"},{"Great Reed Warbler":"Acrocephalus arundinaceus"},{"Great Skua":"Stercorarius skua"},{"Great Spotted Woodpecker":"Dendrocopos major"},{"Great Tit":"Parus major"},{"Great White Egret":"Ardea alba"},{"Green Sandpiper":"Tringa ochropus"},{"Green Woodpecker":"Picus viridis"},{"Green-winged Teal":"Anas carolinensis"},{"Greenfinch":"Chloris chloris"},{"Greenshank":"Tringa nebularia"},{"Grey Heron":"Ardea cinerea"},{"Grey Partridge":"Perdix perdix"},{"Grey Phalarope":"Phalaropus fulicarius"},{"Grey Plover":"Pluvialis squatarola"},{"Grey Wagtail":"Motacilla cinerea"},{"Greylag Goose":"Anser anser"},{"Guillemot":"Uria aalge"},{"Gyr Falcon":"Falco rusticolus"},{"Hawfinch":"Coccothraustes coccothraustes"},{"Hen Harrier":"Circus cyaneus"},{"Herring Gull":"Larus argentatus"},{"Hobby":"Falco subbuteo"},{"Hooded Crow":"Corvus cornix"},{"Hoopoe":"Upupa epops"},{"House Martin":"Delichon urbicum"},{"House Sparrow":"Passer domesticus"},{"Iceland Gull":"Larus glaucoides"},{"Icterine Warbler":"Hippolais icterina"},{"Jack Snipe":"Lymnocryptes minimus"},{"Jackdaw":"Corvus monedula"},{"Jay":"Garrulus glandarius"},{"Kentish Plover":"Charadrius alexandrinus"},{"Kestrel":"Falco tinnunculus"},{"Kingfisher":"Alcedo atthis"},{"Kittiwake":"Rissa tridactyla"},{"Knot":"Calidris canutus"},{"Lapland Bunting":"Calcarius lapponicus"},{"Lapwing":"Vanellus vanellus"},{"Laughing Gull":"Larus atricilla"},{"Lesser Black-backed Gull":"Larus fuscus"},{"Lesser Redpoll":"Carduelis cabaret"},{"Lesser Spotted Woodpecker":"Dendrocopos minor"},{"Lesser Whitethroat":"Sylvia curruca"},{"Lesser Yellowlegs":"Tringa flavipes"},{"Linnet":"Carduelis cannabina"},{"Little Auk":"Alle alle"},{"Little Bunting":"Emberiza pusilla"},{"Little Egret":"Egretta garzetta"},{"Little Grebe":"Tachybaptus ruficollis"},{"Little Gull":"Hydrocoloeus minutus"},{"Little Owl":"Athene noctua"},{"Little Ringed Plover":"Charadrius dubius"},{"Little Stint":"Calidris minuta"},{"Little Tern":"Sternula albifrons"},{"Long-eared Owl":"Asio otus"},{"Long-tailed Duck":"Clangula hyemalis"},{"Long-tailed Skua":"Stercorarius longicaudus"},{"Long-tailed Tit":"Aegithalos caudatus"},{"Magpie":"Pica pica"},{"Mallard":"Anas platyrhynchos"},{"Manx Shearwater":"Puffinus puffinus"},{"Marsh Harrier":"Circus aeruginosus"},{"Marsh Tit":"Poecile palustris"},{"Marsh Warbler":"Acrocephalus palustris"},{"Meadow Pipit":"Anthus pratensis"},{"Mediterranean Gull":"Larus melanocephalus"},{"Melodious Warbler":"Hippolais polyglotta"},{"Merlin":"Falco columbarius"},{"Mistle Thrush":"Turdus viscivorus"},{"Montagu's Harrier":"Circus pygargus"},{"Moorhen":"Gallinula chloropus"},{"Mute Swan":"Cygnus olor"},{"Nightingale":"Luscinia megarhynchos"},{"Nightjar":"Caprimulgus europaeus"},{"Nuthatch":"Sitta europaea"},{"Olive-backed Pipit":"Anthus hodgsoni"},{"Ortolan Bunting":"Emberiza hortulana"},{"Osprey":"Pandion haliaetus"},{"Oystercatcher":"Haematopus ostralegus"},{"Paddyfield Warbler":"Acrocephalus agricola"},{"Pallas's Warbler":"Phylloscopus proregulus"},{"Pectoral Sandpiper":"Calidris melanotos"},{"Penduline Tit":"Remiz pendulinus"},{"Peregrine":"Falco peregrinus"},{"Pheasant":"Phasianus colchicus"},{"Pied Flycatcher":"Ficedula hypoleuca"},{"Pied Wagtail":"Motacilla alba"},{"Pink-footed Goose":"Anser brachyrhynchus"},{"Pintail":"Anas acuta"},{"Pochard":"Aythya ferina"},{"Pomarine Skua":"Stercorarius pomarinus"},{"Puffin":"Fratercula arctica"},{"Purple Heron":"Ardea purpurea"},{"Purple Sandpiper":"Calidris maritima"},{"Quail":"Coturnix coturnix"},{"Raven":"Corvus corax"},{"Razorbill":"Alca torda"},{"Red Kite":"Milvus milvus"},{"Red-backed Shrike":"Lanius collurio"},{"Red-breasted Goose":"Branta ruficollis"},{"Red-breasted Merganser":"Mergus serrator"},{"Red-crested Pochard":"Netta rufina"},{"Red-footed Falcon":"Falco vespertinus"},{"Red-legged Partridge":"Alectoris rufa"},{"Red-necked Grebe":"Podiceps grisegena"},{"Red-necked Phalarope":"Phalaropus lobatus"},{"Red-rumped Swallow":"Cecropis daurica"},{"Red-throated Pipit":"Anthus cervinus"},{"Redshank":"Tringa totanus"},{"Redstart":"Phoenicurus phoenicurus"},{"Redwing":"Turdus iliacus"},{"Reed Bunting":"Emberiza schoeniclus"},{"Reed Warbler":"Acrocephalus scirpaceus"},{"Ring Ouzel":"Turdus torquatus"},{"Ring-billed Gull":"Larus delawarensis"},{"Ring-necked Duck":"Aythya collaris"},{"Ring-necked Parakeet":"Psittacula krameri"},{"Ringed Plover":"Charadrius hiaticula"},{"Robin":"Erithacus rubecula"},{"Rock Pipit":"Anthus petrosus"},{"Rook":"Corvus frugilegus"},{"Rose-coloured Starling":"Pastor roseus"},{"Roseate Tern":"Sterna dougallii"},{"Rough-legged Buzzard":"Buteo lagopus"},{"Ruddy Duck":"Oxyura jamaicensis"},{"Ruddy Shelduck":"Tadorna ferruginea"},{"Ruff":"Philomachus pugnax"},{"Sand Martin":"Riparia riparia"},{"Sanderling":"Calidris alba"},{"Sandwich Tern":"Sterna sandvicensis"},{"Savi's Warbler":"Locustella luscinioides"},{"Scaup":"Aythya marila"},{"Sedge Warbler":"Acrocephalus schoenobaenus"},{"Serin":"Serinus serinus"},{"Shag":"Phalacrocorax aristotelis"},{"Shelduck":"Tadorna tadorna"},{"Short-eared Owl":"Asio flammeus"},{"Short-toed Lark":"Calandrella brachydactyla"},{"Shoveler":"Anas clypeata"},{"Siberian Stonechat":""},{"Siskin":"Carduelis spinus"},{"Skylark":"Alauda arvensis"},{"Slavonian Grebe":"Podiceps auritus"},{"Smew":"Mergellus albellus"},{"Snipe":"Gallinago gallinago"},{"Snow Bunting":"Plectrophenax nivalis"},{"Snow Goose":"Anser caerulescens"},{"Song Thrush":"Turdus philomelos"},{"Sparrowhawk":"Accipiter nisus"},{"Spoonbill":"Platalea leucorodia"},{"Spotted Crake":"Porzana porzana"},{"Spotted Flycatcher":"Muscicapa striata"},{"Spotted Redshank":"Tringa erythropus"},{"Starling":"Sturnus vulgaris"},{"Stock Dove":"Columba oenas"},{"Stone Curlew":"Burhinus oedicnemus"},{"Stonechat":"Saxicola torquatus"},{"Storm Petrel":"Hydrobates pelagicus"},{"Swallow":"Hirundo rustica"},{"Swift":"Apus apus"},{"Tawny Owl":"Strix aluco"},{"Teal":"Anas crecca"},{"Tree Pipit":"Anthus trivialis"},{"Tree Sparrow":"Passer montanus"},{"Treecreeper":"Certhia familiaris"},{"Tufted Duck":"Aythya fuligula"},{"Turnstone":"Arenaria interpres"},{"Turtle Dove":"Streptopelia turtur"},{"Twite":"Carduelis flavirostris"},{"Velvet Scoter":"Melanitta fusca"},{"Water Pipit":"Anthus spinoletta"},{"Water Rail":"Rallus aquaticus"},{"Waxwing":"Bombycilla garrulus"},{"Wheatear":"Oenanthe oenanthe"},{"Whimbrel":"Numenius phaeopus"},{"Whinchat":"Saxicola rubetra"},{"Whiskered Tern":"Chlidonias hybrida"},{"White Stork":"Ciconia ciconia"},{"White-winged Black Tern":"Chlidonias leucopterus"},{"Whitethroat":"Sylvia communis"},{"Whooper Swan":"Cygnus cygnus"},{"Wigeon":"Anas penelope"},{"Willow Tit":"Poecile montana"},{"Willow Warbler":"Phylloscopus trochilus"},{"Wood Duck":"Aix sponsa"},{"Wood Sandpiper":"Tringa glareola"},{"Wood Warbler":"Phylloscopus sibilatrix"},{"Woodchat Shrike":"Lanius senator"},{"Woodcock":"Scolopax rusticola"},{"Woodlark":"Lullula arborea"},{"Woodpigeon":"Columba palumbus"},{"Wren":"Troglodytes troglodytes"},{"Wryneck":"Jynx torquilla"},{"Yellow Wagtail":"Motacilla flava"},{"Yellow-browed Warbler":"Phylloscopus inornatus"},{"Yellow-legged Gull":"Larus michahellis"},{"Yellowhammer":"Emberiza citrinella"}];
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-touchevents-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],d={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase(),h=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];d._prefixes=h;var m=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);
var speciesList = ["Alpine Swift",
"American Golden Plover",
"American Herring Gull",
"American Robin",
"American Wigeon",
"Aquatic Warbler",
"Arctic Skua",
"Arctic Tern",
"Avocet",
"Balearic Shearwater",
"Bar-headed Goose",
"Bar-tailed Godwit",
"Barn Owl",
"Barnacle Goose",
"Barred Warbler",
"Bearded Tit",
"Bee-eater",
"Bewick's Swan",
"Bittern",
"Black Grouse",
"Black Guillemot",
"Black Kite",
"Black Redstart",
"Black Stork",
"Black Swan",
"Black Tern",
"Black-headed Gull",
"Black-necked Grebe",
"Black-tailed Godwit",
"Black-throated Diver",
"Black-throated Thrush",
"Black-winged Red Bishop",
"Black-winged Stilt",
"Blackbird",
"Blackcap",
"Blue Tit",
"Blue-cheeked Bee-eater",
"Bluethroat",
"Blythe's Reed Warbler",
"Bonaparte's Gull",
"Booted Warbler",
"Brambling",
"Brent Goose",
"Brent Goose (Black Brant)",
"Budgerigar",
"Buff-breasted Sandpiper",
"Bullfinch",
"Buzzard",
"Californian Quail",
"Canada Goose",
"Carrion Crow",
"Carrion-Hooded Crow (unspecified)",
"Caspian Gull",
"Cattle Egret",
"Cetti's Warbler",
"Chaffinch",
"Chiffchaff",
"Chiloe Wigeon",
"Chough",
"Cirl Bunting",
"Coal Tit",
"Cockatiel",
"Collared Dove",
"Common Crossbill",
"Common Gull",
"Common Redpoll",
"Common Rosefinch",
"Common Sandpiper",
"Common Scoter",
"Common Tern",
"Common/Arctic Tern",
"Common/Lesser Redpoll",
"Coot",
"Cormorant",
"Cormorant (Continental)",
"Corn Bunting",
"Corncrake",
"Cory's Shearwater",
"Crane",
"Crested Duck",
"Cuckoo",
"Curlew",
"Curlew Sandpiper",
"Dark-bellied Brent Goose",
"Dartford Warbler",
"Desert Wheatear",
"Dipper",
"Domestic Canary",
"Domestic Mallard",
"Dotterel",
"Dunlin",
"Dunnock",
"Dusky Warbler",
"Egyptian Goose",
"Eider",
"Eider (Northern - borealis)",
"Eurasian Eagle-owl",
"European White-fronted Goose",
"Falcated Duck",
"Fea's Petrel",
"Feral Pigeon",
"Fieldfare",
"Firecrest",
"Fulmar",
"Gadwall",
"Gannet",
"Garden Warbler",
"Garganey",
"Glaucous Gull",
"Glossy Ibis",
"Goldcrest",
"Golden Oriole",
"Golden Pheasant",
"Golden Plover",
"Goldeneye",
"Goldfinch",
"Goosander",
"Goshawk",
"Grasshopper Warbler",
"Great Black-backed Gull",
"Great Bustard",
"Great Crested Grebe",
"Great Grey Shrike",
"Great Northern Diver",
"Great Reed Warbler",
"Great Shearwater",
"Great Skua",
"Great Spotted Woodpecker",
"Great Tit",
"Great White Egret",
"Greater Blue-eared Starling",
"Green Sandpiper",
"Green Woodpecker",
"Green-winged Teal",
"Greenfinch",
"Greenland White-fronted Goose",
"Greenshank",
"Grey Heron",
"Grey Partridge",
"Grey Phalarope",
"Grey Plover",
"Grey Wagtail",
"Greylag Goose",
"Greylag Goose (Domestic)",
"Greylag Goose (naturalised)",
"Guillemot",
"Gull-billed Tern",
"Gyr Falcon",
"Harris's Hawk",
"Hawfinch",
"Helmeted Guineafowl",
"Hen Harrier",
"Herring Gull",
"Hobby",
"Honey-buzzard",
"Hooded Crow",
"Hoopoe",
"House Finch",
"House Martin",
"House Sparrow",
"Hybrid Duck",
"Hybrid Goose",
"Iceland Gull",
"Iceland Gull (Kumlien's)",
"Icterine Warbler",
"Indian Peafowl",
"Jack Snipe",
"Jackdaw",
"Jay",
"Kentish Plover",
"Kestrel",
"King Eider",
"Kingfisher",
"Kittiwake",
"Knot",
"Lady Amherst's Pheasant",
"Lanner Falcon",
"Lapland Bunting",
"Lapwing",
"Laughing Gull",
"Leach's Petrel",
"Lesser Black-backed Gull",
"Lesser Redpoll",
"Lesser Spotted Woodpecker",
"Lesser Whitethroat",
"Lesser Yellowlegs",
"Light-bellied Brent Goose",
"Linnet",
"Little Auk",
"Little Bunting",
"Little Crake",
"Little Egret",
"Little Grebe",
"Little Gull",
"Little Owl",
"Little Ringed Plover",
"Little Stint",
"Little Tern",
"Long-billed Dowitcher",
"Long-eared Owl",
"Long-tailed Duck",
"Long-tailed Skua",
"Long-tailed Tit",
"Macaronesian Shearwater",
"Magpie",
"Mallard",
"Mandarin",
"Manx Shearwater",
"Marsh Harrier",
"Marsh Sandpiper",
"Marsh Tit",
"Marsh Warbler",
"Meadow Pipit",
"Mediterranean Gull",
"Melodious Warbler",
"Merlin",
"Mistle Thrush",
"Montagu's Harrier",
"Moorhen",
"Muscovy Duck",
"Mute Swan",
"Night-heron",
"Nightingale",
"Nightjar",
"Nuthatch",
"Olive-backed Pipit",
"Ortolan Bunting",
"Osprey",
"Oystercatcher",
"Paddyfield Warbler",
"Pallas's Warbler",
"Peach-faced Lovebird",
"Pectoral Sandpiper",
"Penduline Tit",
"Peregrine",
"Pheasant",
"Pied Flycatcher",
"Pied Wagtail",
"Pied Wheatear",
"Pied/White Wagtail",
"Pink-footed Goose",
"Pintail",
"Pochard",
"Pomarine Skua",
"Puffin",
"Purple Heron",
"Purple Sandpiper",
"Quail",
"Radde's Warbler",
"Raven",
"Razorbill",
"Red Grouse",
"Red Kite",
"Red-backed Shrike",
"Red-breasted Flycatcher",
"Red-breasted Goose",
"Red-breasted Merganser",
"Red-crested Pochard",
"Red-eyed Vireo",
"Red-flanked Bluetail",
"Red-footed Falcon",
"Red-legged Partridge",
"Red-necked Grebe",
"Red-necked Phalarope",
"Red-rumped Swallow",
"Red-throated Diver",
"Red-throated Pipit",
"Redshank",
"Redstart",
"Redwing",
"Reed Bunting",
"Reed Warbler",
"Reeve's Pheasant",
"Richard's Pipit",
"Ring Ouzel",
"Ring-billed Gull",
"Ring-necked Duck",
"Ring-necked Parakeet",
"Ringed Plover",
"Ringed Teal",
"Robin",
"Rock Dove",
"Rock Pipit",
"Rock Pipit (Scandinavian - littoralis)",
"Rook",
"Rose-coloured Starling",
"Roseate Tern",
"Rough-legged Buzzard",
"Ruddy Duck",
"Ruddy Shelduck",
"Ruff",
"Sabine's Gull",
"Sacred Ibis",
"Saker Falcon",
"Sand Martin",
"Sanderling",
"Sandwich Tern",
"Sardinian Warbler",
"Savi's Warbler",
"Scaup",
"Sedge Warbler",
"Semipalmated Sandpiper",
"Serin",
"Shag",
"Shelduck",
"Short-eared Owl",
"Short-toed Eagle",
"Short-toed Lark",
"Shoveler",
"Siberian Stonechat",
"Siskin",
"Skylark",
"Slavonian Grebe",
"Smew",
"Snipe",
"Snow Bunting",
"Snow Goose",
"Solitary Sandpiper",
"Song Thrush",
"Sooty Shearwater",
"Sparrowhawk",
"Spoonbill",
"Spotted Crake",
"Spotted Flycatcher",
"Spotted Redshank",
"Spotted Sandpiper",
"Starling",
"Stock Dove",
"Stone Curlew",
"Stonechat",
"Storm Petrel",
"Subalpine Warbler",
"Surf Scoter",
"Swallow",
"Swan Goose (Chinese Goose)",
"Swift",
"Tawny Owl",
"Tawny Pipit",
"Teal",
"Temmink's Stint",
"Tree Pipit",
"Tree Sparrow",
"Treecreeper",
"Trumpeter Finch",
"Tufted Duck",
"Turnstone",
"Turtle Dove",
"Twite",
"Velvet Scoter",
"Water Pipit",
"Water Rail",
"Waxwing",
"Western Bonelli's Warbler",
"Wheatear",
"Wheatear (Greenland)",
"Whimbrel",
"Whinchat",
"Whiskered Tern",
"White Stork",
"White Wagtail",
"White-fronted Goose",
"White-rumped Sandpiper",
"White-winged Black Tern",
"Whitethroat",
"Whooper Swan",
"Wigeon",
"Willow Tit",
"Willow Warbler",
"Wilson's Phalarope",
"Wood Duck",
"Wood Sandpiper",
"Wood Warbler",
"Woodchat Shrike",
"Woodcock",
"Woodlark",
"Woodpigeon",
"Wren",
"Wryneck",
"Yellow Wagtail",
"Yellow Wagtail (Blue-headed)",
"Yellow Wagtail (flavissima)",
"Yellow-browed Warbler",
"Yellow-legged Gull",
"Yellow-rumped Warbler",
"Yellowhammer",
"Zebra Finch",
"hybrid Aythya",
"unidentified auk",
"unidentified diver",
"unidentified goose",
"unidentified grebe",
"unidentified shearwater",
"unidentified skua",
"unknown Stonechat sp"];
var tenkSpecies = ['Red Kite', 'Marsh Harrier', 'Little Ringed Plover', 'Dunlin', 'Common Sandpiper', 'Hobby', 'Peregrine', 'Woodlark', 'Lesser Spotted Woodpecker'];








/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
tenkSpecies.js
*/



function MapModule(domContext) {
    this.context = domContext;
    this.tetrad = {
        active: false,
        currentList: ''
    };
}

MapModule.prototype.setDataset = function(dataset) {
    this.dataset = dataset;
    document.getElementById(this.context).setAttribute('data-set', dataset);
};

MapModule.prototype.setSpecies = function(species) {
    this.species = species;
};

MapModule.prototype.setFetchingData = function(status) {
    this.fetchingData = status;
};

MapModule.prototype.setTetradStatus = function(tetradId, id) {
    this.tetrad = {
        active : tetradId,
        domId : id
    };

    document.getElementById(this.context).classList.add('tetrad-active');
};

MapModule.prototype.logModule = function() {
    console.log(this);
};

MapModule.prototype.setGoogleMapLink = function() {

    var gMapWrap = $('#' + this.context).find('.gmap-link');
    gMapWrap.empty();

    if (this.tetrad.active) {
        var url = window.location.href;
        var gMapLink = $('<a/>', {
            'href': url + 'gmap/?tetrad=' + this.tetrad.active + '',
            'target': '_blank',
            'class': 'gmap',
            'html': 'Generate Google Map'
        });

        gMapLink.appendTo(gMapWrap);
    }
};

MapModule.prototype.templateTetradList = function(data) {
    var tetradList = document.createElement('ol');
    tetradList.classList.add('tetrad-list');

    // lookup the index, retreive the Code value and template the list item
    var theCode, el, spanEl;
    for (var i = 0; i < data.length; i++) {
        theCode = data[i].Code;
        el = document.createElement('li');
        el.innerHTML = data[i].Species.trim();
        spanEl = document.createElement('span');
        spanEl.classList.add('code-' + theCode);
        el.appendChild(spanEl);
        tetradList.appendChild(el);
    }

    return tetradList;
}

/* GETTING DATA */

MapModule.prototype.getTetradData = function() {

    if (!this.tetrad.active) { return false; }

    this.startSpinner(['tetrad-meta']);

    this.tetrad.currentList = "";

    var obj = this;

    this.startUpdatingEls();

    var postData = {
        "tetradId" : this.tetrad.active,
        "data-set" : this.dataset
    };

    $.ajax({
        url: config.folder + config.themeUrl + '/ajax/tetradData.php',
        type: 'POST',
        dataType: 'json',
        data: postData,
        timeout: 12000
    })
    .done(function(data){
        obj.tetrad.counts = obj.getSums(data);
        // store on the MapModule object for DOM update later
        obj.tetrad.currentList = obj.templateTetradList(data);

        //  A procedure for soting the list alphabetically
        // // get the list of names
        // var orginalList = [];

        // for (var i = 0; i < data.length; i++) {
        //     orginalList.push(data[i]['Species']);
        // }
        // // sort the list to new arr
        // var sortList = [];
        // for (var i = 0; i < data.length; i++) {
        //     sortList.push(data[i]['Species']);
        // }
        // sortList.sort();

        // var tetradList = document.createElement('ol');
        // tetradList.classList.add('tetrad-list');

        // // lookup the index, retreive the Code value and template the list item
        // var theCode, el, spanEl;
        // for (var i = 0; i < sortList.length; i++) {
        //     theCode = data[orginalList.indexOf(sortList[i])]['Code'];
        //     el = document.createElement('li');
        //     el.innerHTML = sortList[i].trim();
        //     spanEl = document.createElement('span');
        //     spanEl.classList.add('code-' + theCode);
        //     el.appendChild(spanEl);
        //     tetradList.appendChild(el);
        // }

        // obj.tetrad.currentList = tetradList;
        // // truncate arrays
        // orginalList.length = 0;
        // sortList.length = 0;

    })
    .done(function(data) {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['tetrad-meta']);
            // obj.updateStateEls.stop.call(obj, obj.context);
            obj.stopUpdatingEls();
            obj.setFetchingData(false);
        }, 800);
    })
    .fail(function() {
        console.log("getTetradData - error");
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['tetrad-meta']);
            obj.setMapErrorMsg(true, 'tetrad-request');
        }, 800);
    })
    .always(function() {
        // console.log("getTetradData - complete");
    });

};

MapModule.prototype.filterForTenkSpecies = function() {

    if (tenkSpecies.length && tenkSpecies.indexOf(this.species) >= 0) {
        if (this.dataset === 'dbreed') {
            this.tenkSpecies = true;
            this.setDataset('dbreed10');
            console.log('filterForTenkSpecies: ', this.dataset);
        }

        return false;
    }


    this.tenkSpecies = false;
    if ( typeof mapPage !== 'undefined' && mapPage ) {
        var currentDataSet = document.getElementById(this.context).querySelector('.select-data-set');
        this.setDataset(currentDataSet.value);
    }

};


MapModule.prototype.getData = function() {

    this.filterForTenkSpecies();

    var obj = this;

    var formData = {
        "species" : this.species,
        "data-set" : this.dataset
    };

    this.startUpdatingEls();

    $.ajax({
            url: config.folder + config.themeUrl + '/ajax/speciesData.php',
            type: 'POST',
            dataType: 'json',
            data:  formData,
            timeout: 12000
        })
        .done(function(data) {
            // remove previous results using currentTetradArr
            var prevResults = JSON.parse(sessionStorage.getItem(obj.context + "currentTetradArr"));

            if (Array.isArray(prevResults) && prevResults.length)  {
                for (var i = 0; i < prevResults.length; i++) {
                    var prevTetrad = document.getElementById(obj.context + prevResults[i]);
                    if (prevTetrad) {
                        prevTetrad.className = '';
                    }
                }
            }

            var tetArr = [];
            for (var i = 0; i < data.length; i++) {
                tetArr.push(data[i]['Tetrad']);
                sessionStorage.setItem(obj.context + "currentTetradArr", JSON.stringify(tetArr));
            }

            // add classes to matching tetrads
            for (var i = 0; i < tetArr.length; i++) {
                var tetrad = document.getElementById(obj.context + tetArr[i]);
                if (tetrad) {
                    tetrad.classList.add('pres', 'code-' + data[i]['Code']);
                }
            }

        })
        .done(function(data) {
            // refresh active tetrad
            if (obj.tetrad.active) {
                $('#' + obj.tetrad.domId).addClass('selected');
            }

            obj.counts = obj.getSums(data);
        })
        .done(function() {
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                // obj.updateStateEls.stop.call(obj, obj.context);
                obj.stopUpdatingEls();
                obj.setFetchingData(false);
            }, 800);
        })
        .done(function(){
            obj.logModule();
        })
        .fail(function() {
            console.log("getData - error");
            window.setTimeout(function(){
                obj.stopSpinner.call(obj, ['map','tetrad-meta']);
                obj.setMapErrorMsg(true, 'data-request');
            }, 800);
        })
        .always(function() {
        });

};

MapModule.prototype.getSums = function(data) {
    var sumConfirmed = 0,
        sumProbable = 0,
        sumPossible = 0,
        sumPresent = 0;
    if (this.dataset === 'dbreed' || this.dataset === 'sitters') {
        for (var i = 0; i < data.length; i++) {
            if (data[i]['Code'] === 'A') {sumConfirmed++;}
            if (data[i]['Code'] === 'B') {sumProbable++;}
            if (data[i]['Code'] === 'K') {sumPossible++;}
            if (data[i]['Code'] === 'N') {sumPresent++;}
        }
    }

    return {
        total: data.length + 1,
        sumPresent: sumPresent,
        sumPossible: sumPossible,
        sumProbable: sumProbable,
        sumConfirmed: sumConfirmed
    };
};

MapModule.prototype.getLatinName = function() {

    if (typeof latinNames !== 'undefined' && latinNames.length) {

        for (var i = 0; i < latinNames.length; i++) {

            for(var key in latinNames[i]) {

                if( latinNames[i].hasOwnProperty(key)) {
                    if (key == this.species) {
                        return latinNames[i][key];
                    }
                }
            }
        }
    }
    return false;
};



/* DOM */

MapModule.prototype.setMapErrorMsg = function(status, context) {

    var $container;

    context === "tetrad-request" ? $container = $('.tetrad-meta') : $container = $('.map-container');

    var $errorMsg = $('#' + this.context).find($container).find('.error-wrap');
    if (status) {
        $errorMsg.css('display', 'flex');
        return false;
    }
    $errorMsg.css('display', 'none');
};

MapModule.prototype.startSpinner = function(els) {
    if (Array.isArray(els) && els.length) {
        for (var i = 0; i < els.length; i++) {
            if (els[i] === 'map') {
                $('#' + this.context).find('.map-container').addClass('loading-data');
            }
            if (els[i] === 'tetrad-meta') {
                $('#' + this.context).find('.tetrad-meta').addClass('loading-data');
            }
            if (els[i] === 'tetrad-results') {
                $('#' + this.context).find('.tetrad-results').addClass('loading-data');
            }
        }
    }
};

MapModule.prototype.stopSpinner = function(els) {
    if (Array.isArray(els) && els.length) {
        for (var i = 0; i < els.length; i++) {
            if (els[i] === 'map') {
                $('#' + this.context).find('.map-container').removeClass('loading-data');
            }
            if (els[i] === 'tetrad-meta') {
                $('#' + this.context).find('.tetrad-meta').removeClass('loading-data');
            }
            if (els[i] === 'tetrad-results') {
                $('#' + this.context).find('.tetrad-results').removeClass('loading-data');
            }
        }
    }
};

MapModule.prototype.startUpdatingEls = function() {

    var parentEl = document.getElementById(this.context);

    if (this.request === 'species') {
        var speciesTitle = parentEl.querySelector('.species-titles');
        speciesTitle.classList.add('update');
        var counts = parentEl.querySelector('.counts');
        counts.classList.add('update');
        return false;
    }
    if (this.request === 'dataset') {
        // var dataSetTitles = parentEl.querySelector('.dataset-titles');
        // dataSetTitles.classList.add('update');
        // scrapped as no layering datasets currently

        var keyGroup = parentEl.querySelector('.key-group');
        keyGroup.classList.add('update');

        if (this.tetrad.active) {
            var tetradMeta = parentEl.querySelector('.tetrad-meta');
            tetradMeta.classList.add('update');
        }
        return false;
    }
    if (this.request === 'tetrad') {
        var tetradMeta = parentEl.querySelector('.tetrad-meta');
        tetradMeta.classList.add('update');
        return false;
    }
}

MapModule.prototype.stopUpdatingEls = function() {

    if (this.request === 'species') {
        this.updateHeadings();
        this.updateSums();
        this.updateTetradsPresent(this.counts.total);
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'dataset') {
        this.updateDatasetHeadings();
        this.updateKeys();
        this.updateSums();
        this.updateTetradsPresent(this.counts.total);
        if (this.tetrad.active) {
            this.updateTeradBox();
            this.setGoogleMapLink();
        }
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'tetrad') {
        this.updateTeradBox();
        this.setGoogleMapLink();
        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
    if (this.request === 'overview') {
        if (this.dataset === 'dbreed') {
            this.updateSums();
        }
        if (this.dataset === 'dbdensity' || this.dataset === 'dwdensity') {
            this.updateTetradsPresent(this.counts.total);
        }

        $('#' + this.context).find('.state').removeClass('update');
        return false;
    }
}


MapModule.prototype.updateTeradBox = function () {

    var theList = $('#' + this.context).find('.tetrad-list-wrapper'),
        $parentEl = $('#' + this.context);

    $parentEl.find('.tetrad-title').html(this.tetrad.active);

    if (this.dataset === 'dbreed' || this.dataset === 'sitters') {
        $parentEl.find('.tet-pres').html(this.tetrad.counts.sumPresent);
        $parentEl.find('.tet-poss').html(this.tetrad.counts.sumPossible);
        $parentEl.find('.tet-prob').html(this.tetrad.counts.sumProbable);
        $parentEl.find('.tet-conf').html(this.tetrad.counts.sumConfirmed);
        $parentEl.find('.tet-sums').show();
    } else {
        $parentEl.find('.tet-sums').hide();
    }
    $(theList).empty();

    $(this.tetrad.currentList).appendTo(theList);
};

MapModule.prototype.updateSums = function() {
    var sums = this.counts;
    var parentEl = document.getElementById(this.context);
    parentEl.querySelector('.pres-target').innerHTML = sums.sumPresent;
    parentEl.querySelector('.conf-target').innerHTML = sums.sumConfirmed;
    parentEl.querySelector('.prob-target').innerHTML = sums.sumProbable;
    parentEl.querySelector('.poss-target').innerHTML = sums.sumPossible;
};

MapModule.prototype.updateSpeciesSelect = function() {
    var chosenList = $('#' + this.context).find('.select-species');
    chosenList.val(this.species);
    chosenList.trigger("chosen:updated");
};

MapModule.prototype.updateTetradsPresent = function(length) {
    $('#' + this.context).find('.tet_pres').html(length);
};

MapModule.prototype.updateSelectedTetrad = function(tetradId) {
    // reveal the info box if hidden
    $('#' + this.context).find('.tetrad-meta-wrapper').removeClass('hide');
    var $tetrad = $('#' + tetradId);
    if (this.tetrad.active) {
        var $prevTetrad = $('#' + this.tetrad.domId);
        $prevTetrad.removeClass('selected');
        $tetrad.addClass('selected');
    } else {
        $('#' + tetradId).addClass('selected');
    }
};

MapModule.prototype.hideCurrentlySelectedTetradInfo = function(tetradId) {
    var $tetrad = $('#' + tetradId);
    $('#' + this.context).find('.tetrad-meta-wrapper').addClass('hide');
    $tetrad.removeClass('selected');
    $('#' + this.context).removeClass('tetrad-active');
    this.tetrad.active = false;
    this.setFetchingData(false);
};



MapModule.prototype.updateHeadings = function () {
    $('#' + this.context).find('.species-title').html(this.species);
    var latinName = this.getLatinName();
    if (latinName) {
        $('#' + this.context).find('.latin-name').html(latinName);
    }
};

MapModule.prototype.updateDatasetHeadings = function() {
    var obj = this;
    var $els = $('#' + this.context).find('.d-set');
    $els.removeClass('current');
    $els.each(function(index, el) {
        if (obj.dataset === $(el).attr('data-dset-title')) {
            $(el).addClass('current');
            return false;
        }
        if($(el).hasClass('d-set-breeding')) {
            $(this).addClass('current');
        }

    });
};

MapModule.prototype.updateKeys = function() {
    var keyEls = $('#' + this.context).find('.key-container');
    $(keyEls).removeClass('active dwdensity dbdensity');
    if (this.dataset === 'dwdensity' || this.dataset === 'dbdensity') {
        $(keyEls[1]).addClass('active ' + this.dataset);
        return false;
    }
    $(keyEls[0]).addClass('active');
};

MapModule.prototype.toggleDataLayer = function($el) {
    $el.is(":checked") ? $('#' + this.context).removeClass('data-off') : $('#' + this.context).addClass('data-off');
};

MapModule.prototype.setOverviewMapState = function(state) {
    var parentEl = document.getElementById(this.context);

    if (state === 'idle') {
        parentEl.querySelector('.map-state-wrap').classList.remove('off');
        $('#' + this.context).addClass('data-off');
    }
    if (state === 'active') {
        $('#' + this.context).removeClass('data-off');
        this.startSpinner(['map']);
        parentEl.querySelector('.map-state-wrap').classList.add('off');
        this.getData();
    }
};


MapModule.prototype.getSpeciesAccount = function() {
    var obj = this;

    $.ajax({
        url: config.folder + '/wp-json/wp/v2/species?filter[name]=' + this.species,
        type: 'GET',
        dataType: 'json'
    })
    .done(function(data) {
        window.setTimeout(function(){
            var latinName = obj.getLatinName();
            obj.templateSpeciesAccount.call(obj, data, latinName);
        }, 800);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

};


MapModule.prototype.templateSpeciesAccount = function(data, latinName) {

    if (latinName) {
        $('.latin-name').html(latinName);
    } else {
        $('.latin-name').html('');
    }
    document.querySelector('.account-text').innerHTML = data[0].content.rendered;
    document.getElementById('species-name').innerHTML = this.species;
    $('.state').removeClass('update');
};


















/* requires:
mapModule.js
*/
MapModule.prototype.setBreedingRange = function(breedingRange) {
    this.breedingRange = breedingRange;
};

MapModule.prototype.setConservationStatus = function(conservationStatus) {
    this.conservationStatus = conservationStatus;
}

MapModule.prototype.getRichnessData = function() {

    var obj = this;
    var url;
    if (this.conservationStatus === 'red' || this.conservationStatus === 'amber') {
        url = config.folder + config.themeUrl + '/ajax/richness/richnessDataPrepared.php';;
    } else {
        url = config.folder + config.themeUrl + '/ajax/richness/richnessData.php';
    }

    var postData = {
            'dataset' : this.dataset,
            'status' : this.conservationStatus,
            'range' : this.breedingRange
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data:  postData,
        timeout: 12000
    })
    .done(function(data) {
        // get the data for richnessDataPrepared:
        // console.log(JSON.stringify(data));
        obj.templateRichnessData(data);
    })
    .done(function() {
        window.setTimeout(function(){
            obj.stopSpinner.call(obj, ['map']);
            obj.setFetchingData(false);
        }, 800);
    })
    .done(function(data) {
        // refresh active tetrad
        if (obj.tetrad.active) {
            $('#' + obj.tetrad.domId).addClass('selected');
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

};


MapModule.prototype.getRichnessTetradData = function() {

    if (!this.tetrad.active) { return false; }

    this.startSpinner(['tetrad-results']);

    var titleEl = document.getElementById('js-richness-tetrad');
    titleEl.innerHTML = this.tetrad.active;

    if (!this.dataset) { return false; }

    var obj = this,
        url = config.folder + config.themeUrl + '/ajax/richness/richnessTetradData.php';
        postData = {
            "tetradId" : this.tetrad.active,
            'dataset' : this.dataset,
            'status' : this.conservationStatus,
            'range' : this.breedingRange
        };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: postData
    })
    .done(function(data) {
        window.setTimeout(function(){

            if (data.length > 0) {
                $("#js-richness-sum-total").html(data.length);
            } else {
                $("#js-richness-sum-total").html('0');
            }

            obj.setGoogleMapLink();
            $('#js-tet-list').empty().append(obj.templateTetradList(data));
            obj.stopSpinner(['tetrad-results']);
        }, 800);
    })
    .done(function() {
        obj.setFetchingData(false);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });








    // this.tetrad.currentList = "";

    // var obj = this;

    // this.startUpdatingEls();

    // var postData = {
    //     "tetradId" : this.tetrad.active,
    //     "data-set" : this.dataset
    // };

    // $.ajax({
    //     url: config.folder + config.themeUrl + '/ajax/tetradData.php',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: postData,
    //     timeout: 12000
    // })
    // .done(function(data){
    //     obj.tetrad.counts = obj.getSums(data);

    //     var tetradList = document.createElement('ol');
    //     tetradList.classList.add('tetrad-list');

    //     // lookup the index, retreive the Code value and template the list item
    //     var theCode, el, spanEl;
    //     for (var i = 0; i < data.length; i++) {
    //         theCode = data[i].Code;
    //         el = document.createElement('li');
    //         el.innerHTML = data[i].Species.trim();
    //         spanEl = document.createElement('span');
    //         spanEl.classList.add('code-' + theCode);
    //         el.appendChild(spanEl);
    //         tetradList.appendChild(el);
    //     }

    //     obj.tetrad.currentList = tetradList;

    //     //  A procedure for soting the list alphabetically
    //     // // get the list of names
    //     // var orginalList = [];

    //     // for (var i = 0; i < data.length; i++) {
    //     //     orginalList.push(data[i]['Species']);
    //     // }
    //     // // sort the list to new arr
    //     // var sortList = [];
    //     // for (var i = 0; i < data.length; i++) {
    //     //     sortList.push(data[i]['Species']);
    //     // }
    //     // sortList.sort();

    //     // var tetradList = document.createElement('ol');
    //     // tetradList.classList.add('tetrad-list');

    //     // // lookup the index, retreive the Code value and template the list item
    //     // var theCode, el, spanEl;
    //     // for (var i = 0; i < sortList.length; i++) {
    //     //     theCode = data[orginalList.indexOf(sortList[i])]['Code'];
    //     //     el = document.createElement('li');
    //     //     el.innerHTML = sortList[i].trim();
    //     //     spanEl = document.createElement('span');
    //     //     spanEl.classList.add('code-' + theCode);
    //     //     el.appendChild(spanEl);
    //     //     tetradList.appendChild(el);
    //     // }

    //     // obj.tetrad.currentList = tetradList;
    //     // // truncate arrays
    //     // orginalList.length = 0;
    //     // sortList.length = 0;

    // })
    // .done(function(data) {
    //     window.setTimeout(function(){
    //         obj.stopSpinner.call(obj, ['tetrad-meta']);
    //         // obj.updateStateEls.stop.call(obj, obj.context);
    //         obj.stopUpdatingEls();
    //         obj.setFetchingData(false);
    //     }, 800);
    // })
    // .fail(function() {
    //     console.log("getTetradData - error");
    //     window.setTimeout(function(){
    //         obj.stopSpinner.call(obj, ['tetrad-meta']);
    //         obj.setMapErrorMsg(true, 'tetrad-request');
    //     }, 800);
    // })
    // .always(function() {
    //     // console.log("getTetradData - complete");
    // });

};


MapModule.prototype.templateRichnessData = function(data) {
    // remove previous results using richnessTetradArr
    var prevResults = JSON.parse(sessionStorage.getItem(this.context + "richnessTetradArr"));

    if (Array.isArray(prevResults) && prevResults.length)  {
        for (var i = 0; i < prevResults.length; i++) {
            var prevTetrad = document.getElementById(this.context + prevResults[i]);
            if (prevTetrad) {
                prevTetrad.className = '';
            }
        }
    }
    tetArr = [];
    for (var i = 0; i < data.length; i++) {
        tetArr.push(data[i]['Tetrad']);
        sessionStorage.setItem(this.context + "richnessTetradArr", JSON.stringify(tetArr));
    }

    var range;
    for (var i = 0; i < tetArr.length; i++) {
            var count = data[i].CountOf;

            if (count <= 9) {
                range = '1';
            } else if (count >9 && count <= 29) {
                range = '2';
            } else if (count >29 && count <= 49) {
                range = '4';
            } else if (count >49 && count <= 69) {
                range = '5';
            } else if (count >69 && count <= 89) {
                range = '7';
            } else if (count >89 && count <= 109) {
                range = '8';
            } else if (count >109) {
                range = '9';
            } else {
                range = '0'
            }

            var tetrad = document.getElementById(this.context + tetArr[i]);

            if (tetrad) {
                tetrad.classList.add('pres', 'code-' + range);
            }
            // else {
                    // generate a list of tetrads in the sitters file which don't exist on our grid!
            //     console.log('false: ' + tetArr[i]);
            // }
    }
};



















/* requires:
modernizr-custom.js
classList.min.js
chosen.jquery.min.js
speciesList.js
latinNames.js
mapModule.js
mapModule-richness.js
*/

/* https://github.com/mkleehammer/gulp-deporder */


(function($) {

	$(document).ready(function() {

        // build the map elements
        var tetrads = ["E", "J", "P", "U", "Z", "D", "I", "N", "T", "Y", "C", "H", "M", "S", "X", "B", "G", "L", "R", "W", "A", "F", "K", "Q", "V"];

        function createTetrad(id, parent) {
            var tet = document.createElement("div");
            tet.setAttribute('id', id);
            tet.setAttribute('data-tetrad', "2K");
            parent.appendChild(tet);
        }

        $('.parent').each(function(index, el) {
            var parentId = el.id;
            for (var i = 0; i < tetrads.length; i++) {
                var tetId = parentId + tetrads[i];
                createTetrad(tetId, el);
            }
        });



        // template the species list and fire chosen
        for (var i = 0; i < speciesList.length; i++) {
            $('<option value="' + speciesList[i] + '" >' + speciesList[i] + '</option>')
            .appendTo('.select-species');
        }

        var media_query = window.matchMedia("(min-width: 1025px)");
        media_query.addListener(fireChosen);
        fireChosen(media_query);

        function fireChosen(media_query) {
          if (media_query.matches) {
                $(".select-species").chosen({
                    placeholder_text_single: "Select a species",
                    no_results_text: "Oops, nothing found!",
                    width: "95%"
            });
          }
        }


	});

})(jQuery);