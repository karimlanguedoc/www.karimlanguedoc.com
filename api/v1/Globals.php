<?php
abstract class Globals
{
    protected function isValidEmail($email)
    {
        $regex = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z]{2,4})$/';
		if (!preg_match($regex, $email))
			return false;

		return true;
    }
}
?>