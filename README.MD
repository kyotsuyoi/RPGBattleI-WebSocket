# Jogo de batalha
    Joguinho simples feito em javascript para rodar online com recursos de WebSocket em PHP

# Campo de batalha
![](readme_files/battlefield.png)

# Informações
Para executar servidor WebSocket é necessário o PHP instalado.
Também é necessário Composer do PHP intalado para poder baixar o Ratchet (usado para o WebSocket).

Para executar servidor PHP no terminal (maquina local):
    php -S localhost:8000 
Para executar servidor PHP no terminal, navegue até o diretorio do projeto, local do arquivo index (rede local):
    php -S (IP da maquina):8000
    Ex.: (caminho)\RPGBattleI-WebSocket\WebSocketServer>php -S 10.0.0.103:8000
    Com isso é possível executar o servidor WebSocket e também acessar o arquivo index direto pelo IP.
    A maquina que está rodadndo o PHP se torna servidor Web e pode ser acessada por outras maquinas na rede.
Para executar servidor WebSocket no terminal (em outro terminal):
    (caminho)\RPGBattleI-WebSocket\WebSocketServer> php Server.php
Depois de ter os serviços rodando (PHP e WebSocket) é só entrar no navegador e inserir o endereço do PHP
    Ex.: http://(IP da maquina):8000/

# Ajustes e problemas gerais
Correções:
    -Defesa não desabilita quando stamina acaba (animação somente)

Melhorias:
    -Velocidade de movimento do ataque deve ser somada a velocidade do personagem (andando e correndo)
    -Respawn após morrer
    -Sons e musica de fundo
    -Obstaculos (objetos e paredes)
    -Coletáveis
    -Sistema de upgrade de atributos
    -Sistema de upgrade de habilidades
    -Chat deve mostrar mensagens com balão de fala em cima do personagem
    -Criar equipes
    -Criar bots para o campo de batalha
