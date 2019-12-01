function Player(id){
    this.id = id;
    this.position = {x:80, y:80};
    this.toString = () => { return ''+this.id }
}
module.exports = Player;