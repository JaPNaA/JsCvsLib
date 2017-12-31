window.onerror = function(e) {
  alert(JSON.stringify(e));
};

var a = new JsCvs({
  width: 512,
  height: 512
});

a.appendTo(document.body);

a.forEach(function(x) {
  a.set(x, x*x % 0x1000000);
});