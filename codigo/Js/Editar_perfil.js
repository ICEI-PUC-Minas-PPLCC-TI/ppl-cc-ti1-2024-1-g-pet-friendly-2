document.addEventListener('DOMContentLoaded', function () {
    carregarPerfil();
    carregarPosts();
});

function carregarPerfil() {
    let usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuario) {
        fetch('../data/Editar_perfil.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const usuariosExternos = data.usuario;
                if (usuariosExternos.length > 0) {
                    usuario = usuariosExternos[0];
                    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                    localStorage.setItem('usuarios', JSON.stringify(usuariosExternos));
                } else {
                    usuario = { id: 0, nome: '', descricao: '', localizacao: '', fotoPerfil: '' };
                }
                preencherCamposPerfil(usuario);
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
                usuario = { id: 0, nome: '', descricao: '', localizacao: '', fotoPerfil: '' };
                preencherCamposPerfil(usuario);
            });
    } else {
        preencherCamposPerfil(usuario);
    }
}

function preencherCamposPerfil(usuario) {
    document.getElementById('editar-nome').value = usuario.nome;
    document.getElementById('editar-descricao').value = usuario.descricao;
    document.getElementById('editar-localizacao').value = usuario.localizacao;
    if (usuario.fotoPerfil) {
        document.getElementById('foto-perfil').innerHTML = `<img src="${usuario.fotoPerfil}" alt="Foto de Perfil">`;
    }
}

function salvarPerfil() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Nenhum usuário logado encontrado.');
        return;
    }

    const usuario = {
        id: JSON.parse(usuarioLogado).id,
        nome: document.getElementById('editar-nome').value,
        descricao: document.getElementById('editar-descricao').value,
        localizacao: document.getElementById('editar-localizacao').value,
        fotoPerfil: document.querySelector('#foto-perfil img')?.src || ''
    };

    const usuariosExternos = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuariosExternos.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
        usuariosExternos[index] = usuario;
    } else {
        usuariosExternos.push(usuario);
    }
    localStorage.setItem('usuarios', JSON.stringify(usuariosExternos));
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    alert('Perfil salvo com sucesso!');
}

function editarFotoPerfil() {
    document.getElementById('input-foto-perfil').click();
}

document.getElementById('input-foto-perfil').addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById('foto-perfil').innerHTML = `<img src="${reader.result}" alt="Foto de Perfil">`;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

function carregarPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'col-md-4';
        postDiv.innerHTML = `
            <div class="card mb-4">
                <img src="${post.imagem}" class="card-img-top" alt="Imagem do Post">
                <div class="card-body">
                    <p class="card-text">${post.descricao}</p>
                    <button class="btn btn-warning" onclick="editarPost(${index})">Editar</button>
                    <button class="btn btn-danger" onclick="excluirPost(${index})">Excluir</button>
                </div>
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });
}

function salvarPost() {
    const imagemInput = document.getElementById('imagem-post');
    const descricaoInput = document.getElementById('descricao-post');
    const reader = new FileReader();

    reader.onloadend = function () {
        const novoPost = {
            imagem: reader.result,
            descricao: descricaoInput.value
        };

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(novoPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        carregarPosts();

        // Resetar inputs
        imagemInput.value = '';
        descricaoInput.value = '';

        $('#modalAdicionarPost').modal('hide');
    };

    if (imagemInput.files[0]) {
        reader.readAsDataURL(imagemInput.files[0]);
    }
}

function editarPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const post = posts[index];

    document.getElementById('imagem-post').value = '';
    document.getElementById('descricao-post').value = post.descricao;

    $('#modalAdicionarPost').modal('show');

    // Salvar post editado
    document.querySelector('#modalAdicionarPost .btn-primary').onclick = function () {
        const postEditado = {
            imagem: post.imagem,
            descricao: document.getElementById('descricao-post').value
        };

        if (document.getElementById('imagem-post').files[0]) {
            const reader = new FileReader();
            reader.onloadend = function () {
                postEditado.imagem = reader.result;
                posts[index] = postEditado;
                localStorage.setItem('posts', JSON.stringify(posts));
                carregarPosts();
                $('#modalAdicionarPost').modal('hide');
            };
            reader.readAsDataURL(document.getElementById('imagem-post').files[0]);
        } else {
            posts[index] = postEditado;
            localStorage.setItem('posts', JSON.stringify(posts));
            carregarPosts();
            $('#modalAdicionarPost').modal('hide');
        }
    };
}

function excluirPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts'));
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    carregarPosts();
}

// Carregar dados do JSON externo (já integrado na função carregarPerfil)
