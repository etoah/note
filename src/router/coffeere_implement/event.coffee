#事件分发
class Event
	constructor: ()->
#储存订阅事件
		@subscription = {}

#订阅
#@type 事件类型
#@fn 事件的回调函数
#@cons 执行回调函数的对象
	subscribe: (type, fn, cons)->
		if "undefined" is typeof @subscription.eventmap
			@subscription.eventmap = {}
		if "undefined" is typeof @subscription[type]
			@subscription[type] = []
		p = @subscription[type]
		r = false
		if p.length > 0
			f = fn.toString()
			r = !@each.call(p, (item)->
				if item and f is item.response.toString() and cons and cons is item.caller
					return false
			)
		if false is r
			id = Math.floor(Math.random() * 1000000000000000).toString(36)
			@subscription.eventmap[id] = type
			p.push({"id": id, "response": fn, "caller": cons})
		return id

#触发事件
#@type 事件类型
#如果还有其它参数，则会传入回调函数
	publish: (type)->
		p = @subscription[type]
		if p and p.length
			params = if arguments.length > 1 then Array.prototype.slice.call(arguments,1) else []
			@each.call(p, (item)->
				if item
					cons = item.caller || null
					item.response.apply(cons, params)
			)
		return @

#取消订阅，如果没有参数，则取消所有订阅
#@id 订阅时生成的ID或订阅的事件类型
#@handle 如果handle值为"type",则@id表示订阅事件类型,此时将取消所有此类型订阅
	unsubscribe: (id, handle)->
		if "string" is typeof id
			if "type" is handle
				@subscription[type] and (@subscription[type].length = 0)
			else
				map = @subscription.eventmap
				type = map[id]
				if type
					p = @subscription[type]
					if p and p.length > 0
						@each.call(p, (item, index)->
							if item and id is item.id
#p.splice(index, 1)
								p[index] = null
								map[id] = null
								delete map[id]
								return false
						)
		else
			@subscription = {}
		return @

#遍历对象或数组，遍历时如果返回false,则退出循环
	each: (fn)->
		len = @length
		params = arguments.length > 1 and Array.prototype.slice.call(arguments, 1) or []
		if len
			for item, index in @
				result = fn.apply(@, [item, index].concat(params))
				if result is false
					return false
		else
			for key, item of @
				if @hasOwnProperty(key)
					result = fn.apply(@, [item, key].concat(params))
					if result is false
						return false
		return true

module.exports = Event
