# Plano de Testes de Software

O plano de testes apresenta os cenários de testes utilizados na realização dos testes do formulário de inscrição da aplicação Psicohelp. Os cenários escolhidos demonstram os requisitos funcionais sendo atendidos através de validações de navegação, formatação de dados, campos obrigatórios, interface e submissão do formulário.

Os testes funcionais a serem realizados na aplicação são descritos a seguir:

---

## 1. TESTES DE NAVEGAÇÃO ENTRE ETAPAS

|Caso de Teste    | CT-01 - Avançar para próxima etapa com dados válidos |
|:---|:---|
| Requisitos Associados | RF-001 - O sistema deve permitir navegação entre etapas do formulário<br>RF-002 - O sistema deve validar campos obrigatórios antes de avançar |
| Objetivo do Teste | Verificar se o usuário consegue avançar entre as etapas ao preencher todos os campos obrigatórios corretamente |
| Passos | 1. Acessar o formulário de inscrição<br>2. Preencher campo "Nome completo" com "Maria da Silva Santos"<br>3. Preencher campo "CPF" com "123.456.789-00"<br>4. Preencher "Data de nascimento" com "15/03/1990"<br>5. Selecionar opção "Feminino" em Sexo<br>6. Clicar no botão "Próximo" |
| Critérios de êxito | - Formulário avança para Etapa 2 (Contato)<br>- Barra de progresso atualiza para 33%<br>- Step 1 fica marcado como "completed" (verde)<br>- Step 2 fica "active"<br>- Botão "Voltar" aparece<br>- Animação de fadeIn é exibida<br>- Scroll da página vai para o topo |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-02 - Bloquear avanço com campos obrigatórios vazios |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios antes de avançar<br>RF-003 - O sistema deve exibir mensagens de erro para campos inválidos |
| Objetivo do Teste | Validar que o sistema impede o avanço para próxima etapa quando campos obrigatórios não são preenchidos |
| Passos | 1. Acessar o formulário de inscrição (Etapa 1)<br>2. Deixar todos os campos vazios<br>3. Clicar no botão "Próximo" |
| Critérios de êxito | - Sistema não avança para Etapa 2<br>- Campos obrigatórios recebem classe CSS "error"<br>- Mensagens de erro aparecem abaixo dos campos vazios<br>- Borda dos inputs fica vermelha (cor: var(--error))<br>- Usuário permanece na Etapa 1 |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-03 - Retornar à etapa anterior mantendo dados |
|:---|:---|
| Requisitos Associados | RF-001 - O sistema deve permitir navegação entre etapas do formulário<br>RF-004 - O sistema deve manter dados preenchidos ao navegar entre etapas |
| Objetivo do Teste | Verificar se a navegação reversa funciona corretamente e mantém os dados previamente preenchidos |
| Passos | 1. Preencher todos os campos da Etapa 1 corretamente<br>2. Clicar em "Próximo" para ir à Etapa 2<br>3. Clicar no botão "Voltar" |
| Critérios de êxito | - Formulário retorna para Etapa 1<br>- Todos os dados previamente preenchidos permanecem salvos nos campos<br>- Barra de progresso volta para 0%<br>- Step 1 volta para estado "active"<br>- Botão "Voltar" desaparece (display: none)<br>- Scroll da página vai para o topo suavemente |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-04 - Fluxo completo de inscrição |
|:---|:---|
| Requisitos Associados | RF-001 - O sistema deve permitir navegação entre etapas<br>RF-005 - O sistema deve processar inscrição completa<br>RF-006 - O sistema deve gerar número de protocolo |
| Objetivo do Teste | Testar o fluxo completo do formulário desde a primeira etapa até a confirmação final |
| Passos | 1. Preencher todos os campos da Etapa 1 e clicar "Próximo"<br>2. Preencher todos os campos da Etapa 2 e clicar "Próximo"<br>3. Preencher todos os campos da Etapa 3 e clicar "Próximo"<br>4. Preencher todos os campos da Etapa 4<br>5. Marcar checkbox "Li e concordo com os termos"<br>6. Clicar em "Confirmar Inscrição" |
| Critérios de êxito | - Cada etapa avança corretamente sem erros<br>- Barra de progresso atualiza: 0% → 33% → 66% → 100%<br>- Botão muda de "Próximo" para "Confirmar Inscrição" na Etapa 4<br>- Tela de sucesso é exibida após confirmação<br>- Protocolo é gerado no formato #PSI-2025-XXXXXX (6 dígitos aleatórios)<br>- Barra de progresso e botões são ocultados na tela de sucesso<br>- Mensagem de confirmação e próximos passos são exibidos |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

## 2. TESTES DE VALIDAÇÃO E FORMATAÇÃO DE CAMPOS

|Caso de Teste    | CT-05 - Máscara de formatação de CPF |
|:---|:---|
| Requisitos Associados | RF-007 - O sistema deve aplicar máscara de formatação automática em campos específicos |
| Objetivo do Teste | Verificar se a máscara de CPF é aplicada automaticamente durante a digitação |
| Passos | 1. Acessar Etapa 1 do formulário<br>2. Clicar no campo "CPF"<br>3. Digitar apenas números: "12345678900" |
| Critérios de êxito | - Valor exibido automaticamente formatado como "123.456.789-00"<br>- Campo aceita no máximo 14 caracteres (incluindo pontos e hífen)<br>- Apenas números são aceitos (letras e símbolos são bloqueados)<br>- Formatação ocorre em tempo real durante a digitação |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-06 - Validação de CPF incompleto |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-003 - O sistema deve exibir mensagens de erro para campos inválidos |
| Objetivo do Teste | Testar se o sistema identifica e bloqueia CPF incompleto ou inválido |
| Passos | 1. Acessar Etapa 1 do formulário<br>2. Preencher campo "CPF" com "123.456" (incompleto)<br>3. Preencher demais campos obrigatórios corretamente<br>4. Clicar em "Próximo" |
| Critérios de êxito | - Campo CPF recebe classe CSS "error"<br>- Mensagem "CPF inválido" aparece abaixo do campo (id="cpf-error")<br>- Borda do input fica vermelha<br>- Formulário não avança para próxima etapa<br>- Foco permanece na Etapa 1 |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-07 - Validação de e-mail inválido |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-003 - O sistema deve exibir mensagens de erro |
| Objetivo do Teste | Verificar se o sistema valida corretamente o formato de e-mail |
| Passos | 1. Avançar para Etapa 2 (Contato)<br>2. Preencher campo "E-mail" com "emailinvalido" (sem @ e domínio)<br>3. Preencher demais campos obrigatórios<br>4. Selecionar ao menos uma forma de contato<br>5. Clicar em "Próximo" |
| Critérios de êxito | - Campo e-mail recebe classe "error"<br>- Mensagem "E-mail inválido" aparece (id="email-error")<br>- Validação HTML5 type="email" pode ser acionada<br>- Formulário não avança<br>- Borda do campo fica vermelha |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-08 - Formatação de telefone celular (11 dígitos) |
|:---|:---|
| Requisitos Associados | RF-007 - O sistema deve aplicar máscara de formatação automática |
| Objetivo do Teste | Validar máscara automática para telefone celular com 9 dígitos (padrão brasileiro) |
| Passos | 1. Avançar para Etapa 2 (Contato)<br>2. Clicar no campo "Telefone/Celular"<br>3. Digitar "21987654321" (11 dígitos) |
| Critérios de êxito | - Valor formatado automaticamente para "(21) 98765-4321"<br>- Campo aceita no máximo 15 caracteres<br>- Apenas números são aceitos<br>- Formatação com 5 dígitos antes do hífen (padrão celular) |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-09 - Formatação de telefone fixo (10 dígitos) |
|:---|:---|
| Requisitos Associados | RF-007 - O sistema deve aplicar máscara de formatação automática |
| Objetivo do Teste | Validar máscara automática para telefone fixo com 8 dígitos |
| Passos | 1. Avançar para Etapa 2 (Contato)<br>2. Clicar no campo "Telefone alternativo"<br>3. Digitar "2133334444" (10 dígitos) |
| Critérios de êxito | - Valor formatado automaticamente para "(21) 3333-4444"<br>- Formatação diferente de celular (4 dígitos após hífen)<br>- Apenas números são aceitos<br>- Máscara detecta automaticamente se é fixo ou celular pelo comprimento |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-10 - Validação de data de nascimento futura |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-008 - O sistema deve validar datas de nascimento válidas |
| Objetivo do Teste | Verificar se o sistema bloqueia datas de nascimento futuras ou inválidas |
| Passos | 1. Acessar Etapa 1 do formulário<br>2. Preencher "Data de nascimento" com data futura (ex: 01/01/2030)<br>3. Preencher demais campos obrigatórios corretamente<br>4. Clicar em "Próximo" |
| Critérios de êxito | - Campo recebe classe "error"<br>- Mensagem "Data inválida" aparece (id="data-error")<br>- Formulário não avança<br>- Validação impede datas futuras |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

## 3. TESTES DE CAMPOS OBRIGATÓRIOS E INTERAÇÕES

|Caso de Teste    | CT-11 - Validação de campo radio button obrigatório |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-009 - O sistema deve validar seleção de radio buttons |
| Objetivo do Teste | Testar validação de campos do tipo radio button (Sexo) |
| Passos | 1. Acessar Etapa 1 do formulário<br>2. Preencher todos os campos de texto obrigatórios (Nome, CPF, Data)<br>3. NÃO selecionar nenhuma opção em "Sexo"<br>4. Clicar em "Próximo" |
| Critérios de êxito | - Alert JavaScript é exibido com mensagem: "Por favor, selecione uma opção"<br>- Formulário não avança para próxima etapa<br>- Usuário permanece na Etapa 1<br>- Foco permanece na tela atual |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-12 - Validação de ao menos uma forma de contato |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-010 - O sistema deve exigir ao menos uma forma de contato selecionada |
| Objetivo do Teste | Verificar obrigatoriedade de seleção de ao menos um checkbox de contato |
| Passos | 1. Avançar para Etapa 2 (Contato)<br>2. Preencher e-mail e telefone corretamente<br>3. NÃO marcar nenhuma opção em "Como prefere ser contatado?" (E-mail, Telefone, WhatsApp)<br>4. Clicar em "Próximo" |
| Critérios de êxito | - Alert JavaScript exibido com mensagem: "Selecione pelo menos uma forma de contato"<br>- Formulário não avança para Etapa 3<br>- Usuário permanece na Etapa 2<br>- Validação específica para checkboxes funciona |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-13 - Validação do checkbox de aceite de termos |
|:---|:---|
| Requisitos Associados | RF-002 - O sistema deve validar campos obrigatórios<br>RF-011 - O sistema deve exigir aceite dos termos e LGPD |
| Objetivo do Teste | Verificar obrigatoriedade de aceite dos termos de uso e política de privacidade |
| Passos | 1. Navegar até Etapa 4 (Preferências)<br>2. Preencher todos os campos obrigatórios (Faixa etária, Urgência)<br>3. NÃO marcar o checkbox "Li e concordo com os termos"<br>4. Clicar em "Confirmar Inscrição" |
| Critérios de êxito | - Alert exibido com mensagem: "Você deve concordar com os termos para continuar"<br>- Formulário não é submetido<br>- Tela de sucesso não é exibida<br>- Usuário permanece na Etapa 4 |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

## 4. TESTES DE INTERFACE E USABILIDADE

|Caso de Teste    | CT-16 - Barra de progresso visual |
|:---|:---|
| Requisitos Associados | RF-014 - O sistema deve exibir progresso visual do formulário |
| Objetivo do Teste | Verificar atualização correta da barra de progresso durante navegação |
| Passos | 1. Acessar formulário (Etapa 1)<br>2. Observar barra de progresso (deve estar em 0%)<br>3. Avançar para Etapa 2<br>4. Observar barra de progresso (deve estar em 33%)<br>5. Avançar para Etapa 3<br>6. Observar barra de progresso (deve estar em 66%)<br>7. Avançar para Etapa 4<br>8. Observar barra de progresso (deve estar em 100%) |
| Critérios de êxito | - Linha de progresso (#progressLine) atualiza width corretamente<br>- Cálculo: ((etapa - 1) / (totalSteps - 1)) * 100<br>- Transição suave (transition: width 0.3s ease)<br>- Cor da linha: var(--success) - verde<br>- Steps completados ficam verdes, step ativo destacado |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-17 - Responsividade em dispositivos móveis |
|:---|:---|
| Requisitos Associados | RF-015 - O sistema deve ser responsivo para diferentes dispositivos |
| Objetivo do Teste | Verificar adaptação do layout para telas menores (mobile) |
| Passos | 1. Acessar formulário em dispositivo móvel ou usar DevTools (max-width: 600px)<br>2. Navegar pelas 4 etapas<br>3. Testar todos os campos de entrada<br>4. Observar botões e layout |
| Critérios de êxito | - Grid-2 muda para coluna única (grid-template-columns: 1fr)<br>- Card padding reduz para 24px<br>- Botões ficam em coluna (flex-direction: column)<br>- Barra de progresso tem overflow-x: auto<br>- Step labels reduzem para 11px<br>- Todos os campos permanecem funcionais e legíveis |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

## 5. TESTES DE SUBMISSÃO E FINALIZAÇÃO

|Caso de Teste    | CT-21 - Geração de número de protocolo |
|:---|:---|
| Requisitos Associados | RF-006 - O sistema deve gerar número de protocolo único<br>RF-018 - O protocolo deve seguir padrão #PSI-2025-XXXXXX |
| Objetivo do Teste | Verificar se o protocolo é gerado corretamente após submissão |
| Passos | 1. Preencher todas as 4 etapas corretamente<br>2. Marcar checkbox de termos<br>3. Clicar em "Confirmar Inscrição"<br>4. Observar tela de sucesso |
| Critérios de êxito | - Protocolo é gerado no formato #PSI-2025-XXXXXX<br>- XXXXXX é número aleatório de 6 dígitos<br>- Número está entre 100000 e 999999<br>- Protocolo é exibido em elemento com classe "protocol"<br>- Código: Math.floor(100000 + Math.random() * 900000) |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-22 - Exibição da tela de sucesso |
|:---|:---|
| Requisitos Associados | RF-005 - O sistema deve confirmar inscrição realizada<br>RF-019 - O sistema deve exibir próximos passos |
| Objetivo do Teste | Validar que a tela de sucesso é exibida corretamente após submissão |
| Passos | 1. Completar todo o formulário (4 etapas)<br>2. Clicar em "Confirmar Inscrição"<br>3. Observar mudança de interface |
| Critérios de êxito | - Form sections são ocultadas (class active removida)<br>- Section success é exibida (data-section="success")<br>- Ícone de sucesso (✓) aparece em círculo verde<br>- Título "Inscrição Realizada com Sucesso!" é exibido<br>- Protocolo é mostrado<br>- Alert com próximos passos aparece<br>- Barra de progresso é ocultada (display: none)<br>- Botões de navegação são ocultados |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

|Caso de Teste    | CT-23 - Botão "Voltar para Início" na tela de sucesso |
|:---|:---|
| Requisitos Associados | RF-020 - O sistema deve permitir retorno à página inicial após inscrição |
| Objetivo do Teste | Testar funcionalidade do botão de retorno na tela de sucesso |
| Passos | 1. Completar inscrição até visualizar tela de sucesso<br>2. Clicar no botão "Voltar para Início" |
| Critérios de êxito | - Botão redireciona para index.html<br>- window.location.href é alterado<br>- Navegação funciona corretamente<br>- Formulário pode ser preenchido novamente em nova sessão |
| Responsável pela elaboração do caso de Teste | [Nome do integrante] |

---

## Links Úteis

- [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
- [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
- [Criação e Geração de Planos de Teste de Software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
- [Ferramentas de Test para Java Script](https://geekflare.com/javascript-unit-testing/)
- [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)

# Template padrão da Aplicação

Layout padrão do site (HTML e CSS) que será utilizado em todas as páginas com a definição de identidade visual, aspectos de responsividade e iconografia.

[Apresente a estrutura padrão da sua aplicação.]

> **Links Úteis**:
>
> - [CSS Website Layout (W3Schools)](https://www.w3schools.com/css/css_website_layout.asp)
> - [Website Page Layouts](http://www.cellbiol.com/bioinformatics_web_development/chapter-3-your-first-web-page-learning-html-and-css/website-page-layouts/)
> - [Perfect Liquid Layout](https://matthewjamestaylor.com/perfect-liquid-layouts)
> - [How and Why Icons Improve Your Web Design](https://usabilla.com/blog/how-and-why-icons-improve-you-web-design/)
