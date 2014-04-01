!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sfz=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var sfz = _dereq_('./src/sfz')
  , AjaxLoader = _dereq_("./src/client/ajax_loader")

sfz.WebAudioSynth = _dereq_("./src/client/web_audio_synth")

sfz.load = function(audioContext, url, callback){
  var self = this
  AjaxLoader.load(url, function(str){
    var instrument = self.parse(str, sfz.WebAudioSynth, audioContext)
    callback(instrument)
  })
}

module.exports = sfz

},{"./src/client/ajax_loader":3,"./src/client/web_audio_synth":15,"./src/sfz":21}],2:[function(_dereq_,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}],3:[function(_dereq_,module,exports){
module.exports = {
  load: function(url, callback){
    var request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "text"

    var loader = this

    request.onload = function(){
      var pathString = request.response.replace(/\\/g,"/")
      callback(pathString)
    }

    request.send()
  }
}

},{}],4:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")
  , EnvelopeGenerator = _dereq_("./envelope_generator")
  , LFO = _dereq_("./lfo")
  , Signal = _dereq_("./signal")
  , AudioMath = _dereq_("./audio_math")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var Amplifier = function(opts){
  this.context = opts.context
  this.input = opts.context.createGainNode()
  this.output = opts.context.createGainNode()
  this.input.connect(this.output)

  var depth = AudioMath.dbToGain(opts.lfo_depth)
    , velScalar = opts.velocity / 127.0

  this.lfo = new LFO({
    context: opts.context,
    delay: opts.lfo_delay,
    fade: opts.lfo_fade,
    freq: opts.lfo_freq,
    hold: opts.lfo_hold,
    depth: depth,
    depthchanaft: opts.lfo_depthchanaft,
    depthpolyaft: opts.lfo_depthpolyaft,
    freqchanaft: opts.lfo_freqchanaft,
    freqpolyaft: opts.lfo_freqpolyaft
  })


  var volume = opts.volume || 0

  var db = -20 * Math.log(Math.pow(127, 2) / Math.pow(opts.velocity, 2))
    , noteGainAdj = (opts.pitch - opts.keycenter) * opts.keytrack

  db = volume + db + noteGainAdj

  var velGainAdj = (opts.veltrack / 100.0) * velScalar
    , gain = AudioMath.dbToGain(db)

  gain = gain + (gain * velGainAdj)

  this.gainSignal = new Signal({
    context: opts.context,
    value: gain
  })
  this.gainSignal.connect(this.input.gain)
  this.gainSignal.start()
  this.lfo.connect(this.input.gain)

  this.eg_release = opts.eg_release + opts.eg_vel2release * velScalar

  this.eg = new EnvelopeGenerator({
    context: opts.context,
    delay: opts.eg_delay + opts.eg_vel2delay * velScalar,
    start: opts.eg_start,
    attack: opts.eg_attack + opts.eg_vel2attack * velScalar,
    hold: opts.eg_hold + opts.eg_vel2hold * velScalar,
    decay: opts.eg_decay + opts.eg_vel2decay * velScalar,
    sustain: opts.eg_sustain + opts.eg_vel2sustain * velScalar,
    release: this.eg_release,
    depth: 100
  }, { pitch: opts.pitch, velocity: opts.velocity })

  this.eg.connect(this.output.gain)
}

Amplifier.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Amplifier.prototype.disconnect = function(output){
  this.output.disconnect(output)
}

Amplifier.prototype.trigger = function(onended){
  this.eg.onended = onended

  this.lfo.start()
  this.eg.trigger()
}

Amplifier.prototype.triggerRelease = function(){
  this.eg.triggerRelease()
}

Amplifier.prototype.destroy = function(){
  this.lfo.destroy()
  this.eg.destroy()
  this.input.disconnect()
  this.output.disconnect()
  this.gainSignal.stop()
  this.gainSignal = null
  this.input = null
  this.output = null
  this.lfo = null
  this.eg = null
}

Amplifier.prototype.onended = function(){}

module.exports = Amplifier

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],5:[function(_dereq_,module,exports){
module.exports = {
  dbToGain: function(db){
    return Math.pow(10, (db / 20.0 )) * 1.0
  },

  adjustFreqByCents: function(freq, cents){
    return freq * Math.pow((Math.pow(2, 1/1200)), cents)
  }
}

},{}],6:[function(_dereq_,module,exports){
function BufferLoader(urlList, callback, audioContext){
  this.audioContext = audioContext
  this.urlList = urlList
  this.onload = callback
  this.bufferList = new Array()
  this.loadCount = 0
}

BufferLoader.cache = {}

BufferLoader.prototype.loadBuffer = function(url, index, retries){
  var self = this
  var saneUrl = url.split("?date")[0]
  if (BufferLoader.cache[saneUrl]) {
    return this.onload([BufferLoader.cache[saneUrl]])
  }

  var request = new XMLHttpRequest()
  request.open("GET", url, true)
  request.responseType = "arraybuffer"

  var loader = this

  request.onload = function(){
    self.audioContext.decodeAudioData(
      request.response,
      function(buffer){
        if (!buffer) return;
        loader.bufferList[index] = buffer
        BufferLoader.cache[saneUrl] = buffer
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList)
      }, function(e){}
    )
  }

  request.send()
}

BufferLoader.prototype.load = function(){
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i, 0)
}

module.exports = BufferLoader

},{}],7:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var BufferSource = function(opts){
  this.buffer = opts.buffer
  this.opts = opts
  this.bend = opts.bend

  this.updatePlaybackRate = function(){
    var opts = this.opts
    var cents = ((opts.pitch - opts.keycenter) * opts.keytrack) + opts.tune
    cents += (opts.veltrack * opts.velocity / 127)

    var bendRange = 8191
      , bendDepth = opts.bend_up

    if (this.bend < 0) {
      bendRange = -8192
      bendDepth = opts.bend_down
    }

    cents += bendDepth * this.bend / bendRange

    var noteFreq = pitchToFreq(opts.pitch + opts.transpose) * Math.pow((Math.pow(2, 1/1200)), cents)
      , playbackRate = noteFreq / pitchToFreq(opts.keycenter)

    this.playbackRate.value = playbackRate
  }

  this.pitchBend = function(bend){
    this.bend = bend
    this.updatePlaybackRate()
  }

  this.updatePlaybackRate()
}


var BufferSourceFactory = function(opts){
  var source = opts.context.createBufferSource()
  BufferSource.call(source, opts)

  return source
}

module.exports = BufferSourceFactory

},{"underscore":2}],8:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")

var defaults = {
  delay: 0,
  start: 0,
  attack: 0,
  hold: 0,
  decay: 0,
  release: 0,
  sustain: 100,
  depth: 100
}

var EnvelopeGenerator = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)
}

EnvelopeGenerator.prototype.onended = function(){}

EnvelopeGenerator.prototype.trigger = function(){
  var now = this.context.currentTime
  var attackTime = now + this.attack
    , holdTime = attackTime + this.hold
    , decayTime = holdTime + this.decay
    , maxValue = this.depth / 100
    , sustainLevel = this.sustain / 100

  //console.log(attackTime, holdTime, decayTime, maxValue, sustainLevel)

  this.param.cancelScheduledValues(now)
  this.param.setValueAtTime(0, now)
  this.param.linearRampToValueAtTime(maxValue, attackTime)
  this.param.setValueAtTime(maxValue, holdTime)
  this.param.linearRampToValueAtTime(sustainLevel, decayTime)
}

EnvelopeGenerator.prototype.triggerRelease = function(){
  var now = this.context.currentTime
  //console.log("release start", this.param, this.param.value)
  this.param.cancelScheduledValues(0)
  this.param.setValueAtTime(this.param.value, now)
  this.param.linearRampToValueAtTime(0, now + this.release)
  setTimeout(function(){
    //console.log("release done", this.param.value)
    this.onended()
  }.bind(this), this.release * 1000 + 5)
}

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param
}

EnvelopeGenerator.prototype.destroy = function(destroy) {
  this.param = null
}

module.exports = EnvelopeGenerator

},{"underscore":2}],9:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")
  , AudioMath = _dereq_("./audio_math")

var defaults = {
  freq1: 50,
  freq2: 500,
  freq3: 5000,
  vel2freq1: 0,
  vel2freq2: 0,
  vel2freq3: 0,
  bw1: 1,
  bw2: 1,
  bw3: 1,
  gain1: 0,
  gain2: 0,
  gain3: 0,
  vel2gain1: 0,
  vel2gain2: 0,
  vel2gain3: 0,
  velocity: 0
}

var bwToQ = function(bw){
  var x = Math.pow(2, bw)
  return Math.sqrt(x) / (x - 1)
}

var Equalizer = function(opts){
  _.defaults(opts, defaults)

  var velScalar = opts.velocity / 127

  this.input = this.eq1 = opts.context.createBiquadFilter()
  this.eq2 = opts.context.createBiquadFilter()
  this.output = this.eq3 = opts.context.createBiquadFilter()

  this.input.connect(this.eq2)
  this.eq2.connect(this.output)

  // All of these are "peaking"-type filters
  this.eq1.type = 5
  this.eq2.type = 5
  this.eq3.type = 5

  this.eq1.frequency.value = opts.freq1 + opts.vel2freq1 * velScalar
  this.eq2.frequency.value = opts.freq2 + opts.vel2freq2 * velScalar
  this.eq3.frequency.value = opts.freq3 + opts.vel2freq3 * velScalar

  this.eq1.Q.value = bwToQ(opts.bw1)
  this.eq2.Q.value = bwToQ(opts.bw2)
  this.eq3.Q.value = bwToQ(opts.bw3)

  this.eq1.gain.value = AudioMath.dbToGain(opts.gain1 + opts.vel2gain1 * velScalar)
  this.eq2.gain.value = AudioMath.dbToGain(opts.gain2 + opts.vel2gain2 * velScalar)
  this.eq3.gain.value = AudioMath.dbToGain(opts.gain3 + opts.vel2gain3 * velScalar)
}

Equalizer.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Equalizer.prototype.disconnect = function(output){
  this.output.disconnect(output)
}

Equalizer.prototype.destroy = function(){
  this.disconnect()
}

module.exports = Equalizer

},{"./audio_math":5,"underscore":2}],10:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")
  , EnvelopeGenerator = _dereq_("./envelope_generator")
  , LFO = _dereq_("./lfo")
  , Signal = _dereq_("./signal")
  , AudioMath = _dereq_("./audio_math")

var FILTER_TYPES = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "peaking",
  "notch",
  "allpass"
]

//TODO - update this for 1-pole filters when the web audio API
 //makes the filter coefficients available
var filter_map = {
  "lpf_1p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_1p": FILTER_TYPES.indexOf("highpass"),
  "lpf_2p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_2p": FILTER_TYPES.indexOf("highpass"),
  "bpf_2p": FILTER_TYPES.indexOf("bandpass"),
  "brf_2p": FILTER_TYPES.indexOf("notch")
}

var defaults = {
  type: "lpf_2p",
  cutoff: null,
  cutoff_chanaft: 0,
  cutoff_polyaft: 0,
  resonance: 0,
  keytrack: 0,
  keycenter: 60,
  veltrack: 0,
  random: 0
}

var Filter = function(opts, noteOn){
  opts.type = filter_map[opts.type]
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  var noteCutoffAdj = (noteOn.pitch - this.keycenter) * this.keytrack
    , velScalar = noteOn.velocity / 127.0
    , velCutoffAdj = this.veltrack * velScalar
    , cutoffAdj = noteCutoffAdj + velCutoffAdj
    , cutoffValue = this.cutoff + cutoffAdj

  var cutoffSignal = new Signal({
    context: opts.context,
    value: cutoffValue
  })
  cutoffSignal.connect(this.frequency)
  cutoffSignal.start()

  this.eg = new EnvelopeGenerator({
    context: opts.context,
    delay: opts.eg_delay + opts.eg_vel2delay * velScalar,
    start: opts.eg_start,
    attack: opts.eg_attack + opts.eg_vel2attack * velScalar,
    hold: opts.eg_hold + opts.eg_vel2hold * velScalar,
    decay: opts.eg_decay + opts.eg_vel2decay * velScalar,
    sustain: opts.eg_sustain + opts.eg_vel2sustain * velScalar,
    release: opts.eg_release + opts.eg_vel2release * velScalar,
    depth: 100
  }, { pitch: opts.pitch, velocity: opts.velocity })

  this.eg.connect(this.frequency)

  var freq2 = AudioMath.adjustFreqByCents(cutoffValue, this.lfo_depth)
    , depth = freq2 - cutoffValue

  this.lfo = new LFO({
    context: this.context,
    delay: this.lfo_delay,
    fade: this.lfo_fade,
    freq: this.lfo_freq,
    hold: this.lfo_hold,
    depth: depth,
    depthchanaft: this.lfo_depthchanaft,
    depthpolyaft: this.lfo_depthpolyaft,
    freqchanaft: this.lfo_freqchanaft,
    freqpolyaft: this.lfo_freqpolyaft
  })
  this.lfo.connect(this.frequency)

  this.Q.value = this.resonance

  this.trigger = function(){
    this.lfo.start()
    this.eg.trigger()
  }

  this.destroy = function(){
    this.lfo.destroy()
    this.eg.destroy()
  }

}


var FilterFactory = function(opts, noteOn){
  var filter = opts.context.createBiquadFilter()
  Filter.call(filter, opts, noteOn)

  return filter
}

module.exports = FilterFactory

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],11:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")
  , AudioMath = _dereq_("./audio_math")

var defaults = {
  delay: 0,
  fade: 0,
  freq: 0,
  hold: 0,
  depth: 0,
  depthchanaft: 0,
  depthpolyaft: 0,
  freqchanaft: 0,
  freqpolyaft: 0
}

var LFO = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.oscillator = this.context.createOscillator()
  this.oscillator.frequency.value = this.freq
  this.gainNode = this.context.createGainNode()
  this.oscillator.connect(this.gainNode)
}

LFO.prototype.start = function(){
  var now = this.context.currentTime
    , delayTime = now + this.delay
    , fadeTime = delayTime + this.fade

  this.gainNode.gain.setValueAtTime(0, now)
  this.gainNode.gain.setValueAtTime(0, delayTime)
  this.gainNode.gain.linearRampToValueAtTime(this.depth, fadeTime)
  this.oscillator.start(delayTime)
}

LFO.prototype.connect = function(param){
  this.gainNode.connect(param)
}

LFO.prototype.destroy = function(){
  this.oscillator.stop()
  this.oscillator.disconnect()
  this.gainNode.disconnect()
}

module.exports = LFO

},{"./audio_math":5,"underscore":2}],12:[function(_dereq_,module,exports){
var _ = _dereq_("underscore")
  , EnvelopeGenerator = _dereq_("./envelope_generator")
  , LFO = _dereq_("./lfo")
  , Signal = _dereq_("./signal")
  , AudioMath = _dereq_("./audio_math")


var defaults = {
  pan: 0,
  width: 0,
  position: 0
}

var Panner = function(opts){
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.updatePosition = function(position){
    this.panningModel = "equalpower"
    this.distanceModel = "linear"

    var xDeg = position * 45.0
    var zDeg = xDeg + 90
    if (zDeg > 90) zDeg = 180 - zDeg

    var scale = 10
    var x = Math.sin(xDeg * (Math.PI / 180)) * scale

    this.setPosition(x, 0, -1)
  }

  this.updatePosition(this.position)
}


var PannerFactory = function(opts){
  var panner = opts.context.createPanner()
  Panner.call(panner, opts)

  return panner
}

module.exports = PannerFactory

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],13:[function(_dereq_,module,exports){
var Signal = function(opts){
  this.context = opts.context
  if (typeof opts.value == "undefined") opts.value == 1

  var buffer = opts.context.createBuffer(1, 1024, opts.context.sampleRate)

  var data = buffer.getChannelData(0)

  for (var i=0; i < data.length; i++) {
    data[i] = opts.value
  }

  this.buffer = buffer
  this.loop = true
}

var SignalFactory = function(opts){
  var source = opts.context.createBufferSource()
  Signal.call(source, opts)

  return source
}

module.exports = SignalFactory

},{}],14:[function(_dereq_,module,exports){
var BufferSource = _dereq_("./buffer_source")
  , Filter = _dereq_("./filter")
  , Amplifier = _dereq_("./amplifier")
  , Panner = _dereq_("./panner")
  , Equalizer = _dereq_("./equalizer")

var voiceNumber = 0

var sampleRate = 48000

var model = function(buffer, region, noteOn, audioContext, bend){
  this.audioContext = audioContext
  this.voiceId = "voice" + voiceNumber
  voiceNumber += 1

  this.output = audioContext.createGainNode()

  this.setupSource(buffer, region, noteOn, bend)
  this.setupFilter(region, noteOn)
  this.setupAmp(region, noteOn)
  this.setupPanner(region, noteOn)
  this.setupEqualizer(region, noteOn)

  if (region.offset && region.end) {
    this.offset = region.offset / sampleRate
    this.end = region.end / sampleRate
    this.duration = this.end - this.offset
  }

  if (this.filter) {
    this.source.connect(this.filter)
    this.filter.connect(this.amp.input)
  } else {
    this.source.connect(this.amp.input)
  }

  this.amp.connect(this.panner)
  this.panner.connect(this.equalizer.input)
  this.equalizer.connect(this.output)
}

model.prototype.setupSource = function(buffer, region, noteOn, bend){
  this.source = new BufferSource({
    context: this.audioContext,
    buffer: buffer,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.pitch_keycenter,
    keytrack: region.pitch_keytrack,
    transpose: region.transpose,
    tune: region.tune,
    veltrack: region.pitch_veltrack,
    bend: bend,
    bend_up: region.bend_up,
    bend_down: region.bend_down,
    bend_step: region.bend_step
  })

  if (region.loop_start && region.loop_end && region.loop_mode == "loop_continuous") {
    this.source.loopStart = region.loop_start / sampleRate
    this.source.loopEnd = region.loop_end / sampleRate
    this.source.loop = true
  }
}

model.prototype.setupAmp = function(region, noteOn){
  this.amp = new Amplifier({
    context: this.audioContext,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.amp_keycenter,
    keytrack: region.amp_keytrack,
    veltrack: region.amp_veltrack,
    eg_delay: region.ampeg_delay,
    eg_start: region.ampeg_start,
    eg_attack: region.ampeg_attack,
    eg_hold: region.ampeg_hold,
    eg_decay: region.ampeg_decay,
    eg_sustain: region.ampeg_sustain,
    eg_release: region.ampeg_release,
    eg_vel2delay: region.ampeg_vel2delay,
    eg_vel2attack: region.ampeg_vel2attack,
    eg_vel2hold: region.ampeg_vel2hold,
    eg_vel2decay: region.ampeg_vel2decay,
    eg_vel2sustain: region.ampeg_vel2sustain,
    eg_vel2release: region.ampeg_vel2release,
    lfo_delay: region.amplfo_delay,
    lfo_fade: region.amplfo_fade,
    lfo_freq: region.amplfo_freq,
    lfo_depth: region.amplfo_depth,
    lfo_depthchanaft: region.amplfo_depthchanaft,
    lfo_depthpolyaft: region.amplfo_depthpolyaft,
    lfo_freqchanaft: region.amplfo_freqchanaft,
    lfo_freqpolyaft: region.amplfo_freqpolyaft
  })
}

model.prototype.setupFilter = function(region, noteOn){
  if (!region.cutoff) return;

  this.filter = new Filter({
    context: this.audioContext,
    type: region.fil_type,
    cutoff: region.cutoff,
    cutoff_chanaft: region.cutoff_chanaft,
    cutoff_polyaft: region.cutoff_polyaft,
    resonance: region.resonance,
    keytrack: region.fil_keytrack,
    keycenter: region.fil_keycenter,
    veltrack: region.fil_veltrack,
    random: region.fil_random,
    eg_delay: region.fileg_delay,
    eg_start: region.fileg_start,
    eg_attack: region.fileg_attack,
    eg_hold: region.fileg_hold,
    eg_decay: region.fileg_decay,
    eg_sustain: region.fileg_sustain,
    eg_release: region.fileg_release,
    eg_vel2delay: region.fileg_vel2delay,
    eg_vel2attack: region.fileg_vel2attack,
    eg_vel2hold: region.fileg_vel2hold,
    eg_vel2decay: region.fileg_vel2decay,
    eg_vel2sustain: region.fileg_vel2sustain,
    eg_vel2release: region.fileg_vel2release,
    lfo_delay: region.fillfo_delay,
    lfo_fade: region.fillfo_fade,
    lfo_freq: region.fillfo_freq,
    lfo_depth: region.fillfo_depth,
    lfo_depthchanaft: region.fillfo_depthchanaft,
    lfo_depthpolyaft: region.fillfo_depthpolyaft,
    lfo_freqchanaft: region.fillfo_freqchanaft,
    lfo_freqpolyaft: region.fillfo_freqpolyaft
  }, noteOn)
}

model.prototype.setupPanner = function(region, noteOn){
  this.panner = new Panner({
    context: this.audioContext,
    pan: region.pan,
    width: region.width,
    position: region.position
  })
}

model.prototype.setupEqualizer = function(region, noteOn){
  this.equalizer = new Equalizer({
    context: this.audioContext,
    velocity: noteOn.velocity,
    freq1: region.eq1_freq,
    freq2: region.eq2_freq,
    freq3: region.eq3_freq,
    vel2freq1: region.eq1_vel2freq,
    vel2freq2: region.eq2_vel2freq,
    vel2freq3: region.eq3_vel2freq,
    bw1: region.eq1_bw,
    bw2: region.eq2_bw,
    bw3: region.eq3_bw,
    gain1: region.eq1_gain,
    gain2: region.eq2_gain,
    gain3: region.eq3_gain,
    vel2gain1: region.eq1_vel2gain,
    vel2gain2: region.eq2_vel2gain,
    vel2gain3: region.eq3_vel2gain
  })
}

model.prototype.start = function(){
  var self = this
  var onended = function(){
    self.source.stop()
    self.destroy()
  }
  this.amp.trigger(onended)
  if (this.filter) this.filter.trigger()
  if (this.offset && this.duration) {
    this.source.start(0, this.offset, this.duration)
  } else {
    this.source.start(0)
  }
}

model.prototype.stop = function(){
  this.amp.triggerRelease()
}

model.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.equalizer.disconnect(output)
}

model.prototype.destroy = function(){
  if (this.filter) this.filter.destroy()
  this.amp.destroy()
  this.panner.disconnect()
  this.equalizer.destroy()

  this.source = null
  this.filter = null
  this.amp = null
  this.panner = null
  this.equalizer = null

  if (this.onended) this.onended()
}

model.prototype.pitchBend = function(bend){
  this.source.pitchBend(bend)
}

module.exports = model

},{"./amplifier":4,"./buffer_source":7,"./equalizer":9,"./filter":10,"./panner":12}],15:[function(_dereq_,module,exports){
var BufferLoader = _dereq_("./buffer_loader")
  , Voice = _dereq_("./voice")
  , _ = _dereq_("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
  var sampleUrls = _(instrument.samples()).uniq()
  this.loadBuffers(sampleUrls)
  this.voicesToRelease = {}
  this.activeVoices = window.voices = {}
  this.bend = 0
}

player.prototype.loadBuffers = function(urls){
  this.samples = urls
  urls = _(urls).map(function(url){ return encodeURIComponent(url) })
  var loader = new BufferLoader(urls, this.onBuffersLoaded.bind(this), this.context)
  loader.load()
}

player.prototype.onBuffersLoaded = function(buffers){
  console.log("audio buffer loaded")
  var self = this
  this.buffers = {}

  _(this.samples).each(function(url, i){
    self.buffers[url] = buffers[i]
  })
}

player.prototype.play = function(region, noteOn){
  var buffer = this.buffers[region.sample]
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[noteOn.pitch] = voicesToRelease[noteOn.pitch] || []

  var voice = new Voice(buffer, region, noteOn, this.context, this.bend)
  self.activeVoices[voice.voiceId] = voice
  voice.onended = function(){
    delete self.activeVoices[voice.voiceId]
  }
  if (region.trigger == "attack") {
    voicesToRelease[noteOn.pitch].push(voice)
  }
  voice.connect(this.context.destination)
  voice.start()
}

player.prototype.stop = function(pitch){
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[pitch] = voicesToRelease[pitch] || []

  _(voicesToRelease[pitch]).each(function(voice){
    voice.stop()
  })
  voicesToRelease[pitch] = []
  //var voiceToRelase = voicesToRelease[noteOn.pitch][region.regionId]
  //if (voiceToRelase) voiceToRelase.stop()
  //voicesToRelease[noteOn.pitch][region.regionId] = null
}

player.prototype.pitchBend = function(channel, bend){
  _(this.activeVoices).invoke("pitchBend", bend)
  this.bend = bend
}

module.exports = player

},{"./buffer_loader":6,"./voice":14,"underscore":2}],16:[function(_dereq_,module,exports){
var  Region = _dereq_("./region")
  , NullSynth = _dereq_("./null_synth")
  , _ = _dereq_("underscore")

model = function(opts){
  opts = opts || {}
  opts.regions = opts.regions || []

  this.regions = _(opts.regions).map(function(regionDefinition){
    return new Region(regionDefinition)
  })

  this.control = opts.control

  this.bend = 0
  this.chanaft = 64
  this.polyaft = 64
  this.bpm = 120

  if (opts.driver) {
    this.synth = new opts.driver(this, opts.audioContext)
  } else {
    this.synth = new NullSynth()
  }
}

model.prototype.shouldPlayRegion = function(region, noteOn, rand){
  return region.sample != null &&
    region.lochan <= noteOn.channel &&
    region.hichan >= noteOn.channel &&
    region.lokey <= noteOn.pitch &&
    region.hikey >= noteOn.pitch &&
    region.lovel <= noteOn.velocity &&
    region.hivel >= noteOn.velocity &&
    region.lobend <= this.bend &&
    region.hibend >= this.bend &&
    region.lochanaft <= this.chanaft &&
    region.hichanaft >= this.chanaft &&
    region.lopolyaft <= this.polyaft &&
    region.hipolyaft >= this.polyaft &&
    region.lorand <= rand &&
    region.hirand >= rand &&
    region.lobpm <= this.bpm &&
    region.hibpm >= this.bpm
}

model.prototype.regionsToPlay = function(noteOn, rand){
  var self = this
  return _(this.regions).filter(function(region){
    return self.shouldPlayRegion(region, noteOn, rand)
  })
}

model.prototype.random = function(){
  return Math.random()
}

model.prototype.noteOn = function(channel, pitch, velocity){
  var rand = this.random()
  var noteOn = {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }

  if (noteOn.velocity > 0) {
    var regions = this.regionsToPlay(noteOn, rand)
    _(regions).each(function(region){
      this.play(region, noteOn)
    }.bind(this))
  } else {
    this.stop(noteOn.pitch)
  }
}

model.prototype.play = function(region, noteOn){
  this.synth.play(region, noteOn)
}

model.prototype.stop = function(pitch){
  this.synth.stop(pitch)
}

model.prototype.samples = function(){
  var samples = []
  _(this.regions).each(function(region){
    if (region.sample) samples.push(region.sample)
  })
  return samples
}

model.prototype.pitchBend = function(channel, bend){
  this.synth.pitchBend(channel, bend)
  this.bend = bend
}

model.prototype.connect = function(destination, output){
  this.synth.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.synth.connect(output)
}

module.exports = model

},{"./null_synth":17,"./region":20,"underscore":2}],17:[function(_dereq_,module,exports){
model = function(opts){
}

module.exports = model

},{}],18:[function(_dereq_,module,exports){
var  _ = _dereq_("underscore")

var MAX_INT = 4294967296
  , MAX_BEND = 9600

Parameter = function(opts){
}

var defaults = {
  lochan: {
    value: 0,
    min: 0,
    max: 15
  },
  hichan: {
    value: 15,
    min: 0,
    max: 15
  },
  lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  lovel: {
    value: 0,
    min: 0,
    max: 127
  },
  hivel: {
    value: 127,
    min: 0,
    max: 127
  },
  lobend: {
    value: -8192,
    min: -8192,
    max: 8192
  },
  hibend: {
    value: 8192,
    min: -8192,
    max: 8192
  },
  lochanaft: {
    value: 0,
    min: 0,
    max: 127
  },
  hichanaft: {
    value: 127,
    min: 0,
    max: 127
  },
  lopolyaft: {
    value: 0,
    min: 0,
    max: 127
  },
  hipolyaft: {
    value: 127,
    min: 0,
    max: 127
  },
  lorand: {
    value: 0,
    min: 0,
    max: 1
  },
  hirand: {
    value: 1,
    min: 0,
    max: 1
  },
  lobpm: {
    value: 0,
    min: 0,
    max: 500
  },
  hibpm: {
    value: 500,
    min: 0,
    max: 500
  },
  seq_length: {
    value: 1,
    min: 1,
    max: 100
  },
  seq_position: {
    value: 1,
    min: 1,
    max: 100
  },
  sw_lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  sw_last: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_down: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_up: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_previous: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_vel: {
    value: "current",
    allowedValues: ["current", "previous"]
  },
  trigger: {
    value: "attack",
    allowedValues: ["attack", "release", "first", "legato"]
  },
  group: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  off_by: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  off_mode: {
    value: "fast",
    allowedValues: ["fast", "normal"]
  },
  delay: {
    value: 0,
    min: 0,
    max: 100
  },
  delay_random: {
    value: 0,
    min: 0,
    max: 100
  },
  offset: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  offset_random: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  end: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  count: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  loop_mode: {
    value: null,
    allowedValues: ["no_loop", "one_shot", "loop_continuous", "loop_sustain"]
  },
  loop_start: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  loop_end: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  sync_beats: {
    value: 0,
    min: 0,
    max: 32
  },
  sync_offset: {
    value: 0,
    min: 0,
    max: 32
  },
  transpose: {
    value: 0,
    min: -127,
    max: 127
  },
  tune: {
    value: 0,
    min: -100,
    max: 100
  },
  pitch_keycenter: {
    value: 60,
    min: -127,
    max: 127
  },
  pitch_keytrack: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitch_veltrack: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  pitch_random: {
    value: 0,
    min: 0,
    max: MAX_BEND
  },
  bend_up: {
    value: 200,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  bend_down: {
    value: -200,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  bend_step: {
    value: 1,
    min: 1,
    max: 1200
  },
  pitcheg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_sustain: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  pitcheg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  pitchlfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitchlfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  pitchlfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  pitchlfo_depth: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_depthchanaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_depthpolyaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  pitchlfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },
  fil_type: {
    value: "lpf_2p",
    allowedValues: ["lpf_1p", "hpf_1p", "lpf_2p", "hpf_2p", "bpf_2p", "brf_2p"]
  },
  cutoff: {
    value: null,
    min: 0,
    max: 22050
  },
  cutoff_chanaft: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  cutoff_polyaft: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  resonance: {
    value: 0,
    min: 0,
    max: 40
  },
  fil_keytrack: {
    value: 0,
    min: 0,
    max: 1200
  },
  fil_keycenter: {
    value: 60,
    min: 0,
    max: 127
  },
  fil_veltrack: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  fil_random: {
    value: 0,
    min: 0,
    max: MAX_BEND
  },
  fileg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_sustain: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  fileg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  fillfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  fillfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  fillfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  fillfo_depth: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_depthchanaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_depthpolyaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  fillfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },

  volume: {
    value: 0,
    min: -144,
    max: 6
  },
  pan: {
    value: 0,
    min: -100,
    max: 100
  },
  width: {
    value: 0,
    min: -100,
    max: 100
  },
  position: {
    value: 0,
    min: -100,
    max: 100
  },
  amp_keytrack: {
    value: 0,
    min: -96,
    max: 12
  },
  amp_keycenter: {
    value: 60,
    min: 0,
    max: 127
  },
  amp_veltrack: {
    value: 100,
    min: -100,
    max: 100
  },
  amp_random: {
    value: 0,
    min: 0,
    max: 24
  },
  rt_decay: {
    value: 0,
    min: 0,
    max: 200
  },
  output: {
    value: 0,
    min: 0,
    max: 1024
  },
  xfin_lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  xfin_hikey: {
    value: 0,
    min: 0,
    max: 127
  },
  xfout_lokey: {
    value: 127,
    min: 0,
    max: 127
  },
  xfout_hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  xf_keycurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  xf_velcurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  xf_cccurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  ampeg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_sustain: {
    value: 100,
    min: 0,
    max: 100
  },
  ampeg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  amplfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  amplfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  amplfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  amplfo_depth: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_depthchanaft: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_depthpolyaft: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  amplfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },
  eq1_freq: {
    value: 50,
    min: 0,
    max: 30000
  },
  eq2_freq: {
    value: 500,
    min: 0,
    max: 30000
  },
  eq3_freq: {
    value: 5000,
    min: 0,
    max: 30000
  },
  eq1_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq2_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq3_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq1_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq2_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq3_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq1_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq2_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq3_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq1_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq2_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq3_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  effect1: {
    value: 0,
    min: 0,
    max: 100
  },
  effect2: {
    value: 0,
    min: 0,
    max: 100
  }

}

//_(128).times(function(i){
  //defaults["on_locc" + i] = {
    //value: -1,
    //min: 0,
    //max: 127
  //}
  //defaults["on_hicc" + i] = {
    //value: -1,
    //min: 0,
    //max: 127
  //}
  //defaults["delay_cc" + i] = {
    //value: 0,
    //min: 0,
    //max: 100
  //}
  //defaults["offset_cc" + i] = {
    //value: 0,
    //min: 0,
    //max: MAX_INT
  //}
  //defaults["pitchlfo_depthcc" + i] = {
    //value: 0,
    //min: -1200,
    //max: 1200
  //},
  //defaults["pitchlfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["cutoff_cc" + i] = {
    //value: 0,
    //min: -MAX_BEND,
    //max: MAX_BEND
  //}
  //defaults["fillfo_depthcc" + i] = {
    //value: 0,
    //min: -1200,
    //max: 1200
  //}
  //defaults["fillfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["amp_velcurve_" + i] = {
    //value: 1,
    //min: 0,
    //max: 1
  //}
  //defaults["gain_cc" + i] = {
    //value: 0,
    //min: -144,
    //max: 48
  //}
  //defaults["xfin_locc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfin_hicc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfout_locc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfout_hicc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["ampeg_delaycc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_startcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_attackcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_holdcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_decaycc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_sustaincc" + i] = {
    //value: 100,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_releasecc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["amplfo_depthcc" + i] = {
    //value: 0,
    //min: -10,
    //max: 10
  //}
  //defaults["amplfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["eq1_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq2_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq3_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq1_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq2_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq3_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq1_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
  //defaults["eq2_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
  //defaults["eq3_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
//})

Parameter.defaults = defaults

Parameter.inputControls = [
  "lochan",
  "hichan",
  "lokey",
  "hikey",
  "lovel",
  "hivel",
  "lobend",
  "hibend",
  "lochanaft",
  "hichanaft",
  "lopolyaft",
  "hipolyaft",
  "lorand",
  "hirand",
  "lobpm",
  "hibpm",
  "seq_length",
  "seq_position",
  "sw_lokey",
  "sw_hikey",
  "sw_last",
  "sw_down",
  "sw_up",
  "sw_previous",
  "sw_vel",
  "trigger",
  "group",
  "off_by",
  "off_mode"
]

_(128).times(function(i){
  Parameter.inputControls.push("on_locc" + i)
  Parameter.inputControls.push("on_hicc" + i)
})

Parameter.performanceParameters = [
  "delay",
  "delay_random",
  "offset",
  "offset_random",
  "end",
  "count",
  "loop_mode",
  "loop_start",
  "loop_end",
  "sync_beats",
  "sync_offset",
  "transpose",
  "tune",
  "pitch_keycenter",
  "pitch_keytrack",
  "pitch_veltrack",
  "pitch_random",
  "bend_up",
  "bend_down",
  "bend_step",
  "pitcheg_delay",
  "pitcheg_start",
  "pitcheg_attack",
  "pitcheg_hold",
  "pitcheg_decay",
  "pitcheg_sustain",
  "pitcheg_release",
  "pitcheg_depth",
  "pitcheg_vel2delay",
  "pitcheg_vel2attack",
  "pitcheg_vel2hold",
  "pitcheg_vel2decay",
  "pitcheg_vel2sustain",
  "pitcheg_vel2release",
  "pitcheg_vel2depth",
  "pitchlfo_delay",
  "pitchlfo_fade",
  "pitchlfo_freq",
  "pitchlfo_depth",
  "pitchlfo_depthchanaft",
  "pitchlfo_depthpolyaft",
  "pitchlfo_freqchanaft",
  "pitchlfo_freqpolyaft",
  "fil_type",
  "cutoff",
  "cutoff_chanaft",
  "cutoff_polyaft",
  "resonance",
  "fil_keycenter",
  "fil_veltrack",
  "fil_random",
  "fileg_delay",
  "fileg_start",
  "fileg_attack",
  "fileg_hold",
  "fileg_decay",
  "fileg_sustain",
  "fileg_release",
  "fileg_depth",
  "fileg_vel2delay",
  "fileg_vel2attack",
  "fileg_vel2hold",
  "fileg_vel2decay",
  "fileg_vel2sustain",
  "fileg_vel2release",
  "fileg_vel2depth",
  "fillfo_delay",
  "fillfo_fade",
  "fillfo_freq",
  "fillfo_depth",
  "fillfo_depthchanaft",
  "fillfo_depthpolyaft",
  "fillfo_freqcc",
  "fillfo_freqchanaft",
  "fillfo_freqpolyaft",
  "volume",
  "pan",
  "width",
  "position",
  "amp_keytrack",
  "amp_keycenter",
  "amp_veltrack",
  "amp_random",
  "rt_decay",
  "output",
  "xfin_lokey",
  "xfin_hikey",
  "xfout_lokey",
  "xfout_hikey",
  "xf_keycurve",
  "xfin_lovel",
  "xfout_hivel",
  "xf_velcurve",
  "xf_cccurve",
  "ampeg_delay",
  "ampeg_start",
  "ampeg_attack",
  "ampeg_hold",
  "ampeg_decay",
  "ampeg_sustain",
  "ampeg_release",
  "ampeg_vel2delay",
  "ampeg_vel2attack",
  "ampeg_vel2hold",
  "ampeg_vel2decay",
  "ampeg_vel2sustain",
  "ampeg_vel2release",
  "amplfo_delay",
  "amplfo_fade",
  "amplfo_freq",
  "amplfo_depth",
  "amplfo_depthchanaft",
  "amplfo_depthpolyaft",
  "amplfo_freqchanaft",
  "amplfo_freqpolyaft",
  "eq1_freq",
  "eq2_freq",
  "eq3_freq",
  "eq1_vel2freq",
  "eq2_vel2freq",
  "eq3_vel2freq",
  "eq1_bw",
  "eq2_bw",
  "eq3_bw",
  "eq1_gain",
  "eq2_gain",
  "eq3_gain",
  "eq1_vel2gain",
  "eq2_vel2gain",
  "eq3_vel2gain",
  "effect1",
  "effect2"
]

var seqPerformanceParameters = [
  "delay_cc",
  "offset_cc",
  "pitchlfo_depthcc",
  "pitchlfo_freqcc",
  "cutoff_cc",
  "fillfo_depthcc",
  "amp_velcurve_",
  "gain_cc",
  "xfin_locc",
  "xfin_hicc",
  "xfout_locc",
  "xfout_hicc",
  "ampeg_delaycc",
  "ampeg_startcc",
  "ampeg_attackcc",
  "ampeg_holdcc",
  "ampeg_decaycc",
  "ampeg_sustaincc",
  "ampeg_releasecc",
  "amplfo_depthcc",
  "amplfo_freqcc",
  "eq1_freqcc",
  "eq2_freqcc",
  "eq3_freqcc",
  "eq1_bwcc",
  "eq2_bwcc",
  "eq3_bwcc",
  "eq1_gaincc",
  "eq2_gaincc",
  "eq3_gaincc"
]
_(128).times(function(i){
  _(seqPerformanceParameters).each(function(paramName){
    Parameter.performanceParameters.push(paramName + i)
  })
})

var defaultValues = {}
_(defaults).each(function(settings, name){
  defaultValues[name] = settings.value
})
Parameter.defaultValues = defaultValues


module.exports = Parameter

},{"underscore":2}],19:[function(_dereq_,module,exports){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = function(instrument) { return instrument; },
        peg$c2 = null,
        peg$c3 = function(elements) {

              function extend(target, source){
                target = target || {};
                for (var prop in source) {
                  if (typeof source[prop] === 'object') {
                    target[prop] = extend(target[prop], source[prop]);
                  } else {
                    target[prop] = source[prop];
                  }
                }
                return target;
              }

              function defaults(target, source){
                target = target || {};
                for (var prop in source) {
                  if (target[prop]) continue;
                  if (typeof source[prop] === 'object') {
                    target[prop] = defaults(target[prop], source[prop]);
                  } else {
                    target[prop] = source[prop];
                  }
                }
                return target;
              }

              elements = elements !== null ? elements : [];
              var global = null;
              var masters = [];
              var controls = [];
              var groups = [];
              var regions = [];
              var curves = [];
              var lastMaster = null
                , lastControl = null
                , lastGroup = null
                , lastNode = null
              for (var i = 0; i < elements.length; i++) {
                if (elements[i] == '<global>') {
                  lastNode = global = {}
                } else if (elements[i] == '<master>') {
                  lastNode = lastMaster = { masterId: "master" + masters.length }
                } else if (elements[i] == '<group>') {
                  lastNode = lastGroup = {}
                } else if (elements[i] == '<control>') {
                  lastNode = lastControl = {}
                } else if (elements[i] == "<region>") {
                  lastNode = {}
                  lastNode.master = lastMaster
                  lastNode.groupNode = lastGroup
                  lastNode.control = lastControl
                  lastNode.regionId = "r" + regions.length
                  regions.push(lastNode)
                } else if (elements[i] == "<curve>") {
                  lastNode = {}
                  curves.push(lastNode)
                } else {
                  var param = elements[i]
                    , name = param[0]
                    , value = param[1]

                  if (lastNode) {
                    extend(lastNode, elements[i])
                  }
                }
              }

              for (var i = 0; i < curves.length; i++) {
                var curve = curves[i]
                var newCurve = {}
                for (var key in curve) {
                  if (curve.hasOwnProperty(key)) {
                    var v = key.replace("v", "")
                    newCurve[parseInt(v, 10)] = curve[key]
                  }
                }
                curves[i] = newCurve
              }

              var isEmpty = function(obj) {
                if (obj == null) return true;
                for (var key in obj) if (obj.hasOwnProperty(key)) return false;
                return true;
              };

              var regionz = []
              for (var i = 0; i < regions.length; i++) {
                var region = regions[i]
                  , regionCopy = {}

                extend(regionCopy, region)
                delete regionCopy.master
                delete regionCopy.groupNode
                delete regionCopy.control
                delete regionCopy.regionId

                if (isEmpty(regionCopy)) {
                  continue;
                }

                if (global) defaults(region, global)
                if (region.control) defaults(region, region.control)
                if (region.groupNode) defaults(region, region.groupNode)

                if (region.default_path && region.sample) {
                  region.sample = region.default_path + region.sample
                  delete region.default_path
                }

                var noteOffset = 0
                if (region.octave_offset) {
                  noteOffset += region.octave_offset * 12
                  delete region.octave_offset
                }

                if (region.note_offset) {
                  noteOffset += region.note_offset
                  delete region.note_offset
                }

                if (noteOffset) {
                  if (region.lokey) region.lokey += noteOffset
                  if (region.hikey) region.hikey += noteOffset
                  if (region.pitch_keycenter) region.pitch_keycenter += noteOffset
                  if (region.sw_lokey) region.sw_lokey += noteOffset
                  if (region.sw_hikey) region.sw_hikey += noteOffset
                  if (region.sw_last) region.sw_last += noteOffset
                  if (region.sw_down) region.sw_down += noteOffset
                  if (region.sw_up) region.sw_up += noteOffset
                  if (region.sw_previous) region.sw_previous += noteOffset
                }

                if (region.master) {
                  defaults(region, region.master)
                  if (region.lokey && region.master.lokey) {
                    if (region.lokey < region.master.lokey) {
                      region.lokey = region.master.lokey
                    }
                  }

                  if (region.hikey && region.master.hikey) {
                    if (region.hikey > region.master.hikey) {
                      region.hikey = region.master.hikey
                    }
                  }

                  if (region.lovel && region.master.lovel) {
                    if (region.lovel < region.master.lovel) {
                      region.lovel = region.master.lovel
                    }
                  }

                  if (region.hivel && region.master.hivel) {
                    if (region.hivel > region.master.hivel) {
                      region.hivel = region.master.hivel
                    }
                  }
                }
                delete region.master
                delete region.groupNode
                delete region.control
                if (region.masterId) delete region.masterId
                regionz.push(region)
              }

              return {
                type: "Instrument",
                masters: masters,
                regions: regionz,
                curves: curves
              };
            },
        peg$c4 = [],
        peg$c5 = function(head, tail) {
              var result = [head];
              for (var i = 0; i < tail.length; i++) {
                result.push(tail[i][1]);
              }
              return result;
            },
        peg$c6 = { type: "any", description: "any character" },
        peg$c7 = { type: "other", description: "header" },
        peg$c8 = "<global>",
        peg$c9 = { type: "literal", value: "<global>", description: "\"<global>\"" },
        peg$c10 = "<master>",
        peg$c11 = { type: "literal", value: "<master>", description: "\"<master>\"" },
        peg$c12 = "<region>",
        peg$c13 = { type: "literal", value: "<region>", description: "\"<region>\"" },
        peg$c14 = "<group>",
        peg$c15 = { type: "literal", value: "<group>", description: "\"<group>\"" },
        peg$c16 = "<curve>",
        peg$c17 = { type: "literal", value: "<curve>", description: "\"<curve>\"" },
        peg$c18 = { type: "other", description: "opcode directive" },
        peg$c19 = "sample=",
        peg$c20 = { type: "literal", value: "sample=", description: "\"sample=\"" },
        peg$c21 = function(value) { return { sample: value } },
        peg$c22 = "key=",
        peg$c23 = { type: "literal", value: "key=", description: "\"key=\"" },
        peg$c24 = function(value) {
            return { lokey: value, hikey: value, pitch_keycenter: value }
          },
        peg$c25 = "sw_vel=",
        peg$c26 = { type: "literal", value: "sw_vel=", description: "\"sw_vel=\"" },
        peg$c27 = "current",
        peg$c28 = { type: "literal", value: "current", description: "\"current\"" },
        peg$c29 = "previous",
        peg$c30 = { type: "literal", value: "previous", description: "\"previous\"" },
        peg$c31 = function(value) { return { sw_vel: value } },
        peg$c32 = "sw_trigger=",
        peg$c33 = { type: "literal", value: "sw_trigger=", description: "\"sw_trigger=\"" },
        peg$c34 = "attack",
        peg$c35 = { type: "literal", value: "attack", description: "\"attack\"" },
        peg$c36 = "release",
        peg$c37 = { type: "literal", value: "release", description: "\"release\"" },
        peg$c38 = "first",
        peg$c39 = { type: "literal", value: "first", description: "\"first\"" },
        peg$c40 = "legato",
        peg$c41 = { type: "literal", value: "legato", description: "\"legato\"" },
        peg$c42 = function(value) { return { sw_trigger: value } },
        peg$c43 = "off_mode=",
        peg$c44 = { type: "literal", value: "off_mode=", description: "\"off_mode=\"" },
        peg$c45 = "fast",
        peg$c46 = { type: "literal", value: "fast", description: "\"fast\"" },
        peg$c47 = "normal",
        peg$c48 = { type: "literal", value: "normal", description: "\"normal\"" },
        peg$c49 = function(value) { return { off_mode: value } },
        peg$c50 = "fil_type=",
        peg$c51 = { type: "literal", value: "fil_type=", description: "\"fil_type=\"" },
        peg$c52 = "lpf_1p",
        peg$c53 = { type: "literal", value: "lpf_1p", description: "\"lpf_1p\"" },
        peg$c54 = "hpf_1p",
        peg$c55 = { type: "literal", value: "hpf_1p", description: "\"hpf_1p\"" },
        peg$c56 = "lpf_2p",
        peg$c57 = { type: "literal", value: "lpf_2p", description: "\"lpf_2p\"" },
        peg$c58 = "hpf_2p",
        peg$c59 = { type: "literal", value: "hpf_2p", description: "\"hpf_2p\"" },
        peg$c60 = "bpf_2p",
        peg$c61 = { type: "literal", value: "bpf_2p", description: "\"bpf_2p\"" },
        peg$c62 = "brf_2p",
        peg$c63 = { type: "literal", value: "brf_2p", description: "\"brf_2p\"" },
        peg$c64 = function(value) { return { fil_type: value } },
        peg$c65 = "=",
        peg$c66 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c67 = function(name, value) {
            var param = {}
            param[name] = value
            return param
          },
        peg$c68 = "gain",
        peg$c69 = { type: "literal", value: "gain", description: "\"gain\"" },
        peg$c70 = "power",
        peg$c71 = { type: "literal", value: "power", description: "\"power\"" },
        peg$c72 = "xf_keycurve",
        peg$c73 = { type: "literal", value: "xf_keycurve", description: "\"xf_keycurve\"" },
        peg$c74 = "xf_velcurve",
        peg$c75 = { type: "literal", value: "xf_velcurve", description: "\"xf_velcurve\"" },
        peg$c76 = "xf_cccurve",
        peg$c77 = { type: "literal", value: "xf_cccurve", description: "\"xf_cccurve\"" },
        peg$c78 = { type: "other", description: "midi note opcode" },
        peg$c79 = "lokey",
        peg$c80 = { type: "literal", value: "lokey", description: "\"lokey\"" },
        peg$c81 = "hikey",
        peg$c82 = { type: "literal", value: "hikey", description: "\"hikey\"" },
        peg$c83 = "pitch_keycenter",
        peg$c84 = { type: "literal", value: "pitch_keycenter", description: "\"pitch_keycenter\"" },
        peg$c85 = "sw_lokey",
        peg$c86 = { type: "literal", value: "sw_lokey", description: "\"sw_lokey\"" },
        peg$c87 = "sw_hikey",
        peg$c88 = { type: "literal", value: "sw_hikey", description: "\"sw_hikey\"" },
        peg$c89 = "sw_last",
        peg$c90 = { type: "literal", value: "sw_last", description: "\"sw_last\"" },
        peg$c91 = "sw_down",
        peg$c92 = { type: "literal", value: "sw_down", description: "\"sw_down\"" },
        peg$c93 = "sw_up",
        peg$c94 = { type: "literal", value: "sw_up", description: "\"sw_up\"" },
        peg$c95 = "sw_previous",
        peg$c96 = { type: "literal", value: "sw_previous", description: "\"sw_previous\"" },
        peg$c97 = "octave_offset",
        peg$c98 = { type: "literal", value: "octave_offset", description: "\"octave_offset\"" },
        peg$c99 = "note_offset",
        peg$c100 = { type: "literal", value: "note_offset", description: "\"note_offset\"" },
        peg$c101 = { type: "other", description: "float opcode" },
        peg$c102 = "fillfo_delay",
        peg$c103 = { type: "literal", value: "fillfo_delay", description: "\"fillfo_delay\"" },
        peg$c104 = "fillfo_fade",
        peg$c105 = { type: "literal", value: "fillfo_fade", description: "\"fillfo_fade\"" },
        peg$c106 = "fillfo_freq",
        peg$c107 = { type: "literal", value: "fillfo_freq", description: "\"fillfo_freq\"" },
        peg$c108 = "fillfo_freqcc1",
        peg$c109 = { type: "literal", value: "fillfo_freqcc1", description: "\"fillfo_freqcc1\"" },
        peg$c110 = "fillfo_freqcc2",
        peg$c111 = { type: "literal", value: "fillfo_freqcc2", description: "\"fillfo_freqcc2\"" },
        peg$c112 = "lorand",
        peg$c113 = { type: "literal", value: "lorand", description: "\"lorand\"" },
        peg$c114 = "hirand",
        peg$c115 = { type: "literal", value: "hirand", description: "\"hirand\"" },
        peg$c116 = "lotimer",
        peg$c117 = { type: "literal", value: "lotimer", description: "\"lotimer\"" },
        peg$c118 = "hitimer",
        peg$c119 = { type: "literal", value: "hitimer", description: "\"hitimer\"" },
        peg$c120 = "lobpm",
        peg$c121 = { type: "literal", value: "lobpm", description: "\"lobpm\"" },
        peg$c122 = "hibpm",
        peg$c123 = { type: "literal", value: "hibpm", description: "\"hibpm\"" },
        peg$c124 = "delay_random",
        peg$c125 = { type: "literal", value: "delay_random", description: "\"delay_random\"" },
        peg$c126 = "delay_cc1",
        peg$c127 = { type: "literal", value: "delay_cc1", description: "\"delay_cc1\"" },
        peg$c128 = "delay_cc2",
        peg$c129 = { type: "literal", value: "delay_cc2", description: "\"delay_cc2\"" },
        peg$c130 = "delay",
        peg$c131 = { type: "literal", value: "delay", description: "\"delay\"" },
        peg$c132 = "sync_beats",
        peg$c133 = { type: "literal", value: "sync_beats", description: "\"sync_beats\"" },
        peg$c134 = "sync_offset",
        peg$c135 = { type: "literal", value: "sync_offset", description: "\"sync_offset\"" },
        peg$c136 = "pitcheg_delay",
        peg$c137 = { type: "literal", value: "pitcheg_delay", description: "\"pitcheg_delay\"" },
        peg$c138 = "pitcheg_start",
        peg$c139 = { type: "literal", value: "pitcheg_start", description: "\"pitcheg_start\"" },
        peg$c140 = "pitcheg_attack",
        peg$c141 = { type: "literal", value: "pitcheg_attack", description: "\"pitcheg_attack\"" },
        peg$c142 = "pitcheg_hold",
        peg$c143 = { type: "literal", value: "pitcheg_hold", description: "\"pitcheg_hold\"" },
        peg$c144 = "pitcheg_decay",
        peg$c145 = { type: "literal", value: "pitcheg_decay", description: "\"pitcheg_decay\"" },
        peg$c146 = "pitcheg_sustain",
        peg$c147 = { type: "literal", value: "pitcheg_sustain", description: "\"pitcheg_sustain\"" },
        peg$c148 = "pitcheg_release",
        peg$c149 = { type: "literal", value: "pitcheg_release", description: "\"pitcheg_release\"" },
        peg$c150 = "pitcheg_vel2delay",
        peg$c151 = { type: "literal", value: "pitcheg_vel2delay", description: "\"pitcheg_vel2delay\"" },
        peg$c152 = "pitcheg_vel2attack",
        peg$c153 = { type: "literal", value: "pitcheg_vel2attack", description: "\"pitcheg_vel2attack\"" },
        peg$c154 = "pitcheg_vel2hold",
        peg$c155 = { type: "literal", value: "pitcheg_vel2hold", description: "\"pitcheg_vel2hold\"" },
        peg$c156 = "pitcheg_vel2decay",
        peg$c157 = { type: "literal", value: "pitcheg_vel2decay", description: "\"pitcheg_vel2decay\"" },
        peg$c158 = "pitcheg_vel2sustain",
        peg$c159 = { type: "literal", value: "pitcheg_vel2sustain", description: "\"pitcheg_vel2sustain\"" },
        peg$c160 = "pitchlfo_delay",
        peg$c161 = { type: "literal", value: "pitchlfo_delay", description: "\"pitchlfo_delay\"" },
        peg$c162 = "pitchlfo_fade",
        peg$c163 = { type: "literal", value: "pitchlfo_fade", description: "\"pitchlfo_fade\"" },
        peg$c164 = "pitchlfo_freqcc1",
        peg$c165 = { type: "literal", value: "pitchlfo_freqcc1", description: "\"pitchlfo_freqcc1\"" },
        peg$c166 = "pitchlfo_freqcc60",
        peg$c167 = { type: "literal", value: "pitchlfo_freqcc60", description: "\"pitchlfo_freqcc60\"" },
        peg$c168 = "pitchlfo_freqchanaft",
        peg$c169 = { type: "literal", value: "pitchlfo_freqchanaft", description: "\"pitchlfo_freqchanaft\"" },
        peg$c170 = "pitchlfo_freqpolyaft",
        peg$c171 = { type: "literal", value: "pitchlfo_freqpolyaft", description: "\"pitchlfo_freqpolyaft\"" },
        peg$c172 = "pitchlfo_freq",
        peg$c173 = { type: "literal", value: "pitchlfo_freq", description: "\"pitchlfo_freq\"" },
        peg$c174 = "cutoff",
        peg$c175 = { type: "literal", value: "cutoff", description: "\"cutoff\"" },
        peg$c176 = "resonance",
        peg$c177 = { type: "literal", value: "resonance", description: "\"resonance\"" },
        peg$c178 = "fileg_delay",
        peg$c179 = { type: "literal", value: "fileg_delay", description: "\"fileg_delay\"" },
        peg$c180 = "fileg_start",
        peg$c181 = { type: "literal", value: "fileg_start", description: "\"fileg_start\"" },
        peg$c182 = "fileg_attack",
        peg$c183 = { type: "literal", value: "fileg_attack", description: "\"fileg_attack\"" },
        peg$c184 = "fileg_hold",
        peg$c185 = { type: "literal", value: "fileg_hold", description: "\"fileg_hold\"" },
        peg$c186 = "fileg_decay",
        peg$c187 = { type: "literal", value: "fileg_decay", description: "\"fileg_decay\"" },
        peg$c188 = "fileg_sustain",
        peg$c189 = { type: "literal", value: "fileg_sustain", description: "\"fileg_sustain\"" },
        peg$c190 = "fileg_release",
        peg$c191 = { type: "literal", value: "fileg_release", description: "\"fileg_release\"" },
        peg$c192 = "fileg_vel2delay",
        peg$c193 = { type: "literal", value: "fileg_vel2delay", description: "\"fileg_vel2delay\"" },
        peg$c194 = "fileg_vel2attack",
        peg$c195 = { type: "literal", value: "fileg_vel2attack", description: "\"fileg_vel2attack\"" },
        peg$c196 = "fileg_vel2hold",
        peg$c197 = { type: "literal", value: "fileg_vel2hold", description: "\"fileg_vel2hold\"" },
        peg$c198 = "fileg_vel2decay",
        peg$c199 = { type: "literal", value: "fileg_vel2decay", description: "\"fileg_vel2decay\"" },
        peg$c200 = "fileg_vel2sustain",
        peg$c201 = { type: "literal", value: "fileg_vel2sustain", description: "\"fileg_vel2sustain\"" },
        peg$c202 = "fileg_vel2release",
        peg$c203 = { type: "literal", value: "fileg_vel2release", description: "\"fileg_vel2release\"" },
        peg$c204 = "volume",
        peg$c205 = { type: "literal", value: "volume", description: "\"volume\"" },
        peg$c206 = "pan",
        peg$c207 = { type: "literal", value: "pan", description: "\"pan\"" },
        peg$c208 = "width",
        peg$c209 = { type: "literal", value: "width", description: "\"width\"" },
        peg$c210 = "position",
        peg$c211 = { type: "literal", value: "position", description: "\"position\"" },
        peg$c212 = "amp_keytrack",
        peg$c213 = { type: "literal", value: "amp_keytrack", description: "\"amp_keytrack\"" },
        peg$c214 = "amp_veltrack",
        peg$c215 = { type: "literal", value: "amp_veltrack", description: "\"amp_veltrack\"" },
        peg$c216 = "amp_velcurve_1",
        peg$c217 = { type: "literal", value: "amp_velcurve_1", description: "\"amp_velcurve_1\"" },
        peg$c218 = "amp_velcurve_127",
        peg$c219 = { type: "literal", value: "amp_velcurve_127", description: "\"amp_velcurve_127\"" },
        peg$c220 = "amp_random",
        peg$c221 = { type: "literal", value: "amp_random", description: "\"amp_random\"" },
        peg$c222 = "rt_decay",
        peg$c223 = { type: "literal", value: "rt_decay", description: "\"rt_decay\"" },
        peg$c224 = "ampeg_delay",
        peg$c225 = { type: "literal", value: "ampeg_delay", description: "\"ampeg_delay\"" },
        peg$c226 = "ampeg_start",
        peg$c227 = { type: "literal", value: "ampeg_start", description: "\"ampeg_start\"" },
        peg$c228 = "ampeg_attack",
        peg$c229 = { type: "literal", value: "ampeg_attack", description: "\"ampeg_attack\"" },
        peg$c230 = "ampeg_hold",
        peg$c231 = { type: "literal", value: "ampeg_hold", description: "\"ampeg_hold\"" },
        peg$c232 = "ampeg_decay",
        peg$c233 = { type: "literal", value: "ampeg_decay", description: "\"ampeg_decay\"" },
        peg$c234 = "ampeg_sustain",
        peg$c235 = { type: "literal", value: "ampeg_sustain", description: "\"ampeg_sustain\"" },
        peg$c236 = "ampeg_release",
        peg$c237 = { type: "literal", value: "ampeg_release", description: "\"ampeg_release\"" },
        peg$c238 = "ampeg_vel2delay",
        peg$c239 = { type: "literal", value: "ampeg_vel2delay", description: "\"ampeg_vel2delay\"" },
        peg$c240 = "ampeg_vel2attack",
        peg$c241 = { type: "literal", value: "ampeg_vel2attack", description: "\"ampeg_vel2attack\"" },
        peg$c242 = "ampeg_vel2hold",
        peg$c243 = { type: "literal", value: "ampeg_vel2hold", description: "\"ampeg_vel2hold\"" },
        peg$c244 = "ampeg_vel2decay",
        peg$c245 = { type: "literal", value: "ampeg_vel2decay", description: "\"ampeg_vel2decay\"" },
        peg$c246 = "ampeg_vel2sustain",
        peg$c247 = { type: "literal", value: "ampeg_vel2sustain", description: "\"ampeg_vel2sustain\"" },
        peg$c248 = "ampeg_vel2release",
        peg$c249 = { type: "literal", value: "ampeg_vel2release", description: "\"ampeg_vel2release\"" },
        peg$c250 = "amplfo_delay",
        peg$c251 = { type: "literal", value: "amplfo_delay", description: "\"amplfo_delay\"" },
        peg$c252 = "amplfo_fade",
        peg$c253 = { type: "literal", value: "amplfo_fade", description: "\"amplfo_fade\"" },
        peg$c254 = "amplfo_depthchanaft",
        peg$c255 = { type: "literal", value: "amplfo_depthchanaft", description: "\"amplfo_depthchanaft\"" },
        peg$c256 = "amplfo_depthpolyaft",
        peg$c257 = { type: "literal", value: "amplfo_depthpolyaft", description: "\"amplfo_depthpolyaft\"" },
        peg$c258 = "amplfo_depth",
        peg$c259 = { type: "literal", value: "amplfo_depth", description: "\"amplfo_depth\"" },
        peg$c260 = "amplfo_freqchanaft",
        peg$c261 = { type: "literal", value: "amplfo_freqchanaft", description: "\"amplfo_freqchanaft\"" },
        peg$c262 = "amplfo_freqpolyaft",
        peg$c263 = { type: "literal", value: "amplfo_freqpolyaft", description: "\"amplfo_freqpolyaft\"" },
        peg$c264 = "amplfo_freq",
        peg$c265 = { type: "literal", value: "amplfo_freq", description: "\"amplfo_freq\"" },
        peg$c266 = "eq1_freq",
        peg$c267 = { type: "literal", value: "eq1_freq", description: "\"eq1_freq\"" },
        peg$c268 = "eq2_freq",
        peg$c269 = { type: "literal", value: "eq2_freq", description: "\"eq2_freq\"" },
        peg$c270 = "eq3_freq",
        peg$c271 = { type: "literal", value: "eq3_freq", description: "\"eq3_freq\"" },
        peg$c272 = "eq1_vel2freq",
        peg$c273 = { type: "literal", value: "eq1_vel2freq", description: "\"eq1_vel2freq\"" },
        peg$c274 = "eq2_vel2freq",
        peg$c275 = { type: "literal", value: "eq2_vel2freq", description: "\"eq2_vel2freq\"" },
        peg$c276 = "eq3_vel2freq",
        peg$c277 = { type: "literal", value: "eq3_vel2freq", description: "\"eq3_vel2freq\"" },
        peg$c278 = "eq1_bw",
        peg$c279 = { type: "literal", value: "eq1_bw", description: "\"eq1_bw\"" },
        peg$c280 = "eq2_bw",
        peg$c281 = { type: "literal", value: "eq2_bw", description: "\"eq2_bw\"" },
        peg$c282 = "eq3_bw",
        peg$c283 = { type: "literal", value: "eq3_bw", description: "\"eq3_bw\"" },
        peg$c284 = "eq1_gain",
        peg$c285 = { type: "literal", value: "eq1_gain", description: "\"eq1_gain\"" },
        peg$c286 = "eq2_gain",
        peg$c287 = { type: "literal", value: "eq2_gain", description: "\"eq2_gain\"" },
        peg$c288 = "eq3_gain",
        peg$c289 = { type: "literal", value: "eq3_gain", description: "\"eq3_gain\"" },
        peg$c290 = "eq1_vel2gain",
        peg$c291 = { type: "literal", value: "eq1_vel2gain", description: "\"eq1_vel2gain\"" },
        peg$c292 = "eq2_vel2gain",
        peg$c293 = { type: "literal", value: "eq2_vel2gain", description: "\"eq2_vel2gain\"" },
        peg$c294 = "eq3_vel2gain",
        peg$c295 = { type: "literal", value: "eq3_vel2gain", description: "\"eq3_vel2gain\"" },
        peg$c296 = "effect1",
        peg$c297 = { type: "literal", value: "effect1", description: "\"effect1\"" },
        peg$c298 = "effect2",
        peg$c299 = { type: "literal", value: "effect2", description: "\"effect2\"" },
        peg$c300 = { type: "other", description: "integer opcode" },
        peg$c301 = "fillfo_depthcc1",
        peg$c302 = { type: "literal", value: "fillfo_depthcc1", description: "\"fillfo_depthcc1\"" },
        peg$c303 = "fillfo_depthcc60",
        peg$c304 = { type: "literal", value: "fillfo_depthcc60", description: "\"fillfo_depthcc60\"" },
        peg$c305 = "fillfo_freqchanaft",
        peg$c306 = { type: "literal", value: "fillfo_freqchanaft", description: "\"fillfo_freqchanaft\"" },
        peg$c307 = "fillfo_freqpolyaft",
        peg$c308 = { type: "literal", value: "fillfo_freqpolyaft", description: "\"fillfo_freqpolyaft\"" },
        peg$c309 = "fillfo_depth",
        peg$c310 = { type: "literal", value: "fillfo_depth", description: "\"fillfo_depth\"" },
        peg$c311 = "lovel",
        peg$c312 = { type: "literal", value: "lovel", description: "\"lovel\"" },
        peg$c313 = "hivel",
        peg$c314 = { type: "literal", value: "hivel", description: "\"hivel\"" },
        peg$c315 = "lobend",
        peg$c316 = { type: "literal", value: "lobend", description: "\"lobend\"" },
        peg$c317 = "hibend",
        peg$c318 = { type: "literal", value: "hibend", description: "\"hibend\"" },
        peg$c319 = "lochanaft",
        peg$c320 = { type: "literal", value: "lochanaft", description: "\"lochanaft\"" },
        peg$c321 = "hichanaft",
        peg$c322 = { type: "literal", value: "hichanaft", description: "\"hichanaft\"" },
        peg$c323 = "lochan",
        peg$c324 = { type: "literal", value: "lochan", description: "\"lochan\"" },
        peg$c325 = "hichan",
        peg$c326 = { type: "literal", value: "hichan", description: "\"hichan\"" },
        peg$c327 = "loprog",
        peg$c328 = { type: "literal", value: "loprog", description: "\"loprog\"" },
        peg$c329 = "hiprog",
        peg$c330 = { type: "literal", value: "hiprog", description: "\"hiprog\"" },
        peg$c331 = "lopolyaft",
        peg$c332 = { type: "literal", value: "lopolyaft", description: "\"lopolyaft\"" },
        peg$c333 = "hipolyaft",
        peg$c334 = { type: "literal", value: "hipolyaft", description: "\"hipolyaft\"" },
        peg$c335 = "seq_length",
        peg$c336 = { type: "literal", value: "seq_length", description: "\"seq_length\"" },
        peg$c337 = "seq_position",
        peg$c338 = { type: "literal", value: "seq_position", description: "\"seq_position\"" },
        peg$c339 = "group",
        peg$c340 = { type: "literal", value: "group", description: "\"group\"" },
        peg$c341 = "off_by",
        peg$c342 = { type: "literal", value: "off_by", description: "\"off_by\"" },
        peg$c343 = "offset_random",
        peg$c344 = { type: "literal", value: "offset_random", description: "\"offset_random\"" },
        peg$c345 = "offset_cc1",
        peg$c346 = { type: "literal", value: "offset_cc1", description: "\"offset_cc1\"" },
        peg$c347 = "offset_cc64",
        peg$c348 = { type: "literal", value: "offset_cc64", description: "\"offset_cc64\"" },
        peg$c349 = "offset",
        peg$c350 = { type: "literal", value: "offset", description: "\"offset\"" },
        peg$c351 = "end",
        peg$c352 = { type: "literal", value: "end", description: "\"end\"" },
        peg$c353 = "count",
        peg$c354 = { type: "literal", value: "count", description: "\"count\"" },
        peg$c355 = "loop_start",
        peg$c356 = { type: "literal", value: "loop_start", description: "\"loop_start\"" },
        peg$c357 = "loop_end",
        peg$c358 = { type: "literal", value: "loop_end", description: "\"loop_end\"" },
        peg$c359 = "transpose",
        peg$c360 = { type: "literal", value: "transpose", description: "\"transpose\"" },
        peg$c361 = "tune",
        peg$c362 = { type: "literal", value: "tune", description: "\"tune\"" },
        peg$c363 = "pitch_keytrack",
        peg$c364 = { type: "literal", value: "pitch_keytrack", description: "\"pitch_keytrack\"" },
        peg$c365 = "pitch_veltrack",
        peg$c366 = { type: "literal", value: "pitch_veltrack", description: "\"pitch_veltrack\"" },
        peg$c367 = "pitch_random",
        peg$c368 = { type: "literal", value: "pitch_random", description: "\"pitch_random\"" },
        peg$c369 = "bend_up",
        peg$c370 = { type: "literal", value: "bend_up", description: "\"bend_up\"" },
        peg$c371 = "bend_down",
        peg$c372 = { type: "literal", value: "bend_down", description: "\"bend_down\"" },
        peg$c373 = "pitcheg_depth",
        peg$c374 = { type: "literal", value: "pitcheg_depth", description: "\"pitcheg_depth\"" },
        peg$c375 = "fileg_depth",
        peg$c376 = { type: "literal", value: "fileg_depth", description: "\"fileg_depth\"" },
        peg$c377 = "fileg_vel2depth",
        peg$c378 = { type: "literal", value: "fileg_vel2depth", description: "\"fileg_vel2depth\"" },
        peg$c379 = "fil_keytrack",
        peg$c380 = { type: "literal", value: "fil_keytrack", description: "\"fil_keytrack\"" },
        peg$c381 = "fil_keycenter",
        peg$c382 = { type: "literal", value: "fil_keycenter", description: "\"fil_keycenter\"" },
        peg$c383 = "fil_veltrack",
        peg$c384 = { type: "literal", value: "fil_veltrack", description: "\"fil_veltrack\"" },
        peg$c385 = "fil_random",
        peg$c386 = { type: "literal", value: "fil_random", description: "\"fil_random\"" },
        peg$c387 = "cutoff_cc1",
        peg$c388 = { type: "literal", value: "cutoff_cc1", description: "\"cutoff_cc1\"" },
        peg$c389 = "cutoff_cc2",
        peg$c390 = { type: "literal", value: "cutoff_cc2", description: "\"cutoff_cc2\"" },
        peg$c391 = "cutoff_chanaft",
        peg$c392 = { type: "literal", value: "cutoff_chanaft", description: "\"cutoff_chanaft\"" },
        peg$c393 = "cutoff_polyaft",
        peg$c394 = { type: "literal", value: "cutoff_polyaft", description: "\"cutoff_polyaft\"" },
        peg$c395 = "pitchlfo_depthcc1",
        peg$c396 = { type: "literal", value: "pitchlfo_depthcc1", description: "\"pitchlfo_depthcc1\"" },
        peg$c397 = "pitchlfo_depthcc60",
        peg$c398 = { type: "literal", value: "pitchlfo_depthcc60", description: "\"pitchlfo_depthcc60\"" },
        peg$c399 = "pitchlfo_depthchanaft",
        peg$c400 = { type: "literal", value: "pitchlfo_depthchanaft", description: "\"pitchlfo_depthchanaft\"" },
        peg$c401 = "pitchlfo_depthpolyaft",
        peg$c402 = { type: "literal", value: "pitchlfo_depthpolyaft", description: "\"pitchlfo_depthpolyaft\"" },
        peg$c403 = "pitchlfo_depth",
        peg$c404 = { type: "literal", value: "pitchlfo_depth", description: "\"pitchlfo_depth\"" },
        peg$c405 = "pitcheg_vel2depth",
        peg$c406 = { type: "literal", value: "pitcheg_vel2depth", description: "\"pitcheg_vel2depth\"" },
        peg$c407 = "amp_keycenter",
        peg$c408 = { type: "literal", value: "amp_keycenter", description: "\"amp_keycenter\"" },
        peg$c409 = "output",
        peg$c410 = { type: "literal", value: "output", description: "\"output\"" },
        peg$c411 = "xfin_lokey",
        peg$c412 = { type: "literal", value: "xfin_lokey", description: "\"xfin_lokey\"" },
        peg$c413 = "xfin_hikey",
        peg$c414 = { type: "literal", value: "xfin_hikey", description: "\"xfin_hikey\"" },
        peg$c415 = "xfin_lovel",
        peg$c416 = { type: "literal", value: "xfin_lovel", description: "\"xfin_lovel\"" },
        peg$c417 = "xfin_hivel",
        peg$c418 = { type: "literal", value: "xfin_hivel", description: "\"xfin_hivel\"" },
        peg$c419 = "xfout_lovel",
        peg$c420 = { type: "literal", value: "xfout_lovel", description: "\"xfout_lovel\"" },
        peg$c421 = "xfout_hivel",
        peg$c422 = { type: "literal", value: "xfout_hivel", description: "\"xfout_hivel\"" },
        peg$c423 = function(n, i) { return n + i },
        peg$c424 = { type: "other", description: "sequential float opcode" },
        peg$c425 = "fillfo_freqcc",
        peg$c426 = { type: "literal", value: "fillfo_freqcc", description: "\"fillfo_freqcc\"" },
        peg$c427 = "gain_cc",
        peg$c428 = { type: "literal", value: "gain_cc", description: "\"gain_cc\"" },
        peg$c429 = "ampeg_delaycc",
        peg$c430 = { type: "literal", value: "ampeg_delaycc", description: "\"ampeg_delaycc\"" },
        peg$c431 = "ampeg_startcc",
        peg$c432 = { type: "literal", value: "ampeg_startcc", description: "\"ampeg_startcc\"" },
        peg$c433 = "ampeg_attackcc",
        peg$c434 = { type: "literal", value: "ampeg_attackcc", description: "\"ampeg_attackcc\"" },
        peg$c435 = "ampeg_holdcc",
        peg$c436 = { type: "literal", value: "ampeg_holdcc", description: "\"ampeg_holdcc\"" },
        peg$c437 = "ampeg_decaycc",
        peg$c438 = { type: "literal", value: "ampeg_decaycc", description: "\"ampeg_decaycc\"" },
        peg$c439 = "ampeg_sustaincc",
        peg$c440 = { type: "literal", value: "ampeg_sustaincc", description: "\"ampeg_sustaincc\"" },
        peg$c441 = "ampeg_releasecc",
        peg$c442 = { type: "literal", value: "ampeg_releasecc", description: "\"ampeg_releasecc\"" },
        peg$c443 = "amplfo_depthcc",
        peg$c444 = { type: "literal", value: "amplfo_depthcc", description: "\"amplfo_depthcc\"" },
        peg$c445 = "amplfo_freqcc",
        peg$c446 = { type: "literal", value: "amplfo_freqcc", description: "\"amplfo_freqcc\"" },
        peg$c447 = "eq1_freqcc",
        peg$c448 = { type: "literal", value: "eq1_freqcc", description: "\"eq1_freqcc\"" },
        peg$c449 = "eq2_freqcc",
        peg$c450 = { type: "literal", value: "eq2_freqcc", description: "\"eq2_freqcc\"" },
        peg$c451 = "eq3_freqcc",
        peg$c452 = { type: "literal", value: "eq3_freqcc", description: "\"eq3_freqcc\"" },
        peg$c453 = "eq1_bwcc",
        peg$c454 = { type: "literal", value: "eq1_bwcc", description: "\"eq1_bwcc\"" },
        peg$c455 = "eq2_bwcc",
        peg$c456 = { type: "literal", value: "eq2_bwcc", description: "\"eq2_bwcc\"" },
        peg$c457 = "eq3_bwcc",
        peg$c458 = { type: "literal", value: "eq3_bwcc", description: "\"eq3_bwcc\"" },
        peg$c459 = "eq1_gaincc",
        peg$c460 = { type: "literal", value: "eq1_gaincc", description: "\"eq1_gaincc\"" },
        peg$c461 = "eq2_gaincc",
        peg$c462 = { type: "literal", value: "eq2_gaincc", description: "\"eq2_gaincc\"" },
        peg$c463 = "eq3_gaincc",
        peg$c464 = { type: "literal", value: "eq3_gaincc", description: "\"eq3_gaincc\"" },
        peg$c465 = "amp_velcurve_",
        peg$c466 = { type: "literal", value: "amp_velcurve_", description: "\"amp_velcurve_\"" },
        peg$c467 = "fillfo_depthcc",
        peg$c468 = { type: "literal", value: "fillfo_depthcc", description: "\"fillfo_depthcc\"" },
        peg$c469 = "xfin_locc",
        peg$c470 = { type: "literal", value: "xfin_locc", description: "\"xfin_locc\"" },
        peg$c471 = "xfin_hicc",
        peg$c472 = { type: "literal", value: "xfin_hicc", description: "\"xfin_hicc\"" },
        peg$c473 = "xfout_locc",
        peg$c474 = { type: "literal", value: "xfout_locc", description: "\"xfout_locc\"" },
        peg$c475 = "xfout_hicc",
        peg$c476 = { type: "literal", value: "xfout_hicc", description: "\"xfout_hicc\"" },
        peg$c477 = "delay_cc",
        peg$c478 = { type: "literal", value: "delay_cc", description: "\"delay_cc\"" },
        peg$c479 = "offset_cc",
        peg$c480 = { type: "literal", value: "offset_cc", description: "\"offset_cc\"" },
        peg$c481 = "pitchlfo_depthcc",
        peg$c482 = { type: "literal", value: "pitchlfo_depthcc", description: "\"pitchlfo_depthcc\"" },
        peg$c483 = "pitchlfo_freqcc",
        peg$c484 = { type: "literal", value: "pitchlfo_freqcc", description: "\"pitchlfo_freqcc\"" },
        peg$c485 = "cutoff_cc",
        peg$c486 = { type: "literal", value: "cutoff_cc", description: "\"cutoff_cc\"" },
        peg$c487 = "loop_mode",
        peg$c488 = { type: "literal", value: "loop_mode", description: "\"loop_mode\"" },
        peg$c489 = "no_loop",
        peg$c490 = { type: "literal", value: "no_loop", description: "\"no_loop\"" },
        peg$c491 = "one_shot",
        peg$c492 = { type: "literal", value: "one_shot", description: "\"one_shot\"" },
        peg$c493 = "loop_continuous",
        peg$c494 = { type: "literal", value: "loop_continuous", description: "\"loop_continuous\"" },
        peg$c495 = "loop_sustain",
        peg$c496 = { type: "literal", value: "loop_sustain", description: "\"loop_sustain\"" },
        peg$c497 = function(value) { return { loop_mode: value } },
        peg$c498 = /^[0-9]/,
        peg$c499 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c500 = /^[1-9]/,
        peg$c501 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c502 = /^[eE]/,
        peg$c503 = { type: "class", value: "[eE]", description: "[eE]" },
        peg$c504 = /^[\-+]/,
        peg$c505 = { type: "class", value: "[\\-+]", description: "[\\-+]" },
        peg$c506 = function(sign, digits) {
            sign = sign || ""
            return parseInt(sign + digits.join(""), 10)
          },
        peg$c507 = ".",
        peg$c508 = { type: "literal", value: ".", description: "\".\"" },
        peg$c509 = function(parts) {
              return parseFloat(parts);
            },
        peg$c510 = function(parts) { return parseFloat(parts); },
        peg$c511 = "0",
        peg$c512 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c513 = function(sign, decimal) {
           sign = sign || ""
          return parseFloat(sign + decimal)
         },
        peg$c514 = function(pitch, accidental, octave) {
            return (pitch + accidental) + (octave + 1) * 12
          },
        peg$c515 = /^[a-gA-G]/,
        peg$c516 = { type: "class", value: "[a-gA-G]", description: "[a-gA-G]" },
        peg$c517 = function(note) {
            var pitches = {
              "c": 0,
              "d": 2,
              "e": 4,
              "f": 5,
              "g": 7,
              "a": 9,
              "b": 11
            }
            return pitches[note.toLowerCase()]
          },
        peg$c518 = /^[#b]/,
        peg$c519 = { type: "class", value: "[#b]", description: "[#b]" },
        peg$c520 = function(accidental) {
            switch (accidental) {
              case "#":
                return 1
              case "b":
                return -1
              default:
                return 0
            }
          },
        peg$c521 = function(name, ext) { return name + ext },
        peg$c522 = void 0,
        peg$c523 = function(c) { return c },
        peg$c524 = function(chars) {
           return chars.join("")
         },
        peg$c525 = "../",
        peg$c526 = { type: "literal", value: "../", description: "\"../\"" },
        peg$c527 = ".wav",
        peg$c528 = { type: "literal", value: ".wav", description: "\".wav\"" },
        peg$c529 = ".ogg",
        peg$c530 = { type: "literal", value: ".ogg", description: "\".ogg\"" },
        peg$c531 = ".mp3",
        peg$c532 = { type: "literal", value: ".mp3", description: "\".mp3\"" },
        peg$c533 = { type: "other", description: "whitespace" },
        peg$c534 = /^[\t\x0B\f \xA0\uFEFF]/,
        peg$c535 = { type: "class", value: "[\\t\\x0B\\f \\xA0\\uFEFF]", description: "[\\t\\x0B\\f \\xA0\\uFEFF]" },
        peg$c536 = /^[\n\r\u2028\u2029]/,
        peg$c537 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c538 = { type: "other", description: "end of line" },
        peg$c539 = "\n",
        peg$c540 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c541 = "\r\n",
        peg$c542 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c543 = "\r",
        peg$c544 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c545 = "\u2028",
        peg$c546 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c547 = "\u2029",
        peg$c548 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c549 = { type: "other", description: "comment" },
        peg$c550 = "/*",
        peg$c551 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c552 = "*/",
        peg$c553 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c554 = "//",
        peg$c555 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c556 = /^[ \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/,
        peg$c557 = { type: "class", value: "[ \\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000]", description: "[ \\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000]" },
        peg$c558 = ";",
        peg$c559 = { type: "literal", value: ";", description: "\";\"" },
        peg$c560 = "}",
        peg$c561 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c562 = "<control>",
        peg$c563 = { type: "literal", value: "<control>", description: "\"<control>\"" },
        peg$c564 = "hint_ram_based",
        peg$c565 = { type: "literal", value: "hint_ram_based", description: "\"hint_ram_based\"" },
        peg$c566 = "global_volume",
        peg$c567 = { type: "literal", value: "global_volume", description: "\"global_volume\"" },
        peg$c568 = "lfo06_freq",
        peg$c569 = { type: "literal", value: "lfo06_freq", description: "\"lfo06_freq\"" },
        peg$c570 = "lfo06_pitch",
        peg$c571 = { type: "literal", value: "lfo06_pitch", description: "\"lfo06_pitch\"" },
        peg$c572 = "lfo06_wave",
        peg$c573 = { type: "literal", value: "lfo06_wave", description: "\"lfo06_wave\"" },
        peg$c574 = "lfo06_pitch_oncc129",
        peg$c575 = { type: "literal", value: "lfo06_pitch_oncc129", description: "\"lfo06_pitch_oncc129\"" },
        peg$c576 = "set_cc",
        peg$c577 = { type: "literal", value: "set_cc", description: "\"set_cc\"" },
        peg$c578 = "lfo06_pitch_oncc",
        peg$c579 = { type: "literal", value: "lfo06_pitch_oncc", description: "\"lfo06_pitch_oncc\"" },
        peg$c580 = "amplitude_oncc",
        peg$c581 = { type: "literal", value: "amplitude_oncc", description: "\"amplitude_oncc\"" },
        peg$c582 = "amplitude_curvecc",
        peg$c583 = { type: "literal", value: "amplitude_curvecc", description: "\"amplitude_curvecc\"" },
        peg$c584 = "region_label=",
        peg$c585 = { type: "literal", value: "region_label=", description: "\"region_label=\"" },
        peg$c586 = function(value) { return { region_label: value } },
        peg$c587 = "default_path=",
        peg$c588 = { type: "literal", value: "default_path=", description: "\"default_path=\"" },
        peg$c589 = function(value) { return { default_path: value } },
        peg$c590 = "v",
        peg$c591 = { type: "literal", value: "v", description: "\"v\"" },
        peg$c592 = function(digits, value) {
            var param = {}
            var name = "v" + digits.join("")
            param[name] = value
            return param
          },
        peg$c593 = "eg",
        peg$c594 = { type: "literal", value: "eg", description: "\"eg\"" },
        peg$c595 = "_cutoff=",
        peg$c596 = { type: "literal", value: "_cutoff=", description: "\"_cutoff=\"" },
        peg$c597 = function(digits, value) {
            var param = {}
            var name = "eg" + digits.join("")
            param[name] = value
            return param
          },
        peg$c598 = "_sustain=",
        peg$c599 = { type: "literal", value: "_sustain=", description: "\"_sustain=\"" },
        peg$c600 = "_pitch=",
        peg$c601 = { type: "literal", value: "_pitch=", description: "\"_pitch=\"" },
        peg$c602 = "_time",
        peg$c603 = { type: "literal", value: "_time", description: "\"_time\"" },
        peg$c604 = function(digits, node, value) {
            var param = {}
            var name = "eg" + digits.join("") + "_time" + node
            param[name] = value
            return param
          },
        peg$c605 = "_level",
        peg$c606 = { type: "literal", value: "_level", description: "\"_level\"" },
        peg$c607 = function(digits, node, value) {
            var param = {}
            var name = "eg" + digits.join("") + "_level" + node
            param[name] = value
            return param
          },
        peg$c608 = "_shape",
        peg$c609 = { type: "literal", value: "_shape", description: "\"_shape\"" },
        peg$c610 = function(digits, node, value) {
            var param = {}
            var name = "eg" + digits.join("") + "_shape" + node
            param[name] = value
            return param
          },
        peg$c611 = "lfo",
        peg$c612 = { type: "literal", value: "lfo", description: "\"lfo\"" },
        peg$c613 = "_wave=",
        peg$c614 = { type: "literal", value: "_wave=", description: "\"_wave=\"" },
        peg$c615 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_wave"
            param[name] = value
            return param
          },
        peg$c616 = "_freq=",
        peg$c617 = { type: "literal", value: "_freq=", description: "\"_freq=\"" },
        peg$c618 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_freq"
            param[name] = value
            return param
          },
        peg$c619 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_pitch"
            param[name] = value
            return param
          },
        peg$c620 = "_delay=",
        peg$c621 = { type: "literal", value: "_delay=", description: "\"_delay=\"" },
        peg$c622 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_delay"
            param[name] = value
            return param
          },
        peg$c623 = "_amplitude=",
        peg$c624 = { type: "literal", value: "_amplitude=", description: "\"_amplitude=\"" },
        peg$c625 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_amplitude"
            param[name] = value
            return param
          },
        peg$c626 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_cutoff"
            param[name] = value
            return param
          },
        peg$c627 = "_phase=",
        peg$c628 = { type: "literal", value: "_phase=", description: "\"_phase=\"" },
        peg$c629 = function(digits, value) {
            var param = {}
            var name = "lfo" + digits.join("") + "_phase"
            param[name] = value
            return param
          },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInstrument();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c1(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseInstrument() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseSourceElements();
      if (s1 === peg$FAILED) {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c3(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSourceElements() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSourceElement();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceElement();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceElement();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c5(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSourceElement() {
      var s0;

      s0 = peg$parseComment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseHeader();
        if (s0 === peg$FAILED) {
          s0 = peg$parseOpcodeDirective();
        }
      }

      return s0;
    }

    function peg$parseSourceCharacter() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }

      return s0;
    }

    function peg$parseHeader() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseGlobal();
      if (s0 === peg$FAILED) {
        s0 = peg$parseMaster();
        if (s0 === peg$FAILED) {
          s0 = peg$parseRegion();
          if (s0 === peg$FAILED) {
            s0 = peg$parseGroup();
            if (s0 === peg$FAILED) {
              s0 = peg$parseCurve();
              if (s0 === peg$FAILED) {
                s0 = peg$parseAriaCustomHeader();
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }

      return s0;
    }

    function peg$parseGlobal() {
      var s0;

      if (input.substr(peg$currPos, 8) === peg$c8) {
        s0 = peg$c8;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }

      return s0;
    }

    function peg$parseMaster() {
      var s0;

      if (input.substr(peg$currPos, 8) === peg$c10) {
        s0 = peg$c10;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c11); }
      }

      return s0;
    }

    function peg$parseRegion() {
      var s0;

      if (input.substr(peg$currPos, 8) === peg$c12) {
        s0 = peg$c12;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }

      return s0;
    }

    function peg$parseGroup() {
      var s0;

      if (input.substr(peg$currPos, 7) === peg$c14) {
        s0 = peg$c14;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c15); }
      }

      return s0;
    }

    function peg$parseCurve() {
      var s0;

      if (input.substr(peg$currPos, 7) === peg$c16) {
        s0 = peg$c16;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }

      return s0;
    }

    function peg$parseOpcodeDirective() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFilepath();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c21(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4) === peg$c22) {
          s1 = peg$c22;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseMidiNoteValue();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c24(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 7) === peg$c25) {
            s1 = peg$c25;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c27) {
              s2 = peg$c27;
              peg$currPos += 7;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c28); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 8) === peg$c29) {
                s2 = peg$c29;
                peg$currPos += 8;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c30); }
              }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c31(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 11) === peg$c32) {
              s1 = peg$c32;
              peg$currPos += 11;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c33); }
            }
            if (s1 !== peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c34) {
                s2 = peg$c34;
                peg$currPos += 6;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c35); }
              }
              if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 7) === peg$c36) {
                  s2 = peg$c36;
                  peg$currPos += 7;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c37); }
                }
                if (s2 === peg$FAILED) {
                  if (input.substr(peg$currPos, 5) === peg$c38) {
                    s2 = peg$c38;
                    peg$currPos += 5;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c39); }
                  }
                  if (s2 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6) === peg$c40) {
                      s2 = peg$c40;
                      peg$currPos += 6;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c41); }
                    }
                  }
                }
              }
              if (s2 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c42(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 9) === peg$c43) {
                s1 = peg$c43;
                peg$currPos += 9;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c44); }
              }
              if (s1 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c45) {
                  s2 = peg$c45;
                  peg$currPos += 4;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c46); }
                }
                if (s2 === peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c47) {
                    s2 = peg$c47;
                    peg$currPos += 6;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c48); }
                  }
                }
                if (s2 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c49(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$parseDelayCcDirective();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseOffsetCcDirective();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseLoopModeDirective();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parsePitchLfoDepthCcDirective();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parsePitchLfoFreqCcDirective();
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.substr(peg$currPos, 9) === peg$c50) {
                            s1 = peg$c50;
                            peg$currPos += 9;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c51); }
                          }
                          if (s1 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c52) {
                              s2 = peg$c52;
                              peg$currPos += 6;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c53); }
                            }
                            if (s2 === peg$FAILED) {
                              if (input.substr(peg$currPos, 6) === peg$c54) {
                                s2 = peg$c54;
                                peg$currPos += 6;
                              } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c55); }
                              }
                              if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c56) {
                                  s2 = peg$c56;
                                  peg$currPos += 6;
                                } else {
                                  s2 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c57); }
                                }
                                if (s2 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 6) === peg$c58) {
                                    s2 = peg$c58;
                                    peg$currPos += 6;
                                  } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c59); }
                                  }
                                  if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c60) {
                                      s2 = peg$c60;
                                      peg$currPos += 6;
                                    } else {
                                      s2 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c61); }
                                    }
                                    if (s2 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 6) === peg$c62) {
                                        s2 = peg$c62;
                                        peg$currPos += 6;
                                      } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c63); }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            if (s2 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c64(s2);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                          if (s0 === peg$FAILED) {
                            s0 = peg$parseCutoffCcDirective();
                            if (s0 === peg$FAILED) {
                              s0 = peg$parseMidiNoteOpcodeDirective();
                              if (s0 === peg$FAILED) {
                                s0 = peg$parseFloatOpcodeDirective();
                                if (s0 === peg$FAILED) {
                                  s0 = peg$parseIntegerOpcodeDirective();
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$parseCurveOpcodeDirective();
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$parseSequentialFloatDirective();
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$parseSequentialIntegerDirective();
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$parseAriaDefaultPathOpcode();
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$parseAriaCustomTextOpcode();
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$parseAriaCurveOpcode();
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$parseFlexEgOpcode();
                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$parseLfoOpcode();
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }

      return s0;
    }

    function peg$parseMidiNoteOpcodeDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseMidiNoteOpcode();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseMidiNoteValue();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFloatOpcodeDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseFloatOpcode();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedDecimalLiteral();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseIntegerOpcodeDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseIntegerOpcode();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedIntegerAsNumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseCurveOpcodeDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseCurveOpcode();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c68) {
            s3 = peg$c68;
            peg$currPos += 4;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c69); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c70) {
              s3 = peg$c70;
              peg$currPos += 5;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c71); }
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseCurveOpcode() {
      var s0;

      if (input.substr(peg$currPos, 11) === peg$c72) {
        s0 = peg$c72;
        peg$currPos += 11;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c73); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c74) {
          s0 = peg$c74;
          peg$currPos += 11;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c75); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 10) === peg$c76) {
            s0 = peg$c76;
            peg$currPos += 10;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c77); }
          }
        }
      }

      return s0;
    }

    function peg$parseMidiNoteOpcode() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 5) === peg$c79) {
        s0 = peg$c79;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c80); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c81) {
          s0 = peg$c81;
          peg$currPos += 5;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c82); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 15) === peg$c83) {
            s0 = peg$c83;
            peg$currPos += 15;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c84); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c85) {
              s0 = peg$c85;
              peg$currPos += 8;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c86); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 8) === peg$c87) {
                s0 = peg$c87;
                peg$currPos += 8;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c88); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 7) === peg$c89) {
                  s0 = peg$c89;
                  peg$currPos += 7;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c90); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c91) {
                    s0 = peg$c91;
                    peg$currPos += 7;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c92); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c93) {
                      s0 = peg$c93;
                      peg$currPos += 5;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c94); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 11) === peg$c95) {
                        s0 = peg$c95;
                        peg$currPos += 11;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c96); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 13) === peg$c97) {
                          s0 = peg$c97;
                          peg$currPos += 13;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c98); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 11) === peg$c99) {
                            s0 = peg$c99;
                            peg$currPos += 11;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c100); }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c78); }
      }

      return s0;
    }

    function peg$parseFloatOpcode() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 12) === peg$c102) {
        s0 = peg$c102;
        peg$currPos += 12;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c103); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c104) {
          s0 = peg$c104;
          peg$currPos += 11;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c105); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 11) === peg$c106) {
            s0 = peg$c106;
            peg$currPos += 11;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c107); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 14) === peg$c108) {
              s0 = peg$c108;
              peg$currPos += 14;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c109); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 14) === peg$c110) {
                s0 = peg$c110;
                peg$currPos += 14;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c111); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c112) {
                  s0 = peg$c112;
                  peg$currPos += 6;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c113); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c114) {
                    s0 = peg$c114;
                    peg$currPos += 6;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c115); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 7) === peg$c116) {
                      s0 = peg$c116;
                      peg$currPos += 7;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c117); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 7) === peg$c118) {
                        s0 = peg$c118;
                        peg$currPos += 7;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c119); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c120) {
                          s0 = peg$c120;
                          peg$currPos += 5;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c121); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 5) === peg$c122) {
                            s0 = peg$c122;
                            peg$currPos += 5;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c123); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 12) === peg$c124) {
                              s0 = peg$c124;
                              peg$currPos += 12;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c125); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 9) === peg$c126) {
                                s0 = peg$c126;
                                peg$currPos += 9;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c127); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 9) === peg$c128) {
                                  s0 = peg$c128;
                                  peg$currPos += 9;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c129); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 5) === peg$c130) {
                                    s0 = peg$c130;
                                    peg$currPos += 5;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c131); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 10) === peg$c132) {
                                      s0 = peg$c132;
                                      peg$currPos += 10;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c133); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 11) === peg$c134) {
                                        s0 = peg$c134;
                                        peg$currPos += 11;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c135); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 13) === peg$c136) {
                                          s0 = peg$c136;
                                          peg$currPos += 13;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c137); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 13) === peg$c138) {
                                            s0 = peg$c138;
                                            peg$currPos += 13;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c139); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 14) === peg$c140) {
                                              s0 = peg$c140;
                                              peg$currPos += 14;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c141); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 12) === peg$c142) {
                                                s0 = peg$c142;
                                                peg$currPos += 12;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c143); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 13) === peg$c144) {
                                                  s0 = peg$c144;
                                                  peg$currPos += 13;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c145); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 15) === peg$c146) {
                                                    s0 = peg$c146;
                                                    peg$currPos += 15;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c147); }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 15) === peg$c148) {
                                                      s0 = peg$c148;
                                                      peg$currPos += 15;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c149); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 17) === peg$c150) {
                                                        s0 = peg$c150;
                                                        peg$currPos += 17;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c151); }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 18) === peg$c152) {
                                                          s0 = peg$c152;
                                                          peg$currPos += 18;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c153); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 16) === peg$c154) {
                                                            s0 = peg$c154;
                                                            peg$currPos += 16;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c155); }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 17) === peg$c156) {
                                                              s0 = peg$c156;
                                                              peg$currPos += 17;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c157); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 19) === peg$c158) {
                                                                s0 = peg$c158;
                                                                peg$currPos += 19;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c159); }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 14) === peg$c160) {
                                                                  s0 = peg$c160;
                                                                  peg$currPos += 14;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c161); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 13) === peg$c162) {
                                                                    s0 = peg$c162;
                                                                    peg$currPos += 13;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c163); }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 16) === peg$c164) {
                                                                      s0 = peg$c164;
                                                                      peg$currPos += 16;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c165); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 17) === peg$c166) {
                                                                        s0 = peg$c166;
                                                                        peg$currPos += 17;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c167); }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 20) === peg$c168) {
                                                                          s0 = peg$c168;
                                                                          peg$currPos += 20;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c169); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 20) === peg$c170) {
                                                                            s0 = peg$c170;
                                                                            peg$currPos += 20;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c171); }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 13) === peg$c172) {
                                                                              s0 = peg$c172;
                                                                              peg$currPos += 13;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c173); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 6) === peg$c174) {
                                                                                s0 = peg$c174;
                                                                                peg$currPos += 6;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c175); }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 9) === peg$c176) {
                                                                                  s0 = peg$c176;
                                                                                  peg$currPos += 9;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c177); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 11) === peg$c178) {
                                                                                    s0 = peg$c178;
                                                                                    peg$currPos += 11;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c179); }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 11) === peg$c180) {
                                                                                      s0 = peg$c180;
                                                                                      peg$currPos += 11;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c181); }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                      if (input.substr(peg$currPos, 12) === peg$c182) {
                                                                                        s0 = peg$c182;
                                                                                        peg$currPos += 12;
                                                                                      } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c183); }
                                                                                      }
                                                                                      if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 10) === peg$c184) {
                                                                                          s0 = peg$c184;
                                                                                          peg$currPos += 10;
                                                                                        } else {
                                                                                          s0 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c185); }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                          if (input.substr(peg$currPos, 11) === peg$c186) {
                                                                                            s0 = peg$c186;
                                                                                            peg$currPos += 11;
                                                                                          } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c187); }
                                                                                          }
                                                                                          if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 13) === peg$c188) {
                                                                                              s0 = peg$c188;
                                                                                              peg$currPos += 13;
                                                                                            } else {
                                                                                              s0 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c189); }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                              if (input.substr(peg$currPos, 13) === peg$c190) {
                                                                                                s0 = peg$c190;
                                                                                                peg$currPos += 13;
                                                                                              } else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c191); }
                                                                                              }
                                                                                              if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 15) === peg$c192) {
                                                                                                  s0 = peg$c192;
                                                                                                  peg$currPos += 15;
                                                                                                } else {
                                                                                                  s0 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c193); }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                  if (input.substr(peg$currPos, 16) === peg$c194) {
                                                                                                    s0 = peg$c194;
                                                                                                    peg$currPos += 16;
                                                                                                  } else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c195); }
                                                                                                  }
                                                                                                  if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 14) === peg$c196) {
                                                                                                      s0 = peg$c196;
                                                                                                      peg$currPos += 14;
                                                                                                    } else {
                                                                                                      s0 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c197); }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                      if (input.substr(peg$currPos, 15) === peg$c198) {
                                                                                                        s0 = peg$c198;
                                                                                                        peg$currPos += 15;
                                                                                                      } else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c199); }
                                                                                                      }
                                                                                                      if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 17) === peg$c200) {
                                                                                                          s0 = peg$c200;
                                                                                                          peg$currPos += 17;
                                                                                                        } else {
                                                                                                          s0 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c201); }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                          if (input.substr(peg$currPos, 17) === peg$c202) {
                                                                                                            s0 = peg$c202;
                                                                                                            peg$currPos += 17;
                                                                                                          } else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c203); }
                                                                                                          }
                                                                                                          if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 6) === peg$c204) {
                                                                                                              s0 = peg$c204;
                                                                                                              peg$currPos += 6;
                                                                                                            } else {
                                                                                                              s0 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c205); }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                              if (input.substr(peg$currPos, 3) === peg$c206) {
                                                                                                                s0 = peg$c206;
                                                                                                                peg$currPos += 3;
                                                                                                              } else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c207); }
                                                                                                              }
                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 5) === peg$c208) {
                                                                                                                  s0 = peg$c208;
                                                                                                                  peg$currPos += 5;
                                                                                                                } else {
                                                                                                                  s0 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c209); }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                  if (input.substr(peg$currPos, 8) === peg$c210) {
                                                                                                                    s0 = peg$c210;
                                                                                                                    peg$currPos += 8;
                                                                                                                  } else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c211); }
                                                                                                                  }
                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c212) {
                                                                                                                      s0 = peg$c212;
                                                                                                                      peg$currPos += 12;
                                                                                                                    } else {
                                                                                                                      s0 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c213); }
                                                                                                                    }
                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                      if (input.substr(peg$currPos, 12) === peg$c214) {
                                                                                                                        s0 = peg$c214;
                                                                                                                        peg$currPos += 12;
                                                                                                                      } else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c215); }
                                                                                                                      }
                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                        if (input.substr(peg$currPos, 14) === peg$c216) {
                                                                                                                          s0 = peg$c216;
                                                                                                                          peg$currPos += 14;
                                                                                                                        } else {
                                                                                                                          s0 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c217); }
                                                                                                                        }
                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                          if (input.substr(peg$currPos, 16) === peg$c218) {
                                                                                                                            s0 = peg$c218;
                                                                                                                            peg$currPos += 16;
                                                                                                                          } else {
                                                                                                                            s0 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c219); }
                                                                                                                          }
                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                            if (input.substr(peg$currPos, 10) === peg$c220) {
                                                                                                                              s0 = peg$c220;
                                                                                                                              peg$currPos += 10;
                                                                                                                            } else {
                                                                                                                              s0 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c221); }
                                                                                                                            }
                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                              if (input.substr(peg$currPos, 8) === peg$c222) {
                                                                                                                                s0 = peg$c222;
                                                                                                                                peg$currPos += 8;
                                                                                                                              } else {
                                                                                                                                s0 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c223); }
                                                                                                                              }
                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                if (input.substr(peg$currPos, 11) === peg$c224) {
                                                                                                                                  s0 = peg$c224;
                                                                                                                                  peg$currPos += 11;
                                                                                                                                } else {
                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c225); }
                                                                                                                                }
                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                  if (input.substr(peg$currPos, 11) === peg$c226) {
                                                                                                                                    s0 = peg$c226;
                                                                                                                                    peg$currPos += 11;
                                                                                                                                  } else {
                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c227); }
                                                                                                                                  }
                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c228) {
                                                                                                                                      s0 = peg$c228;
                                                                                                                                      peg$currPos += 12;
                                                                                                                                    } else {
                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c229); }
                                                                                                                                    }
                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                      if (input.substr(peg$currPos, 10) === peg$c230) {
                                                                                                                                        s0 = peg$c230;
                                                                                                                                        peg$currPos += 10;
                                                                                                                                      } else {
                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c231); }
                                                                                                                                      }
                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                        if (input.substr(peg$currPos, 11) === peg$c232) {
                                                                                                                                          s0 = peg$c232;
                                                                                                                                          peg$currPos += 11;
                                                                                                                                        } else {
                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c233); }
                                                                                                                                        }
                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                          if (input.substr(peg$currPos, 13) === peg$c234) {
                                                                                                                                            s0 = peg$c234;
                                                                                                                                            peg$currPos += 13;
                                                                                                                                          } else {
                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c235); }
                                                                                                                                          }
                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                            if (input.substr(peg$currPos, 13) === peg$c236) {
                                                                                                                                              s0 = peg$c236;
                                                                                                                                              peg$currPos += 13;
                                                                                                                                            } else {
                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c237); }
                                                                                                                                            }
                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                              if (input.substr(peg$currPos, 15) === peg$c238) {
                                                                                                                                                s0 = peg$c238;
                                                                                                                                                peg$currPos += 15;
                                                                                                                                              } else {
                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c239); }
                                                                                                                                              }
                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                if (input.substr(peg$currPos, 16) === peg$c240) {
                                                                                                                                                  s0 = peg$c240;
                                                                                                                                                  peg$currPos += 16;
                                                                                                                                                } else {
                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c241); }
                                                                                                                                                }
                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                  if (input.substr(peg$currPos, 14) === peg$c242) {
                                                                                                                                                    s0 = peg$c242;
                                                                                                                                                    peg$currPos += 14;
                                                                                                                                                  } else {
                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c243); }
                                                                                                                                                  }
                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                    if (input.substr(peg$currPos, 15) === peg$c244) {
                                                                                                                                                      s0 = peg$c244;
                                                                                                                                                      peg$currPos += 15;
                                                                                                                                                    } else {
                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c245); }
                                                                                                                                                    }
                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                      if (input.substr(peg$currPos, 17) === peg$c246) {
                                                                                                                                                        s0 = peg$c246;
                                                                                                                                                        peg$currPos += 17;
                                                                                                                                                      } else {
                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c247); }
                                                                                                                                                      }
                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                        if (input.substr(peg$currPos, 17) === peg$c248) {
                                                                                                                                                          s0 = peg$c248;
                                                                                                                                                          peg$currPos += 17;
                                                                                                                                                        } else {
                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                                                                                                                                        }
                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                          if (input.substr(peg$currPos, 12) === peg$c250) {
                                                                                                                                                            s0 = peg$c250;
                                                                                                                                                            peg$currPos += 12;
                                                                                                                                                          } else {
                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c251); }
                                                                                                                                                          }
                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                            if (input.substr(peg$currPos, 11) === peg$c252) {
                                                                                                                                                              s0 = peg$c252;
                                                                                                                                                              peg$currPos += 11;
                                                                                                                                                            } else {
                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c253); }
                                                                                                                                                            }
                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                              if (input.substr(peg$currPos, 19) === peg$c254) {
                                                                                                                                                                s0 = peg$c254;
                                                                                                                                                                peg$currPos += 19;
                                                                                                                                                              } else {
                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c255); }
                                                                                                                                                              }
                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                if (input.substr(peg$currPos, 19) === peg$c256) {
                                                                                                                                                                  s0 = peg$c256;
                                                                                                                                                                  peg$currPos += 19;
                                                                                                                                                                } else {
                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c257); }
                                                                                                                                                                }
                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c258) {
                                                                                                                                                                    s0 = peg$c258;
                                                                                                                                                                    peg$currPos += 12;
                                                                                                                                                                  } else {
                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c259); }
                                                                                                                                                                  }
                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                    if (input.substr(peg$currPos, 18) === peg$c260) {
                                                                                                                                                                      s0 = peg$c260;
                                                                                                                                                                      peg$currPos += 18;
                                                                                                                                                                    } else {
                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c261); }
                                                                                                                                                                    }
                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                      if (input.substr(peg$currPos, 18) === peg$c262) {
                                                                                                                                                                        s0 = peg$c262;
                                                                                                                                                                        peg$currPos += 18;
                                                                                                                                                                      } else {
                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c263); }
                                                                                                                                                                      }
                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                        if (input.substr(peg$currPos, 11) === peg$c264) {
                                                                                                                                                                          s0 = peg$c264;
                                                                                                                                                                          peg$currPos += 11;
                                                                                                                                                                        } else {
                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c265); }
                                                                                                                                                                        }
                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                          if (input.substr(peg$currPos, 8) === peg$c266) {
                                                                                                                                                                            s0 = peg$c266;
                                                                                                                                                                            peg$currPos += 8;
                                                                                                                                                                          } else {
                                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c267); }
                                                                                                                                                                          }
                                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c268) {
                                                                                                                                                                              s0 = peg$c268;
                                                                                                                                                                              peg$currPos += 8;
                                                                                                                                                                            } else {
                                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c269); }
                                                                                                                                                                            }
                                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                                              if (input.substr(peg$currPos, 8) === peg$c270) {
                                                                                                                                                                                s0 = peg$c270;
                                                                                                                                                                                peg$currPos += 8;
                                                                                                                                                                              } else {
                                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c271); }
                                                                                                                                                                              }
                                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                                if (input.substr(peg$currPos, 12) === peg$c272) {
                                                                                                                                                                                  s0 = peg$c272;
                                                                                                                                                                                  peg$currPos += 12;
                                                                                                                                                                                } else {
                                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c273); }
                                                                                                                                                                                }
                                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c274) {
                                                                                                                                                                                    s0 = peg$c274;
                                                                                                                                                                                    peg$currPos += 12;
                                                                                                                                                                                  } else {
                                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c275); }
                                                                                                                                                                                  }
                                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c276) {
                                                                                                                                                                                      s0 = peg$c276;
                                                                                                                                                                                      peg$currPos += 12;
                                                                                                                                                                                    } else {
                                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c277); }
                                                                                                                                                                                    }
                                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                                      if (input.substr(peg$currPos, 6) === peg$c278) {
                                                                                                                                                                                        s0 = peg$c278;
                                                                                                                                                                                        peg$currPos += 6;
                                                                                                                                                                                      } else {
                                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c279); }
                                                                                                                                                                                      }
                                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                                        if (input.substr(peg$currPos, 6) === peg$c280) {
                                                                                                                                                                                          s0 = peg$c280;
                                                                                                                                                                                          peg$currPos += 6;
                                                                                                                                                                                        } else {
                                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c281); }
                                                                                                                                                                                        }
                                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                                          if (input.substr(peg$currPos, 6) === peg$c282) {
                                                                                                                                                                                            s0 = peg$c282;
                                                                                                                                                                                            peg$currPos += 6;
                                                                                                                                                                                          } else {
                                                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c283); }
                                                                                                                                                                                          }
                                                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c284) {
                                                                                                                                                                                              s0 = peg$c284;
                                                                                                                                                                                              peg$currPos += 8;
                                                                                                                                                                                            } else {
                                                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c285); }
                                                                                                                                                                                            }
                                                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                                                              if (input.substr(peg$currPos, 8) === peg$c286) {
                                                                                                                                                                                                s0 = peg$c286;
                                                                                                                                                                                                peg$currPos += 8;
                                                                                                                                                                                              } else {
                                                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c287); }
                                                                                                                                                                                              }
                                                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                                                if (input.substr(peg$currPos, 8) === peg$c288) {
                                                                                                                                                                                                  s0 = peg$c288;
                                                                                                                                                                                                  peg$currPos += 8;
                                                                                                                                                                                                } else {
                                                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c289); }
                                                                                                                                                                                                }
                                                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c290) {
                                                                                                                                                                                                    s0 = peg$c290;
                                                                                                                                                                                                    peg$currPos += 12;
                                                                                                                                                                                                  } else {
                                                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c291); }
                                                                                                                                                                                                  }
                                                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c292) {
                                                                                                                                                                                                      s0 = peg$c292;
                                                                                                                                                                                                      peg$currPos += 12;
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c293); }
                                                                                                                                                                                                    }
                                                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                                                      if (input.substr(peg$currPos, 12) === peg$c294) {
                                                                                                                                                                                                        s0 = peg$c294;
                                                                                                                                                                                                        peg$currPos += 12;
                                                                                                                                                                                                      } else {
                                                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c295); }
                                                                                                                                                                                                      }
                                                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                                                        if (input.substr(peg$currPos, 7) === peg$c296) {
                                                                                                                                                                                                          s0 = peg$c296;
                                                                                                                                                                                                          peg$currPos += 7;
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c297); }
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                                                          if (input.substr(peg$currPos, 7) === peg$c298) {
                                                                                                                                                                                                            s0 = peg$c298;
                                                                                                                                                                                                            peg$currPos += 7;
                                                                                                                                                                                                          } else {
                                                                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c299); }
                                                                                                                                                                                                          }
                                                                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                                                                            s0 = peg$parseAriaCustomFloatOpcode();
                                                                                                                                                                                                          }
                                                                                                                                                                                                        }
                                                                                                                                                                                                      }
                                                                                                                                                                                                    }
                                                                                                                                                                                                  }
                                                                                                                                                                                                }
                                                                                                                                                                                              }
                                                                                                                                                                                            }
                                                                                                                                                                                          }
                                                                                                                                                                                        }
                                                                                                                                                                                      }
                                                                                                                                                                                    }
                                                                                                                                                                                  }
                                                                                                                                                                                }
                                                                                                                                                                              }
                                                                                                                                                                            }
                                                                                                                                                                          }
                                                                                                                                                                        }
                                                                                                                                                                      }
                                                                                                                                                                    }
                                                                                                                                                                  }
                                                                                                                                                                }
                                                                                                                                                              }
                                                                                                                                                            }
                                                                                                                                                          }
                                                                                                                                                        }
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  }
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c101); }
      }

      return s0;
    }

    function peg$parseIntegerOpcode() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 15) === peg$c301) {
        s0 = peg$c301;
        peg$currPos += 15;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c302); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 16) === peg$c303) {
          s0 = peg$c303;
          peg$currPos += 16;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c304); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 18) === peg$c305) {
            s0 = peg$c305;
            peg$currPos += 18;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c306); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 18) === peg$c307) {
              s0 = peg$c307;
              peg$currPos += 18;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c308); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 18) === peg$c305) {
                s0 = peg$c305;
                peg$currPos += 18;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c306); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 18) === peg$c307) {
                  s0 = peg$c307;
                  peg$currPos += 18;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c308); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 12) === peg$c309) {
                    s0 = peg$c309;
                    peg$currPos += 12;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c310); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c311) {
                      s0 = peg$c311;
                      peg$currPos += 5;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c312); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 5) === peg$c313) {
                        s0 = peg$c313;
                        peg$currPos += 5;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c314); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c315) {
                          s0 = peg$c315;
                          peg$currPos += 6;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c316); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 6) === peg$c317) {
                            s0 = peg$c317;
                            peg$currPos += 6;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c318); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 9) === peg$c319) {
                              s0 = peg$c319;
                              peg$currPos += 9;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c320); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 9) === peg$c321) {
                                s0 = peg$c321;
                                peg$currPos += 9;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c322); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c323) {
                                  s0 = peg$c323;
                                  peg$currPos += 6;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c324); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 6) === peg$c325) {
                                    s0 = peg$c325;
                                    peg$currPos += 6;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c326); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c327) {
                                      s0 = peg$c327;
                                      peg$currPos += 6;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c328); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 6) === peg$c329) {
                                        s0 = peg$c329;
                                        peg$currPos += 6;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c330); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 9) === peg$c331) {
                                          s0 = peg$c331;
                                          peg$currPos += 9;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c332); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 9) === peg$c333) {
                                            s0 = peg$c333;
                                            peg$currPos += 9;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c334); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 10) === peg$c335) {
                                              s0 = peg$c335;
                                              peg$currPos += 10;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c336); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 12) === peg$c337) {
                                                s0 = peg$c337;
                                                peg$currPos += 12;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c338); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 5) === peg$c339) {
                                                  s0 = peg$c339;
                                                  peg$currPos += 5;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c340); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 6) === peg$c341) {
                                                    s0 = peg$c341;
                                                    peg$currPos += 6;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c342); }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 13) === peg$c343) {
                                                      s0 = peg$c343;
                                                      peg$currPos += 13;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c344); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 10) === peg$c345) {
                                                        s0 = peg$c345;
                                                        peg$currPos += 10;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c346); }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 11) === peg$c347) {
                                                          s0 = peg$c347;
                                                          peg$currPos += 11;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c348); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 6) === peg$c349) {
                                                            s0 = peg$c349;
                                                            peg$currPos += 6;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c350); }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 3) === peg$c351) {
                                                              s0 = peg$c351;
                                                              peg$currPos += 3;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c352); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 5) === peg$c353) {
                                                                s0 = peg$c353;
                                                                peg$currPos += 5;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c354); }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 10) === peg$c355) {
                                                                  s0 = peg$c355;
                                                                  peg$currPos += 10;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c356); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 8) === peg$c357) {
                                                                    s0 = peg$c357;
                                                                    peg$currPos += 8;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c358); }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 9) === peg$c359) {
                                                                      s0 = peg$c359;
                                                                      peg$currPos += 9;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c360); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 4) === peg$c361) {
                                                                        s0 = peg$c361;
                                                                        peg$currPos += 4;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c362); }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 4) === peg$c361) {
                                                                          s0 = peg$c361;
                                                                          peg$currPos += 4;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c362); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 14) === peg$c363) {
                                                                            s0 = peg$c363;
                                                                            peg$currPos += 14;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c364); }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 14) === peg$c365) {
                                                                              s0 = peg$c365;
                                                                              peg$currPos += 14;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c366); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 12) === peg$c367) {
                                                                                s0 = peg$c367;
                                                                                peg$currPos += 12;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c368); }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 7) === peg$c369) {
                                                                                  s0 = peg$c369;
                                                                                  peg$currPos += 7;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c370); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 9) === peg$c371) {
                                                                                    s0 = peg$c371;
                                                                                    peg$currPos += 9;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c372); }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 13) === peg$c373) {
                                                                                      s0 = peg$c373;
                                                                                      peg$currPos += 13;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c374); }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                      if (input.substr(peg$currPos, 11) === peg$c375) {
                                                                                        s0 = peg$c375;
                                                                                        peg$currPos += 11;
                                                                                      } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c376); }
                                                                                      }
                                                                                      if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 15) === peg$c377) {
                                                                                          s0 = peg$c377;
                                                                                          peg$currPos += 15;
                                                                                        } else {
                                                                                          s0 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c378); }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                          if (input.substr(peg$currPos, 12) === peg$c379) {
                                                                                            s0 = peg$c379;
                                                                                            peg$currPos += 12;
                                                                                          } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c380); }
                                                                                          }
                                                                                          if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 13) === peg$c381) {
                                                                                              s0 = peg$c381;
                                                                                              peg$currPos += 13;
                                                                                            } else {
                                                                                              s0 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c382); }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                              if (input.substr(peg$currPos, 12) === peg$c383) {
                                                                                                s0 = peg$c383;
                                                                                                peg$currPos += 12;
                                                                                              } else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c384); }
                                                                                              }
                                                                                              if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 10) === peg$c385) {
                                                                                                  s0 = peg$c385;
                                                                                                  peg$currPos += 10;
                                                                                                } else {
                                                                                                  s0 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c386); }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                  if (input.substr(peg$currPos, 10) === peg$c387) {
                                                                                                    s0 = peg$c387;
                                                                                                    peg$currPos += 10;
                                                                                                  } else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c388); }
                                                                                                  }
                                                                                                  if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 10) === peg$c389) {
                                                                                                      s0 = peg$c389;
                                                                                                      peg$currPos += 10;
                                                                                                    } else {
                                                                                                      s0 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c390); }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                      if (input.substr(peg$currPos, 14) === peg$c391) {
                                                                                                        s0 = peg$c391;
                                                                                                        peg$currPos += 14;
                                                                                                      } else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c392); }
                                                                                                      }
                                                                                                      if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 14) === peg$c393) {
                                                                                                          s0 = peg$c393;
                                                                                                          peg$currPos += 14;
                                                                                                        } else {
                                                                                                          s0 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c394); }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                          if (input.substr(peg$currPos, 17) === peg$c395) {
                                                                                                            s0 = peg$c395;
                                                                                                            peg$currPos += 17;
                                                                                                          } else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c396); }
                                                                                                          }
                                                                                                          if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 18) === peg$c397) {
                                                                                                              s0 = peg$c397;
                                                                                                              peg$currPos += 18;
                                                                                                            } else {
                                                                                                              s0 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c398); }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                              if (input.substr(peg$currPos, 21) === peg$c399) {
                                                                                                                s0 = peg$c399;
                                                                                                                peg$currPos += 21;
                                                                                                              } else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c400); }
                                                                                                              }
                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 21) === peg$c401) {
                                                                                                                  s0 = peg$c401;
                                                                                                                  peg$currPos += 21;
                                                                                                                } else {
                                                                                                                  s0 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c402); }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                  if (input.substr(peg$currPos, 14) === peg$c403) {
                                                                                                                    s0 = peg$c403;
                                                                                                                    peg$currPos += 14;
                                                                                                                  } else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c404); }
                                                                                                                  }
                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 17) === peg$c405) {
                                                                                                                      s0 = peg$c405;
                                                                                                                      peg$currPos += 17;
                                                                                                                    } else {
                                                                                                                      s0 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c406); }
                                                                                                                    }
                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                      if (input.substr(peg$currPos, 13) === peg$c407) {
                                                                                                                        s0 = peg$c407;
                                                                                                                        peg$currPos += 13;
                                                                                                                      } else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c408); }
                                                                                                                      }
                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                        if (input.substr(peg$currPos, 6) === peg$c409) {
                                                                                                                          s0 = peg$c409;
                                                                                                                          peg$currPos += 6;
                                                                                                                        } else {
                                                                                                                          s0 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c410); }
                                                                                                                        }
                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                          if (input.substr(peg$currPos, 10) === peg$c411) {
                                                                                                                            s0 = peg$c411;
                                                                                                                            peg$currPos += 10;
                                                                                                                          } else {
                                                                                                                            s0 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c412); }
                                                                                                                          }
                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                            if (input.substr(peg$currPos, 10) === peg$c413) {
                                                                                                                              s0 = peg$c413;
                                                                                                                              peg$currPos += 10;
                                                                                                                            } else {
                                                                                                                              s0 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c414); }
                                                                                                                            }
                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                              if (input.substr(peg$currPos, 10) === peg$c415) {
                                                                                                                                s0 = peg$c415;
                                                                                                                                peg$currPos += 10;
                                                                                                                              } else {
                                                                                                                                s0 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c416); }
                                                                                                                              }
                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                if (input.substr(peg$currPos, 10) === peg$c417) {
                                                                                                                                  s0 = peg$c417;
                                                                                                                                  peg$currPos += 10;
                                                                                                                                } else {
                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c418); }
                                                                                                                                }
                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                  if (input.substr(peg$currPos, 11) === peg$c419) {
                                                                                                                                    s0 = peg$c419;
                                                                                                                                    peg$currPos += 11;
                                                                                                                                  } else {
                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c420); }
                                                                                                                                  }
                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                    if (input.substr(peg$currPos, 11) === peg$c421) {
                                                                                                                                      s0 = peg$c421;
                                                                                                                                      peg$currPos += 11;
                                                                                                                                    } else {
                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c422); }
                                                                                                                                    }
                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                      s0 = peg$parseAriaCustomIntegerOpcode();
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c300); }
      }

      return s0;
    }

    function peg$parseSequentialFloatDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseSequentialFloatOpcode();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedDecimalLiteral();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSequentialIntegerDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseSequentialIntegerOpcode();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedDecimalLiteral();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSequentialFloatOpcode() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 13) === peg$c425) {
        s0 = peg$c425;
        peg$currPos += 13;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c426); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c427) {
          s0 = peg$c427;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c428); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 13) === peg$c429) {
            s0 = peg$c429;
            peg$currPos += 13;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c430); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 13) === peg$c431) {
              s0 = peg$c431;
              peg$currPos += 13;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c432); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 14) === peg$c433) {
                s0 = peg$c433;
                peg$currPos += 14;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c434); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 12) === peg$c435) {
                  s0 = peg$c435;
                  peg$currPos += 12;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c436); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 13) === peg$c437) {
                    s0 = peg$c437;
                    peg$currPos += 13;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c438); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 15) === peg$c439) {
                      s0 = peg$c439;
                      peg$currPos += 15;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c440); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 15) === peg$c441) {
                        s0 = peg$c441;
                        peg$currPos += 15;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c442); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 14) === peg$c443) {
                          s0 = peg$c443;
                          peg$currPos += 14;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c444); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 13) === peg$c445) {
                            s0 = peg$c445;
                            peg$currPos += 13;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c446); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 10) === peg$c447) {
                              s0 = peg$c447;
                              peg$currPos += 10;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c448); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 10) === peg$c449) {
                                s0 = peg$c449;
                                peg$currPos += 10;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c450); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 10) === peg$c451) {
                                  s0 = peg$c451;
                                  peg$currPos += 10;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c452); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 8) === peg$c453) {
                                    s0 = peg$c453;
                                    peg$currPos += 8;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c454); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 8) === peg$c455) {
                                      s0 = peg$c455;
                                      peg$currPos += 8;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c456); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 8) === peg$c457) {
                                        s0 = peg$c457;
                                        peg$currPos += 8;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c458); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 10) === peg$c459) {
                                          s0 = peg$c459;
                                          peg$currPos += 10;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c460); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 10) === peg$c461) {
                                            s0 = peg$c461;
                                            peg$currPos += 10;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c462); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 10) === peg$c463) {
                                              s0 = peg$c463;
                                              peg$currPos += 10;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c464); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 13) === peg$c465) {
                                                s0 = peg$c465;
                                                peg$currPos += 13;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c466); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 13) === peg$c465) {
                                                  s0 = peg$c465;
                                                  peg$currPos += 13;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c466); }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c424); }
      }

      return s0;
    }

    function peg$parseSequentialIntegerOpcode() {
      var s0;

      if (input.substr(peg$currPos, 14) === peg$c467) {
        s0 = peg$c467;
        peg$currPos += 14;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c468); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c469) {
          s0 = peg$c469;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c470); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c471) {
            s0 = peg$c471;
            peg$currPos += 9;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c472); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c473) {
              s0 = peg$c473;
              peg$currPos += 10;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c474); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 10) === peg$c475) {
                s0 = peg$c475;
                peg$currPos += 10;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c476); }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$parseAriaCustomSequentialIntegerOpcode();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseDelayCcDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c477) {
        s2 = peg$c477;
        peg$currPos += 8;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c478); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedDecimalLiteral();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseOffsetCcDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c479) {
        s2 = peg$c479;
        peg$currPos += 9;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c480); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedIntegerAsNumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePitchLfoDepthCcDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.substr(peg$currPos, 16) === peg$c481) {
        s2 = peg$c481;
        peg$currPos += 16;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c482); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedIntegerAsNumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePitchLfoFreqCcDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.substr(peg$currPos, 15) === peg$c483) {
        s2 = peg$c483;
        peg$currPos += 15;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c484); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedDecimalLiteral();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseCutoffCcDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c485) {
        s2 = peg$c485;
        peg$currPos += 9;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c486); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$reportedPos = s1;
          s2 = peg$c423(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedIntegerAsNumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c67(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLoopModeDirective() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c487) {
        s1 = peg$c487;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c488); }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c489) {
            s3 = peg$c489;
            peg$currPos += 7;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c490); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c491) {
              s3 = peg$c491;
              peg$currPos += 8;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c492); }
            }
            if (s3 === peg$FAILED) {
              if (input.substr(peg$currPos, 15) === peg$c493) {
                s3 = peg$c493;
                peg$currPos += 15;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c494); }
              }
              if (s3 === peg$FAILED) {
                if (input.substr(peg$currPos, 12) === peg$c495) {
                  s3 = peg$c495;
                  peg$currPos += 12;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c496); }
                }
              }
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c497(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMidiNoteValue() {
      var s0;

      s0 = peg$parseSignedIntegerAsNumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parseMidiNoteName();
      }

      return s0;
    }

    function peg$parseDecimalDigits() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseDecimalDigit();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parseDecimalDigit();
        }
      } else {
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseDecimalDigit() {
      var s0;

      if (peg$c498.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c499); }
      }

      return s0;
    }

    function peg$parseNonZeroDigit() {
      var s0;

      if (peg$c500.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c501); }
      }

      return s0;
    }

    function peg$parseExponentPart() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseExponentIndicator();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSignedInteger();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseExponentIndicator() {
      var s0;

      if (peg$c502.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c503); }
      }

      return s0;
    }

    function peg$parseSignedInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c504.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c505); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSignedIntegerAsNumber() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c504.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c505); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c506(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseDecimalLiteral() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      s3 = peg$parseDecimalIntegerLiteral();
      if (s3 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c507;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c508); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseDecimalDigits();
          if (s5 === peg$FAILED) {
            s5 = peg$c2;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseExponentPart();
            if (s6 === peg$FAILED) {
              s6 = peg$c2;
            }
            if (s6 !== peg$FAILED) {
              s3 = [s3, s4, s5, s6];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c0;
      }
      if (s2 !== peg$FAILED) {
        s2 = input.substring(s1, peg$currPos);
      }
      s1 = s2;
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c509(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c507;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c508); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseDecimalDigits();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseExponentPart();
            if (s5 === peg$FAILED) {
              s5 = peg$c2;
            }
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s2 = input.substring(s1, peg$currPos);
        }
        s1 = s2;
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c510(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$currPos;
          s3 = peg$parseDecimalIntegerLiteral();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseExponentPart();
            if (s4 === peg$FAILED) {
              s4 = peg$c2;
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s2 = input.substring(s1, peg$currPos);
          }
          s1 = s2;
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c510(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseDecimalIntegerLiteral() {
      var s0, s1, s2;

      if (input.charCodeAt(peg$currPos) === 48) {
        s0 = peg$c511;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c512); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNonZeroDigit();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseDecimalDigits();
          if (s2 === peg$FAILED) {
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseSignedDecimalLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c504.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c505); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalLiteral();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c513(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMidiNoteName() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseMidiPitch();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseMidiAccidental();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSignedIntegerAsNumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c514(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMidiPitch() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c515.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c516); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c517(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseMidiAccidental() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c518.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c519); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c520(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseFilepath() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseFilename();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFileExtension();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c521(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFilename() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parseFileExtension();
      peg$silentFails--;
      if (s4 === peg$FAILED) {
        s3 = peg$c522;
      } else {
        peg$currPos = s3;
        s3 = peg$c0;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseSourceCharacter();
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s2;
          s3 = peg$c523(s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c0;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parseFileExtension();
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c522;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSourceCharacter();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s2;
              s3 = peg$c523(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c524(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsePath() {
      var s0;

      if (input.substr(peg$currPos, 3) === peg$c525) {
        s0 = peg$c525;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c526); }
      }

      return s0;
    }

    function peg$parseFileExtension() {
      var s0;

      if (input.substr(peg$currPos, 4) === peg$c527) {
        s0 = peg$c527;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c528); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c529) {
          s0 = peg$c529;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c530); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c531) {
            s0 = peg$c531;
            peg$currPos += 4;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c532); }
          }
        }
      }

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c534.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c535); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseZs();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c533); }
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0;

      if (peg$c536.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c537); }
      }

      return s0;
    }

    function peg$parseLineTerminatorSequence() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c539;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c540); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c541) {
          s0 = peg$c541;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c542); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c543;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c544); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c545;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c546); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c547;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c548); }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c538); }
      }

      return s0;
    }

    function peg$parseComment() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseMultiLineComment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSingleLineComment();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c549); }
      }

      return s0;
    }

    function peg$parseMultiLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c550) {
        s1 = peg$c550;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c551); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c552) {
          s5 = peg$c552;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c553); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c522;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c552) {
            s5 = peg$c552;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c553); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c522;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c552) {
            s3 = peg$c552;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c553); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMultiLineCommentNoLineTerminator() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c550) {
        s1 = peg$c550;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c551); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c552) {
          s5 = peg$c552;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c553); }
        }
        if (s5 === peg$FAILED) {
          s5 = peg$parseLineTerminator();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c522;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c552) {
            s5 = peg$c552;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c553); }
          }
          if (s5 === peg$FAILED) {
            s5 = peg$parseLineTerminator();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c522;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c552) {
            s3 = peg$c552;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c553); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSingleLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c554) {
        s1 = peg$c554;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c555); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseLineTerminator();
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c522;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseLineTerminator();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c522;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseZs() {
      var s0;

      if (peg$c556.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c557); }
      }

      return s0;
    }

    function peg$parseEOS() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c558;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c559); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLineTerminatorSequence();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 125) {
              s3 = peg$c560;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c561); }
            }
            peg$silentFails--;
            if (s3 !== peg$FAILED) {
              peg$currPos = s2;
              s2 = peg$c522;
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse__();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseEOF();
              if (s2 !== peg$FAILED) {
                s1 = [s1, s2];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseEOSNoLineTerminator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c558;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c559); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLineTerminatorSequence();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 125) {
              s3 = peg$c560;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c561); }
            }
            peg$silentFails--;
            if (s3 !== peg$FAILED) {
              peg$currPos = s2;
              s2 = peg$c522;
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseEOF();
              if (s2 !== peg$FAILED) {
                s1 = [s1, s2];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c522;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseMultiLineCommentNoLineTerminator();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSingleLineComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseMultiLineCommentNoLineTerminator();
          if (s1 === peg$FAILED) {
            s1 = peg$parseSingleLineComment();
          }
        }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseLineTerminatorSequence();
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseLineTerminatorSequence();
          if (s1 === peg$FAILED) {
            s1 = peg$parseComment();
          }
        }
      }

      return s0;
    }

    function peg$parseAriaCustomHeader() {
      var s0;

      if (input.substr(peg$currPos, 9) === peg$c562) {
        s0 = peg$c562;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c563); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c16) {
          s0 = peg$c16;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
      }

      return s0;
    }

    function peg$parseAriaCustomIntegerOpcode() {
      var s0;

      if (input.substr(peg$currPos, 14) === peg$c564) {
        s0 = peg$c564;
        peg$currPos += 14;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c565); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 13) === peg$c566) {
          s0 = peg$c566;
          peg$currPos += 13;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c567); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 10) === peg$c568) {
            s0 = peg$c568;
            peg$currPos += 10;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c569); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 11) === peg$c570) {
              s0 = peg$c570;
              peg$currPos += 11;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c571); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 10) === peg$c572) {
                s0 = peg$c572;
                peg$currPos += 10;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c573); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 19) === peg$c574) {
                  s0 = peg$c574;
                  peg$currPos += 19;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c575); }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseAriaCustomFloatOpcode() {
      var s0;

      if (input.substr(peg$currPos, 10) === peg$c568) {
        s0 = peg$c568;
        peg$currPos += 10;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c569); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 13) === peg$c566) {
          s0 = peg$c566;
          peg$currPos += 13;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c567); }
        }
      }

      return s0;
    }

    function peg$parseAriaCustomSequentialIntegerOpcode() {
      var s0;

      if (input.substr(peg$currPos, 6) === peg$c576) {
        s0 = peg$c576;
        peg$currPos += 6;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c577); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 16) === peg$c578) {
          s0 = peg$c578;
          peg$currPos += 16;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c579); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 14) === peg$c580) {
            s0 = peg$c580;
            peg$currPos += 14;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c581); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 17) === peg$c582) {
              s0 = peg$c582;
              peg$currPos += 17;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c583); }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseAriaCustomTextOpcode() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c584) {
        s1 = peg$c584;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c585); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLabel();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c586(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseAriaDefaultPathOpcode() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c587) {
        s1 = peg$c587;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c588); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsePath();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c589(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLabel() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parseLineTerminatorSequence();
      peg$silentFails--;
      if (s4 === peg$FAILED) {
        s3 = peg$c522;
      } else {
        peg$currPos = s3;
        s3 = peg$c0;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseSourceCharacter();
        if (s4 !== peg$FAILED) {
          peg$reportedPos = s2;
          s3 = peg$c523(s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c0;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c0;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parseLineTerminatorSequence();
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c522;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSourceCharacter();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s2;
              s3 = peg$c523(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c524(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseAriaCurveOpcode() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 118) {
        s1 = peg$c590;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c591); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c65;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c592(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgOpcode() {
      var s0;

      s0 = peg$parseFlexEgCutoff();
      if (s0 === peg$FAILED) {
        s0 = peg$parseFlexEgSustain();
        if (s0 === peg$FAILED) {
          s0 = peg$parseFlexEgPitch();
          if (s0 === peg$FAILED) {
            s0 = peg$parseFlexEgTime();
            if (s0 === peg$FAILED) {
              s0 = peg$parseFlexEgLevel();
              if (s0 === peg$FAILED) {
                s0 = peg$parseFlexEgShape();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseFlexEgCutoff() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c595) {
            s3 = peg$c595;
            peg$currPos += 8;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c596); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c597(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgSustain() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c598) {
            s3 = peg$c598;
            peg$currPos += 9;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c599); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c597(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgPitch() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c600) {
            s3 = peg$c600;
            peg$currPos += 7;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c601); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c597(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgTime() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c602) {
            s3 = peg$c602;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c603); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedIntegerAsNumber();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c65;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseSignedDecimalLiteral();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c604(s2, s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgLevel() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c605) {
            s3 = peg$c605;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c606); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedIntegerAsNumber();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c65;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseSignedDecimalLiteral();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c607(s2, s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseFlexEgShape() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c593) {
        s1 = peg$c593;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c594); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c608) {
            s3 = peg$c608;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c609); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedIntegerAsNumber();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c65;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseSignedIntegerAsNumber();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c610(s2, s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoOpcode() {
      var s0;

      s0 = peg$parseLfoWave();
      if (s0 === peg$FAILED) {
        s0 = peg$parseLfoFreq();
        if (s0 === peg$FAILED) {
          s0 = peg$parseLfoPitch();
          if (s0 === peg$FAILED) {
            s0 = peg$parseLfoDelay();
            if (s0 === peg$FAILED) {
              s0 = peg$parseLfoAmplitude();
              if (s0 === peg$FAILED) {
                s0 = peg$parseLfoCutoff();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseLfoPhase();
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseLfoWave() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c613) {
            s3 = peg$c613;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c614); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedIntegerAsNumber();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c615(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoFreq() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c616) {
            s3 = peg$c616;
            peg$currPos += 6;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c617); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c618(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoPitch() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c600) {
            s3 = peg$c600;
            peg$currPos += 7;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c601); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedIntegerAsNumber();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c619(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoDelay() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c620) {
            s3 = peg$c620;
            peg$currPos += 7;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c621); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c622(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoAmplitude() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 11) === peg$c623) {
            s3 = peg$c623;
            peg$currPos += 11;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c624); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c625(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoCutoff() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c595) {
            s3 = peg$c595;
            peg$currPos += 8;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c596); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c626(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseLfoPhase() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c611) {
        s1 = peg$c611;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c612); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c627) {
            s3 = peg$c627;
            peg$currPos += 7;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c628); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSignedDecimalLiteral();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c629(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

},{}],20:[function(_dereq_,module,exports){
var  Parameter = _dereq_("./parameter")
  , _ = _dereq_("underscore")

function extend(target, source){
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

Region = function(opts){
  this.sample = {}
  this.inputControls = {}
  this.performanceParameters = {}
  _.extend(this, opts)
  _.defaults(this, Parameter.defaultValues)
}

module.exports = Region

},{"./parameter":18,"underscore":2}],21:[function(_dereq_,module,exports){
var sfz = {}
  , Parser = _dereq_("./parser")

sfz.Instrument = _dereq_("./instrument")

sfz.parse = function(str, driver, audioContext){
  var instrumentDefinition = Parser.parse(str)
  if (driver) instrumentDefinition.driver = driver
  if (audioContext) instrumentDefinition.audioContext = audioContext
  return new sfz.Instrument(instrumentDefinition)
}


module.exports = sfz

},{"./instrument":16,"./parser":19}]},{},[1])
(1)
});