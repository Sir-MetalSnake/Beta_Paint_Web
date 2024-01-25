document.addEventListener('DOMContentLoaded',function (){
    var canvas = document.getElementById("canvas");
    var big = document.getElementById("big");
    canvas.width= canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var paper = canvas.getContext('2d');
    var lines = [];
    var size;
    var isDrawing = false;
    canvas.addEventListener('mousedown',OnMouseDown);
    canvas.addEventListener('mouseup',OnMouseUp);
    canvas.addEventListener('mousemove',OnMouseMove);
    big.addEventListener('click',ClickEvent)
    function ClickEvent(event){
       return size = 20;
    }
    function OnMouseDown(event){
        startDrawing(event);
    }
    function OnMouseUp(event){
        if (isDrawing){
            stopDraw(event);
        }

    }
    function OnMouseMove(event){
        if (isDrawing) {
            ContinueLine(event);
        }
    }
    function startDrawing(event){
        isDrawing= true;
        var startpoint= getPos(canvas,event);
        lines.push({type:'line',points:[startpoint]});
    }
    function ContinueLine(event){
        lines[lines.length-1].points[1]= getPos(canvas,event);
        drawLines(lines)
    }
    function stopDraw(event){
        isDrawing= false;
        lines[lines.length-1].points[1]= getPos(canvas,event);
        drawLines(lines);
        lines.push({type: 'line',points: []});
    }
    function drawLines(lines){
        paper.clearRect(0,0,canvas.width,canvas.height);

        for(var i=0;i<lines.length;i++){
            var points = lines[i].points;
            paper.lineWidth = 50;
            paper.beginPath();
            if (points.length === 2){
                var deltaX = points[1].x - points[0].x;
                var deltaY = points[1].y - points[0].y;
                var steps = Math.max(Math.abs(deltaX),Math.abs(deltaY));
                for (var t=0;t<=steps;t++){
                    var x= points[0].x+t*(deltaX/steps);
                    var y= points[0].y+t*(deltaY/steps);
                    paper.fillRect(x,y,2,2)
                }
                paper.stroke();
            }
        }
    }
    function getPos(canvas,event){
        var rect = canvas.getBoundingClientRect();
        return{
            x:event.clientX - rect.left,
            y:event.clientY - rect.top
        };
    }
});
