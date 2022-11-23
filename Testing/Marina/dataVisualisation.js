const ctx = document.getElementById('myChart');

document.querySelector("#read-button").addEventListener('click', function() {
		let file = document.querySelector("#file-input").files[0];
		let reader = new FileReader();
		reader.onload = function(progressEvent) {
        // Entire file
          const text = this.result;
        // $output.innerText = text

        // By lines
        let lines = text.split('\n');
        let reached = false;
        let data = [];
        for (let line = 0; line < 50; line++) {
            if(reached){
                data.push(lines[line].split("\t"));
            }

            let words = lines[line].split('');
            for(let word = 0; word<words.length; word++){
                if(words.slice(-10).join("").trim() === "Auxiliary") {
                    reached = true;
                }
            }

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