<?php
return array(
    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\SQLSrv\Driver',
                'params' => array(
                    'host'     => 'RIZWAN-PC\SQLEXPRESS',
                    'port'     => '1433',
                    'user'     => 'redi',
                    'password' => '123456',
                    'dbname'   => 'd2',
//                    'charset'  => 'utf8',
//                    'driverOptions' => array(
//                        1002 => 'SET NAMES utf8'
//                    )
                )
            )
        )
    ),
);
