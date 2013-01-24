/**
 * jQuery-HatenaBlock
 */
(function($){
    var init, setupElement, methods;

    methods = {
      /**
       * Coin Action
       *
       */
      coin: function(options) {
        var elements, opts;
        elements = this;
        opts = $.extend({}, $.fn.hatenablock.defaults);

        elements.each(function(){
            var $elm, $coin, offset;

            // initialize coin element
            $elm = $(this);
            offset = $elm.offset();
            $coin = createElement($elm, opts.itemElement, {
                text: opts.itemText,
                style: opts.itemStyle,
                clsName: 'jqhatenablock-item jqhatenablock-item-coin',
                offsetX: opts.offsetX,
                offsetY: opts.offsetY
            }).show();

            // action
            $.Deferred(function(dtd){
                dtd.pipe(function(){
                    return $coin.animate({
                        top: offset.top - $coin.height() * opts.deltaY
                    }, opts.speed * 3 / 4);
                })
                .pipe(function(){
                    var timer = $.Deferred();
                    setTimeout(function(){
                        timer.resolve();
                    }, opts.speed / 10);
                    return timer;
                })
                .pipe(function(){
                    return $coin.animate({
                        top: offset.top - $coin.height() * opts.deltaY / 2
                    }, opts.speed / 4);
                })
                .pipe(function(){
                    scoreUp($coin, 'coin', opts);
                    $coin.remove();
                });
            }).resolve();
        });

        return this;
      },
      /**
       * Score up action
       *
       */
      score: function(options) {
        var opts = $.extend({includeOwnHeight: true}, $.fn.hatenablock.defaults, options);
        return this.each(function(){ scoreUp($(this), 'score', opts); });
      }
    };

    $.fn.hatenablock = function(method){
      if(methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } 
      if(typeof method === 'object' || ! method) {
        return methods.coin.apply(this, arguments);
      }
      $.error('Method ' + name + 'does not exist on jQuery.hatenablock');
    };

    $.extend({
        hatenablockSetup: function(options) {
          $.extend($.fn.hatenablock.defaults, options);
        }
    });


    /**
     * score up action to element
     *
     */
    scoreUp = function($elm, name, opts){
      // initialize
      var $score = createElement($elm, opts.scoreElement, {
          style: opts.scoreStyle,
          clsName: 'jqhatenablock-score jqhatenablock-score-' + name,
          text: opts.scoreText,
          offsetX: opts.offsetX,
          offsetY: opts.offsetY,
          includeOwnHeight: opts.includeOwnHeight || false 
      });
      $score.css({top: top}).show();

      // do action
      $score.animate({
          top: $score.offset().top - $score.height() * opts.deltaY,
          opacity: 0.3
      }, opts.speed * 2.5).promise().done(function(){
          $score.remove();
      });
    };

    /**
     * generate DOM elmement
     *
     */
    createElement = function($parent, $origElement, options) {
      var $elm, offset, opts;
      opts = $.extend({
          text: '',
          clsName: '',
          offsetY: 0,
          offsetX: 0,
          style: {},
          includeOwnHeight: true,
          adjustWindow: $.fn.hatenablock.defaults.adjustWindow
      }, options);

      $elm = $origElement.clone().css(opts.style).text(opts.text).addClass(opts.clsName).hide().appendTo($('body'));
      offset = $parent.offset();
      $elm.css({
          left: offset.left + $parent.width() / 2 - $elm.width() / 2 + opts.offsetX,
          top: offset.top + opts.offsetY - (opts.includeOwnHeight? $elm.height() : 0)
      });
      return $elm;
    };


    /**
     * adjust offset
     *
     */
    getAdjustedOffset = function(left, width) {
      if(left < 0) {
        left = 0;
      } else if (window.innerWidth < left + width / 2) {
        left = window.innerWidth - width;
      }
      return left;
    };


    /**
     * Defualt options
     *
     */
    $.fn.hatenablock.defaults = {
      speed: 300,
      deltaY: 3,
      offsetY: 0,
      offsetX: 0,
      itemText: '',
      itemStyle: {},
      itemElement: $('<div>'),
      scoreText: '',
      scoreStyle: {},
      scoreElement: $('<span>'),
      adjustWindow: true
    };

}(jQuery));
