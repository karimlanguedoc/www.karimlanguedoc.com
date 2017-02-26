<?php
session_start();

require_once($_SERVER['DOCUMENT_ROOT'] . '/inc/utilities/Strings.php');
require_once('Globals.php');

class User extends Globals
{
    /**
    * And array of returned data
    * @var array
    **/
    private $_data = array();

    public function __construct($userid = 0)
    {
        // TODO: 
    }

    /**
    * Return response data
    * return type: array
    **/
    public function getData()
    {
        return $this->_data;
    }
}
?>