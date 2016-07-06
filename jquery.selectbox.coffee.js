(function() {
  (function($) {

    /**
    Selectbox manager.
    Use the singleton instance of this class, $.selectbox, to interact with the select box.
    Settings for (groups of) select boxes are maintained in an instance object,
    allowing multiple different settings on the same page
     */
    var PROP_NAME, Selectbox;
    Selectbox = function() {
      this._state = [];
      this._defaults = {
        classHolder: "selectbox__holder",
        classHolderDisabled: "selectbox__holder--disabled",
        classSelector: "selectbox__selector",
        classOptions: "selectbox__options",
        classOptionsList: "selectbox__options-list",
        classOptionsItem: "selectbox__options-item",
        classOptionSelected: "selectbox__options-item--selected",
        classGroup: "selectbox__group",
        classSub: "selectbox__sub",
        classDisabled: "selectbox--disabled",
        classSelectOpen: "selectbox--open",
        classToggle: "selectbox__toggle",
        classFocus: "selectbox--focus",
        classDropUp: "selectbox__holder--drop-up",
        minWidth: 50,
        maxWidth: 500,
        maxHeight: 300,
        padding: 30,
        speed: 200,
        effect: "slide",
        onChange: null,
        onOpen: null,
        onClose: null
      };
    };
    PROP_NAME = "selectbox";
    $.extend(Selectbox.prototype, {

      /**
      Is the first field in a jQuery collection open as a selectbox
      
      @param {Object} target
      @return {Boolean}
       */
      _isOpenSelectbox: function(target) {
        var inst;
        if (target == null) {
          target = false;
        }
        inst = this._getInst(target);
        return inst.isOpen;
      },

      /**
      Is the first field in a jQuery collection disabled as a selectbox
      
      @param {HTMLElement} target
      @return {Boolean}
       */
      _isDisabledSelectbox: function(target) {
        var inst;
        if (target == null) {
          target = false;
        }
        inst = this._getInst(target);
        return inst.isDisabled;
      },

      /**
      Attach the select box to a jQuery selection.
      
      @param {HTMLElement} target
      @param {Object} settings
       */
      _attachSelectbox: function(target, settings) {
        var $target, closeOthers, getOptions, inst, olen, optGroup, opts, s, sbHolder, sbHolderWidth, sbOptions, sbOptionsContainer, sbSelector, sbToggle, self;
        closeOthers = function() {
          var key, sel, uid;
          key = void 0;
          sel = void 0;
          uid = this.attr("id").split("_")[1];
          for (key in self._state) {
            if (key !== uid) {
              if (self._state.hasOwnProperty(key)) {
                sel = $("select[sb='" + key + "']")[0];
                if (sel) {
                  self._closeSelectbox(sel);
                }
              }
            }
          }
        };
        getOptions = function() {
          var disabled, sub;
          sub = (arguments[1] && arguments[1].sub ? true : false);
          disabled = (arguments[1] && arguments[1].disabled ? true : false);
          arguments[0].each(function(i) {
            var child, li, s, that;
            that = $(this);
            li = $("<li>", {
              "class": inst.settings.classOptionsItem
            });
            child = void 0;
            if (that.is(":selected")) {
              sbSelector.text(that.text());
              li.addClass(inst.settings.classOptionSelected);
              s = true;
            }
            if (i === olen - 1) {
              li.addClass("last");
            }
            if (!that.is(":disabled") && !disabled) {
              child = $("<a>", {
                href: "#" + that.val(),
                rel: that.val(),
                title: that.text()
              }).text(that.text()).bind("click.sb", function(e) {
                var $this, t, uid;
                if (e && e.preventDefault) {
                  e.preventDefault();
                }
                t = sbToggle;
                $this = $(this);
                uid = t.attr("id").split("_")[1];
                self._changeSelectbox(target, $this.attr("rel"), $this.text(), $this.parent().index());
                self._closeSelectbox(target);
              }).bind("mouseover.sb", function() {
                var $this;
                $this = $(this);
                $this.parent().siblings().find("a").removeClass(inst.settings.classFocus);
                $this.addClass(inst.settings.classFocus);
              }).bind("mouseout.sb", function() {
                $(this).removeClass(inst.settings.classFocus);
              });
              if (sub) {
                child.addClass(inst.settings.classSub);
              }
              if (that.is(":selected")) {
                child.addClass(inst.settings.classFocus);
              }
              child.appendTo(li);
            } else {
              child = $("<span>", {
                text: that.text()
              }).addClass(inst.settings.classDisabled);
              if (sub) {
                child.addClass(inst.settings.classSub);
              }
              child.appendTo(li);
            }
            li.appendTo(sbOptions);
          });
        };
        if (this._getInst(target)) {
          return false;
        }
        $target = $(target);
        self = this;
        inst = self._newInst($target);
        sbHolder = void 0;
        sbSelector = void 0;
        sbToggle = void 0;
        sbOptionsContainer = void 0;
        sbOptions = void 0;
        s = false;
        optGroup = $target.find("optgroup");
        opts = $target.find("option");
        olen = opts.length;
        $target.attr("sb", inst.uid);
        $.extend(inst.settings, self._defaults, settings, $target.data("options"));
        self._state[inst.uid] = false;
        $target.hide();
        sbHolderWidth = $target.outerWidth();
        sbHolderWidth = (inst.settings.maxWidth < sbHolderWidth ? inst.settings.maxWidth : sbHolderWidth);
        sbHolderWidth = (inst.settings.minWidth > sbHolderWidth ? inst.settings.minWidth : sbHolderWidth);
        sbHolder = $("<div>", {
          id: "sbHolder_" + inst.uid,
          "class": inst.settings.classHolder,
          css: {
            width: sbHolderWidth
          },
          tabindex: $target.attr("tabindex")
        });
        sbSelector = $("<a>", {
          id: "sbSelector_" + inst.uid,
          href: "#",
          "class": inst.settings.classSelector,
          click: function(e) {
            var uid;
            e.preventDefault();
            if ($target.children().length) {
              closeOthers.apply($(this), []);
              uid = $(this).attr("id").split("_")[1];
              if (self._state[uid]) {
                self._closeSelectbox(target);
              } else {
                self._openSelectbox(target);
              }
            }
          }
        });
        sbToggle = $("<a>", {
          id: "sbToggle_" + inst.uid,
          href: "#",
          "class": inst.settings.classToggle,
          click: function(e) {
            var uid;
            e.preventDefault();
            closeOthers.apply($(this), []);
            uid = $(this).attr("id").split("_")[1];
            if (self._state[uid]) {
              self._closeSelectbox(target);
            } else {
              self._openSelectbox(target);
            }
          }
        });
        sbToggle.appendTo(sbHolder);
        sbOptionsContainer = $("<div>", {
          id: "sbOptions_" + inst.uid,
          "class": inst.settings.classOptions,
          css: {
            display: "none"
          }
        });
        sbOptions = $("<ul>", {
          "class": inst.settings.classOptionsList
        });
        $target.children().each(function(i) {
          var config, li, that;
          that = $(this);
          li = void 0;
          config = {};
          if (that.is("option")) {
            getOptions(that);
          } else if (that.is("optgroup")) {
            li = $("<li>", {
              "class": inst.settings.classOptionsItem
            });
            $("<span>", {
              text: that.attr("label")
            }).addClass(inst.settings.classGroup).appendTo(li);
            li.appendTo(sbOptions);
            if (that.is(":disabled")) {
              config.disabled = true;
            }
            config.sub = true;
            getOptions(that.find("option"), config);
          }
        });
        if (!s) {
          sbSelector.text(opts.first().text());
        }
        $.data(target, PROP_NAME, inst);
        sbHolder.data("uid", inst.uid).bind("keydown.sb", function(e) {
          var $f, $next, $this, i, key, trgt, uid;
          key = (e.charCode ? e.charCode : (e.keyCode ? e.keyCode : 0));
          $this = $(this);
          uid = $this.data("uid");
          inst = $this.siblings("select[sb='" + uid + "']").data(PROP_NAME);
          trgt = $this.siblings(["select[sb='", uid, "']"].join("")).get(0);
          $f = $this.find("ul").find("a." + inst.settings.classFocus);
          switch (key) {
            case 37:
            case 38:
              if ($f.length > 0) {
                $next = void 0;
                $("a", $this).removeClass(inst.settings.classFocus);
                $next = $f.parent().prevAll("li:has(a)").eq(0).find("a");
                if ($next.length > 0) {
                  $next.addClass(inst.settings.classFocus).focus();
                  $("#sbSelector_" + uid).text($next.text());
                }
              }
              break;
            case 39:
            case 40:
              $next = void 0;
              $("a", $this).removeClass(inst.settings.classFocus);
              if ($f.length > 0) {
                $next = $f.parent().nextAll("li:has(a)").eq(0).find("a");
              } else {
                $next = $this.find("ul").find("a").eq(0);
              }
              if ($next.length > 0) {
                $next.addClass(inst.settings.classFocus).focus();
                $("#sbSelector_" + uid).text($next.text());
              }
              break;
            case 13:
              if ($f.length > 0) {
                self._changeSelectbox(trgt, $f.attr("rel"), $f.text(), $f.parent().index());
              }
              self._closeSelectbox(trgt);
              break;
            case 9:
              if (trgt) {
                inst = self._getInst(trgt);
                if (inst) {
                  if ($f.length > 0) {
                    self._changeSelectbox(trgt, $f.attr("rel"), $f.text(), $f.parent().index());
                  }
                  self._closeSelectbox(trgt);
                }
              }
              i = parseInt($this.attr("tabindex"), 10);
              if (!e.shiftKey) {
                i++;
              } else {
                i--;
              }
              $("*[tabindex='" + i + "']").focus();
              break;
            case 27:
              self._closeSelectbox(trgt);
          }
          e.stopPropagation();
          return false;
        }).delegate("a", "mouseover", function(e) {
          $(this).addClass(inst.settings.classFocus);
        }).delegate("a", "mouseout", function(e) {
          $(this).removeClass(inst.settings.classFocus);
        });
        sbSelector.appendTo(sbHolder);
        sbOptions.appendTo(sbOptionsContainer);
        sbOptionsContainer.appendTo(sbHolder);
        sbHolder.insertAfter($target);
        $("html").live("mousedown", function(e) {
          e.stopPropagation();
          $("select").selectbox("close");
        });
        $([".", inst.settings.classHolder, ", .", inst.settings.classSelector].join("")).mousedown(function(e) {
          e.stopPropagation();
        });
      },

      /**
      Remove the selectbox functionality completely. This will return the element back to its pre-init state.
      
      @param {HTMLElement} target
       */
      _detachSelectbox: function(target) {
        var inst;
        inst = this._getInst(target);
        if (!inst) {
          return false;
        }
        $("#sbHolder_" + inst.uid).remove();
        $.data(target, PROP_NAME, null);
        $(target).show();
      },

      /**
      Change selected attribute of the selectbox.
      
      @param {HTMLElement} target
      @param {String} value
      @param {String} text
      @param {Number} index
       */
      _changeSelectbox: function(target, value, text, index) {
        var $sbOptions, inst, onChange;
        onChange = void 0;
        inst = this._getInst(target);
        if (inst) {
          onChange = this._get(inst, "onChange");
          $("#sbSelector_" + inst.uid).text(text);
          $sbOptions = $("#sbOptions_" + inst.uid);
          $sbOptions.find("." + inst.settings.classOptionSelected).removeClass(inst.settings.classOptionSelected);
          $sbOptions.find("li").eq(index).addClass(inst.settings.classOptionSelected);
        }
        value = value.replace(/\'/g, "\\'");
        $(target).find("option[value='" + value + "']").attr("selected", true);
        if (inst && onChange) {
          onChange.apply((inst.input ? inst.input[0] : null), [value, inst]);
        } else {
          if (inst && inst.input) {
            inst.input.trigger("change");
          }
        }
      },

      /**
      Enable the selectbox.
      
      @param {HTMLElement} target
       */
      _enableSelectbox: function(target) {
        var inst;
        inst = this._getInst(target);
        if (!inst || !inst.isDisabled) {
          return false;
        }
        $("#sbHolder_" + inst.uid).removeClass(inst.settings.classHolderDisabled);
        inst.isDisabled = false;
        $.data(target, PROP_NAME, inst);
      },

      /**
      Disable the selectbox.
      
      @param {HTMLElement} target
       */
      _disableSelectbox: function(target) {
        var inst;
        inst = this._getInst(target);
        if (!inst || inst.isDisabled) {
          return false;
        }
        $("#sbHolder_" + inst.uid).addClass(inst.settings.classHolderDisabled);
        inst.isDisabled = true;
        $.data(target, PROP_NAME, inst);
      },

      /**
      Get or set any selectbox option. If no value is specified, will act as a getter.
      
      @param {HTMLElement} target
      @param {String} name
      @param {Object} value
       */
      _optionSelectbox: function(target, name, value) {
        var inst;
        inst = this._getInst(target);
        if (!inst) {
          return false;
        }
        inst[name] = value;
        $.data(target, PROP_NAME, inst);
      },

      /**
      Call up attached selectbox
      
      @param {HTMLElement} target
       */
      _openSelectbox: function(target) {
        var diff, el, height, holder, inst, maxHeight, offset, onOpen, viewportHeight;
        inst = this._getInst(target);
        if (!inst || inst.isOpen || inst.isDisabled) {
          return;
        }
        el = $("#sbOptions_" + inst.uid);
        holder = $("#sbHolder_" + inst.uid);
        viewportHeight = parseInt($(document).height(), 10);
        offset = holder.offset();
        height = el.prev().outerHeight();
        diff = viewportHeight - offset.top - height / 2;
        onOpen = this._get(inst, "onOpen");
        maxHeight = void 0;
        if (diff > viewportHeight / 2) {
          maxHeight = diff - height - (inst.settings.padding * 2);
          maxHeight = (maxHeight > inst.settings.maxHeight ? inst.settings.maxHeight : maxHeight);
          el.css({
            top: height + "px",
            bottom: "auto",
            maxHeight: maxHeight + "px"
          });
        } else {
          holder.addClass(inst.settings.classDropUp);
          maxHeight = offset.top - height - (inst.settings.padding * 2);
          maxHeight = (maxHeight > inst.settings.maxHeight ? inst.settings.maxHeight : maxHeight);
          el.css({
            top: "auto",
            bottom: height + "px",
            maxHeight: maxHeight + "px"
          });
        }
        if (inst.settings.effect === "fade") {
          el.fadeIn(inst.settings.speed);
        } else {
          el.slideDown(inst.settings.speed);
        }
        holder.addClass(inst.settings.classSelectOpen);
        this._state[inst.uid] = true;
        inst.isOpen = true;
        if (onOpen) {
          onOpen.apply((inst.input ? inst.input[0] : null), [inst]);
        }
        $.data(target, PROP_NAME, inst);
      },

      /**
      Close opened selectbox
      
      @param {HTMLElement} target
       */
      _closeSelectbox: function(target) {
        var $holder, inst, onClose, sbOptions;
        inst = this._getInst(target);
        if (!inst || !inst.isOpen) {
          return;
        }
        onClose = this._get(inst, "onClose");
        sbOptions = $("#sbOptions_" + inst.uid);
        if (inst.settings.effect === "fade") {
          sbOptions.fadeOut(inst.settings.speed);
        } else {
          sbOptions.slideUp(inst.settings.speed);
        }
        $holder = $("#sbHolder_" + inst.uid);
        $holder.removeClass(inst.settings.classSelectOpen);
        $holder.removeClass(inst.settings.classDropUp);
        this._state[inst.uid] = false;
        inst.isOpen = false;
        if (onClose) {
          onClose.apply((inst.input ? inst.input[0] : null), [inst]);
        }
        $.data(target, PROP_NAME, inst);
      },

      /**
      Create a new instance object
      
      @param {HTMLElement} target
      @return {Object}
       */
      _newInst: function(target) {
        var id;
        id = target[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1");
        return {
          id: id,
          input: target,
          uid: Math.floor(Math.random() * 99999999),
          isOpen: false,
          isDisabled: false,
          settings: {}
        };
      },

      /**
      Retrieve the instance data for the target control.
      
      @param {HTMLElement} target
      @return {Object} - the associated instance data
      @throws error if a jQuery problem getting data
       */
      _getInst: function(target) {
        var err;
        try {
          return $.data(target, PROP_NAME);
        } catch (_error) {
          err = _error;
          throw "Missing instance data for this selectbox";
        }
      },

      /**
      Get a setting value, defaulting if necessary
      
      @param {Object} inst
      @param {String} name
       */
      _get: function(inst, name) {
        if (inst.settings[name] !== undefined) {
          return inst.settings[name];
        } else {
          return this._defaults[name];
        }
      }
    });

    /**
    Invoke the selectbox functionality.
    
    @param {Object|String} options
    @return {Object}
     */
    $.fn.selectbox = function(options) {
      var otherArgs;
      otherArgs = Array.prototype.slice.call(arguments, 1);
      if (typeof options === "string" && options === "isDisabled") {
        return $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this[0]].concat(otherArgs));
      }
      if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
        return $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this[0]].concat(otherArgs));
      }
      return this.each(function() {
        if (typeof options === "string") {
          $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this].concat(otherArgs));
        } else {
          $.selectbox._attachSelectbox(this, options);
        }
      });
    };
    $.selectbox = new Selectbox();
    $.selectbox.version = "0.3";
  })(jQuery);

}).call(this);
