<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/inc/utilities/Strings.php');

abstract class GeneralAPI
{
    /**
    * Container for cleaned $_REQUEST data
    * @var array
    **/
    protected $_data = array();

    /**
    * Request Method Type (POST, GET, PUT, DELETE)
    * @var string
    **/
    protected $_method = "";

    protected function __construct()
    {
        $this->_method = $_SERVER['REQUEST_METHOD'];

        if ($this->_method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER))
        {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE')
                $this->_method = "DELETE";
            else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT')
                $this->_method = "PUT";
            else
                $this->_method = "";
        }

        switch($this->_method)
        {
            case "POST":
                $this->_data = $this->_cleanData($_POST);
                break;
            case "GET":
                $this->_data = $this->_cleanData($_GET);
                break;
            case "PUT":
                parse_str(file_get_contents("php://input"), $this->_data);
				$this->_data = $this->_cleanData($this->_data);
                break;
            case "DELETE":
            default:
                header('Allow: GET, PUT, POST');
                $this->_response(array("message"=> HTTP_INVALID_METHOD. ": " . $this->_method), 405);
                break;
        }
    }
    
    private function _cleanData($dirtyData)
    {
        $cleanData = array();

        if (is_array($dirtyData))
        {
            foreach ($dirtyData as $key => $value)
                $cleanData[$key] = $this->_cleanData($value);
        }
        else
        {
            $cleanData = trim(strip_tags($dirtyData));
        }

        return $cleanData;
    }

    private function _getStatusCode($code)
    {
        $status = array(  
            200 => HTTP_OK,
            204 => HTTP_NO_CONTENT,
            401 => HTTP_NOT_AUTHORIZED,
            404 => HTTP_NOT_FOUND,   
            405 => HTTP_INVALID_METHOD,
            409 => HTTP_CONFLICT,
            500 => HTTP_SERVER_ERROR,
        );

        return ($status[$code]) ? $status[$code] : $status[500];
    }

    protected function _response($data, $status = 200) 
    {
        $responseData = $data;
        if (!is_array($responseData))
            $responseData = array("message"=>$responseData);

        header("HTTP/1.1 " . $status . " " . $this->_getStatusCode($status));

        echo json_encode($responseData);
    }

    protected function processAPI() 
    {
        $function = strtolower(trim(str_replace("/","",$_REQUEST['action'])));

        if((int)method_exists($this, $function) > 0)
        {
            $this->$function($this->_data);
            exit;
        }

        $this->_response(HTTP_NOT_FOUND, 404);
    }
}
?>