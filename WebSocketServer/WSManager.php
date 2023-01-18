<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WSManager implements MessageComponentInterface {
    protected $clients;
    protected $players = array();

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        $resourceId = $conn->resourceId;
        echo "New connection id: ({$resourceId})\n";

        $color = bin2hex(openssl_random_pseudo_bytes(3));
        foreach ($this->clients as $client) {
            if ($resourceId === $client->resourceId) {
                // The sender is not the receiver, send to each client connected

                //send socket id for the new connection
                $client->send(json_encode(
                    ['type' => 'first_connection', 
                    'id' => $resourceId, 
                    'color' => $color]
                ));

                array_push($this->players, 
                    ['id' => $resourceId, 
                    'user_name' => null, 
                    'color' => $color, 
                    'x' => 0, 'y' => 0, 
                    'gender' => '',
                    'side' => 'down', 
                    'walking' => false,
                    'running' => false,
                    'attacking' => false,
                    'defending' => false,
                    'attributes_values' => '']
                );
                //var_dump($this->players);

                foreach ($this->clients as $inner_client) {
                    if ($inner_client->resourceId !== $client->resourceId) {

                        foreach ($this->players as $player) {
                            if ($player['id'] == $inner_client->resourceId) {
                                $inner_user_name = $player['user_name'];
                                $inner_color = $player['color'];
                                $inner_x = $player['x'];
                                $inner_y = $player['y'];
                                $inner_gender = $player['gender'];
                                $inner_side = $player['side'];
                                $inner_walking = $player['walking'];
                                $inner_running = $player['running'];
                                $inner_attacking = $player['attacking'];
                                $inner_defending = $player['defending'];
                                $inner_attributes_values = $player['attributes_values'];

                                //var_dump($player);
                            }
                        }
                        //get all players info and send to the new connection
                        $client->send(json_encode(
                            ['type' => 'get_player', 
                            'id' => $inner_client->resourceId, 
                            'user_name' => $inner_user_name, 
                            'color' => $inner_color, 
                            'x' => $inner_x, 
                            'y' => $inner_y, 
                            'gender' => $inner_gender, 
                            'side' => $inner_side, 
                            'walking' => $inner_walking, 
                            'running' => $inner_running, 
                            'attacking' => $inner_attacking, 
                            'defending' => $inner_defending,
                            'attributes_values' => $inner_attributes_values]
                        ));    
                    }
                }
            }
        }    
        
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        //$numRecv = count($this->clients) - 1;
        //var_dump($msg);
        $json = json_decode($msg);

        //echo "Procesing message Type: {$json->type} from ID:{$from->resourceId} \n"; 

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected

                if($json->type === 'chat'){
                    $user_name = getUserNameById($from->resourceId, $this->players);
                    $client->send(json_encode(
                        ['type' => 'chat', 
                        'id' => $from->resourceId,
                        'user_name' => $user_name, 
                        'text' => $json->text]
                    ));

                    // echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
                    // , $from->resourceId, $json->text, $numRecv, $numRecv == 1 ? '' : 's');
                }

                if($json->type === 'action'){
                    $client->send(json_encode(
                        ['type' => 'action', 
                        'id' => $from->resourceId, 
                        'x' => $json->x, 
                        'y' => $json->y, 
                        'side' => $json->side, 
                        'walking' => $json->walking, 
                        'running' => $json->running, 
                        'attacking' => $json->attacking, 
                        'defending' => $json->defending, 
                        'attributes_values' => $json->attributes_values]
                    ));

                    foreach ($this->players as $key => $player) {
                        if ($player['id'] == $from->resourceId) {
                            $this->players[$key]['x'] = $json->x;
                            $this->players[$key]['y'] = $json->y;
                            $this->players[$key]['side'] = $json->side;
                            $this->players[$key]['walking'] = $json->walking;
                            $this->players[$key]['running'] = $json->running;
                            $this->players[$key]['attacking'] = $json->attacking;
                            $this->players[$key]['defending'] = $json->defending;
                            $this->players[$key]['attributes_values'] = $json->attributes_values;
                        }
                    }
                    
                }  
                
                if($json->type === 'action_attack'){
                    $client->send(json_encode(
                        ['type' => 'action_attack', 
                        'id' => $from->resourceId, 
                        'attack_type' => $json->attack_type]
                    ));

                    //echo ('ID:'.$from->resourceId.' send action_attack' . "\n");

                    foreach ($this->players as $key => $player) {
                        if ($player['id'] == $from->resourceId) {
                            $this->players[$key]['attack_type'] = $json->attack_type;
                        }
                    }                    
                } 

                if($json->type === 'action_damage'){
                    $client->send(json_encode(
                        ['type' => 'action_damage', 
                        'id' => $json->id, 
                        'result' => $json->result, 
                        'knockback_side' => $json->knockback_side, 
                        'knockback_val' => $json->knockback_val,
                        'stamina_result' => $json->stamina_result]
                    ));
                    echo "Type: {$json->type} from ID:{$from->resourceId} to ID: {$json->id}\n";                
                } 

                if($json->type === 'login'){

                     //send new info for all other connections
                    foreach ($this->players as $key => $player) {
                        if ($player['id'] == $from->resourceId) {                    
                    
                            $client->send(json_encode([
                                'type' => 'first_connection_wellcome', 
                                'id' => $player['id'], 
                                'color' => $player['color'], 
                                'user_name' => $json->user_name, 
                                'gender' => $json->gender
                            ]));                           
                        }
                    }                
                } 
            }

            if ($from === $client) {
                if($json->type === 'login'){

                    foreach ($this->players as $key => $player) {
                        if ($player['id'] == $from->resourceId) {
                            $this->players[$key]['user_name'] = $json->user_name;
                            $this->players[$key]['x'] = $json->x;
                            $this->players[$key]['y'] = $json->y;
                            $this->players[$key]['gender'] = $json->gender;

                            echo ('ID:'.$from->resourceId.' login:'. $this->players[$key]['user_name'] . "\n");
                        }
                    }                
                } 
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
        
        foreach ($this->clients as $client) {
            
            foreach ($this->players as $key => $player) {
                if ($player['id'] === $conn->resourceId) {
                    $this->players[$key]['id'] == null;
                    //unset($this->players[$key]);
                }
            }
            
            //send the disconnection to all other connections
            $client->send(json_encode(['type' => 'disconnection', 'id' => $conn->resourceId]));
            
        }

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }


}

function getUserNameById($id, $players) {
    foreach($players as $player) {
        if($player['id'] == $id) {
            //var_dump($player);
            return $player['user_name'];
        }
    }
}

function getKeyByUserName($user_name, $players) {    
    foreach ($players as $key => $player) {
        if ($player['user_name'] === $user_name) {
            return $key;
        }
    }
    return -1;
}