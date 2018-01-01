class JsCvs {
    constructor(o) {
        var that = this;

        if (!o) o = {};

        Object.defineProperties(this, {
            width: {
                get: () => this.element.width,
                set: function (e) {
                    if (this.maximized) {
                        this._pre.width = e;
                        return;
                    }

                    this.element.width = e;
                    if (this.highDPI) {
                        this.element.style.width = e / this.dpr + "px";
                    } else {
                        this.element.style.width = e + "px";
                    }
                }
            },
            height: {
                get: () => this.element.height,
                set: function (e) {
                    if (this.maximized) {
                        this._pre.height = e;
                        return;
                    }

                    this.element.height = e;
                    if (this.highDPI) {
                        this.element.style.height = e / this.dpr + "px";
                    } else {
                        this.element.style.height = e + "px";
                    }
                }
            },
            color: {
                get: () => this.context.fillStyle,
                set: function (e) {
                    if (typeof e == "number") {
                        this.context.fillStyle =
                            "#" + Math.floor(e).toString(16).padStart(6, "0");
                    } else {
                        this.context.fillStyle = e;
                    }
                }
            },
            highDPI: {
                get: () => this._highDPI,
                set: function (e) {
                    this._highDPI = !!e;

                    if (this.highDPI) {
                        this.element.style.width = this.width / this.dpr + "px";
                        this.element.style.height = this.height / this.dpr + "px";
                    } else {
                        this.element.style.width = this.width + "px";
                        this.element.style.height = this.height + "px";
                    }
                }
            },
            maximized: {
                get: () => this._maximized,
                set: function (e) {
                    upd: if (e) {
                        this._pre.was = true;
                        this._pre.width = this.width;
                        this._pre.height = this.height;

                        if (this.highDPI) {
                            this.width = innerWidth * this.dpr;
                            this.height = innerHeight * this.dpr;
                        } else {
                            this.width = innerWidth;
                            this.height = innerHeight;
                        }

                        this.element.style.position = "fixed";
                        this.element.style.width = "100%";
                        this.element.style.height = "100%";
                        this.element.style.top = 0;
                        this.element.style.left = 0;

                        this._maximized = true;
                    } else {
                        this._maximized = false;

                        if (!this._pre.was) break upd;

                        this.width = this._pre.width;
                        this.height = this._pre.height;

                        this.element.style.position = "static";

                        this._pre.was = false;
                    }
                }
            },
            rendering: {
                get: () => this.element.style.imageRendering,
                set: function (e) {
                    this.element.style.imageRendering = e;
                }
            },
            filter: {
                get: () => this.element.style.filter,
                set: function (e) {
                    this.element.style.filter = e;
                }
            },
            RANDOM: {
                get: () => Math.floor(Math.random() * 16777216)
            }
        });

        this.element = document.createElement("canvas");
        this.context = this.element.getContext("2d");

        this._pre = {};
        this.obs = [];

        function undefT(e) {
            if (e === undefined) {
                return true;
            }

            return e;
        }

        this.width = o.width || 300;
        this.height = o.height || 150;
        this.dpr = window.devicePixelRatio;
        this.highDPI = this.dpr;
        this.maximized = o.maximize || false;
        this.preventDefault = o.preventDefault || false;
        this.redrawOnResize = undefT(o.redrawOnResize);
        this.rendering = o.rendering;
        this.filter = o.filter;
        this.clearOnDraw = undefT(o.clearOnDraw);

        addEventListener("resize", function () {
            if (that.maximized && !that.redrawOnResize) {
                that.element.width = innerWidth * that.dpr;
                that.element.height = innerHeight * that.dpr;
            }
        });

        addEventListener("touchstart",
            e => that.preventDefault && e.preventDefault()
        );
        addEventListener("touchmove",
            e => that.preventDefault && e.preventDefault()
        );
        addEventListener("touchend",
            e => that.preventDefault && e.preventDefault()
        );
    }
    appendTo(e) {
        e.appendChild(this.element);
    }
    set(x, y, c) {
        if (arguments.length == 2) {
            this.color = y;
            this.context.fillRect(x % this.width, Math.floor(x / this.width), 1, 1);
        } else {
            this.color = c;
            this.context.fillRect(x, y, 1, 1);
        }
    }
    rect(x, y, w, h, c) {
        this.color = c;
        this.context.fillRect(x, y, w, h);
        return ["rect", x, y, w, h, c];
    }
    circle(x, y, c) {
        //
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    fill(e) {
        this.color = e;
        this.context.fillRect(0, 0, this.width, this.height);
    }
    forEach(c) {
        var x = this.width * this.height;
        for (let i = 0; i < x; i++) {
            c(i, x);
        }
    }
    forEachXY(c) {
        var w = this.width,
            h = this.height;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                c(x, y, w, h);
            }
        }
    }
    forEachX(c) {
        var w = this.width;
        for (let x = 0; x < w; x++) {
            c(x, w);
        }
    }
    forEachY(c) {
        var h = this.height;
        for (let y = 0; y < h; y++) {
            c(y, h);
        }
    }
    toImg(e) {
        var a = document.createElement("img");
        a.src = this.element.toDataURL("img/png");

        if (e) {
            a.style = this.element.style.cssText;
        }
        a.appendTo = function (e) {
            e.appendChild(this);
        };
        return a;
    }
    drawObs() {
        if (this.clearOnDraw) this.clear();

        for (let i of this.obs) {
            this.draw(i);
        }
    }
    draw(e) {
        e.constructor.apply(this, e.args);
    }
    add(e) {
        this.obs.push(this.make(e));
    }
    make(i) {
        return {
            constructor: this[i[0]],
            args: i.slice(1, i.length)
        }
    }
}