window.onerror = function(e) {
  alert(JSON.stringify(e));
};

var a = new JsCvs({
  width: 512,
  height: 512,
  rendering: "pixelated"
});

a.forEachXY(function(x, y) {
  a.set(x, y, 
    (x / y * 0xFFFFFF) % 0x1000000
  );
});

a.toImg(true).appendTo(document.body);