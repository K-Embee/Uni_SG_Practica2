class Hitbox extends THREE.SphereGeometry {
    constructor(radio, parent_object) {
        super(radio, 4, 4);
        parent_object.add(this);
        this.parent_object = parent_object;
        scene.hitboxes.add(this);
    }
    onCollision() {

    }
}
