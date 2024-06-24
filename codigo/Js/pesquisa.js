async function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    try {
        // Verificar se a chave "usuarios" está vazia ou não é um array
        let storedUsers = JSON.parse(localStorage.getItem('usuarios'));

        if (!Array.isArray(storedUsers)) {
            // Se não for um array ou estiver vazio, buscar dados do arquivo JSON local
            const response = await fetch('../data/Editar_perfil.json');
            const usersJSON = await response.json();

            // Verificar se 'usuario' é um array
            if (Array.isArray(usersJSON.usuario)) {
                storedUsers = usersJSON.usuario;
                // Preencher a chave "usuarios" no local storage
                localStorage.setItem('usuarios', JSON.stringify(storedUsers));
            } else {
                console.error('O formato do JSON obtido não é válido: "usuario" não é um array.');
                return;
            }
        }

        // Filtrar usuários com base na localização
        const filteredUsers = storedUsers.filter(user => user.localizacao.toLowerCase().includes(searchInput));

        // Exibir tabela de usuários ou mensagem de "usuário não encontrado"
        const usersTable = document.getElementById('usersTable');
        if (filteredUsers.length > 0) {
            usersTable.innerHTML = '';
            usersTable.innerHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredUsers.map(user => `
                            <tr onclick="openUserModal(${user.id})" style="cursor: pointer;">
                                <td>${user.id}</td>
                                <td>${user.nome}</td>
                                <td>${user.descricao}</td>
                                <td>${user.localizacao}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            usersTable.innerHTML = '';
            alert("Usuario não encontrado");
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
        document.getElementById('usersTable').innerHTML = '<p>Erro ao buscar dados.</p>';
    }
}

// Função para abrir o modal com os dados do usuário
function openUserModal(userId) {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios'));
    const user = storedUsers.find(user => user.id === userId);
    const userModalBody = document.getElementById('userModalBody');
    userModalBody.innerHTML = `
        <img src="${user.fotoPerfil}" class="img-fluid mb-3" alt="Profile Picture">
        <h5>Name: ${user.nome}</h5>
        <p>Description: ${user.descricao}</p>
        <p>Location: ${user.localizacao}</p>
    `;
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
}
