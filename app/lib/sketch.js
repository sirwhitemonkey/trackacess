
var __slice = Array.prototype.slice;
(function($) {
  var Sketch;
  $.fn.sketch = function() {
    var args, key, sketch;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.length > 1) {
      $.error('Sketch.js can only be called on one element at a time.');
    }
    sketch = this.data('sketch');
    if (typeof key === 'string' && sketch) {
      if (sketch[key]) {
        if (typeof sketch[key] === 'function') {
          return sketch[key].apply(sketch, args);
        } else if (args.length === 0) {
          return sketch[key];
        } else if (args.length === 1) {

          if (key === 'text') {
            sketch.setText(args[0]);
          }
          return sketch[key] = args[0];
        }
      } else {
        return $.error('Sketch.js did not recognize the given command.');
      }
    } else if (sketch) {
      return sketch;
    } else {
      this.data('sketch', new Sketch(this.get(0), key));
      return this;
    }
  };
  Sketch = (function() {
    function Sketch(el, opts) {
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      this.options = $.extend({
        toolLinks: true,
        defaultTool: 'marker',
        defaultColor: '#000000',
        defaultSize: 5
      }, opts);
      this.painting = false;
      this.color = this.options.defaultColor;
      this.size = this.options.defaultSize;
      this.tool = this.options.defaultTool;
      this.actions = [];
      this.action = [];

      //Drawing the texts
      this.texts=[];
      this.text = 'text';
      this.texting = false;
      this.selectedText = -1;
      this.canvasOffset = this.canvas.offset();
      this.offsetX = this.canvasOffset.left;
      this.offsetY = this.canvasOffset.top;
      this.scrollX = this.canvas.scrollLeft();
      this.scrollY = this.canvas.scrollTop();
      this.startX=0;
      this.startY=0;
      this.mouseX=0;
      this.mouseY=0;

      //TODO
      this.font = '18px verdana';
      //-------------------------

      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
      if (this.options.toolLinks) {
        $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
          var $canvas, $this, key, sketch, _i, _len, _ref;
          $this = $(this);
          $canvas = $($this.attr('href'));
          sketch = $canvas.data('sketch');
          _ref = ['color', 'size', 'tool','text'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            if ($this.attr("data-" + key)) {
              sketch.set(key, $(this).attr("data-" + key));
            }
          }
          if ($(this).attr('data-download')) {
            sketch.download($(this).attr('data-download'));
          }

          return false;
        });
      }
    }
    Sketch.prototype.download = function(format) {
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      return window.open(this.el.toDataURL(mime));

    };
    Sketch.prototype.set = function(key, value) {
      this[key] = value;
      if (key === 'text') {
        this.setText(value);
      }
      return this.canvas.trigger("sketch.change" + key, value);
    };
    Sketch.prototype.startPainting = function() {
      this.painting = true;
      this.texting = false;
      return this.action = {
        tool: this.tool,
        color: this.color,
        size: parseFloat(this.size),
        events: []
      };
    };
    Sketch.prototype.stopPainting = function() {
      if (this.action) {
        this.actions.push(this.action);
      }
      this.painting = false;
      this.texting=false;
      this.action = null;
      return this.drawStrokes();
    };
    Sketch.prototype.onEvent = function(e) {
      try {
        if (e.originalEvent && e.originalEvent.targetTouches) {
          e.pageX = e.originalEvent.targetTouches[0].pageX;
          e.pageY = e.originalEvent.targetTouches[0].pageY;
        }
        $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
        e.preventDefault();
      }catch(e) {

      }
      return false;
    };
    Sketch.prototype.drawStrokes = function() {
      var sketch;
      //this.el.width = this.canvas.width();
      this.context = this.el.getContext('2d');
      sketch = this;
      $.each(this.actions, function() {
        if (this.tool) {
          return $.sketch.tools[this.tool].draw.call(sketch, this);
        }
      });
      if (this.painting && this.action && Object.keys(this.action).length > 0) {
        return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
      }
    };

    //test if x,y is inside the bounding box of texts[textIndex]
    Sketch.prototype.textHitTest=function (x, y, textIndex) {
      var text = this.texts[textIndex];
      //return ((x >= text.x) && (x <= text.x + text.width) && (y >= text.y - text.height) && (y <= text.y));
      return ((x >= text.x) && (x <= text.x + text.width) && (y >= text.y - text.height));

    };

    Sketch.prototype.drawTexts=function() {

      var text;
       for (var i = 0; i < this.texts.length; i++) {
        text = this.texts[i];
        this.context.font=text.font;
        this.context.fillStyle=text.color;
        this.context.fillText(text.text, text.x, text.y);
      }
    };

    Sketch.prototype.setText=function(text) {

      this.texting=true;
      this.painting=false;

      this.texts.push({
        text: text,
        color: this.color,
        font: this.font,
        height: 18,
        x: 20,
        y: 20
      });


      var text = this.texts[this.texts.length-1];

      this.context.font=text.font;
      this.context.fillStyle=text.color;
      text.width = this.context.measureText(text.text).width;


      this.context.clearRect(0,0,this.canvas[0].width,this.canvas[0].height);
      this.drawTexts();

    };

    Sketch.prototype.reset=function() {
      this.context.clearRect(0,0,this.canvas[0].width,this.canvas[0].height);
      this.painting=true;
      this.drawStrokes();
      this.painting=false;
      this.drawTexts();
      this.selectedText=-1;
    };

    Sketch.prototype.clear=function() {
      this.actions=[];
      this.action=[];
      this.texts=[];
      this.context.clearRect(0,0,this.canvas[0].width,this.canvas[0].height);

    };

    return Sketch;

  })();
  $.sketch = {
    tools: {}
  };

  $.sketch.tools.clear={
    onEvent: function(e) {
      this.actions=[];
      this.action=[];
      this.texts=[];
      this.context.clearRect(0,0,this.canvas[0].width,this.canvas[0].height);
    }
  };





  $.sketch.tools.label={


    onEvent: function(e) {


      switch (e.type) {
        case 'mousedown':
        case 'touchstart':

             //this.selectedText=-1;
             if (this.texting) {
               e.preventDefault();

               this.startX = parseFloat(e.pageX - this.offsetX);
               this.startY = parseFloat(e.pageY - this.offsetY);

               for (var i = 0; i < this.texts.length; i++) {
                 if (this.textHitTest(this.startX, this.startY, i)) {
                   this.selectedText = i;
                 }
               }
             }

          break;
        case 'mousemove':
        case 'touchmove':
          if (this.texting) {
            if (this.selectedText <0) {
              return;
            }


            var startY=this.startY;
            var startX=this.startX;

            e.preventDefault();
            this.mouseX = parseFloat(e.pageX - this.offsetX);
            this.mouseY = parseFloat(e.pageY - this.offsetY);

            var dx = this.mouseX - this.startX;
            var dy = this.mouseY - this.startY;
            this.startX = this.mouseX;
            this.startY = this.mouseY;

            var text = this.texts[this.selectedText];

            var origin=20;
            if (startX <0) {
              text.x=origin;
            } else if (startX > this.canvas[0].width) {
              text.x = this.canvas[0].width-(text.width*2);
            }else {
              text.x += dx;
            }

            if (startY < 0) {
              text.y = origin;
             } else if (startY > this.canvas[0].height) {
              text.y = this.canvas[0].height-text.height;
            } else {
              text.y += dy;
            }

            this.context.clearRect(0,0,this.canvas[0].width,this.canvas[0].height);


            this.painting=true;
            this.drawStrokes();
            this.painting=false;
            this.drawTexts();




          }
          break;
        case 'mouseup':
        case 'mouseout':
        case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          if (this.texting) {
            e.preventDefault();
            this.selectedText=-1;
          }

       }

    }
  };


  $.sketch.tools.marker = {
    onEvent: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          if (this.painting) {
            this.stopPainting();
          }
          this.startPainting();


          break;
        case 'mouseup':
        case 'mouseout':
        case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          this.stopPainting();

      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        this.drawStrokes();
        this.drawTexts();
      }
    },
    draw: function(action) {
      var event, previous, _i, _len, _ref;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.moveTo(action.events[0].x, action.events[0].y);
      _ref = action.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.context.lineTo(event.x, event.y);
        previous = event;
      }
      this.context.strokeStyle = action.color;
      this.context.lineWidth = action.size;
      return this.context.stroke();
    }
  };
  return $.sketch.tools.eraser = {
    onEvent: function(e) {
      return $.sketch.tools.marker.onEvent.call(this, e);
    },
    draw: function(action) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "destination-out";
      action.color = "rgba(0,0,0,1.0)";
      $.sketch.tools.marker.draw.call(this, action);
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };
})(jQuery);


