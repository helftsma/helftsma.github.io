document.getElementById('upload-button').addEventListener('change', function(e) {
  let file = document.getElementById('upload-button').files[0];

  (async () => {
    const fileContent = await file.text();

    console.log(fileContent);

    let insertPoint = document.getElementById('user-code');
    insertPoint.innerHTML = fileContent;
    let myPyScript = insertPoint.firstElementChild;
    myPyScript.evaluate();
  })();
});