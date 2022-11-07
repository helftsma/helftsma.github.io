// Global variable to store the py-script DIV
let py_div;
let py_output;
function run_python(py_code) {
        // remove the previous script tag
        if (py_div) {
                py_div.remove();
        }

        // Wrap the Python code (py_code) with a PyScript tag
        // py_div.evaluate() will run the code within the <py-script> tag
        let html_tag = `
        <py-script output="${py_output.id}">
        ${py_code}
        </py-script>
        `;

        // Create the DIV to attach the py-script tag
        let div = document.createElement("div");
        div.innerHTML = html_tag;

        py_div = div.firstElementChild;
        document.body.appendChild(py_div);

        try {
                // This will run the Python interpreter
                // for the code loaded into py_div
                py_div.evaluate();
        } catch (error) {
                console.error("Python error:");
                console.error(error);
        }
}

document.getElementById('upload-button').addEventListener('change', function(e) {
  let file = document.getElementById('upload-button').files[0];

  (async () => {
    const fileContent = await file.text();

    console.log(fileContent);

    // Create a DIV to store Python program print output
    py_output = document.createElement("div");
    py_output.id = "user-code";
    document.body.appendChild(py_output);

    run_python(fileContent);

  })();
});

