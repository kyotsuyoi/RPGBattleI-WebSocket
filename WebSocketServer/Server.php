<?php

require_once(dirname(__DIR__) . '/vendor/autoload.php');
require_once(dirname(__DIR__) . '/WebSocketServer/WSManager.php');

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MyApp\WSManager;

$server = IoServer::Factory(
    new HttpServer(
        new WsServer(
            new WSManager()
        )
        ), 8085
);

$server->run();