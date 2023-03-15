const BRICK_WIDTH = 0.4
const BRICK_DEPTH = 0.2
const BRICK_HEIGHT = 0.25
AFRAME.registerComponent('brick-wall', {
  schema: {
    width: {default: 10},
    height: {default: 8},
    projection: {default: false},
    projectionTolerance: {type: 'vec2', default: {x: -1, y: -1}},
  },  
  init() {

    let delay = 0;

    for (let ii = 0; ii < this.data.height; ii++) {

      for (let jj = 0; jj < this.data.width; jj++) {

        this.createAndBindBrick(ii, jj)
      }
    }
  },

  createAndBindBrick(ii, jj) {

    const y = (ii + 1) * BRICK_HEIGHT

    const offset = (ii % 2) /2
    const x = (jj + offset - (this.data.width / 2)) * BRICK_WIDTH
    const id = `brick-${ii}-${jj}`
    const brick = this.createBrick(x, y, 0, id)

    
    if (ii === 0) {
      this.bindToBrick(brick, 'base') 

      console.log(`${id} binding to #base`)
    }
    else {

      let leftLower, rightLower

      if (offset < 1) {
        leftLower = jj
        rightLower = jj + 1
      }
      else {
        leftLower = jj - 1
        rightLower = jj
      }
      
      const leftLowerId = `brick-${ii - 1}-${leftLower}`
      const rightLowerId = `brick-${ii - 1}-${rightLower}`

      console.log(`${id} binding to ${leftLowerId} and ${rightLowerId}`)

      if (document.getElementById(leftLowerId)) {
        this.bindToBrick(brick, leftLowerId) 
      }
      if (document.getElementById(rightLowerId)) {
        this.bindToBrick(brick, rightLowerId) 
      }
    }
    

  },

  createBrick(x, y, z, id) {

    const color = "#" + Math.floor(Math.random()*16777216).toString(16);

    const brick = document.createElement('a-box')
    brick.setAttribute("id", id)
    brick.object3D.position.set(x, y, z)
    brick.setAttribute("width", BRICK_WIDTH)
    brick.setAttribute("height", BRICK_HEIGHT)
    brick.setAttribute("depth", BRICK_DEPTH)
    brick.setAttribute("color", color)
    brick.setAttribute("physx-body", "")
    this.el.appendChild(brick)

    return brick
  },

  bindToBrick(brick, target) {

    this.createJoint(brick, target, 0, 0)
  },

  createJoint(brick, targetId, x, z) {

    const joint = document.createElement('a-entity');
    const y = -BRICK_HEIGHT / 2
    joint.object3D.position.set(x, y, z)
    joint.setAttribute('physx-joint', {type: "Fixed",
                                        target: `#${targetId}`,
                                        collideWithTarget: true,
                                        enableProjection: this.data.projection,
                                        projectionTolerance: this.data.projectionTolerance})
    brick.appendChild(joint)
  }
})