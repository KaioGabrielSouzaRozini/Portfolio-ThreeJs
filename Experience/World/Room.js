import Experience from "../Experience.js";
import * as THREE from "three";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.time = this.experience.time;
    this.roomChildren = {};

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };
    this.time.on("update", () => {
      this.update();
    });

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupChild) => {
          groupChild.castShadow = true;
          groupChild.receiveShadow = true;
        });
      }

      if (child.name === "Computer") {
        child.children[0].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
      if (child.name === "Mini_floor") {
        child.position.x = -0.174219;
        child.position.z = 3.11941;
      }
      /*if (
        child.name === "Mailbox" ||
        child.name === "lamp" ||
        child.name === "FloorFirst" ||
        child.name === "FloorSecond" ||
        child.name === "FloorThird"
      ) {
        child.scale.set(0, 0, 0);
      }*/
      child.scale.set(0, 0, 0);
      if (child.name === "Cube") {
        //child.scale.set(1, 1, 1);
        child.position.set(0, 0.5, 0);
        child.rotation.y = Math.PI / 4;
      }
      this.roomChildren[child.name.toLowerCase()] = child;
    });

    const width = 1;
    const height = 1;
    const intensity = 3;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(-3.50917, 4.58779, -3);
    rectLight.rotation.y = 3.9;

    this.actualRoom.add(rectLight);
    this.roomChildren["rectLight"] = rectLight;

    //const rectLightHelper = new RectAreaLightHelper(rectLight);
    //rectLight.add(rectLightHelper);

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.22, 0.22, 0.22);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.1;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
