# Jogo de batalha
    Joguinho simples feito em javascript para rodar online com recursos de WebSocket em PHP

# Campo de batalha
![](readme_files/battlefield.gif)

# Informações
Para executar servidor WebSocket é necessário o PHP instalado.  
Também é necessário Composer do PHP intalado para poder baixar o Ratchet (usado para o WebSocket).  

*******
Para executar servidor PHP no terminal (maquina local):  
    1. php -S localhost:8000  

Para executar servidor PHP no terminal, navegue até o diretorio do projeto, local do arquivo index (rede local):  
    1. php -S (IP da maquina):8000  
    2. Ex.: (caminho)\RPGBattleI-WebSocket\WebSocketServer>php -S 10.0.0.103:8000  
    3. Com isso é possível executar o servidor WebSocket e também acessar o arquivo index direto pelo IP.  
    4. A maquina que está rodadndo o PHP se torna servidor Web e pode ser acessada por outras maquinas na rede.  

Para executar servidor WebSocket no terminal (em outro terminal):  
    1. (caminho)\RPGBattleI-WebSocket\WebSocketServer> php Server.php  

Depois de ter os serviços rodando (PHP e WebSocket) é só entrar no navegador e inserir o endereço do PHP  
    1. Ex.: http://(IP da maquina):8000/  

*******

# Ajustes e problemas gerais
*******
Correções:  
    1. Defesa não desabilita quando stamina acaba (animação somente)  

Melhorias:  
    1. Velocidade de movimento do ataque deve ser somada a velocidade do personagem (andando e correndo)  
    2. Respawn após morrer  
    3. Sons e musica de fundo  
    4. Obstaculos (objetos e paredes)  
    5. Coletáveis  
    6. Sistema de upgrade de atributos  
    7. Sistema de upgrade de habilidades  
    8. Chat deve mostrar mensagens com balão de fala em cima do personagem  
    9. Criar equipes  
    10. Criar bots para o campo de batalha  
*******