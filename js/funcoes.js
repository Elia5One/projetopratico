// FUNÇÕES

const ESTADOS = {
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
    BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
    GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
    PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
    SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
};

// REGRAS PARA A VALIDAÇÃO
const REGRAS = {
    nome: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Este campo é obrigatório.' };
        if (v.length < 2) return { valido: false, mensagem: 'Digite pelo menos 2 caracteres.' };
        if (v.length > 80) return { valido: false, mensagem: 'Máximo de 80 caracteres.' };
        if (!/^[A-Za-zÀ-ÿ' ]+$/.test(v))
            return { valido: false, mensagem: 'Use apenas letras (sem números ou símbolos).' };
        return { valido: true };
    },
    idade: (valor) => {
        if (!valor) return { valido: false, mensagem: 'Informe a idade.' };
        if (!/^\d+$/.test(valor)) return { valido: false, mensagem: 'Digite apenas números.' };
        const idade = parseInt(valor, 10);
        if (idade < 1 || idade > 15)
            return { valido: false, mensagem: 'A idade deve estar entre 1 e 15 anos.' };
        return { valido: true };
    },
    telefone: (valor) => {
        const d = valor.replace(/\D/g, '');
        if (!d) return { valido: false, mensagem: 'Informe o telefone.' };
        if (d.length !== 10 && d.length !== 11)
            return { valido: false, mensagem: 'Telefone deve ter 10 ou 11 dígitos com DDD.' };
        if (d.length === 11 && d[2] !== '9')
            return { valido: false, mensagem: 'Celular deve começar com 9 após o DDD.' };
        return { valido: true };
    },
    cep: (valor) => {
        const d = valor.replace(/\D/g, '');
        if (!d) return { valido: false, mensagem: 'Informe o CEP.' };
        if (d.length !== 8) return { valido: false, mensagem: 'CEP deve ter 8 dígitos.' };
        return { valido: true };
    },
    endereco: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Informe o endereço.' };
        if (v.length < 3) return { valido: false, mensagem: 'Endereço muito curto.' };
        if (v.length > 120) return { valido: false, mensagem: 'Máximo de 120 caracteres.' };
        return { valido: true };
    },
    bairro: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Informe o bairro.' };
        if (v.length < 2) return { valido: false, mensagem: 'Bairro muito curto.' };
        if (v.length > 60) return { valido: false, mensagem: 'Máximo de 60 caracteres.' };
        return { valido: true };
    },
    numero: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Informe o número da casa.' };
        if (!/^[0-9]+[A-Za-z]?$/.test(v))
            return { valido: false, mensagem: 'Use apenas números (ex: 123 ou 123A).' };
        if (v.length > 10) return { valido: false, mensagem: 'Número inválido.' };
        return { valido: true };
    },
    cidade: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Informe a cidade.' };
        if (v.length < 2) return { valido: false, mensagem: 'Cidade muito curta.' };
        if (v.length > 60) return { valido: false, mensagem: 'Máximo de 60 caracteres.' };
        if (!/^[A-Za-zÀ-ÿ' .-]+$/.test(v))
            return { valido: false, mensagem: 'Cidade contém caracteres inválidos.' };
        return { valido: true };
    },
    uf: (valor) => {
        if (!valor) return { valido: false, mensagem: 'Selecione o estado (UF).' };
        if (!ESTADOS[valor]) return { valido: false, mensagem: 'UF inválida.' };
        return { valido: true };
    },
    carta: (valor) => {
        const v = valor.trim();
        if (!v) return { valido: false, mensagem: 'Escreva sua cartinha para o Papai Noel!' };
        if (v.length < 20) return { valido: false, mensagem: 'A carta deve ter pelo menos 20 caracteres.' };
        if (v.length > 1000) return { valido: false, mensagem: 'Máximo de 1000 caracteres.' };
        return { valido: true };
    },
    // NOVO: regra para o checkbox de consentimento
    consentimento: () => {
        const checkbox = document.getElementById('consentimento');
        if (!checkbox || !checkbox.checked) {
            return { valido: false, mensagem: 'É necessário o consentimento do responsável para enviar a carta.' };
        }
        return { valido: true };
    }
};

// SELECIONAR UF
function popularUF() {
    const selectUF = document.getElementById('uf');
    if (!selectUF) return;

    Object.entries(ESTADOS)
        .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .forEach(([uf, nome]) => {
            const option = document.createElement('option');
            option.value = uf;
            option.textContent = `${nome} (${uf})`;
            selectUF.appendChild(option);
        });
}

// MÁSCARAS
function mascaraCEP(input) {
    let valor = input.value.replace(/\D/g, '').slice(0, 8);
    if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    input.value = valor;
}

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '').slice(0, 11);
    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d+)$/, '($1) $2');
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d+)$/, '($1');
    }
    input.value = valor;
}

// BUSCAR ENDEREÇO PELO CEP (ViaCEP)
async function buscarCEP(cep) {
    const statusEl = document.getElementById('cep-status');
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        statusEl.textContent = '';
        statusEl.className = 'ajuda';
        return;
    }

    statusEl.textContent = '🔍 Buscando CEP...';
    statusEl.className = 'ajuda cep-status-carregando';

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            statusEl.textContent = '❌ CEP não encontrado.';
            statusEl.className = 'ajuda cep-status-erro';
            // NOVO: limpa campos para não manter dados antigos
            ['endereco', 'bairro', 'cidade', 'uf'].forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            return;
        }

        document.getElementById('endereco').value = dados.logradouro || '';
        document.getElementById('bairro').value = dados.bairro || '';
        document.getElementById('cidade').value = dados.localidade || '';
        document.getElementById('uf').value = dados.uf || '';

        statusEl.textContent = '✅ Endereço encontrado!';
        statusEl.className = 'ajuda cep-status-sucesso';

        document.getElementById('numero').focus();

        ['endereco', 'bairro', 'cidade', 'uf'].forEach(validarCampo);

        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'ajuda';
        }, 3000);

    } catch (erro) {
        statusEl.textContent = '⚠️ Erro ao buscar CEP. Preencha manualmente.';
        statusEl.className = 'ajuda cep-status-erro';
        console.error('Erro ao buscar CEP:', erro);
    }
}

// VALIDAÇÃO INDIVIDUAL
function validarCampo(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return true;

    const tipo = campo.dataset.validar;
    const erroEl = document.querySelector(`[data-erro="${idCampo}"]`);
    const regra = REGRAS[tipo];
    if (!regra) return true;

    const resultado = regra(campo.value, campo);


    const alvoVisual = tipo === 'consentimento'
        ? campo.closest('.consentimento')
        : campo;

    if (resultado.valido) {
        alvoVisual.classList.remove('campo-invalido');
        
        if (tipo !== 'consentimento') alvoVisual.classList.add('campo-valido');
        campo.setAttribute('aria-invalid', 'false');
        if (erroEl) {
            erroEl.textContent = '';
            erroEl.classList.remove('visivel');
        }
        return true;
    } else {
        alvoVisual.classList.remove('campo-valido');
        alvoVisual.classList.add('campo-invalido');
        campo.setAttribute('aria-invalid', 'true');
        if (erroEl) {
            erroEl.textContent = resultado.mensagem;
            erroEl.classList.add('visivel');
        }
        return false;
    }
}

// VALIDAÇÃO DE FORMULÁRIO COMPLETO
function validarFormulario() {
    const campos = document.querySelectorAll('[data-validar]');
    const invalidos = [];

    campos.forEach((campo) => {
        if (!validarCampo(campo.id)) invalidos.push(campo);
    });

    if (invalidos.length === 0) return true;

    invalidos[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidos[0].focus();
    return false;
}

// CONTADOR DE CARACTERES
function atualizarContador() {
    const carta = document.getElementById('carta');
    const contador = document.getElementById('contador');
    if (!carta || !contador) return;

    const total = carta.value.length;
    contador.textContent = total;
    contador.classList.toggle('limite', total >= 900);
}

// TOAST DE SUCESSO
function mostrarToast(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('mostrar'), 100);
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// REGISTRO DE ÚLTIMAS CARTAS ENVIADAS
const CHAVE_STORAGE = 'cartasPapaiNoel';

function obterCartas() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || [];
    } catch {
        return [];
    }
}

function salvarCarta(dados) {
    const cartas = obterCartas();
    cartas.unshift({
        nome: dados.nome_crianca,
        cidade: dados.cidade,
        uf: dados.uf,
        carta: dados.carta,
        data: new Date().toISOString(),
        consentimento: true
    });
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(cartas.slice(0, 3)));
}

function formatarData(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function renderizarCartas() {
    const lista = document.getElementById('lista-cartas');
    if (!lista) return;

    const cartas = obterCartas();

    if (cartas.length === 0) {
        lista.innerHTML = '<p class="sem-cartas">Nenhuma carta enviada ainda. Seja o primeiro a escrever para o Papai Noel! 🎅</p>';
        return;
    }

    lista.innerHTML = cartas.map((c) => `
        <div class="carta-card">
            <div class="carta-topo">
                <span class="carta-nome">🎅 ${c.nome}</span>
                <span class="carta-data">${formatarData(c.data)}</span>
            </div>
            <div class="carta-info">📍 ${c.cidade} - ${c.uf}</div>
            <div class="carta-texto">"${c.carta}"</div>
        </div>
    `).join('');
}

// ENVIO DO FORMULÁRIO
function tratarEnvio(evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
        console.warn('⚠️ Envio bloqueado: existem campos inválidos.');
        return;
    }

    const dados = Object.fromEntries(new FormData(evento.target));
    const nomeCrianca = dados.nome_crianca;

    console.log('📨 Carta enviada!');
    console.log('Dados:', dados);

    // REGISTRO DA CARTA
    salvarCarta(dados);
    renderizarCartas();

    mostrarToast(`🎅 Carta enviada com sucesso, ${nomeCrianca}!`);

    // RESETE DO FORMULÁRIO
    evento.target.reset();

    document.querySelectorAll('[data-validar]').forEach((c) => {
        c.classList.remove('campo-valido', 'campo-invalido');
        c.removeAttribute('aria-invalid');
    });
    document.querySelectorAll('.mensagem-erro').forEach((m) => {
        m.textContent = '';
        m.classList.remove('visivel');
    });

    document.querySelectorAll('.consentimento').forEach((c) => {
        c.classList.remove('campo-invalido', 'campo-valido');
    });

    const contador = document.getElementById('contador');
    if (contador) contador.textContent = '0';

    const cepStatus = document.getElementById('cep-status');
    if (cepStatus) {
        cepStatus.textContent = '';
        cepStatus.className = 'ajuda';
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    renderizarCartas();
    popularUF();

    const campoCEP = document.getElementById('cep');
    const campoTelefone = document.getElementById('telefone');
    const carta = document.getElementById('carta');
    const form = document.getElementById('form-carta');

    campoCEP.addEventListener('input', (e) => {
        mascaraCEP(e.target);
    });

    campoTelefone.addEventListener('input', (e) => {
        mascaraTelefone(e.target);
    });

    campoCEP.addEventListener('blur', (e) => {
        buscarCEP(e.target.value);
    });

    carta.addEventListener('input', atualizarContador);

    document.querySelectorAll('[data-validar]').forEach((campo) => {
        campo.addEventListener('blur', () => validarCampo(campo.id));
    });

    // ENVIO DO FORMULÁRIO
    form.addEventListener('submit', tratarEnvio);

    const menuToggle = document.getElementById('menu-toggle');
    const navPrincipal = document.querySelector('.nav-principal');

    if (menuToggle && navPrincipal) {
        menuToggle.addEventListener('click', () => {
            const aberto = menuToggle.classList.toggle('aberto');
            navPrincipal.classList.toggle('aberto', aberto);
            menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        });

        navPrincipal.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('aberto');
                navPrincipal.classList.remove('aberto');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // MODAL DE POLÍTICA DE PRIVACIDADE
    const linksPolitica = document.querySelectorAll('.link-politica');
    const modalPolitica = document.getElementById('modal-politica');
    const fecharPolitica = document.getElementById('fechar-politica');
    const aceitarPolitica = document.getElementById('aceitar-politica');

    // Preenche a data de atualização
    const dataEl = document.getElementById('data-atualizacao-politica');
    if (dataEl) {
        dataEl.textContent = new Date().toLocaleDateString('pt-BR');
    }

    function abrirModal() {
        if (!modalPolitica) return;
        modalPolitica.classList.add('ativo');
        document.body.style.overflow = 'hidden';
        fecharPolitica?.focus();
    }

    function fecharModal() {
        if (!modalPolitica) return;
        modalPolitica.classList.remove('ativo');
        document.body.style.overflow = '';
    }

    linksPolitica.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal();
        });
    });

    fecharPolitica?.addEventListener('click', fecharModal);

    aceitarPolitica?.addEventListener('click', () => {
        const checkbox = document.getElementById('consentimento');
        if (checkbox) {
            checkbox.checked = true;
            validarCampo('consentimento');
        }
        fecharModal();
    });

    modalPolitica?.addEventListener('click', (e) => {
        if (e.target === modalPolitica) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalPolitica?.classList.contains('ativo')) {
            fecharModal();
        }
    });

    // CHECKBOX DE CONSENTIMENTO

    const checkboxConsentimento = document.getElementById('consentimento');
    if (checkboxConsentimento) {
        checkboxConsentimento.addEventListener('change', () => {
            validarCampo('consentimento');
        });
    }
});