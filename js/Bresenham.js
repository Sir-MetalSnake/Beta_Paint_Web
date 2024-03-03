//Bresenham Algorithm
class Bresenham {
    constructor(CordX_In,CordY_In,CordX_Fin,CordY_Fin) {
        this._CordX_In=CordX_In;
        this._CordY_In=CordY_In;
        this._CordX_Fin=CordX_Fin;
        this._CordY_Fin=CordY_Fin;
    }
    DrawLine(size,paper){
        let XK =this._CordX_In,YK = this._CordY_In;
        let dx = Math.abs(this._CordX_Fin - this._CordX_In);
        let dy = Math.abs(this._CordY_Fin - this._CordY_In);
        let sx = (this._CordX_In < this._CordX_Fin) ? 1 : -1;
        let sy = (this._CordY_In < this._CordY_Fin) ? 1 : -1;
        let err = dx - dy;

        while(true) {
            paper.fillRect(XK, YK,size,size);
            if ((XK === this._CordX_Fin) && (YK === this._CordY_Fin)) break;
            let e2 = 2*err;
            if (e2 > -dy) { err -= dy; XK  += sx; }
            if (e2 < dx) { err += dx; YK  += sy; }
        }
    }
}