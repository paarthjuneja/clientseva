document.addEventListener('DOMContentLoaded', () => {
    const addClientBtn = document.getElementById('addClientBtn');
    const clientNameInput = document.getElementById('clientName');
    const unpaidClientsList = document.getElementById('unpaidClients');
    const paidClientsList = document.getElementById('paidClients');

    // Load clients from localStorage
    loadClients();

    addClientBtn.addEventListener('click', () => {
        const clientName = clientNameInput.value.trim();
        if (clientName) {
            addClientToList(clientName, unpaidClientsList, false);
            saveClient(clientName, false);
            clientNameInput.value = '';
        }
    });

    function addClientToList(clientName, list, checked) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                paidClientsList.appendChild(li);
                updateClientStatus(clientName, true);
            } else {
                unpaidClientsList.appendChild(li);
                updateClientStatus(clientName, false);
            }
        });

        const label = document.createElement('label');
        label.textContent = clientName;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            deleteClient(clientName);
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    function saveClient(clientName, paid) {
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push({ name: clientName, paid: paid });
        localStorage.setItem('clients', JSON.stringify(clients));
    }

    function updateClientStatus(clientName, paid) {
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients = clients.map(client => 
            client.name === clientName ? { ...client, paid: paid } : client
        );
        localStorage.setItem('clients', JSON.stringify(clients));
    }

    function deleteClient(clientName) {
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients = clients.filter(client => client.name !== clientName);
        localStorage.setItem('clients', JSON.stringify(clients));
    }

    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.forEach(client => {
            addClientToList(client.name, client.paid ? paidClientsList : unpaidClientsList, client.paid);
        });
    }

    function resetCheckboxes() {
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients = clients.map(client => ({ ...client, paid: false }));
        localStorage.setItem('clients', JSON.stringify(clients));
        unpaidClientsList.innerHTML = '';
        paidClientsList.innerHTML = '';
        loadClients();
    }

    function checkForNewMonth() {
        const lastReset = localStorage.getItem('lastReset');
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + (now.getMonth() + 1);

        if (lastReset !== currentMonth) {
            resetCheckboxes();
            localStorage.setItem('lastReset', currentMonth);
        }
    }

    checkForNewMonth();
});
