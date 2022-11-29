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
        let data = {
            "Time":[],
            "Load":[],
            "Indentation":[],
            "Cantilever":[],
            "Piezo":[]
        };
        let values;
        for (let line = 0; line < lines.length; line++) {
            if(reached){
                //ta.push(lines[line].split("\t"));
                values = lines[line].split("\t");
                data["Time"].push(values[0]);
                data["Load"].push(values[1]);
                data["Indentation"].push(values[2]);
                data["Cantilever"].push(values[3]);
                data["Piezo"].push(values[4]);
            }

            let words = lines[line].split('');
            for(let word = 0; word<words.length; word++){

                if(words.slice(-10).join("").trim() === "Auxiliary") {
                    reached = true;
                }
            }

        }
        console.log(data);
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