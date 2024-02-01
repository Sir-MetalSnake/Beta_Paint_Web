document.addEventListener('DOMContentLoaded',function(){
    const canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const paper = canvas.getContext("2d");
    const circle = document.getElementById("circle");
    var figure=[];
    var isDrawing = false;
    var firstPointX = 0;
    var firstPointY = 0;
    var finalPointX = 0;
    var finalPointY = 0; 
    var modo = 'pencil';
    circle.addEventListener('click',function(e) {
        modo='circle';
    })
    canvas.addEventListener('mousedown',function(e){
        var position = getPos(canvas,e);
        isDrawing = true;
        firstPointX = position.x;
        firstPointY = position.y;
        console.log(firstPointX,',',firstPointY);
    });
    canvas.addEventListener('mousemove',function(e){
        if(!isDrawing)return;
        var position = getPos(canvas,e);
        finalPointX = position.x;
        finalPointY = position.y;
        if(modo==='pencil'){

        }else{
            drawFigure();
        }
    });
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
                d = d + 4 * (x - y) + 10; 
            } 
            else{
                d = d + 4 * x + 6; 
            }

        } 
    } 
    canvas.addEventListener('mouseup',function (e){
        if(isDrawing){
            isDrawing=false;
            if(modo==='line'){
                figure.push({type:'line',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY});
            }else if (modo==='square') {
                
            }else if (modo ==='circle'){
                let radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                figure.push({type:'circle',firstPointX:firstPointX,firstPointY:firstPointY,finalPointX:finalPointX,finalPointY:finalPointY,radius:radio});
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
            if (fig.type ==='circle'){
                let h,k, radio; 
                h=fig.firstPointX
                k=fig.firstPointY
                circleBres(h,k,fig.radius);
            }
        }
        if (isDrawing){
            switch (modo){
                case "pencil":
                    break;
                case "circle":
                    let radio = Math.sqrt(Math.pow(finalPointX-firstPointX,2)+Math.pow(finalPointY-firstPointY,2));
                    circleBres(firstPointX,firstPointY,radio);
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
