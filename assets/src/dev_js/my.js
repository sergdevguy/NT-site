$(document).ready(function () {
  'use strict';




  //
  //
  // SLIDER. украл код
  //
  //

  var multiItemSlider = (function () {
    return function (selector) {
      var
        _mainElement = document.querySelector(selector), // основный элемент блока
        _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
        _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
        _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
        _positionLeftItem = 0, // позиция левого активного элемента
        _transform = 0, // значение транфсофрмации .slider_wrapper
        _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
        _items = []; // массив элементов

      // Наполнение массива _items, добавляем все слайды в массив
      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });

      var position = {
        getItemMin: function () {
          var indexItem = 0;
          _items.forEach(function (item, index) {
            if (item.position < _items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getItemMax: function () {
          var indexItem = 0;
          _items.forEach(function (item, index) {
            if (item.position > _items[indexItem].position) {
              indexItem = index;
            }
          });
          return indexItem;
        },
        getMin: function () {
          return _items[position.getItemMin()].position;
        },
        getMax: function () {
          return _items[position.getItemMax()].position;
        }
      }

      var _transformItem = function (direction) {
        var nextItem;
        if (direction === 'right') {
          _positionLeftItem++;
          if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
            nextItem = position.getItemMin();
            _items[nextItem].position = position.getMax() + 1;
            _items[nextItem].transform += _items.length * 100;
            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
          }
          _transform -= _step;
        }
        if (direction === 'left') {
          _positionLeftItem--;
          if (_positionLeftItem < position.getMin()) {
            nextItem = position.getItemMax();
            _items[nextItem].position = position.getMin() - 1;
            _items[nextItem].transform -= _items.length * 100;
            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
          }
          _transform += _step;
        }
        _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
      }

      // обработчик события click для кнопок "назад" и "вперед"
      var _controlClick = function (e) {
        var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
        e.preventDefault();
        _transformItem(direction);
      };

      var _setUpListeners = function () {
        // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
        _sliderControls.forEach(function (item) {
          item.addEventListener('click', _controlClick);
        });
      }

      // инициализация
      _setUpListeners();

      var resetToDefault = function() {
        // reset vars 
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
        _positionLeftItem = 0;
        _transform = 0;
        _step = _itemWidth / _wrapperWidth * 100;

        // reset objects propertys in array _items
        _items.forEach(function(item, index){
          item.position = index;
          item.transform = 0;
        });
      };

      return {
        reset: function(){
          resetToDefault();
        },
        right: function () { // метод right
          _transformItem('right');
        },
        left: function () { // метод left
          _transformItem('left');
        }
        
      }

    }
  }());

  var slider = multiItemSlider('.slider');

  
  window.onresize = function() {

    // reset slider to start position
    $(".slider__wrapper").attr("style", "transform:translateX(0)");
    $(".slider__wrapper .slider__item").each(function(){
      $(this).attr("style", "transform:translateX(0)");
    });

    slider.reset();
    // end reset slider

  };




  //
  //
  // POPUP slider
  //
  //

  // Show popup on click.
  // Get img src from clicked to popup img.
  $(".img_container").each(function (i) {
    $(this).on("click", function () {
      var img_src = $(".slider__item:nth-child(" + (i + 1) + ") .slide-img").attr('src');
      $(".slider-img-popup").css("display", "flex");
      $(".slider-img-popup img").attr("src", img_src);
      $(".slider-img-popup").animate({
        opacity: 1
      }), 500, function () { }
    });
  });

  // Hide popup on click on bg
  $(".slider-img-popup .bg").on("click", function () {
    $(".slider-img-popup").animate({
      opacity: 0
    }, 500, function () {
      $(".slider-img-popup").css("display", "none");
    });
  });




  //
  //
  // DEADPOOL animation in header
  //
  //

  $("header").css("background-position", "center bottom");



  //
  //
  // Make the end of word by number - положительнЫХ, положительнАЯ etc...
  //
  //

  /*$(".reviews-num").each(function(index){

    var name =  $(".num_:nth-child(" + (index+2) + ") .reviews-num-name").text();
    name = name.substr(0, name.length - 2);

    if($(this).text() == 0){
      name += "ых";
      $(".num_:nth-child(" + (index+2) + ") .reviews-num-name").text(name);
    }else if($(this).text() == 1){
      name += "ая";
      $(".num_:nth-child(" + (index+2) + ") .reviews-num-name").text(name);
    } else if($(this).text() <= 4 ){
      name += "ые";
      $(".num_:nth-child(" + (index+2) + ") .reviews-num-name").text(name);
    }

  })*/




  //
  //
  // Rating color-line in dependence of number in reviews section
  //
  //

  var reviews_sum = 0;
  var reviews_numbers = [];
  var rating_colors = [
    "#b7ffb1",
    "#d7d7d7",
    "#ffb1b1"
  ];

  // Sum of reviews
  $(".reviews-num").each(function () {
    reviews_sum += Number($(this).text());
  });

  // Numbers of reviews
  $(".reviews-num").each(function (index) {
    reviews_numbers.push($(this).text());
  });

  // Drow rating. Rating widht = reviews_numbers * 100 / reviews_sum
  $(".rating").each(function (index) {
    var rating_width = reviews_numbers[index] * 100 / reviews_sum;
    $(this).css({ "width": rating_width + "%", "background-color": rating_colors[index] });
  });




  //
  //
  // Main nav button
  //
  //


  // Zoom circle
  var toggleMenuMainMin = false;
  $(".toggle-menu-button").click(function () {

    if (toggleMenuMainMin == false) {

      $(".nav-deadpoll").animate({
        top: -90
      }, 2500, function () {});
      
      toggleMenuMainMin = true;

      $(".full-screen-field").css({
        "left": $(".toggle-menu-button").offset().left + $(".toggle-menu-button").width() / 2 - 1500,
        "top": $(".toggle-menu-button").offset().top + $(".toggle-menu-button").height() / 2 - 1500,
        "opacity": "1"
      });

      $(".full-screen-field").css("display", "flex");
      $(".full-screen-circle").animate({
        width: 2700,
        height: 2700
      }, 1100, function () {
        $(".full-screen-circle").css("display", "none");
        $(".full-screen-field").css({ "left": "0", "top": "0", "width": "100%", "height": "100%", "background-color": "#e71e6e", "opacity": "1" });
        $(".nav-min-menu").css("display", "block");

        // Animation to li with delay for each
        var timerTickSum = $(".nav-min-menu li").length;
        var timerTick = 1;
        $(".nav-min-menu li:nth-child(" + timerTick + ")").addClass('animated fadeInLeft');
        setInterval(function () {
          if (timerTick < timerTickSum) {
            timerTick++;
            $(".nav-min-menu li:nth-child(" + timerTick + ")").addClass('animated fadeInLeft');
          } else {
            timerTick = 1;
            timerTickSum = 1;
          }
        }, 200);
      });

    } else {
      toggleMenuMainMin = false;

      $(".nav-deadpoll").css("top", "-900px");

      $(".full-screen-field").animate({
        opacity: 0
      }, 300, function () {
        $(".full-screen-field").css({ "display": "none", "width": "3000", "height": "3000", "background-color": "rgba(255, 255, 255, 0)" });
        $(".nav-min-menu li").removeClass("animated fadeInLeft");
        $(".full-screen-circle").css({ "display": "block", "width": "25", "height": "25" });
        $(".nav-min-menu").css("display", "none");
      });
    }
    
  });

  // links close nav
  $(".nav-min-menu li a").click(function () {
    toggleMenuMainMin = false;

    $(".nav-deadpoll").css("top", "-900px");

    $(".full-screen-field").animate({
      opacity: 0
    }, 300, function () {
      $(".full-screen-field").css({ "display": "none", "width": "3000", "height": "3000", "background-color": "rgba(255, 255, 255, 0)" });
      $(".nav-min-menu li").removeClass("animated fadeInLeft");
      $(".full-screen-circle").css({ "display": "block", "width": "25", "height": "25" });
      $(".nav-min-menu").css("display", "none");
    });
  });




});