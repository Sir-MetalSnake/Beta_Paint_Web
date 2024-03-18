document.addEventListener('DOMContentLoaded',function(){
    const canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const paper = canvas.getContext("2d");
    const undo = document.getElementById('undo');
    const redo = document.getElementById('redo');
    const move = document.getElementById('move');
    const scale = document.getElementById('ratio');
    const rotate = document.getElementById('rotate');
    const toPNG = document.getElementById('toPNG');
    const toJPG = document.getElementById('toJPG');
    const Colors = document.querySelectorAll('.color');
    const Figrs = document.querySelectorAll('.fig');
    const save = document.getElementById('Save');
    const open = document.getElementById('openfile');
    const restart = document.getElementById('restart');
    var figure=[];
    var back_store =[];
    var isDrawing = false;
    var isScale = false;
    var isRotate = false;
    var isEraser = false;
    var firstPointX = 0;
    var firstPointY = 0;
    var finalPointX = 0;
    var finalPointY = 0;
    var modo = 'pencil';
    var Color_line = null;
    let current_index=null;
    let json =[];
    Colors.forEach((button)=>{
        button.addEventListener('click',function (ev) {
            Color_line=button.value;
        })
    });
    open.addEventListener('click',function () {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                figure = JSON.parse(event.target.result);

                drawFigure();
            };
            reader.readAsText(file);
        };
        input.click();
    })
    Figrs.forEach((button)=>{
       button.addEventListener('click',function (){
           modo=button.value;
       })
    });
    restart.addEventListener('click',function () {
        paper.clearRect(0, 0, canvas.width, canvas.height);
        figure=[];
        back_store=[];
    })
    save.addEventListener('click',function () {
        json=JSON.stringify(figure);
        console.log(json)
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'figuras.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    //Rango de tamaño
    const  range = document.getElementById('range');
    const dat = document.getElementById('data');
    const eraser = document.getElementById('eraser');
    const eraser_pix = document.getElementById('eraser_pix');
    range.addEventListener('change',function () {
       dat.textContent = range.value;
    });
    eraser.addEventListener('click',function () {
        modo='eraser';
    })
    eraser_pix.addEventListener('click',function () {
        modo='eraser_pix';
    })
    move.addEventListener('click',function () {
        modo='move';
    });
    scale.addEventListener('click',function (){
       modo='scale';
    });
    rotate.addEventListener('click',function () {
        modo='rotate';
    });
    undo.addEventListener('click',function (){
        if (figure.length>0){
            back_store.push(figure.pop());
            drawFigure();
        }
    })
    toPNG.addEventListener('click',function (){
       const  a = document.createElement('a');
       const dataURI= canvas.toDataURL();
       document.body.appendChild(a);
       a.href = dataURI;
       a.download = "canvas-image.png";
       a.click();
    });
    toJPG.addEventListener('click',function (){
        const  a = document.createElement('a');
        const dataURI= canvas.toDataURL();
        document.body.appendChild(a);
        a.href = dataURI;
        a.download = "canvas-image.jpg";
        a.click();
    });
    const toPDF = document.getElementById('toPDF');
    toPDF.addEventListener('click',function () {
        genPDF();
    })
    function genPDF() {
        var doc = new jsPDF({
            orientation: "landscape",
            unit: 'mm',
            format: [canvas.clientWidth,canvas.clientHeight]
        });
        const dataURI= canvas.toDataURL({
            type:'png',
            quality:1
        });
        doc.addImage(dataURI,"PNG",0,0);
        doc.save("Midocumento.pdf")
    }
    redo.addEventListener('click',function (){
        if (back_store.length>0){
            figure.push(back_store.pop());
            drawFigure();
        }
    })
    // function EllipsePoint(xc,yc,x,y,angle){
    //     paper.fillRect(xc+x,yc+y,5,5);
    //     paper.fillRect(xc-x,yc+y,5,5);
    //     paper.fillRect(xc+x,yc-y,5,5);
    //     paper.fillRect(xc-x,yc-y,5,5);
    // }
    // function DrawEllipse(xc,yc,a,b,angle)
    // {
    //     var dx, dy, d1, d2, x, y;
    //     x = 0;
    //     y = b;
    //     let a_mul =a * a
    //     let b_mul =b * b
    //     // Initial decision parameter of region 1
    //     d1 = Math.round(b_mul - a_mul * b + 0.25 * a_mul);
    //     dx = 2 * b_mul * x;
    //     dy = 2 * a_mul * y;
    //     // For region 1
    //     while (dx < dy)
    //     {
    //         EllipsePoint(xc,yc,x,y,angle);
    //         x++;
    //         dx += 2 * b_mul;
    //         if (d1 < 0)
    //         {
    //             d1 += dx + b_mul;
    //         }
    //         else
    //         {
    //             y--;
    //             dy = dy - (2 * a_mul);
    //             d1 = d1 + dx - dy + b_mul;
    //         }
    //     }
    //     d2 = (b_mul * (x + 0.5) * (x + 0.5) + a_mul * (y - 1) * (y - 1) - a_mul * b_mul);
    //     while (y >= 0)
    //     {
    //         EllipsePoint(xc,yc,x,y,angle);
    //         y--;
    //         dy -= 2 * a_mul;
    //         if (d2 > 0)
    //         {
    //             d2 += a_mul - dy;
    //         }
    //         else
    //         {
    //             x++;
    //             dx += 2 * b_mul;
    //             d2 += dx - dy + a_mul;
    //         }
    //     }
    // }
    function DrawEllipse(xc, yc, a, b, angle) {
        for (let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
            const x = xc + a * Math.cos(theta) * Math.cos(angle) - b * Math.sin(theta) * Math.sin(angle);
            const y = yc + a * Math.cos(theta) * Math.sin(angle) + b * Math.sin(theta) * Math.cos(angle);
            paper.fillRect(x, y, 2, 2);
        }
    }
    function is_in_trapezoid(mouseX,mouseY,Figure) {
        var halfHeight = Figure.heightTrapezoid;
        var halfTopWidth = Figure.topWidth;
        var halfBottomWidth = Figure.bottomWidth;

        // Calcular las coordenadas de los vértices del trapecio en base al ángulo de inclinación
        var topLeftX = Figure.firstPointX - halfTopWidth;
        var topLeftY = Figure.firstPointY - halfHeight;
        var topRightX = Figure.firstPointX + halfTopWidth;
        var topRightY = Figure.firstPointY - halfHeight;
        var bottomRightX = Figure.firstPointX + halfBottomWidth;
        var bottomRightY = Figure.firstPointY + halfHeight;
        var bottomLeftX = Figure.firstPointX - halfBottomWidth;
        var bottomLeftY = Figure.firstPointY + halfHeight;

        var rotatedTopLeft = rotatePoint(topLeftX, topLeftY, Figure.firstPointX, Figure.firstPointY, Figure.angle);
        var rotatedTopRight = rotatePoint(topRightX, topRightY, Figure.firstPointX, Figure.firstPointY, Figure.angle);
        var rotatedBottomRight = rotatePoint(bottomRightX, bottomRightY, Figure.firstPointX, Figure.firstPointY, Figure.angle);
        var rotatedBottomLeft = rotatePoint(bottomLeftX, bottomLeftY, Figure.firstPointX, Figure.firstPointY, Figure.angle);

        var trapezoidPolygon = [rotatedTopLeft, rotatedTopRight, rotatedBottomRight, rotatedBottomLeft];

        var inside = false;
        for (var i = 0, j = trapezoidPolygon.length - 1; i < trapezoidPolygon.length; j = i++) {
            var xi = trapezoidPolygon[i].x, yi = trapezoidPolygon[i].y;
            var xj = trapezoidPolygon[j].x, yj = trapezoidPolygon[j].y;

            var intersect = ((yi > mouseY) !== (yj > mouseY)) &&
                (mouseX < (xj - xi) * (mouseY - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }
    function is_mouse_in_figure(startX,startY,Figure){
        let x1,y1,x2,y2,numerator,denominator,distance,angle,width;
        switch (Figure.type) {
            case 'line':
                x1 = Figure.firstPointX;
                y1 = Figure.firstPointY;
                x2 = Figure.finalPointX;
                y2 = Figure.finalPointY;

                numerator = Math.abs((y2 - y1) * startX - (x2 - x1) * startY + x2 * y1 - y2 * x1);
                denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
                distance = numerator / denominator;

                const epsilon = 2; // Tamaño del área alrededor de la línea para considerar como "dentro"
                if (distance <= epsilon) {
                    return true;
                }
                break;
            case 'diamond':
                const halfWidth = Figure.width_rhombus;
                distance=Math.sqrt(Math.pow(startX-Figure.firstPointX,2)+Math.pow(startY-Figure.firstPointY,2));
                if (distance < halfWidth/2) {
                    return true;
                }
                break;
            case 'trapezoid':
                return is_in_trapezoid(startX,startY,Figure);
            case 'square':
                let lengthX = Math.abs(Figure.finalPointX-Figure.firstPointX);
                let lengthY = Math.abs(Figure.finalPointY-Figure.firstPointY);
                let length = Math.min(lengthX,lengthY);
                if(startX>=Figure.firstPointX && startX <=Figure.firstPointX+length*Figure.OrientX && startY>=Figure.firstPointY && startY<=Figure.firstPointY+length*Figure.OrientY){
                    return true;
                }
                break;
            case 'circle':
                distance=Math.sqrt(Math.pow(startX-Figure.firstPointX,2)+Math.pow(startY-Figure.firstPointY,2));
                if (distance < Figure.radius) {
                    return true;
                }
                break;
            case'rectangle':
                width = Math.abs(Figure.finalPointX-Figure.firstPointX);
                let height = Math.abs(Figure.finalPointY-Figure.firstPointY);
                if ((startX>=Figure.firstPointX && startX<=Figure.firstPointX+width*Figure.OrientX)&&(startY>=Figure.firstPointY && startY<=Figure.firstPointY+height*Figure.OrientY)){
                    return true;
                }
                break;
            case 'oval':
                let distanceX=Math.sqrt(Math.pow(startX-Figure.firstPointX,2));
                let distanceY=Math.sqrt(Math.pow(startY-Figure.firstPointY,2));
                if (distanceX<=Figure.a && distanceY<= Figure.b){
                    return true;
                }
                break;
            case 'pent':
                distance=Math.sqrt(Math.pow(startX-Figure.firstPointX,2)+Math.pow(startY-Figure.firstPointY,2));
                angle = Math.atan2(Figure.finalPointY - startY,Figure.finalPointX-startX);
                if (distance < Figure.radius && angle!==Figure.angle*5) {
                    console.log(Figure.angle*5);
                    return true;
                }
                else {
                    console.log(angle);
                }
                break;
            case 'hex':
                distance =Math.sqrt(Math.pow(startX-Figure.firstPointX,2)+Math.pow(startY-Figure.firstPointY,2));
                angle = Math.atan2(Figure.finalPointY - startY,Figure.finalPointX-startX);
                if (distance <= Figure.radius) {
                     return true;
                }
                break;
            case 'text':
                if (startY===Figure.firstPointY){
                    return true;
                }
                break;
            case 'pencil':
                break;
        }
        return false;
    }
    let isMove=false;
    canvas.addEventListener('touchstart',function () {
        var position = getPos(canvas,e);
        if (modo==='eraser_pix'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isEraser=true;
                    return;
                }
                index++;
            }
        }
        if (modo==='eraser'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    figure.splice(index,1);
                    drawFigure();
                    return;
                }
                index++;
            }
        }
        if (modo==='rotate'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isRotate=true;
                    return;
                }
                index++;
            }
        }
        if (modo==='scale'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isScale=true;
                    firstPointX = position.x;
                    firstPointY = position.y;
                    console.log('entra');
                    return;
                }else{
                    console.log('no entra')}
                index++;
            }
        }
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
                }else{
                    console.log('no entra')}
                index++;
            }
        }
        isDrawing = true;
        firstPointX = position.x;
        firstPointY = position.y;
    })
    canvas.addEventListener('mousedown',function(e){
        var position = getPos(canvas,e);
        if (modo==='eraser_pix'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isEraser=true;
                    return;
                }
                index++;
            }
        }
        if (modo==='eraser'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    figure.splice(index,1);
                    drawFigure();
                    return;
                }
                index++;
            }
        }
        if (modo==='rotate'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isRotate=true;
                    return;
                }
                index++;
            }
        }
        if (modo==='scale'){
            let index = 0;
            for (let fig of figure){
                if (is_mouse_in_figure(position.x,position.y,fig)){
                    current_index = index;
                    isScale=true;
                    firstPointX = position.x;
                    firstPointY = position.y;
                    console.log('entra');
                    return;
                }else{
                    console.log('no entra')}
                index++;
            }
        }
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
                }else{
                    console.log('no entra')}
                index++;
            }
        }
        isDrawing = true;
        firstPointX = position.x;
        firstPointY = position.y;
    });
    function Scale(curr_fig,pos) {
        let OrientX,OrientY,radio,width,height;
        switch (curr_fig.type) {
            case 'square':
                let lengthX = Math.abs(pos.x-curr_fig.firstPointX);
                let lengthY = Math.abs(pos.y-curr_fig.firstPointY);
                let length = Math.min(lengthX,lengthY);
                curr_fig.OrientX = Math.sign(pos.x-curr_fig.firstPointX);
                curr_fig.OrientY = Math.sign(pos.y-curr_fig.firstPointY);
                curr_fig.len=length;
                break;
            case 'line':
                let dx = pos.x - firstPointX;
                let dy = pos.y - firstPointY;
                curr_fig.firstPointX += dx;
                curr_fig.firstPointY -= dy;
                curr_fig.finalPointX -= dx;
                curr_fig.finalPointY += dy;
                break;
            case 'circle':
                radio = Math.sqrt(Math.pow(pos.x-curr_fig.firstPointX,2)+Math.pow(pos.y-curr_fig.firstPointY,2));
                curr_fig.radius = radio;
                break;
            case 'oval':
                 curr_fig.a = Math.abs(pos.x-curr_fig.firstPointX);
                 curr_fig.b = Math.abs(pos.y-curr_fig.firstPointY);
                break;
            case 'rectangle':
                curr_fig.width_rect = Math.abs(pos.x-curr_fig.firstPointX);
                curr_fig.height_rect = Math.abs(pos.y-curr_fig.firstPointY);
                curr_fig.OrientX = Math.sign(pos.x-curr_fig.firstPointX);
                curr_fig.OrientY = Math.sign(pos.y-curr_fig.firstPointY);
                break;
            case 'pent':
                radio = Math.sqrt(Math.pow(pos.x-curr_fig.firstPointX,2)+Math.pow(pos.y-curr_fig.firstPointY,2));
                curr_fig.radius = radio;
                break;
            case 'hex':
                radio = Math.sqrt(Math.pow(pos.x-curr_fig.firstPointX,2)+Math.pow(pos.y-curr_fig.firstPointY,2));
                curr_fig.radius = radio;
                break;
            case 'trapezoid':
                curr_fig.bottomWidth = Math.abs(pos.x-curr_fig.firstPointX);
                curr_fig.topWidth = curr_fig.bottomWidth/2;
                curr_fig.heightTrapezoid= Math.abs(pos.y-curr_fig.firstPointY);
                break;
            case 'diamond':
                curr_fig.width_rhombus = Math.abs(pos.x-firstPointX);
                curr_fig.height_rhombus= Math.abs(pos.y-firstPointY);
                break;

        }
    }
    function rotateFig(curr_fig,pos) {
        let OrientX,OrientY,radio,angle,dx,dy;
        switch (curr_fig.type) {
            case 'square':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break;
            case 'line':
                dx = pos.x - firstPointX;
                dy = pos.y - firstPointY;
                curr_fig.firstPointX += dx;
                curr_fig.firstPointY -= dy;
                curr_fig.finalPointX -= dx;
                curr_fig.finalPointY += dy;
                break;
            case 'circle':
                radio = Math.sqrt(Math.pow(pos.x-curr_fig.firstPointX,2)+Math.pow(pos.y-curr_fig.firstPointY,2));
                curr_fig.radius = radio;
                break;
            case 'oval':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break;
            case 'rectangle':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break;
            case 'pent':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break;
            case 'hex':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break;
            case 'trapezoid':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
                break
            case 'diamond':
                angle=Math.atan2(pos.y - curr_fig.firstPointY, pos.x - curr_fig.firstPointX);
                curr_fig.angle = angle;
        }
    }
    function borrarFiguraPorPixeles(figuraABorrar) {
        // for (let i = 0; i < figuraABorrar.length; i++) {
        //         // Obtener las coordenadas de los píxeles de la figura a borrar
        //         // let coordenadasPixeles = figuraABorrar.obtenerCoordenadasPixeles();
        //         //
        //         // // Borrar los píxeles de la figura en el lienzo
        //         // for (let j = 0; j < coordenadasPixeles.length; j++) {
        //         //     let coordenada = coordenadasPixeles[j];
        //         //     borrarPixel(coordenada.x, coordenada.y); // Suponiendo que tienes una función para borrar un píxel
        //         // }
        //
        //         // Eliminar la figura del vector
        //         figuraABorrar.splice(i, 3);
        //         break;
        // }

    }
    let erasePoints=[];
    function MoveEvent() {
        var pos = getPos(canvas,e);
        if (isEraser){
            let current_fig= figure[current_index];
            //borrarFiguraPorPixeles(current_fig);
            erasePoints.push({x:pos.x,y:pos.y});
            paper.clearRect(pos.x,pos.y,4,4);

        }
        if (isRotate){
            let current_fig= figure[current_index];
            rotateFig(current_fig,pos);
            drawFigure();
        }
        if (isScale){
            let current_fig= figure[current_index];
            Scale(current_fig,pos);
            drawFigure();
        }
        if(isMove){
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
    }
    canvas.addEventListener('touchmove',function () {
        MoveEvent();
    })
    canvas.addEventListener('mousemove',function(e){
        MoveEvent();
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
    // function square(x0,y0,length,OrientX,OrientY){
    //     let x1= x0+length*OrientX;
    //     let y1= y0+length*OrientY;
    //     DDA(x0,y0,x1,y0);
    //     DDA(x1,y0,x1,y1);
    //     DDA(x1,y1,x0,y1);
    //     DDA(x0,y1,x0,y0);
    // }
    function rotatePoint(x, y, x0, y0, angle) {
        var newX = (x - x0) * Math.cos(angle) - (y - y0) * Math.sin(angle) + x0;
        var newY = (x - x0) * Math.sin(angle) + (y - y0) * Math.cos(angle) + y0;
        return { x: newX, y: newY };
    }

    function square(x0, y0, length, OrientX, OrientY, angle) {
        if (arguments.length===6){
            var x = x0 - length / 2;
            var y = y0 - length / 2;
            var x1 = x0 + length / 2;
            var y1 = y0 - length / 2;
            var x2 = x0 + length / 2;
            var y2 = y0 + length / 2;
            var x3 = x0 - length / 2;
            var y3 = y0 + length / 2;

            // Rotar cada vértice del cuadrado alrededor del centro
            var rotatedX0Y0 = rotatePoint(x, y, x0, y0, angle);
            var rotatedX1Y1 = rotatePoint(x1, y1, x0, y0, angle);
            var rotatedX2Y2 = rotatePoint(x2, y2, x0, y0, angle);
            var rotatedX3Y3 = rotatePoint(x3, y3, x0, y0, angle);

            // Dibujar las líneas que conectan los vértices rotados para formar el cuadrado
            DDA(rotatedX0Y0.x, rotatedX0Y0.y, rotatedX1Y1.x, rotatedX1Y1.y);
            DDA(rotatedX1Y1.x, rotatedX1Y1.y, rotatedX2Y2.x, rotatedX2Y2.y);
            DDA(rotatedX2Y2.x, rotatedX2Y2.y, rotatedX3Y3.x, rotatedX3Y3.y);
            DDA(rotatedX3Y3.x, rotatedX3Y3.y, rotatedX0Y0.x, rotatedX0Y0.y);
        }
        else {
            let x1= x0+length*OrientX;
            let y1= y0+length*OrientY;
            DDA(x0,y0,x1,y0);
            DDA(x1,y0,x1,y1);
            DDA(x1,y1,x0,y1);
            DDA(x0,y1,x0,y0);
        }
    }
    const acordion_content = document.querySelectorAll('.accordion-content');
    acordion_content.forEach((item, index)=>{
        let header = item.querySelector('header');
        header.addEventListener('click',()=>{
            item.classList.toggle("open");
            let description = item.querySelector('.description');
            let chev= item.querySelector('.tab');
            if(item.classList.contains("open")){
                description.style.height = `${description.scrollHeight}px`;
                chev.style.rotate = "180deg";
            }else{
                description.style.height = "0px";
                chev.style.rotate = "0deg";
            }
        })
    })
    function Rectangle(x0,y0,x1,y1,width,height,OrientX,OrientY,angle){
        if (arguments.length===9){
            var x = x0 - width / 2;
            var y = y0 - height / 2;
            var x1_1 = x0 + width / 2;
            var y1_1 = y0 - height / 2;
            var x2 = x0 + width / 2;
            var y2 = y0 + height / 2;
            var x3 = x0 - width / 2;
            var y3 = y0 + height / 2;

            // Rotar cada vértice del cuadrado alrededor del centro
            var rotatedX0Y0 = rotatePoint(x, y, x0, y0, angle);
            var rotatedX1Y1 = rotatePoint(x1_1, y1_1, x0, y0, angle);
            var rotatedX2Y2 = rotatePoint(x2, y2, x0, y0, angle);
            var rotatedX3Y3 = rotatePoint(x3, y3, x0, y0, angle);

            // Dibujar las líneas que conectan los vértices rotados para formar el cuadrado
            DDA(rotatedX0Y0.x, rotatedX0Y0.y, rotatedX1Y1.x, rotatedX1Y1.y);
            DDA(rotatedX1Y1.x, rotatedX1Y1.y, rotatedX2Y2.x, rotatedX2Y2.y);
            DDA(rotatedX2Y2.x, rotatedX2Y2.y, rotatedX3Y3.x, rotatedX3Y3.y);
            DDA(rotatedX3Y3.x, rotatedX3Y3.y, rotatedX0Y0.x, rotatedX0Y0.y);
        }else{
            let x = x0+width*OrientX;
            let y= y0+height*OrientY;
            DDA(x0,y0,x,y0);
            DDA(x,y0,x,y);
            DDA(x,y,x0,y);
            DDA(x0,y,x0,y0);
        }
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
    function UPevent(){
        if (isEraser){
            isEraser=false;
            figure.push({type:'action',subtype:'erase',erasePoints:erasePoints});
        }
        if (isRotate){
            isRotate=false;
        }
        if (isScale){
            isScale=false;
        }
        if (isMove){
            isMove=false;
        }
        if(isDrawing){
            let OrientX,OrientY,angle,radio,width,height;
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
                        OrientY:OrientY,angle:0});
                    break;
                case 'rectangle':
                    width = Math.abs(finalPointX-firstPointX);
                    height = Math.abs(finalPointY-firstPointY);
                    OrientX = Math.sign(finalPointX-firstPointX);
                    OrientY = Math.sign(finalPointY-firstPointY);
                    figure.push({type:'rectangle',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,width_rect:width,height_rect:height,
                        OrientX:OrientX,OrientY:OrientY,angle:0});
                    break;
                case "circle":
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    figure.push({type:'circle',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio});
                    break;
                case 'oval':
                    var a = Math.abs(finalPointX-firstPointX);
                    var b = Math.abs(finalPointY-firstPointY);
                    figure.push({type:'oval',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,a:a,b:b,angle:0});
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
                case 'diamond':
                    width = Math.abs(finalPointX-firstPointX);
                    height= Math.abs(finalPointY-firstPointY);
                    figure.push({type:'diamond',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,width_rhombus:width,height_rhombus:height, angle:0});
                    break;
                case 'trapezoid':
                    width = Math.abs(finalPointX-firstPointX);
                    height= Math.abs(finalPointY-firstPointY);
                    figure.push({type:'trapezoid',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,topWidth:width/2,bottomWidth:width,heightTrapezoid:height,angle:0});
                    break;
                case 'triangle':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    figure.push({type:'hex',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio,sides:3,angle:angle});
                    break;
            }
        }else{

            //drawFigure();
        }
    }
    canvas.addEventListener('touchend',function (){
        UPevent();
    })
    canvas.addEventListener('mouseup',function (e){
        UPevent();
    });
    // function AddText() {
    //     document.addEventListener('keydown',function (e){
    //         if (e.keyCode===13){
    //         }else {
    //
    //         }
    //     });
    // }
    let TrapezoidPoints;
    function SetTrapezoidPoints(point0,point1,point2,point3) {
        return TrapezoidPoints={x0:point0.x,y0:point0.y,x1:point1.x,y1:point1.y,x2:point2.x,y2:point2.y,x3:point3.x,y3:point3.y};
    }
    function draw_Rhombus(x0,y0,length,angle) {
        var halfDiagonal = length;
        var xOffset = halfDiagonal * Math.cos(Math.PI / 4);
        var yOffset = halfDiagonal * Math.sin(Math.PI / 4);

        var rotatedX0Y0 = rotatePoint(x0, y0 - halfDiagonal, x0, y0, angle);
        var rotatedX1Y1 = rotatePoint(x0 + xOffset, y0, x0, y0, angle);
        var rotatedX2Y2 = rotatePoint(x0, y0 + halfDiagonal, x0, y0, angle);
        var rotatedX3Y3 = rotatePoint(x0 - xOffset, y0, x0, y0, angle);
        DDA(rotatedX0Y0.x, rotatedX0Y0.y, rotatedX1Y1.x, rotatedX1Y1.y);
        DDA(rotatedX1Y1.x, rotatedX1Y1.y, rotatedX2Y2.x, rotatedX2Y2.y);
        DDA(rotatedX2Y2.x, rotatedX2Y2.y, rotatedX3Y3.x, rotatedX3Y3.y);
        DDA(rotatedX3Y3.x, rotatedX3Y3.y, rotatedX0Y0.x, rotatedX0Y0.y);
    }
    function drawTrapezoid(x, y, topWidth, bottomWidth, height, angle) {
        var halfHeight = height;
        var halfTopWidth = topWidth;
        var halfBottomWidth = bottomWidth;

        // Calcular las coordenadas de los vértices del trapecio en base al ángulo de inclinación
        var topLeftX = x - halfTopWidth;
        var topLeftY = y - halfHeight;
        var topRightX = x + halfTopWidth;
        var topRightY = y - halfHeight;
        var bottomRightX = x + halfBottomWidth;
        var bottomRightY = y + halfHeight;
        var bottomLeftX = x - halfBottomWidth;
        var bottomLeftY = y + halfHeight;

        var rotatedTopLeft = rotatePoint(topLeftX, topLeftY, x, y, angle);
        var rotatedTopRight = rotatePoint(topRightX, topRightY, x, y, angle);
        var rotatedBottomRight = rotatePoint(bottomRightX, bottomRightY, x, y, angle);
        var rotatedBottomLeft = rotatePoint(bottomLeftX, bottomLeftY, x, y, angle);

        DDA(rotatedTopLeft.x,rotatedTopLeft.y,rotatedTopRight.x, rotatedTopRight.y);
        DDA(rotatedTopRight.x, rotatedTopRight.y,rotatedBottomRight.x, rotatedBottomRight.y);
        DDA(rotatedBottomRight.x, rotatedBottomRight.y,rotatedBottomLeft.x, rotatedBottomLeft.y);
        DDA(rotatedBottomLeft.x, rotatedBottomLeft.y,rotatedTopLeft.x,rotatedTopLeft.y)
    }
    const textarea = document.getElementById('txt_area');
    function drawFigure(){
        paper.clearRect(0,0,canvas.width,canvas.height);
        for(var i=0;i<figure.length;i++){
            let fig = figure[i];
            paper.beginPath();
            switch (fig.type) {
                case'action':
                    if (fig.subtype==='erase'){
                        for (let point of fig.erasePoints) {
                            // Dibuja el punto en el lienzo
                            paper.clearRect(point.x, point.y, 4, 4); // Dibuja un píxel en la posición del punto
                        }
                    }
                    break
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
                    square(fig.firstPointX,fig.firstPointY,fig.len, fig.OrientX,fig.OrientY,fig.angle);
                    break;
                case 'rectangle':
                    Rectangle(fig.firstPointX,fig.firstPointY,fig.finalPointX,fig.finalPointY,fig.width_rect,fig.height_rect,fig.OrientX,fig.OrientY,fig.angle);
                    break;
                case 'oval':
                    DrawEllipse(fig.firstPointX,fig.firstPointY,fig.a,fig.b,fig.angle);
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
                case 'diamond':
                    draw_Rhombus(fig.firstPointX,fig.firstPointY,fig.width_rhombus,fig.angle);
                    break;
                case 'triangle':
                    draw_Polygon(fig.radius,fig.firstPointX,fig.firstPointY,fig.sides,fig.angle);
                    break;
                case 'trapezoid':
                    drawTrapezoid(fig.firstPointX,fig.firstPointY,fig.topWidth,fig.bottomWidth,fig.heightTrapezoid,fig.angle);
                    break;
                case 'text':
                    drawtext(fig.text_value,fig.firstPointX,fig.firstPointY);
                    break;
            }
        }
        if (isDrawing){
            let radio=0,angle=0,OrientX,OrientY,width,height;
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
                    DrawEllipse(firstPointX,firstPointY,a,b,0);
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
                    width = Math.abs(finalPointX-firstPointX);
                    height = Math.abs(finalPointY-firstPointY);
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
                case 'diamond':
                    width = Math.abs(finalPointX-firstPointX);
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    draw_Rhombus(firstPointX,firstPointY,width,0);
                    break;
                case 'trapezoid':
                    width = Math.abs(finalPointX-firstPointX);
                    height= Math.abs(finalPointY-firstPointY);
                    drawTrapezoid(firstPointX,firstPointY,width/2,width,height,0)
                    break;
                case 'triangle':
                    angle = Math.atan2(finalPointY - firstPointY, finalPointX - firstPointX);
                    radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    draw_Polygon(radio,firstPointX,firstPointY,3,angle);
                    break;
            }
        }
        paper.closePath();
    }
    let hasInput = false;
    canvas.addEventListener('click',function (e) {
        if (modo==='text'){
            if (hasInput){return}
            addInput(firstPointX,firstPointY,e);
        }else {return}
    })
    function addInput(x, y,ev) {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.left = ev.pageX + 'px';
        input.style.top = ev.pageY + 'px';
        input.onkeydown = handleEnter;
        document.body.appendChild(input);
        input.focus();
        hasInput = true;
    }
    function handleEnter(e) {
        const keyCode = e.keyCode;
        if (keyCode === 13) {
            drawtext(this.value, firstPointX, firstPointY);
            figure.push({type:'text',firstPointX:firstPointX,firstPointY:firstPointY,text_value:this.value});
            document.body.removeChild(this);
            hasInput = false;
        }
    }
    function drawtext(txt,x, y) {
        paper.font = '25px Arial';
        paper.fillText(txt, x, y);
        textarea.style.display='none';
    }
    function getPos(canvas,event){
        var rect = canvas.getBoundingClientRect();
        return{
            x:event.clientX - rect.left,
            y:event.clientY - rect.top
        };
    }
});
