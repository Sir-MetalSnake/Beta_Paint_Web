document.addEventListener('DOMContentLoaded',function (){
    var canvas = document.getElementById('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var paper = canvas.getContext('2d');
    var lines = [];
    var squarev=[];
    var size;
    var isDrawing = false;
    var modo='linea';
    const square = document.getElementById("square");
    canvas.addEventListener('mousedown',OnMouseDown);
    canvas.addEventListener('mouseup',OnMouseUp);
    canvas.addEventListener('mousemove',OnMouseMove);
    square.addEventListener('click',(e)=>{
        modo= 'square';
        console.log(modo);
    });
    function OnMouseDown(event){
        if (modo ==='square'){
            startDrawingsquare(event)
        }else {
            startDrawing(event);
        }
    }
    function OnMouseUp(event){
        if (modo==='square' && isDrawing){
            stopDrawSquare(event);
        }else if(modo === 'linea' && isDrawing){
            stopDraw(event);
        }

    }
    function OnMouseMove(event){
        if (modo==='square' && isDrawing){
            ContinueSquare(event);
        }else if(modo === 'linea' && isDrawing){
            ContinueLine(event);
        }
    }
    function startDrawing(event){
        isDrawing= true;
        var startpoint= getPos(canvas,event);
        lines.push({type:'line',points:[startpoint]});
    }
    function startDrawingsquare(event){
        isDrawing= true;
        var startpoint= getPos(canvas,event);
        squarev.push({type:'square',points:[startpoint]});
    }
    function ContinueLine(event){
        lines[lines.length-1].points[1]= getPos(canvas,event);
        drawLines(lines)
    }
    function ContinueSquare(event){
        squarev[squarev.length-1].points[1]= getPos(canvas,event);
        drawSquare(squarev);
    }
    function stopDraw(event){
        isDrawing= false;
        lines[lines.length-1].points[1]= getPos(canvas,event);
        drawLines(lines);
        lines.push({type: 'line',points: []});
    }
    function stopDrawSquare(event){
        isDrawing= false;
        squarev[squarev.length-1].points[1]= getPos(canvas,event);
        drawSquare(squarev);
        squarev.push({type: 'square',points: []});
        modo='linea';
    }
    function brasenham(x0,y0,x1,y1) {
        var XK = x0;
        var YK = y0;
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;

        while(true) {
            paper.fillRect(XK, YK,20,20); // Do what you need to for this
            if ((XK === x1) && (YK === y1)) break;
            var e2 = 2*err;
            if (e2 > -dy) { err -= dy; XK  += sx; }
            if (e2 < dx) { err += dx; YK  += sy; }
        }
    }
    function drawSquare(lines){
        var lado=0;
        paper.clearRect(0,0,canvas.width,canvas.height);

        for(var i=0;i<lines.length;i++){
            var points = lines[i].points;
            paper.lineWidth = 5;
            paper.beginPath();
            if (points.length === 2){
                var MAX_X =0;
                var MAX_Y =0;
                var FirstPX=points[0].x;
                var FirstPY=points[0].y;
                var dx = Math.abs(points[1].x - points[0].x);

                while (lado<4){
                    if(lado===0){
                        MAX_X= points[0].x+dx;
                        MAX_Y = points[0].y;
                        brasenham(FirstPX,FirstPY,MAX_X,MAX_Y);
                        FirstPX=MAX_X;
                        FirstPY =MAX_Y;
                    }
                    if(lado===1){
                        MAX_X= points[0].x+dx;
                        MAX_Y = points[0].y-dx;
                        brasenham(FirstPX,FirstPY,MAX_X,MAX_Y);
                        FirstPX=MAX_X;
                        FirstPY=MAX_Y;
                    }
                    if(lado===2){
                        MAX_X= points[0].x;
                        MAX_Y = points[0].y-dx;
                        brasenham(FirstPX,FirstPY,MAX_X,MAX_Y);
                        FirstPX=MAX_X;
                        FirstPY=MAX_Y;
                    }
                    if (lado===3){
                        MAX_X= points[0].x;
                        MAX_Y = points[0].y;
                        brasenham(FirstPX,FirstPY,MAX_X,MAX_Y);
                    }
                    lado+=1;
                }
            }
        }
        paper.closePath();
    }
    function drawLines(lines){
        paper.clearRect(0,0,canvas.width,canvas.height);

        for(var i=0;i<lines.length;i++){
            var points = lines[i].points;
            paper.lineWidth = 5;
            paper.beginPath();
            if (points.length === 2){
                var XK = points[0].x;
                var YK = points[0].y;
                var dx = Math.abs(points[1].x - points[0].x);
                var dy = Math.abs(points[1].y - points[0].y);
                var sx = (points[0].x < points[1].x) ? 1 : -1;
                var sy = (points[0].y < points[1].y) ? 1 : -1;
                var err = dx - dy;

                while(true) {
                    paper.fillRect(XK, YK,20,20); // Do what you need to for this
                    if ((XK === points[1].x) && (YK === points[1].y)) break;
                    var e2 = 2*err;
                    if (e2 > -dy) { err -= dy; XK  += sx; }
                    if (e2 < dx) { err += dx; YK  += sy; }
                }

            }
        }
        paper.closePath();
    }
    function getPos(canvas,event){
        var rect = canvas.getBoundingClientRect();
        return{
            x:event.clientX - rect.left,
            y:event.clientY - rect.top
        };
    }
});
