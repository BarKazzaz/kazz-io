function InputsHandler(){
    this.ControlLeft = ()=>{ console.log("FIRE!"); }
    this.ShiftLeft = ()=>{ console.log("RUN!"); }
    this.Escape = ()=>{ console.log("show menu"); }
    this.changeInputButton = (currentButton, newButton)=>{
        if(this.hasOwnProperty(newButton)) return false;
        this[newButton] = this[currentButton];
        delete this[currentButton];
    }
}
module.exports.InputsHandler = InputsHandler;