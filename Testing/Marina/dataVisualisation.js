const ctx = document.getElementById('myChart');

document.querySelector("#read-button").addEventListener('click', function() {
		let file = document.querySelector("#file-input").files[0];
		let reader = new FileReader();
		reader.onload = function(progressEvent) {
        // Entire file
          const text = this.result;
        // $output.innerText = text

        // By lines
        var lines = text.split('\n');
        for (var line = 0; line < lines.length; line++) {
          console.log(lines[line]);
        }
      };
		reader.readAsText(file);
	});



new Chart(ctx, {
    type: 'line',
    data: {
    datasets: [{
      data: [{x: '2016-12-25', y: 20}, {x: '2016-12-26', y: 10}]
    }]
  },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });