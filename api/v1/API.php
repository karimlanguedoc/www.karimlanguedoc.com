<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/inc/utilities/Strings.php');
require_once('API.General.php');
require_once('User.php');

class API extends GeneralAPI
{
    /**
    * User class instance
    * @var User
    **/
    private $_user;

    /**
    * Call supers constructor to setup abstract class
    * create ivars for user and content classes
    **/
    public function __construct()
    {
        parent::__construct();
        $this->_user = new User();
        $this->_processAPI();
    }

    /**
    * 
    * 
    **/
    private function _processAPI()
    {
        $function = strtolower(trim(str_replace("/","",$_REQUEST['action'])));

        if((int)method_exists($this, $function) > 0)
        {
            $this->$function($this->_data);
            exit;
        }

        $this->_response(array("message"=>ERROR_INVALID_ACTION), 404);
    }
}

$api = new API;

?>