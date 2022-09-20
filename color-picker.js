function runColorPicker () {

  let input = document.querySelector('input');
  let hsvS = 100, hsvV = 100, outputColor;
    
  let canvasVerticalLine = {    
    Hue: 0,
    init: function (elem) {
      let canvaLine, cAr, pst, bk, t = 0;   
      canvaLine = canvasVerticalLine.create(elem.h, elem.w, elem.line, "cLine");
      cAr = document.querySelector(elem.arrows);
      bk = document.querySelector(elem.block);
      canvasVerticalLine.posit = function (e) {
        let top = mousePositionY(e) - pst;
        top = (top < 0 )? 0 : top;
        top = (top > elem.h) ? elem.h : top;
        cAr.style.top = top - 2 +"px";
        t = Math.abs(Math.round(top / (elem.h / 360)) - 360);          
        canvasVerticalLine.Hue = (t == 360) ? 0 : t;
        let hexValue = RGBtoHEX(HSVtoRGB(canvasVerticalLine.Hue, hsvS, hsvV));
        bk.style.backgroundColor = RGBtoHEX(HSVtoRGB(canvasVerticalLine.Hue, 100, 100));
        outputColor.style.backgroundColor = hexValue;
        input.value = hexValue;
      }
      cAr.onmousedown = function () {
        pst = positionY(canvaLine);
        document.onmousemove = function (e) {
          canvasVerticalLine.posit(e);
        }
      }
      cAr.onclick = canvasVerticalLine.posit;
      canvaLine.onclick = function (e) {
        canvasVerticalLine.posit(e)
      };   
      canvaLine.onmousedown = function () {
        pst = positionY(canvaLine);
        document.onmousemove = function (e) {
          canvasVerticalLine.posit(e);
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null; 
        cAr.onmousemove = null;       
      }
    },
      
    create : function (height, width, line, cN) {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;	
      canvas.className = cN;
      document.querySelector(line).appendChild(canvas);
      canvasVerticalLine.grd(canvas, height, width);
      return canvas;
    },
      
    grd : function (canva, h, w) {
      let gradient, hue, color;
      canva = canva.getContext("2d");
      gradient = canva.createLinearGradient(w / 2, h, w / 2, 0);
      hue = [[255,0,0], [255,255,0], [0,255,0], [0,255,255], [0,0,255], [255,0,255], [255,0,0]];
      for (let i = 0; i <= 6; i++) {
        color = 'rgb(' + hue[i][0] + ',' + hue[i][1] + ',' + hue[i][2] + ')';
        gradient.addColorStop(i * 1 / 6, color);
      };
      canva.fillStyle = gradient;
      canva.fillRect(0, 0, w, h);
    }
  };
    
  let canvasBlock = {
    init: function (elem) {
      let circle, block, bPstX, bPstY, bWi, bHe, cW, cH, pxY, pxX;
      circle = document.querySelector(elem.circle);
      block = document.querySelector(elem.block);
      cW = circle.offsetWidth ;
      cH = circle.offsetHeight;
      bWi = block.offsetWidth - cW;
      bHe = block.offsetHeight - cH;
      pxY = bHe / 100; 
      pxX = bWi / 100; 
      canvasBlock.cPos = function (e) {
        let top, left, S, V;
        document.ondragstart = function () {
          return false;
        }
        left = mousePositionX(e) - bPstX - cW / 2;
        left = (left < 0) ? 0 : left;
        left = (left > bWi ) ? bWi : left;
        circle.style.left = left  + "px"; 
        S = Math.ceil(left / pxX);
        top = mousePositionY(e)  - bPstY - cH / 2;
        top = (top > bHe ) ? bHe : top;
        top = (top < 0) ? 0 : top;
        circle.style.top = top  + "px";
        V = Math.ceil(Math.abs(top / pxY - 100));
        if (V < 50) circle.style.borderColor = "#fff";
        else circle.style.borderColor = "#000";
        hsvS = S;
        hsvV = V;
        let hexValue = RGBtoHEX(HSVtoRGB(canvasVerticalLine.Hue, S, V));
        outputColor.style.backgroundColor = hexValue
        input.value = hexValue;
      }  
      block.onclick = function (e) {
        bPstX = positionX(block);
        bPstY = positionY(block);
        canvasBlock.cPos(e);
      }
      block.onmousedown  = function () {
        document.onmousemove = function (e) {
          bPstX = positionX(block);
          bPstY = positionY(block);
          canvasBlock.cPos(e);
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null;
      }
    }     
  };

  function mousePositionX (b) {
    let a, c, d = b;
    return null == d.pageX && null != d.clientX ? 
      (a = document.body, c = document.documentElement, b = c.scrollLeft || a && a.scrollLeft || 0, b = d.clientX + b - (c.clientLeft || a.clientLeft || 0)) : d.pageX;
  }

  function mousePositionY (b) {
    let a, c, d = b;
    return null == d.pageX && null != d.clientX ?
      (a = document.body, c = document.documentElement, b = c.scrollTop || a && a.scrollTop || 0, b = d.clientY + b - (c.clientTop || a.clientTop || 0)) : d.pageY;
  }
    
  function positionX (b) {
    let c = b.getBoundingClientRect();
    b = document.body;
    let a = document.documentElement;
    a = c.left + (a.scrollLeft || b && b.scrollLeft || 0) - (a.clientLeft || b.sclientLeft || 0);
    return Math.round(a)
  }

  function positionY (b) {
    let c = b.getBoundingClientRect();
    b = document.body;
    let a = document.documentElement;
    a = c.top + (a.scrollTop || b && b.scrollTop || 0) - (a.clientTop || b.sclientTop || 0);
    return Math.round(a)
  }

  function HSVtoRGB (H, S, V) {
    let f, p, q , t, lH, R, G, B;
      S /= 100;
      V /= 100;
      lH = Math.floor(H / 60);
      f = H / 60 - lH;
      p = V * (1 - S); 
      q = V * (1 - S * f);
      t = V* (1 - (1 - f) * S);
      switch (lH) {
        case 0: R = V; G = t; B = p; break;
        case 1: R = q; G = V; B = p; break;
        case 2: R = p; G = V; B = t; break;
        case 3: R = p; G = q; B = V; break;
        case 4: R = t; G = p; B = V; break;
        case 5: R = V; G = p; B = q; break;
      }   
    return [parseInt(R * 255), parseInt(G * 255), parseInt(B * 255)];
  }
  
  function RGBtoHEX ([r, g, b]) { 
    return `#${normalizeHexNum(r)}${normalizeHexNum(g)}${normalizeHexNum(b)}`;
  }
  
  function normalizeHexNum (num) {
    if (num < 0) return '00';
    if (num > 255) return 'ff';
    num = num.toString(16);
    return num.length === 1 ? `0${num}` : num;
  }

  canvasVerticalLine.init({h: 200, w: 20, arrows: '.gradient__line__arrows', block: '.block__picker', line: '.gradient__line'});
  canvasBlock.init({block: '.block__picker', circle: '.circle__pointer'});
  outputColor = document.querySelector(".picker__output__color");
}

export {runColorPicker};