var preHandler = function (e) {
  e.preventDefault();
};
export default  class Draw {
    constructor(el) {
      this.el = el;
      this.isDraw = false
      this.canvas = document.getElementById(this.el);
      this.cxt = this.canvas.getContext("2d");
      this.cw = document.getElementById("canvas-box").clientWidth - 30;
      this.ch = document.getElementById("canvas-box").clientHeight - 30;
      this.canvas.width = this.cw;
      this.canvas.height = this.ch;
      this.stage_info = canvas.getBoundingClientRect();
      this.path = {
        beginX: 0,
        beginY: 0,
        endX: 0,
        endY: 0
      };
    }
    init(btn) {
      var that = this;

      this.canvas.addEventListener("touchstart", function (event) {
        document.addEventListener("touchstart", preHandler, false);
        that.drawBegin(event);
      });
      this.canvas.addEventListener("touchend", function (event) {
        document.addEventListener("touchend", preHandler, false);
        that.drawEnd();
      });
      this.clear(btn);
    }
    drawBegin(e) {
      var that = this;
      window.getSelection() ?
        window.getSelection().removeAllRanges() :
        document.selection.empty();
      this.cxt.strokeStyle = "#000";
      this.cxt.lineWidth = 5
      this.cxt.beginPath();
      this.cxt.moveTo(
        e.changedTouches[0].clientX - this.stage_info.left,
        e.changedTouches[0].clientY - this.stage_info.top
      );
      this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left;
      this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top;
      canvas.addEventListener("touchmove", function () {
        that.drawing(event);
      });
    }
    drawing(e) {
      this.cxt.lineTo(
        e.changedTouches[0].clientX - this.stage_info.left,
        e.changedTouches[0].clientY - this.stage_info.top
      );
      this.path.endX = e.changedTouches[0].clientX - this.stage_info.left;
      this.path.endY = e.changedTouches[0].clientY - this.stage_info.top;
      this.cxt.stroke();
    }
    drawEnd() {
      document.removeEventListener("touchstart", preHandler, false);
      document.removeEventListener("touchend", preHandler, false);
      document.removeEventListener("touchmove", preHandler, false);
      //canvas.ontouchmove = canvas.ontouchend = null
      this.isDraw = true;
    }
    clear(btn) {
      this.cxt.clearRect(0, 0, this.cw, this.ch);
      this.isDraw = false;
    }
    save() {
      return canvas.toDataURL("image/png");
    }
  }





