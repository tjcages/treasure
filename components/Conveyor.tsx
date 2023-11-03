import React, { useEffect, useRef } from "react";
import Matter, { Constraint } from "matter-js";

const Conveyor = () => {
  const canvasRef = useRef(
    null
  ) as React.MutableRefObject<HTMLDivElement | null>;

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;

    if (!canvasRef.current) return;

    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: 2,
        background: "transparent",
        wireframes: false,
      },
    });

    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2 + 160,
      window.innerHeight + 80,
      window.innerWidth + 320,
      160,
      { render: { fillStyle: "#080808" }, isStatic: true }
    );
    // const wallLeft = Matter.Bodies.rectangle(
    //   -80,
    //   window.innerHeight / 2,
    //   160,
    //   window.innerHeight,
    //   { isStatic: true }
    // );
    const wallRight = Matter.Bodies.rectangle(
      window.innerWidth + 80,
      window.innerHeight / 2,
      160,
      1200,
      { isStatic: true }
    );
    const roof = Matter.Bodies.rectangle(
      window.innerWidth / 2 + 160,
      -80,
      window.innerWidth + 320,
      160,
      { isStatic: true }
    );

    // create objects
    const word = "TREASURE";
    const objects = [] as any;
    const constraints = [] as any;

    word
      .split("")
      .reverse()
      .forEach((letter, index) => {
        const object = Matter.Bodies.rectangle(-300 - index * 8, 250, 50, 80, {
          render: {
            sprite: {
              texture: `/assets/${letter}.png`,
              xScale: 0.2,
              yScale: 0.2,
            },
          },
          mass: 0.5, 
        });

        objects.push(object); // Add the object to the objects array

        if (index > 0) {
          const constraint = Constraint.create({
            bodyA: objects[index - 1],
            bodyB: object,
            length: 50,
            stiffness: 0.1,
            damping: 0.4,
            render: {
              visible: false,
            },
          });

          constraints.push(constraint); // Add the constraint to the constraints array
        }
      });

    // Add the constraints to the world
    // Add the constraints to the world
    constraints.forEach((constraint) => {
      Matter.World.add(world, constraint);
    });

    // Add the objects to the world
    objects.forEach((object) => {
      Matter.World.add(world, object);
    });

    const conveyorBelt = Matter.Bodies.rectangle(
      -window.innerWidth,
      window.innerHeight / 2,
      window.innerWidth * 2 + 400,
      10,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    Matter.World.add(world, [
      ground,
      // wallLeft,
      wallRight,
      roof,
      // ...wordArray,
      conveyorBelt,
    ]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.World.add(world, mouseConstraint);

    render.mouse = mouse;

    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    let click = false;

    document.addEventListener("mousedown", () => (click = true));
    document.addEventListener("mousemove", () => (click = false));
    document.addEventListener("mouseup", () =>
      console.log(click ? "click" : "drag")
    );

    Matter.Events.on(engine, "beforeUpdate", function () {
      const objectsOnConveyorBelt = objects;

      objectsOnConveyorBelt.forEach((object) => {
        if (object.position.y < conveyorBelt.position.y) {
          Matter.Body.applyForce(object, object.position, { x: 0.00035, y: 0 });
        }
      });
      objectsOnConveyorBelt.forEach((object) => {
        if (
          object.position.x >
          conveyorBelt.position.x + conveyorBelt.width / 2
        ) {
          Matter.Body.applyForce(object, object.position, { x: 0, y: 0.0005 });
        }
      });
    });

    Matter.Runner.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default Conveyor;
