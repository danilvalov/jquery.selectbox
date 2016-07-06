#!
# * jQuery Selectbox plugin 0.3
# *
# * Copyright 2011-2012, Dimitar Ivanov (http://www.bulgaria-web-developers.com/projects/javascript/selectbox/)
# * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
# *
# * A fork by Danil Valov for some simple modifications. Based off v.0.2
# *
# * Date: Tue Jul 09 18:19:36 2014 +0700
# 
(($) ->

  ###*
  Selectbox manager.
  Use the singleton instance of this class, $.selectbox, to interact with the select box.
  Settings for (groups of) select boxes are maintained in an instance object,
  allowing multiple different settings on the same page
  ###
  Selectbox = ->
    @_state = []
    @_defaults = # Global defaults for all the select box instances
      classHolder: "selectbox__holder"
      classHolderDisabled: "selectbox__holder--disabled"
      classSelector: "selectbox__selector"
      classOptions: "selectbox__options"
      classOptionsList: "selectbox__options-list"
      classOptionsItem: "selectbox__options-item"
      classOptionSelected: "selectbox__options-item--selected"
      classGroup: "selectbox__group"
      classSub: "selectbox__sub"
      classDisabled: "selectbox--disabled"
      classSelectOpen: "selectbox--open"
      classToggle: "selectbox__toggle"
      classFocus: "selectbox--focus"
      classDropUp: "selectbox__holder--drop-up"
      minWidth: 50
      maxWidth: 500
      maxHeight: 300
      padding: 30
      speed: 200
      effect: "slide" # "slide" or "fade"
      onChange: null #Define a callback function when the selectbox is changed
      onOpen: null #Define a callback function when the selectbox is open
      onClose: null #Define a callback function when the selectbox is closed

    return
  PROP_NAME = "selectbox"
  $.extend Selectbox::,

    ###*
    Is the first field in a jQuery collection open as a selectbox
    
    @param {Object} target
    @return {Boolean}
    ###
    _isOpenSelectbox: (target = false) ->
      inst = @_getInst(target)
      inst.isOpen


    ###*
    Is the first field in a jQuery collection disabled as a selectbox

    @param {HTMLElement} target
    @return {Boolean}
    ###
    _isDisabledSelectbox: (target = false) ->
      inst = @_getInst(target)
      inst.isDisabled


    ###*
    Attach the select box to a jQuery selection.

    @param {HTMLElement} target
    @param {Object} settings
    ###
    _attachSelectbox: (target, settings) ->
      closeOthers = ->
        key = undefined
        sel = undefined
        uid = @attr("id").split("_")[1]
        for key of self._state
          if key isnt uid
            if self._state.hasOwnProperty(key)
              sel = $("select[sb='" + key + "']")[0]
              self._closeSelectbox sel  if sel
        return
      getOptions = ->
        sub = (if arguments[1] and arguments[1].sub then true else false)
        disabled = (if arguments[1] and arguments[1].disabled then true else false)
        arguments[0].each (i) ->
          that = $(this)
          li = $("<li>",
            class: inst.settings.classOptionsItem
          )
          child = undefined
          if that.is(":selected")
            sbSelector.text that.text()
            li.addClass inst.settings.classOptionSelected
            s = true
          li.addClass "last"  if i is olen - 1
          if not that.is(":disabled") and not disabled
            child = $("<a>",
              href: "#" + that.val()
              rel: that.val()
              title: that.text()
            ).text(that.text()).bind("click.sb", (e) ->
              e.preventDefault()  if e and e.preventDefault
              t = sbToggle
              $this = $(this)
              uid = t.attr("id").split("_")[1]
              self._changeSelectbox target, $this.attr("rel"), $this.text(), $this.parent().index()
              self._closeSelectbox target
              return
            ).bind("mouseover.sb", ->
              $this = $(this)
              $this.parent().siblings().find("a").removeClass inst.settings.classFocus
              $this.addClass inst.settings.classFocus
              return
            ).bind("mouseout.sb", ->
              $(this).removeClass inst.settings.classFocus
              return
            )
            child.addClass inst.settings.classSub  if sub
            child.addClass inst.settings.classFocus  if that.is(":selected")
            child.appendTo li
          else
            child = $("<span>",
              text: that.text()
            ).addClass(inst.settings.classDisabled)
            child.addClass inst.settings.classSub  if sub
            child.appendTo li
          li.appendTo sbOptions
          return

        return
      return false  if @_getInst(target)
      $target = $(target)
      self = this
      inst = self._newInst($target)
      sbHolder = undefined
      sbSelector = undefined
      sbToggle = undefined
      sbOptionsContainer = undefined
      sbOptions = undefined
      s = false
      optGroup = $target.find("optgroup")
      opts = $target.find("option")
      olen = opts.length
      $target.attr "sb", inst.uid
      $.extend inst.settings, self._defaults, settings, $target.data("options")
      self._state[inst.uid] = false
      $target.hide()
      sbHolderWidth = $target.outerWidth()
      sbHolderWidth = (if inst.settings.maxWidth < sbHolderWidth then inst.settings.maxWidth else sbHolderWidth)
      sbHolderWidth = (if inst.settings.minWidth > sbHolderWidth then inst.settings.minWidth else sbHolderWidth)
      sbHolder = $("<div>",
        id: "sbHolder_" + inst.uid
        class: inst.settings.classHolder
        css:
          width: sbHolderWidth

        tabindex: $target.attr("tabindex")
      )
      sbSelector = $("<a>",
        id: "sbSelector_" + inst.uid
        href: "#"
        class: inst.settings.classSelector
        click: (e) ->
          e.preventDefault()
          if $target.children().length
            closeOthers.apply $(this), []
            uid = $(this).attr("id").split("_")[1]
            if self._state[uid]
              self._closeSelectbox target
            else
              self._openSelectbox target
          return
      )
      sbToggle = $("<a>",
        id: "sbToggle_" + inst.uid
        href: "#"
        class: inst.settings.classToggle
        click: (e) ->
          e.preventDefault()
          closeOthers.apply $(this), []
          uid = $(this).attr("id").split("_")[1]
          if self._state[uid]
            self._closeSelectbox target
          else
            self._openSelectbox target
          return
      )
      sbToggle.appendTo sbHolder
      sbOptionsContainer = $("<div>",
        id: "sbOptions_" + inst.uid
        class: inst.settings.classOptions
        css:
          display: "none"
      )
      sbOptions = $("<ul>",
        class: inst.settings.classOptionsList
      )
      $target.children().each (i) ->
        that = $(this)
        li = undefined
        config = {}
        if that.is("option")
          getOptions that
        else if that.is("optgroup")
          li = $("<li>",
            class: inst.settings.classOptionsItem
          )
          $("<span>",
            text: that.attr("label")
          ).addClass(inst.settings.classGroup).appendTo li
          li.appendTo sbOptions
          config.disabled = true  if that.is(":disabled")
          config.sub = true
          getOptions that.find("option"), config
        return

      sbSelector.text opts.first().text()  unless s
      $.data target, PROP_NAME, inst
      #Arrow Left
      #Arrow Up
      #Arrow Right
      #Arrow Down
      #Enter
      #Tab
      # && inst.isOpen
      #Escape
      sbHolder.data("uid", inst.uid).bind("keydown.sb", (e) ->
        key = (if e.charCode then e.charCode else (if e.keyCode then e.keyCode else 0))
        $this = $(this)
        uid = $this.data("uid")
        inst = $this.siblings("select[sb='" + uid + "']").data(PROP_NAME)
        trgt = $this.siblings([
          "select[sb='"
          uid
          "']"
        ].join("")).get(0)
        $f = $this.find("ul").find("a." + inst.settings.classFocus)
        switch key
          when 37, 38
            if $f.length > 0
              $next = undefined
              $("a", $this).removeClass inst.settings.classFocus
              $next = $f.parent().prevAll("li:has(a)").eq(0).find("a")
              if $next.length > 0
                $next.addClass(inst.settings.classFocus).focus()
                $("#sbSelector_" + uid).text $next.text()
          when 39, 40
            $next = undefined
            $("a", $this).removeClass inst.settings.classFocus
            if $f.length > 0
              $next = $f.parent().nextAll("li:has(a)").eq(0).find("a")
            else
              $next = $this.find("ul").find("a").eq(0)
            if $next.length > 0
              $next.addClass(inst.settings.classFocus).focus()
              $("#sbSelector_" + uid).text $next.text()
          when 13
            self._changeSelectbox trgt, $f.attr("rel"), $f.text(), $f.parent().index()  if $f.length > 0
            self._closeSelectbox trgt
          when 9
            if trgt
              inst = self._getInst(trgt)
              if inst
                self._changeSelectbox trgt, $f.attr("rel"), $f.text(), $f.parent().index()  if $f.length > 0
                self._closeSelectbox trgt
            i = parseInt($this.attr("tabindex"), 10)
            unless e.shiftKey
              i++
            else
              i--
            $("*[tabindex='" + i + "']").focus()
          when 27
            self._closeSelectbox trgt
        e.stopPropagation()
        false
      ).delegate("a", "mouseover", (e) ->
        $(this).addClass inst.settings.classFocus
        return
      ).delegate "a", "mouseout", (e) ->
        $(this).removeClass inst.settings.classFocus
        return

      sbSelector.appendTo sbHolder
      sbOptions.appendTo sbOptionsContainer
      sbOptionsContainer.appendTo sbHolder
      sbHolder.insertAfter $target
      $("html").live "mousedown", (e) ->
        e.stopPropagation()
        $("select").selectbox "close"
        return

      $([
        "."
        inst.settings.classHolder
        ", ."
        inst.settings.classSelector
      ].join("")).mousedown (e) ->
        e.stopPropagation()
        return

      return


    ###*
    Remove the selectbox functionality completely. This will return the element back to its pre-init state.

    @param {HTMLElement} target
    ###
    _detachSelectbox: (target) ->
      inst = @_getInst(target)
      return false  unless inst
      $("#sbHolder_" + inst.uid).remove()
      $.data target, PROP_NAME, null
      $(target).show()
      return


    ###*
    Change selected attribute of the selectbox.

    @param {HTMLElement} target
    @param {String} value
    @param {String} text
    @param {Number} index
    ###
    _changeSelectbox: (target, value, text, index) ->
      onChange = undefined
      inst = @_getInst(target)
      if inst
        onChange = @_get(inst, "onChange")
        $("#sbSelector_" + inst.uid).text text
        $sbOptions = $("#sbOptions_" + inst.uid)
        $sbOptions.find("." + inst.settings.classOptionSelected).removeClass inst.settings.classOptionSelected
        $sbOptions.find("li").eq(index).addClass inst.settings.classOptionSelected
      value = value.replace(/\'/g, "\\'")
      $(target).find("option[value='" + value + "']").attr "selected", true
      if inst and onChange
        onChange.apply ((if inst.input then inst.input[0] else null)), [
          value
          inst
        ]
      else inst.input.trigger "change"  if inst and inst.input
      return


    ###*
    Enable the selectbox.

    @param {HTMLElement} target
    ###
    _enableSelectbox: (target) ->
      inst = @_getInst(target)
      return false  if not inst or not inst.isDisabled
      $("#sbHolder_" + inst.uid).removeClass inst.settings.classHolderDisabled
      inst.isDisabled = false
      $.data target, PROP_NAME, inst
      return


    ###*
    Disable the selectbox.

    @param {HTMLElement} target
    ###
    _disableSelectbox: (target) ->
      inst = @_getInst(target)
      return false  if not inst or inst.isDisabled
      $("#sbHolder_" + inst.uid).addClass inst.settings.classHolderDisabled
      inst.isDisabled = true
      $.data target, PROP_NAME, inst
      return


    ###*
    Get or set any selectbox option. If no value is specified, will act as a getter.

    @param {HTMLElement} target
    @param {String} name
    @param {Object} value
    ###
    _optionSelectbox: (target, name, value) ->
      inst = @_getInst(target)
      return false  unless inst

      #TODO check name
      inst[name] = value
      $.data target, PROP_NAME, inst
      return


    ###*
    Call up attached selectbox

    @param {HTMLElement} target
    ###
    _openSelectbox: (target) ->
      inst = @_getInst(target)

      #if (!inst || this._state[inst.uid] || inst.isDisabled) {
      return  if not inst or inst.isOpen or inst.isDisabled
      el = $("#sbOptions_" + inst.uid)
      holder = $("#sbHolder_" + inst.uid)
      viewportHeight = parseInt($(document).height(), 10)
      offset = holder.offset()
      height = el.prev().outerHeight()
      diff = viewportHeight - offset.top - height / 2
      onOpen = @_get(inst, "onOpen")
      maxHeight = undefined
      if diff > viewportHeight / 2
        maxHeight = (diff - height - (inst.settings.padding * 2))
        maxHeight = (if maxHeight > inst.settings.maxHeight then inst.settings.maxHeight else maxHeight)
        el.css
          top: height + "px"
          bottom: "auto"
          maxHeight: maxHeight + "px"

      else
        holder.addClass inst.settings.classDropUp
        maxHeight = (offset.top - height - (inst.settings.padding * 2))
        maxHeight = (if maxHeight > inst.settings.maxHeight then inst.settings.maxHeight else maxHeight)
        el.css
          top: "auto"
          bottom: height + "px"
          maxHeight: maxHeight + "px"

      (if inst.settings.effect is "fade" then el.fadeIn(inst.settings.speed) else el.slideDown(inst.settings.speed))
      holder.addClass inst.settings.classSelectOpen
      @_state[inst.uid] = true
      inst.isOpen = true
      onOpen.apply ((if inst.input then inst.input[0] else null)), [inst]  if onOpen
      $.data target, PROP_NAME, inst
      return


    ###*
    Close opened selectbox

    @param {HTMLElement} target
    ###
    _closeSelectbox: (target) ->
      inst = @_getInst(target)

      #if (!inst || !this._state[inst.uid]) {
      return  if not inst or not inst.isOpen
      onClose = @_get(inst, "onClose")
      sbOptions = $("#sbOptions_" + inst.uid)
      (if inst.settings.effect is "fade" then sbOptions.fadeOut(inst.settings.speed) else sbOptions.slideUp(inst.settings.speed))
      $holder = $("#sbHolder_" + inst.uid);
      $holder.removeClass inst.settings.classSelectOpen
      $holder.removeClass inst.settings.classDropUp
      @_state[inst.uid] = false
      inst.isOpen = false
      onClose.apply ((if inst.input then inst.input[0] else null)), [inst]  if onClose
      $.data target, PROP_NAME, inst
      return


    ###*
    Create a new instance object

    @param {HTMLElement} target
    @return {Object}
    ###
    _newInst: (target) ->
      id = target[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1")
      id: id
      input: target
      uid: Math.floor(Math.random() * 99999999)
      isOpen: false
      isDisabled: false
      settings: {}


    ###*
    Retrieve the instance data for the target control.

    @param {HTMLElement} target
    @return {Object} - the associated instance data
    @throws error if a jQuery problem getting data
    ###
    _getInst: (target) ->
      try
        return $.data(target, PROP_NAME)
      catch err
        throw "Missing instance data for this selectbox"
      return


    ###*
    Get a setting value, defaulting if necessary

    @param {Object} inst
    @param {String} name
    ###
    _get: (inst, name) ->
      (if inst.settings[name] isnt `undefined` then inst.settings[name] else @_defaults[name])


  ###*
  Invoke the selectbox functionality.
  
  @param {Object|String} options
  @return {Object}
  ###
  $.fn.selectbox = (options) ->
    otherArgs = Array::slice.call(arguments, 1)
    return $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this[0]].concat(otherArgs))  if typeof options is "string" and options is "isDisabled"
    return $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this[0]].concat(otherArgs))  if options is "option" and arguments.length is 2 and typeof arguments[1] is "string"
    @each ->
      (if typeof options is "string" then $.selectbox["_" + options + "Selectbox"].apply($.selectbox, [this].concat(otherArgs)) else $.selectbox._attachSelectbox(this, options))
      return


  $.selectbox = new Selectbox() # singleton instance
  $.selectbox.version = "0.3"
  return
) jQuery
