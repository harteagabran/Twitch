//<!-- jsDelivr  -->
  //  <script src="https://cdn.jsdelivr.net/npm/fireworks-js@2.x/dist/index.umd.js"></script>
//
  //  <!-- UNPKG -->
    //<script src="https://unpkg.com/fireworks-js@2.x/dist/index.umd.js"></script>
const container = document.querySelector("#fireworks");
const fireworks = new Fireworks(container, {
	traceLength: 1,
	traceSpeed: 1,
	opacity: 1,
	lineStyle: "none",
	lineWidth: {
		explosion: {
			min: 1,
			max: 1
		},
		trace: {
			min: 1,
			max: 1
		},
		boundaries: {
			height: 1,
			width: 0,
			x: 200,
			y: 200
		},
		rocketsPoint: {
			min: 150,
			max: 150
		}
	}
});
fireworks.start();
