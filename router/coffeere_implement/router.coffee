Event = require './event'
_getParams = (path)->
	params = []
	patten = path.replace /\/:([^/]+)/g, (s0, param)->
		params.push(param)
		return ''
	return {
		patten: patten
		params: params
	}

clickEvent = 'click' #document && document.ontouchstart ? 'touchstart':

_clickHandler = (e)->
	el = e.target
	while el and el.nodeName != 'A'
		el = el.parentNode
	if !el or el.nodeName != 'A' or el.hasAttribute('download') or el.hasAttribute('data-escape')  or !el.hasAttribute('href') or (el.target and el.target != '_self') or el.href.indexOf(location.href.match(/^.+?\/\/+[^\/]+/)[0]) == -1
		return
	e.preventDefault()
	if el.href != location.href
		path = el.href.replace(@location.origin, '')
		@go(path, el.title or document.title)

_getQuery=()->
	q = {}
	location.href.replace /[?&](.+?)=([^&]*)/g, (_, k, v)-> q[k] = decodeURIComponent(v)
	return q


class Router extends Event
	constructor: (root) ->
		super()
		@root = root or ''
		@routes = []
		@currentUrl = @root
		@location = window.location
		@history = window.history
		@started = false
		return @

	use: (path, callback) ->
		route = _getParams(path)
		that = @
		@routes.push {
			path
			patten: route.patten
			callback: ->
				that.publish(Router.stateChange, path)
				callback&&callback.apply(@,arguments)
			params: route.params
		}
		return @

	refresh: (path, hasRoot = false)->
		if hasRoot then  @currentUrl = @location.pathname.replace(@root, '') else @currentUrl = path
		@routes.forEach (item)=>
			if item.params.length is 0 and item.patten is @currentUrl
				item.callback.apply(@)
			else if item.params.length isnt 0 and 0 is @currentUrl.indexOf(item.patten)
				item.callback.apply(@, @currentUrl.replace(item.patten, '').split('/').slice(1))
		return @

#  Go to the path
#  @param {string} path - destination path
#  @param {string} title - page title
#  @param {boolean} shouldReplace - use replaceState or pushState
#  @returns {boolean} - route not found flag
	go: (path, title, shouldReplace = false) ->
		path = @location.origin + @root + path
		title = title || document.title

		if shouldReplace then @history.replaceState(null, title, path) else @history.pushState(null, title, path)
		document.title = title
		@refresh path, true
		return @

	query: _getQuery


	start: ->
		if @started
			return @
		window.addEventListener 'popstate', (-> @refresh(location.pathname, true)).bind(this), false
		document.addEventListener clickEvent, _clickHandler.bind(@)
		path = @location.pathname.replace(@root, '') || '/'
		@refresh path, !@root
		@started = true
		return @

	stop: ->
		if not @started
			return @
		window.removeEventListener 'popstate', @refresh.bind(this), false
		document.removeEventListener clickEvent, _clickHandler.bind(@)
		@started = false
		return @

Router.stateChange = "STATE_CHANGE"
Router.query=_getQuery

module.exports = Router