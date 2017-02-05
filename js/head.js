window.Head = {
  init: function(parent) {
    var that = this;

    this.parent = parent;
    this.children = [];
    if (parent) this.parent.children.push(this);

    this.head = document.createElement('div');
    this.head.className = 'head';
    this.head.addEventListener('click', function() { that.chop(); });
    if (parent) {
      this.neck = document.createElement('div');
      this.neck.className = 'neck';
      document.body.appendChild(this.neck);
    }

    this.size(parent ? parent.size() * 0.5 : 100);
    this.position(parent ? parent.position() : [0, 0]);

    document.body.appendChild(this.head);
  },

  position: function(vector) {
    if (_.isArray(vector)) {
      this.x = vector[0];
      this.y = vector[1];

      var left = (window.innerWidth / 2) + this.x;
      var top = (window.innerHeight / 2) + this.y;

      this.head.style.left = (left - (this.size() / 2)) + 'px';
      this.head.style.top = (top - (this.size() / 2)) + 'px';

      if (this.parent) {
        this.neck.style.left = left + 'px';
        this.neck.style.top = (top - 1) + 'px';

        var polarVector = Math.cartesianToPolar(
          this.parent.position(), this.position()
        );

        this.neck.style.width = polarVector[0] + 'px';
        this.neck.style.transform = 'rotate(' + polarVector[1] + 'rad)';
      }
    }

    return [this.x, this.y];
  },

  size: function(value) {
    if (_.isNumber(value)) {
      this._size = value;

      this.head.style.height = value + 'px';
      this.head.style.width = value + 'px';
    }

    return this._size;
  },

  distance: function() {
    return this.parent ?
      this.parent.distance() * 0.5 :
      Math.min(window.innerWidth, window.innerHeight) / 4;
  },

  angle: function() {
    return Math.TAU / (
      this.parent ? this.children.length + 1 : this.children.length
    );
  },

  balanceChildren: function() {
    var distance = this.distance();
    var angle = this.angle();

    if (this.parent) {
      var polarVector = Math.cartesianToPolar(
        this.parent.position(), this.position()
      );
      var initialTheta = polarVector[1];
    } else {
      var initialTheta = 0;
    }

    for (var i = 0; i < this.children.length; i++) {
      this.children[i].position(
        Math.polarToCartesian(
          [distance, (angle * (i + 1)) + initialTheta]
          , this.position()
        )
      );
      this.children[i].balanceChildren();
    }
  },

  depth: function() {
    return this.parent ? this.parent.depth() + 1 : 0;
  },

  randomSpawn: function() {
    if (Math.random() < Math.pow(0.45, this.depth())) {
      var childCount = Math.floor(Math.random() * 5) + 1;
      for (var i = 0; i < childCount; i++) Head.build(this)
      this.balanceChildren();
      for (var i = 0; i < childCount; i++) this.children[i].randomSpawn();
    }
  },

  duplicate: function(parent) {
    var copy = Head.build(parent);

    for (var i = 0; i < this.children.length; i++) {
      this.children[i].duplicate(copy);
    }
  },

  chop: function() {
    if (this.children.length === 0) {
      this.head.remove();

      if (this.parent) {
        this.neck.remove();

        var index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        this.parent.balanceChildren();

        if (this.parent.parent) {
          this.parent.duplicate(this.parent.parent);
          this.parent.duplicate(this.parent.parent);
          this.parent.parent.balanceChildren();
        }
      }
    }
  }
};
