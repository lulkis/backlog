function list_toggle(id, type) {
    const table = document.getElementById('list-menu');
    fetch('/api/lists')
        .then(res => res.json())
        .then(rows => {
            if(table.style.display === 'none') {
                var counter = 0;
                rows.forEach(row => {
                    const div = document.createElement('div');
                    div.innerHTML = row.name;
                    div.classList.add('list_element');
                    div.name = counter;
                    div.addEventListener('click', () => list_add(row.id, id, type))

                    table.appendChild(div);
                    counter++;
                })

                table.style.display = 'block';
            } else {
                table.style.display = 'none';
                table.innerHTML = "";
            }
        });
}

function list_add(list, id, type) {
    fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list: list, media: id, type: type })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log(id);
                console.log(type);
                console.log(name);

                console.log("Lief Gut");
            }
        });
}
