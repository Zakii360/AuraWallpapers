Creating Wallpapers

HTML wallpapers can use:

Canvas
WebGL
CSS animations
JavaScript
External libraries

Example:

<canvas id="canvas"></canvas>

<script>
const canvas =
document.querySelector("canvas");

const ctx =
canvas.getContext("2d");

function draw(){

    ctx.fillStyle="#111";
    ctx.fillRect(
        0,
        0,
        innerWidth,
        innerHeight
    );

    requestAnimationFrame(draw);
}

draw();
</script>
