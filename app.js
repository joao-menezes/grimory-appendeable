document.getElementById('file-input').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(event) {
        var existingData = JSON.parse(event.target.result);
        document.getElementById('form-magic').style.display = 'block';

        document.getElementById('form-magic').addEventListener('submit', function(e) {
            e.preventDefault();

            var formData = new FormData(this);
            var newData = {};
            formData.forEach(function(value, key){
                if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }
                newData[key] = value;
            });
            newData.id = generateNewId(existingData);

            existingData.dados.push(newData);
            var updatedJson = JSON.stringify(existingData, null, 2);
            var updatedBlob = new Blob([updatedJson], { type: 'application/json' });

            var updatedUrl = URL.createObjectURL(updatedBlob);
            var a = document.createElement('a');
            a.href = updatedUrl;
            a.download = 'updated_file.json';
            a.textContent = 'Download Updated File';
            document.body.appendChild(a);

            a.click();
            document.body.removeChild(a);

            if (document.getElementById('check-form').checked) {
                document.getElementById('form-magic').reset();
            }
        });
    };
    reader.readAsText(file);
}); 

function generateNewId(existingData) {
    var maxId = 20000;
    existingData.dados.forEach(function(data) {
        if (data.id > maxId) {
            maxId = data.id;
        }
    });
    return maxId + 1;
}
