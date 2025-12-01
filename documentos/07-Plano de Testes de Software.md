# Plano de Testes de Software

[Apresente os cenários de testes a serem utilizados na realização dos testes da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo atendidos. ]


|Caso de teste | Requisitos associados | Objetivo do teste | Passos | Critérios de êxito | Responsável|
| ------------ | --------------------- | ----------------- | ------ | ------------------ | -----------|
| CT-01: Verificar o funcionamento do filtro de pesquisa de instituições | RF-001: O site deve possuir uma funcionalidade de pesquisa, permitindo que o usuário adicione dados (filtros) e busque por instituições. Por meio de filtros de pesquisa, uma lista com as instituições encontradas deverá ser retornada. | Verificar se os campos de filtro de pesquisa estão recebendo os dados inseridos pelo usuário. | 1. Acessar o navegador; 2. Informar o endereço web do site; 3. Abrir a página Home; 4. Clicar no botão: Universidade/Instituição; 5. Escolher no drop-down menu; 6. Escolher o Estado; 7. De acordo com o estado escolhido, verificar se recebe uma lista de cidades daquele estado; 8. Escolher uma cidade; 9. Escolher uma faixa etária; 10. Escolher uma abordagem; 11. Clicar Sim/Não no radio button em relação à necessidade de pronto atendimento; 12. Clicar em “Enviar”; 13. Os dados recebidos serão salvos em um banco de dados. | Os dados informados devem ser recebidos no “console” e devem retornar uma lista filtrada de universidades | Mariana |


|Caso de teste | Requisitos associados | Objetivo do teste | Passos | Critérios de êxito | Responsável|
| ------------ | --------------------- | ----------------- | ------ | ------------------ | -----------|
| CT-02: Verificar a visualização do texto “Sobre nós” | RF-002: O site deve permitir ao usuário a visualização das informações sobre os desenvolvedores. | Verificar se o texto da página aparece corretamente, assim como a logo do site. | 1. Acessar o navegador; 2. Informar o endereço web do site; 3. Abrir a página Home; 4. Clicar no botão: Sobre nós;
5. Visualizar o texto e a logo do site. | A logo do site deverá aparecer sem nenhuma quebra na imagem, assim como o texto deverá aparecer organizado em parágrafos e justificado. | Mariana |

