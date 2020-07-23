<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    'db' => array(
        'driver' => 'Pdo',
// 'dsn' => 'mysql:dbname=wingman;host=wingman-db.my.phpcloud.com',
        'driver_options' => array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter'
            => 'Zend\Db\Adapter\AdapterServiceFactory',
        ),
        /* Moved to Auth module to allow to be replaced by Doctrine or other.
        // added for Authentication and Authorization. Without this each time we have to create a new instance.
        // This code should be moved to a module to allow Doctrine to overwrite it
        'aliases' => array( // !!! aliases not alias
            'Zend\Authentication\AuthenticationService' => 'my_auth_service',
        ),
        'invokables' => array(
            'my_auth_service' => 'Zend\Authentication\AuthenticationService',
        ),
        */
    ),

    'static_salt' => '', // was moved from module.config.php here to allow all modules to use it

//    'jwt_config' => array(
//       'private_key_path' => 'private key path',
//       'public_key_path' => "public key path",
//        'password' => 'some_password',
//    )

    'directory_path' => array(
        'profile_image' => getcwd() . '/public/thumb/profile_image/',
        'temp_profile_image' => getcwd() . '/data/temp_profile_image/',
    ),
    'site_url' => 'http://buddhajonesapi.localhost/'
);
