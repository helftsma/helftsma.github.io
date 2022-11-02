
const fileSelector = document.getElementById('file-input');
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files[0];
  console.log("Uploaded file");
  readFile(fileList);
});

function readFile(file) {
  console.log("Reading file");

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    console.log(result);
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });

  reader.readAsText(file);
}