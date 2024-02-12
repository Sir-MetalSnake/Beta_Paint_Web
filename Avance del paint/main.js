document.addEventListener('DOMContentLoaded',function(){
    const canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const paper = canvas.getContext("2d");
    const circle = document.getElementById("circle");
    const line = document.getElementById("line");
    const pencil = document.getElementById("pencil");
    const undo = document.getElementById('undo');
    const oval = document.getElementById('oval');
    const redo = document.getElementById('redo');
    const pent = document.getElementById('pent');
    const hex = document.getElementById('hex');
    const squar = document.getElementById('square');
    const rect = document.getElementById('rect');
    const move = document.getElementById('move');
    var figure=[];
    var back_store =[];
    var isDrawing = false;
    var firstPointX = 0;
    var firstPointY = 0;
    var finalPointX = 0;
    var finalPointY = 0; 
    var modo = 'pencil';
    let current_index=null;
    circle.addEventListener('click',function(e) {
        modo='circle';
    })
    line.addEventListener('click',function (e){
       modo='line';
    });
    pencil.addEventListener('click',function (e){
       modo='pencil'
    });
    oval.addEventListener("click", function (){
        modo='oval';
    });
    pent.addEventListener('click',function (){
        modo='pent';
    })
    hex.addEventListener('click',function (){
        modo='hex';
    })
    squar.addEventListener('click',function (){
        modo ='square';
    })
    move.addEventListener('click',function () {
        modo='move';
    })
    undo.addEventListener('click',function (){
        if (figure.length>0){
            back_store.push(figure.pop());
            drawFigure();
        }
    })
    redo.addEventListener('click',function (){
        if (back_store.length>0){
            figure.push(back_store.pop());
            drawFigure();
        }
    })
    rect.addEventListener('click',function () {
        modo='rectangle';
    })
    function EllipsePoint(xc,yc,x,y){
        paper.fillRect(xc+x,yc+y,5,5);
        paper.fillRect(xc-x,yc+y,5,5);
        paper.fillRect(xc+x,yc-y,5,5);
        paper.fillRect(xc-x,yc-y,5,5);
    }
    function DrawEllipse(xc,yc,a,b)
    {
        var dx, dy, d1, d2, x, y;
        x = 0;
        y = b;
        let a_mul =a * a
        let b_mul =b * b
        // Initial decision parameter of region 1
        d1 = Math.round(b_mul - a_mul * b + 0.25 * a_mul);
        dx = 2 * b_mul * x;
        dy = 2 * a_mul * y;
        // For region 1
        while (dx < dy)
        {
            EllipsePoint(xc,yc,x,y);
            x++;
            dx += 2 * b_mul;
            if (d1 < 0)
            {
                d1 += dx + b_mul;
            }
            else
            {
                y--;
                dy = dy - (2 * a_mul);
                d1 = d1 + dx - dy + b_mul;
            }
        }
        d2 = (b_mul * (x + 0.5) * (x + 0.5) + a_mul * (y - 1) * (y - 1) - a_mul * b_mul);
        while (y >= 0)
        {
            EllipsePoint(xc,yc,x,y);
            y--;
            dy -= 2 * a_mul;
            if (d2 > 0)
            {
                d2 += a_mul - dy;
            }
            else
            {
                x++;
                dx += 2 * b_mul;
                d2 += dx - dy + a_mul;
            }
        }
    }
    function is_mouse_in_figure(startX,startY,Figure){
        switch (Figure.type) {
            case 'line':
                const x1 = Figure.firstPointX;
                const y1 = Figure.firstPointY;
                const x2 = Figure.finalPointX;
                const y2 = Figure.finalPointY;

                const numerator = Math.abs((y2 - y1) * startX - (x2 - x1) * startY + x2 * y1 - y2 * x1);
                const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
                const distance = numerator / denominator;

                const epsilon = 2; // Tamaño del área alrededor de la línea para considerar como "dentro"
                if (distance <= epsilon) {
                    console.log('entra');
                    return true;
                }
                console.log('no entra');
                break;
        }
        return false;
    }
    let isMove=false;
    canvas.addEventListener('mousedown',function(e){
        var position = getPos(canvas,e);
        if (modo==='move'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isMove=true;
                    firstPointX = position.x;
                    firstPointY = position.y;
                    console.log('entra');
                    return;
                }
                index++;
            }
        }
        isDrawing = true;
        firstPointX = position.x;
        firstPointY = position.y;
    });
    canvas.addEventListener('mousemove',function(e){
        if(isMove){
            var pos = getPos(canvas,e);
            let current_fig= figure[current_index];
            let dx = pos.x - firstPointX;
            let dy = pos.y - firstPointY;
            current_fig.firstPointX += dx;
            current_fig.firstPointY += dy;
            current_fig.finalPointX += dx;
            current_fig.finalPointY += dy;
            drawFigure();
            firstPointX = pos.x;
            firstPointY = pos.y;

        }
        if(!isDrawing)return;
        if (isDrawing){
            var position = getPos(canvas,e);
            finalPointX = position.x;
            finalPointY = position.y;
            if(modo==='pencil'){
                Pencil(finalPointX,finalPointY);
            }else{
                drawFigure();
            }
        }
    });
    function Pencil(x,y){
        paper.beginPath();
        paper.strokeStyle = 'black';
        paper.lineWidth = 5;
        paper.lineCap = 'round';
        paper.moveTo(firstPointX,firstPointY);
        paper.lineTo(x,y);
        paper.lineJoin = 'round';
        paper.closePath();
        paper.stroke();
        firstPointX = x;
        firstPointY = y;
    }

    function drawcircle(xc,yc,x,y){
        paper.fillRect(xc+x,yc+y,5,5);
        paper.fillRect(xc-x,yc+y,5,5);
        paper.fillRect(xc+x,yc-y,5,5);
        paper.fillRect(xc-x,yc-y,5,5);
        paper.fillRect(xc+y,yc+x,5,5);
        paper.fillRect(xc-y,yc+x,5,5);
        paper.fillRect(xc+y,yc-x,5,5);
        paper.fillRect(xc-y,yc-x,5,5);
    }
    function circleBres(xc, yc, r) 
    { 
        let x = 0, y = r; 
        let d = 3 - 2 * r;
        while (y >= x)
        {
            drawcircle(xc, yc, x, y);
            x++; 
            if (d > 0) 
            { 
                y--;  
                d += 4 * (x - y) + 10;
            } 
            else{
                d += 4 * x + 6;
            }
        }
    }
    function DDA(x0,y0,x1,y1){
        var dx,dy,incx,incy,x,y,p;
        dx = x1-x0;
        dy = y1-y0;
        if (Math.abs(dx)>=Math.abs(dy)){
            p=Math.abs(dx);
        }else {
            p=Math.abs(dy);
        }
        incx= dx/p;
        incy=dy/p;
        x=x0;
        y=y0;
        for (var i =0; i<=p; i++){
            paper.fillRect(x,y,5,5);
            x+=incx;
            y+=incy;
        }
    }
    function square(x0,y0,length,OrientX,OrientY){
        let x1= x0+length*OrientX;
        let y1= y0+length*OrientY;
        DDA(x0,y0,x1,y0);
        DDA(x1,y0,x1,y1);
        DDA(x1,y1,x0,y1);
        DDA(x0,y1,x0,y0);
    }
    function Rectangle(x0,y0,x1,y1,width,height,OrientX,OrientY){
        let x = x0+width*OrientX;
        let y= y0+height*OrientY;
        DDA(x0,y0,x,y0);
        DDA(x,y0,x,y);
        DDA(x,y,x0,y);
        DDA(x0,y,x0,y0);
    }
    function grade_to_points(CenterX,CenterY,radio,angle){
        let pointX= Math.round(CenterX+radio*Math.cos(angle));
        let pointY= Math.round(CenterY+radio*Math.sin(angle));
        return{x:pointX,y:pointY}
    }
    function draw_Polygon(radio,centerX,centerY,Sides,angle){
        var initialAngle = (2*Math.PI)/Sides,lastX=0,lastY=0;
        for (let i = 0; i < Sides;i++) {
            let step = i*initialAngle+angle;
            let points= grade_to_points(centerX,centerY,radio,step);
            if(i>0){
                DDA(lastX,lastY,points.x,points.y);
            }
            lastX = points.x;
            lastY = points.y;
        }
        DDA(lastX,lastY,Math.round(centerX + radio * Math.cos(angle)),Math.round(centerY + radio * Math.sin(angle)))
    }
    canvas.addEventListener('mouseup',function (e){
        if (isMove){
            isMove=false;
        }
        if(isDrawing){
            let OrientX,OrientY,angle,radio;
            isDrawing=false;
            switch (modo){
                case "pencil":
                    figure.push({type:'pencil',imag:paper.getImageData(0,0,canvas.width,canvas.height)});
                    break;
                case "line":
                    figure.push({type:'line',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY});
                    break;
                case "square":
                    let lengthX = Math.abs(finalPointX-firstPointX);
                    let lengthY = Math.abs(finalPointY-firstPointY);
                    let length = Math.min(lengthX,lengthY);
                    OrientX = Math.sign(finalPointX-firstPointX);
                    OrientY = Math.sign(finalPointY-firstPointY);
                    figure.push({type:'square',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,len:length,OrientX:OrientX,
                    OrientY:OrientY});
                    break;
                case 'rectangle':
                    let width = Math.abs(finalPointX-firstPointX);
                    let height = Math.abs(finalPointY-firstPointY);
                    OrientX = Math.sign(finalPointX-firstPointX);
                    OrientY = Math.sign(finalPointY-firstPointY);
                    figure.push({type:'rectangle',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,width_rect:width,height_rect:height,
                        OrientX:OrientX,OrientY:OrientY});
                    break;
                case "circle":
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    figure.push({type:'circle',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio});
                    break;
                case 'oval':
                    var a = Math.abs(finalPointX-firstPointX);
                    var b = Math.abs(finalPointY-firstPointY);
                    figure.push({type:'oval',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,a:a,b:b});
                    break;
                case 'pent':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    figure.push({type:'pent',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio,sides:5,angle:angle});
                    break;
                case 'hex':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    figure.push({type:'hex',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio,sides:6,angle:angle});
                    break;
            }
        }else{

            drawFigure();
        }
    });
    function drawFigure(){
        paper.clearRect(0,0,canvas.width,canvas.height);
        for(var i=0;i<figure.length;i++){
            let fig = figure[i];
            paper.beginPath();
            switch (fig.type) {
                case 'pencil':
                    paper.putImageData(fig.imag,0,0);
                    break;
                case 'circle':
                    let h,k;
                    h=fig.firstPointX
                    k=fig.firstPointY
                    circleBres(h,k,fig.radius);
                    break;
                case 'square':
                    square(fig.firstPointX,fig.firstPointY,fig.len, fig.OrientX,fig.OrientY);
                    break;
                case 'rectangle':
                    Rectangle(fig.firstPointX,fig.firstPointY,fig.finalPointX,fig.finalPointY,fig.width_rect,fig.height_rect,fig.OrientX,fig.OrientY);
                    break;
                case 'oval':
                    DrawEllipse(fig.firstPointX,fig.firstPointY,fig.a,fig.b);
                    break;
                case 'line':
                    DDA(fig.firstPointX,fig.firstPointY,fig.finalPointX,fig.finalPointY);
                    break;
                case 'pent':
                    draw_Polygon(fig.radius,fig.firstPointX,fig.firstPointY,fig.sides,fig.angle);
                    break;
                case 'hex':
                    draw_Polygon(fig.radius,fig.firstPointX,fig.firstPointY,fig.sides,fig.angle);
                    break;
            }
        }
        if (isDrawing){
            let radio=0,angle=0,OrientX,OrientY;
            switch (modo){
                case "pencil":
                    break;
                case "circle":
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    circleBres(firstPointX,firstPointY,radio);
                    break;
                case 'oval':
                    var a = Math.abs(finalPointX-firstPointX);
                    var b = Math.abs(finalPointY-firstPointY);
                    DrawEllipse(firstPointX,firstPointY,a,b);
                    break;
                case 'square':
                    let lengthX = Math.abs(finalPointX-firstPointX);
                    let lengthY = Math.abs(finalPointY-firstPointY);
                    let length = Math.min(lengthX,lengthY);
                    OrientX = Math.sign(finalPointX-firstPointX);
                    OrientY = Math.sign(finalPointY-firstPointY);
                    square(firstPointX,firstPointY,length,OrientX,OrientY);
                    break;
                case 'rectangle':
                    let width = Math.abs(finalPointX-firstPointX);
                    let height = Math.abs(finalPointY-firstPointY);
                    OrientX = Math.sign(finalPointX-firstPointX);
                    OrientY = Math.sign(finalPointY-firstPointY);
                    Rectangle(firstPointX,firstPointY,finalPointX,finalPointY,width,height,OrientX,OrientY);
                    break;
                case "line":
                    DDA(firstPointX,firstPointY,finalPointX,finalPointY);
                    break;
                case 'pent':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    draw_Polygon(radio,firstPointX,firstPointY,5,angle);
                    break;
                case 'hex':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    draw_Polygon(radio,firstPointX,firstPointY,6,angle);
                    break;
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
