export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) { this.x += vector.x; this.y += vector.y; return this; }
  sub(vector) { this.x -= vector.x; this.y -= vector.y; return this; }
  mult(value) { this.x *= value; this.y *= value; return this; }
  div(value) { if (value !== 0) { this.x /= value; this.y /= value; } return this; }
  magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() { const magnitude = this.magnitude(); if (magnitude !== 0) this.div(magnitude); return this; }
  setMagnitude(value) { return this.normalize().mult(value); }
  limit(maximum) { if (this.magnitude() > maximum) this.setMagnitude(maximum); return this; }
  distance(vector) { return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2); }
  static clone(vector) { return new Vector2D(vector.x, vector.y); }
}

const DEFAULT_CONFIG = {
  maxSpeed: 3,
  maxForce: 0.05,
  perceptionRadius: 50,
  separationDistance: 25,
  separationWeight: 1.5,
  alignmentWeight: 1,
  cohesionWeight: 1,
};

export class Boid {
  constructor(x, y) {
    this.position = new Vector2D(x, y);
    const angle = Math.random() * Math.PI * 2;
    this.velocity = new Vector2D(Math.cos(angle), Math.sin(angle)).mult(Math.random() * 2 + 1);
    this.acceleration = new Vector2D(0, 0);
  }

  update(width, height, config = DEFAULT_CONFIG) {
    this.velocity.add(this.acceleration).limit(config.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  seek(target, config) {
    const desired = Vector2D.clone(target).sub(this.position);
    desired.setMagnitude(config.maxSpeed);
    return desired.sub(this.velocity).limit(config.maxForce);
  }

  flock(boids, config = DEFAULT_CONFIG) {
    let separation = new Vector2D();
    let alignment = new Vector2D();
    let cohesion = new Vector2D();
    let separationCount = 0;
    let neighborCount = 0;

    for (const other of boids) {
      if (other === this) continue;
      const distance = this.position.distance(other.position);
      if (distance < config.separationDistance && distance > 0) {
        separation.add(Vector2D.clone(this.position).sub(other.position).normalize().div(distance));
        separationCount += 1;
      }
      if (distance < config.perceptionRadius) {
        alignment.add(other.velocity);
        cohesion.add(other.position);
        neighborCount += 1;
      }
    }

    if (separationCount > 0) {
      separation.div(separationCount).setMagnitude(config.maxSpeed).sub(this.velocity).limit(config.maxForce);
    }
    if (neighborCount > 0) {
      alignment.div(neighborCount).setMagnitude(config.maxSpeed).sub(this.velocity).limit(config.maxForce);
      cohesion.div(neighborCount);
      cohesion = this.seek(cohesion, config);
    }

    this.acceleration.add(separation.mult(config.separationWeight));
    this.acceleration.add(alignment.mult(config.alignmentWeight));
    this.acceleration.add(cohesion.mult(config.cohesionWeight));
  }
}
