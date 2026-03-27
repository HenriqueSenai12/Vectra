// ==========================================================================
//   UPLOAD DE ARQUIVOS (DRAG & DROP E CLIQUE) - CORRIGIDO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionando os elementos do HTML
    const dropZone = document.getElementById('drop-zone');
    const btnUpload = document.getElementById('btn-upload');
    const fileInput = document.getElementById('file-input');
    const textInfo = document.getElementById('upload-info');

    // Tipos permitidos
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    // TRAVA DE SEGURANÇA: Só executa o código se os elementos existirem nesta página
    if (dropZone && btnUpload && fileInput && textInfo) {
        
        // 2. Ação de CLIQUE no botão "Fazer Upload"
        btnUpload.addEventListener('click', (e) => {
            e.preventDefault(); 
            fileInput.click();  
        });

        // 3. Ação quando o usuário SELECIONA o arquivo
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                handleFile(this.files[0]);
            }
        });

        // 4. Ações de ARRASTAR E SOLTAR (Drag & Drop)
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            dropZone.classList.add('drag-active'); 
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-active');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        // 5. Função principal para validar
        function handleFile(file) {
            if (!allowedTypes.includes(file.type)) {
                alert('Formato inválido! Por favor, envie apenas arquivos PNG, JPG ou PDF.');
                fileInput.value = ''; 
                textInfo.textContent = 'Apenas arquivos PNG, JPG e PDF são suportados';
                return;
            }

            textInfo.textContent = `Arquivo selecionado: ${file.name}`;
            textInfo.style.color = '#4FA3FF'; 
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionamos os elementos que criamos no HTML
    const fileInput = document.getElementById('file-input');
    const btnUpload = document.getElementById('btn-upload');
    const dropZone = document.getElementById('drop-zone');
    const imagePreview = document.getElementById('image-preview');
    const uploadInfo = document.getElementById('upload-info'); 

    // 2. Faz o botão "Procurar..." abrir a janela de seleção do Windows/Mac
    btnUpload.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que a página recarregue
        fileInput.click();
    });

    // 3. Função principal que lê o arquivo e mostra a imagem
    const processarArquivo = (file) => {
        if (!file) return;

        // Atualiza o texto abaixo do botão para mostrar o nome do arquivo selecionado
        uploadInfo.innerHTML = `<span class="text-vectra-light font-medium">Arquivo selecionado:</span> ${file.name}`;

        // Se o arquivo for uma imagem (PNG, JPG, etc)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            // Quando a leitura da imagem terminar, joga ela na tag <img> da coluna direita
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden'); // Remove a classe que escondia a imagem
            };
            
            reader.readAsDataURL(file); // Inicia a leitura do arquivo
        } 
        // Se for um PDF (já que seu accept tem .pdf)
        else if (file.type === 'application/pdf') {
            imagePreview.classList.add('hidden'); // Esconde a foto se tiver alguma
            uploadInfo.innerHTML += ` <br><span class="text-yellow-500">(Prévia indisponível para PDF)</span>`;
        }
    };

    // 4. Quando o usuário escolhe o arquivo pela janela do sistema
    fileInput.addEventListener('change', (e) => {
        processarArquivo(e.target.files[0]);
    });

    // ==========================================
    // BÔNUS: Drag and Drop (Arrastar e Soltar)
    // ==========================================

    // Quando o arquivo está "voando" por cima da área pontilhada (Efeito visual de destaque)
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-vectra-light', 'bg-[#152036]'); 
    });

    // Quando o mouse sai da área pontilhada com o arquivo
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-vectra-light', 'bg-[#152036]');
    });

    // Quando o usuário solta o arquivo dentro da área
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-vectra-light', 'bg-[#152036]'); // Tira o destaque
        
        // Pega o arquivo solto e manda para a nossa função
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files; // Atualiza o input escondido
            processarArquivo(e.dataTransfer.files[0]); 
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionando os elementos pelo ID que adicionamos no HTML
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    const inputTitulo = document.getElementById('input-titulo');
    const selectCategoria = document.getElementById('input-categoria');
    const textareaDescricao = document.getElementById('input-descricao');
    const fileInput = document.getElementById('file-input');
    
    const imagePreview = document.getElementById('image-preview');
    const uploadInfo = document.getElementById('upload-info');

    // ==========================================
    // SISTEMA DE POP-UP (TOAST NOTIFICATION)
    // ==========================================
    const mostrarNotificacao = (mensagem, tipo) => {
        // Verifica se o container de toasts já existe, se não, cria um
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
            document.body.appendChild(container);
        }

        // Configurações visuais baseadas no tipo (Sucesso ou Erro)
        const isSuccess = tipo === 'sucesso';
        const bgColor = isSuccess ? 'bg-[#10B981]' : 'bg-[#EF4444]'; // Verde ou Vermelho
        const icone = isSuccess ? 'ph-check-circle' : 'ph-warning-circle';

        // Cria o elemento do popup
        const toast = document.createElement('div');
        toast.className = `${bgColor} text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 font-medium text-sm border border-white/20 transition-all duration-300 transform translate-x-full opacity-0`;
        toast.innerHTML = `<i class="ph-fill ${icone} text-xl"></i> ${mensagem}`;

        container.appendChild(toast);

        // Animação de entrada (desliza da direita)
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Remove o popup automaticamente após 3.5 segundos
        setTimeout(() => {
            toast.classList.remove('translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300); // Espera a animação acabar para deletar do HTML
        }, 3500);
    };

    // ==========================================
    // FUNÇÃO PARA LIMPAR TUDO (RESET)
    // ==========================================
    const resetarFormulario = () => {
        // Limpa os textos e seleções
        if(inputTitulo) inputTitulo.value = '';
        if(textareaDescricao) textareaDescricao.value = '';
        if(selectCategoria) selectCategoria.selectedIndex = 0; // Volta pro "Sem categoria"
        
        // Limpa o arquivo oculto
        if(fileInput) fileInput.value = '';
        
        // Esconde a imagem de preview e volta o texto original do upload
        if (imagePreview) {
            imagePreview.src = '';
            imagePreview.classList.add('hidden');
        }
        if (uploadInfo) {
            uploadInfo.innerHTML = 'Apenas arquivos PNG, JPG e PDF são suportados';
        }
    };

    // ==========================================
    // AÇÕES DOS BOTÕES
    // ==========================================

    // Ação: CANCELAR
    if (btnCancelar) {
        btnCancelar.addEventListener('click', (e) => {
            e.preventDefault();
            resetarFormulario();
            mostrarNotificacao('Ação cancelada. Formulário limpo.', 'erro'); 
        });
    }

    // Ação: SALVAR
    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();

            // Regras de validação (Verifica se estão vazios)
            // .trim() remove espaços em branco acidentais
            const tituloPreenchido = inputTitulo && inputTitulo.value.trim() !== '';
            const descricaoPreenchida = textareaDescricao && textareaDescricao.value.trim() !== '';
            const categoriaPreenchida = selectCategoria && selectCategoria.value !== 'Sem categoria' && selectCategoria.value !== '';
            
            // Opcional: Se quiser obrigar a ter imagem, descomente a linha abaixo e adicione na verificação do 'if'
            // const arquivoPreenchido = fileInput && fileInput.files.length > 0;

            // Se TODOS os campos obrigatórios estiverem preenchidos...
            if (tituloPreenchido && descricaoPreenchida && categoriaPreenchida) {
                resetarFormulario(); // Limpa os dados
                mostrarNotificacao('Publicação salva com sucesso!', 'sucesso'); // Mostra verde
            } else {
                // Se faltar algum campo...
                mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'erro'); // Mostra vermelho
            }
        });
    }
});