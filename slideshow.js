(function (root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.SlideShow = factory();
    }
}(this, function () {

    function createElement(tag, className, text) {
        var elm = document.createElement(tag);
        elm.className = className;
        if (text) elm.appendChild(document.createTextNode(text));
        return elm;
    }

    function SlideShow(selector, options) {
        options = {
            timeout: options && options.timeout || 5000
        };

        this.element = document.querySelector(selector);
        if (!(this.element && this.element.children.length)) {
            throw new Error('Element not found or no children.');
        }

        // Add slideshow classes
        this.element.classList.add('slideshow');
        this.element.classList.add('preload');

        // Set the dimensions of the container based on image size
        var elmImg = this.element.querySelector('img');
        var doResize = function () {
            this.element.style.height = elmImg.clientHeight + 'px';
        }.bind(this);
        doResize();
        window.addEventListener('resize', doResize);

        // Create caption elements from image properties
        this._captions = [];
        for (var i = 0; i < this.element.children.length; i++) {
            var elmChild = this.element.children[i];
            elmImg = elmChild.querySelector('img');
            if (elmImg && elmImg.title) {
                var elmCaption = createElement('div', 'caption');
                elmCaption.appendChild(createElement('span', 'title', elmImg.title));
                elmCaption.appendChild(createElement('span', 'alt', elmImg.alt));
                elmChild.appendChild(elmCaption);
                this._captions.push(elmCaption);
            }
        }

        // Show the first slide
        this.currentSlide = this.element.children[0];
        this.currentSlide.classList.add('show-animation');

        // Remove preload class to enable transition animations
        setTimeout(function () {
            this.element.classList.remove('preload');
        }.bind(this));

        // Start the slidehshow
        var index = 0;
        this._ticker = setInterval(function () {
            this.currentSlide.classList.remove('show-animation');
            index = (index + 1) % this.element.children.length;
            this.currentSlide = this.element.children[index];
            this.currentSlide.classList.add('show-animation');
        }.bind(this), options.timeout);
    }

    SlideShow.prototype = {
        constructor: SlideShow,
        destroy: function () {
            clearInterval(this._ticker);
            this.currentSlide.classList.remove('show-animation');
            for (var i = 0; i < this._captions.length; i++) {
                this._captions[i].parentNode.removeChild(this._captions[i]);
            }
            this._captions = [];
        }
    }

    return SlideShow;

}));
