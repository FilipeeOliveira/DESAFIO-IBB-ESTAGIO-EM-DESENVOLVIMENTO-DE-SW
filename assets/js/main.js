const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('bd_cliente')) ?? []
const setLocalStorage = (bdClient) => localStorage.setItem("bd_cliente", JSON.stringify(bdClient))


const deleteClient = (index) => {
    const bdClient = readClient()
    bdClient.splice(index, 1)
    setLocalStorage(bdClient)
}

const updateClient = (index, client) => {
    const bdClient = readClient()
    bdClient[index] = client
    setLocalStorage(bdClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const bdClient = getLocalStorage()
    bdClient.push(client)
    setLocalStorage(bdClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}



const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent = 'Novo Usuário'
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            status: document.getElementById('status').value 
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tabelaCliente>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tabelaCliente>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const bdClient = readClient()
    clearTable()
    bdClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('senha').value = client.senha 
    document.getElementById('status').value = client.status 
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    document.querySelector(".modal-header>h2").textContent = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('fecharModal')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tabelaCliente>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
