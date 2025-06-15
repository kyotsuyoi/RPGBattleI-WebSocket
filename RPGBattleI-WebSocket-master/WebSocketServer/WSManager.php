<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WSManager implements MessageComponentInterface {
    protected $clients;
    protected $players = array();

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        echo "WS Server is online\n";
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
                        'state' => $json->state, 
                        'attributes_values' => $json->attributes_values, 
                        'good_status' => $json->good_status, 
                        'bad_status' => $json->bad_status]
                    ));                   
                }  
                
                if($json->type === 'action_attack'){
                    $client->send(json_encode(
                        ['type' => 'action_attack', 
                        'id' => $from->resourceId, 
                        'damage_id' => $json->damage_id, 
                        'attack_type' => $json->attack_type,
                        'attributes_values' => $json->attributes_values]
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
                        'stamina_result' => $json->stamina_result,
                        'stun' => $json->stun]
                    ));
                    //echo "Type: {$json->type} from ID:{$from->resourceId} to ID: {$json->id}\n";                
                } 

                if($json->type === 'action_damage_finish'){
                    $client->send(json_encode(
                        ['type' => 'action_damage_finish', 
                        'id' => $json->id, 
                        'damage_id' => $json->damage_id]
                    ));               
                } 

                if($json->type === 'action_damage_update'){
                    $client->send(json_encode(
                        ['type' => 'action_damage_update', 
                        'id' => $json->id, 
                        'damage_id' => $json->damage_id, 
                        'side' => $json->side]
                    ));    
                    echo "Type: {$json->type} ({$json->side}) from ID:{$from->resourceId} to ID: {$json->id}\n";            
                }

                if($json->type === 'set_bad_status'){
                    $client->send(json_encode(
                        ['type' => 'set_bad_status', 
                        'sender_id' => $json->sender_id,
                        'id' => $json->id, 
                        'damage_type' => $json->damage_type]
                    ));   
                    echo "Type: {$json->type} ({$json->damage_type}) from ID:{$from->resourceId} to ID: {$json->id}\n";            
                } 

                if($json->type === 'set_good_status'){
                    $client->send(json_encode(
                        ['type' => 'set_good_status', 
                        'sender_id' => $json->sender_id,
                        'id' => $json->id, 
                        'damage_type' => $json->damage_type]
                    ));   
                    echo "Type: {$json->type} ({$json->damage_type}) from ID:{$from->resourceId} to ID: {$json->id}\n";            
                } 

                if($json->type === 'action_restore'){
                    $client->send(json_encode(
                        ['type' => 'action_restore', 
                        'id' => $json->id, 
                        'result' => $json->result, 
                        'restore_type' => $json->restore_type]
                    ));             
                } 

                if($json->type === 'login_complete'){

                    //send new info for all other connections
                    foreach ($this->players as $key => $player) {
                        if ($player['id'] == $from->resourceId) {                    
                    
                            $client->send(json_encode([
                                'type' => 'login_wellcome', 
                                'id' => $player['id'], 
                                'color' => $player['color'], 
                                'x' => $player['x'],
                                'y' => $player['y'],
                                'user_name' => $player['user_name'], 
                                'gender' => $player['gender'], 
                                'character_class' => $player['character_class'],
                                'state' => $player['state'],
                                'attributes_values' => $player['attributes_values'],
                                'good_status' => $player['good_status'],
                                'bad_status' => $player['bad_status']
                            ]));                            
                        }
                    }                
                } 
            }

            //To save actual state for the player (login only)
            if ($from === $client) {
                if($json->type === 'login'){

                    //$color = bin2hex(openssl_random_pseudo_bytes(3));
                    $key = getKeyByUserName($json->user_name,$this->players);
                    if($key == -1){
                        array_push($this->players, 
                            ['id' => $from->resourceId, 
                            'user_name' => $json->user_name, 
                            'color' => $json->color, 
                            'x' => $json->x, 
                            'y' => $json->y, 
                            'gender' => $json->gender, 
                            'character_class' => $json->character_class,
                            'state' => '',
                            'attributes_values' => '',
                            'good_status' => '',
                            'bad_status' => '']
                        );
                        
                        $client->send(json_encode([
                            'type' => 'login_complete', 
                            'id' => $from->resourceId, 
                            'color' => $json->color,
                            'x' => $json->x, 
                            'y' => $json->y, 
                            'user_name' => $json->user_name, 
                            'gender' => $json->gender, 
                            'character_class' => $json->character_class,
                            'state' => '',
                            'attributes_values' => '',
                            'good_status' => '',
                            'bad_status' => ''
                        ])); 
                        
                        echo ('ID:'.$from->resourceId.' login:'. $json->user_name . " - <login> \n");  

                    } else {
                        
                        if($this->players[$key]['id'] != 0){
                            $client->send(json_encode([
                                'type' => 'login_refused',
                                'message' => 'This login ID is in use'
                            ])); 
                            return;
                        }
                        $this->players[$key]['id'] = $from->resourceId;                        

                        $client->send(json_encode([
                            'type' => 'login_complete', 
                            'id' => $this->players[$key]['id'], 
                            'color' => $this->players[$key]['color'], 
                            'x' => $this->players[$key]['x'], 
                            'y' => $this->players[$key]['y'], 
                            'user_name' => $this->players[$key]['user_name'], 
                            'gender' => $this->players[$key]['gender'], 
                            'character_class' => $this->players[$key]['character_class'],
                            'state' => $this->players[$key]['state'],
                            'attributes_values' => $this->players[$key]['attributes_values'],
                            'good_status' => $this->players[$key]['good_status'],
                            'bad_status' => $this->players[$key]['bad_status']
                        ])); 

                        echo ('ID:'.$from->resourceId.' login:'. $json->user_name . " - <relogin> \n");  
                    } 
                    
                    //get all players info and send to the new logged user
                    foreach ($this->clients as $inner_client) {
                        if ($inner_client->resourceId !== $client->resourceId) {

                            foreach ($this->players as $player) {
                                if ($player['id'] == $inner_client->resourceId) {
                                    $inner_user_name = $player['user_name'];
                                    $inner_color = $player['color'];
                                    $inner_x = $player['x'];
                                    $inner_y = $player['y'];
                                    $inner_gender = $player['gender'];
                                    $inner_character_class = $player['character_class'];
                                    $inner_state = $player['state'];
                                    $inner_attributes_values = $player['attributes_values'];
                                    $inner_good_status = $player['good_status'];
                                    //var_dump($player);
                                }
                            }
                            $client->send(json_encode(
                                ['type' => 'get_player', 
                                'id' => $inner_client->resourceId, 
                                'user_name' => $inner_user_name, 
                                'color' => $inner_color, 
                                'x' => $inner_x, 
                                'y' => $inner_y, 
                                'gender' => $inner_gender, 
                                'character_class' => $inner_character_class, 
                                'state' => $inner_state,
                                'attributes_values' => $inner_attributes_values,
                                'good_status' => $inner_good_status]
                            )); 
                        }
                    }               
                } 
            }
        }

        //To save actual state for the player
        if($json->type === 'action'){
            foreach ($this->players as $key => $player) {
                if ($player['id'] == $from->resourceId) {
                    $this->players[$key]['x'] = $json->x;
                    $this->players[$key]['y'] = $json->y;
                    $this->players[$key]['state'] = $json->state;
                    $this->players[$key]['attributes_values'] = $json->attributes_values;                    
                    $this->players[$key]['good_status'] = $json->good_status;
                }
            } 
        }
    }

    public function onClose(ConnectionInterface $conn) {
        
        foreach ($this->clients as $client) {            
            foreach ($this->players as $key => $player) {
                if ($player['id'] == $conn->resourceId) {
                    $this->players[$key]['id'] = 0; 
                    $vKey = $key;
                }
            }
            
            //send the disconnection to all other connections
            $client->send(json_encode(
                ['type' => 'disconnection', 
                'id' => $conn->resourceId, 
                'user_name' => $this->players[$vKey]['user_name']]
            ));
        }
        
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        //var_dump($this->players);
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