# Jogo de batalha
    Joguinho simples feito em JavaScript para rodar online com recursos de WebSocket em PHP.

# Campo de batalha
![](readme_files/battlefield.gif)

# Informações
Necessário PHP, Composer e Ratchet
Para executar servidor WebSocket é necessário o PHP instalado.  
Também é necessário Composer do PHP instalado para poder baixar o Ratchet (usado para o WebSocket).  

*******

Instalação PHP:
Instale o Visual C: https://aka.ms/vs/17/release/vc_redist.x64.exe
Acesse a pagina pra baixar o PHP: https://windows.php.net/download#php-8.4
Baixar o arquivo .zip, extrair na Unidade C e renomear a pasta para o nome e versão do PHP selecionado.
Ex.: php84
Vá em Variaveis de Ambiente e dentro da variavel PATH aponte o novo caminho que acabou de criar.
Ex.: C:\php84

Testar no Powershell com o comando: php -v
Se não funcionar talvez seja necessária a reinicialização do sistema.

Instalação do Composer:
Baixe o instalador .exe pelo link: https://getcomposer.org/
Siga os passos do instalador apenas Next-Next como qualquer outro.
Após instalar, abra o Powershell no caminho raiz do projeto e execute o comando:
composer require cboden/ratchet
Assim deverá baixar as dependencias do Ratchet para o projeto.
Se já houver composer.json, composer.lock e a pasta vendor no seu projeto, remova antes de executar o comando

*******

Para executar servidor PHP no terminal (maquina local):  
    php -S localhost:8000  

Para executar servidor PHP no terminal, navegue até o diretorio do projeto, local do arquivo index (rede local):  
    php -S (IP da maquina):8000  
    Ex.: (caminho)\RPGBattleI-WebSocket> php -S 10.0.0.103:8000  
    Com isso é possível executar o servidor WebSocket e também acessar o arquivo index direto pelo IP.  
    A maquina que está rodadndo o PHP se torna servidor Web e pode ser acessada por outras maquinas na rede.  

Para executar servidor WebSocket no terminal (em outro terminal):  
    (caminho)\RPGBattleI-WebSocket\WebSocketServer> php Server.php  

Depois de ter os serviços rodando (PHP e WebSocket) é só entrar no navegador e inserir o endereço do PHP  
    Ex.: http://(IP da maquina):8000/  

# Ajustes e problemas gerais

Correções:  
    Defesa não desabilita quando stamina acaba (animação somente)  

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
