(() => {
  const config = {
    minRadius: 6,
    maxRadius: 20,
    bigDotRadius: 35,
    massFactor: 0.002,
    defaultColor: "rgba(255,255,255, 0.9)",
    smooth: 0.95,
    sphereRadius: 300,
    mouseSize: 120,
  };

  const TWO_PI = 2 * Math.PI;

  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  let w, h, mouse, dots;

  class Dot {
    constructor(bigDotRadius) {
      this.position = { x: mouse.x, y: mouse.y };
      this.speed = { x: 0, y: 0 };
      this.radius = bigDotRadius || random(config.minRadius, config.maxRadius);
      this.mass = this.radius * config.massFactor;
      this.color = config.defaultColor;
    }

    draw(x , y) {
      this.position.x = x || this.position.x + this.speed.x
      this.position.y = y || this.position.y + this.speed.y
      createCircle(
        this.position.x,
        this.position.y,
        this.radius,
        true,
        this.color
      );
      createCircle(
        this.position.x,
        this.position.y,
        this.radius,
        false,
        config.defaultColor
      );
    }
  }

  function updateDots() {
    for (let i = 0; i < dots.length; i++) {
      let acc = { x: 0, y: 0 };
        for (let j = 0; j < dots.length; j++) {
          if (i === j) {
          continue;
          }
        let [a, b] = [dots[i], dots[j]];
        
        let delta = {x: b.position.x - a.position.x, y: b.position.y - a.position.y};
        let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
          let force = (dist - config.sphereRadius) / dist * b.mass
          
          if (j === 0) {
            let transparency = config.mouseSize / dist;
            a.color = `rgba(250, 255, 255, ${transparency})`
            dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
          }
        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }

      dots[i].speed.x = dots[i].speed.x * config.smooth + acc.x * dots[i].mass;
      dots[i].speed.y = dots[i].speed.y * config.smooth + acc.y * dots[i].mass;
    }
    dots.map((el) => el === dots[0] ? el.draw(mouse.x, mouse.y) : el.draw());
  }

  function createCircle(x, y, radius, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;

    mouse = { x: w / 2, y: h / 2, down: false };
    dots = [];

    dots.push(new Dot(config.bigDotRadius))
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (mouse.down) {
      dots.push(new Dot());
    }
    updateDots()

    window.requestAnimationFrame(loop);
  }

  init();
  loop();

  function setPosition({ layerX, layerY }) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  canvas.addEventListener("mousemove", setPosition);
  window.addEventListener("mousedown", isDown);
  window.addEventListener("mouseup", isDown);
})();
