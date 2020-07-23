<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getServiceConfig()
    {
        return array(
//-			'aliases' => array( // !!! aliases not alias
//-				'Zend\Authentication\AuthenticationService' => 'doctrine_authenticationservice', // aliases can be overwriten
//-			),
            'factories' => array(
                // taken from DoctrineModule on GitHub
                // Please note that Iam using here a Zend\Authentication\AuthenticationService name, but it can be anything else
                // However, using the name Zend\Authentication\AuthenticationService will allow it to be recognised by the ZF2 view helper.
                // the configuration of doctrine.authenticationservice.orm_default is in module.config.php
                'Zend\Authentication\AuthenticationService' => function($serviceManager) {
//-				'doctrine_authenticationservice'  => function($serviceManager) {
                    // If you are using DoctrineORMModule:
                    return $serviceManager->get('doctrine.authenticationservice.orm_default');

                    // If you are using DoctrineODMModule:
                    //- return $serviceManager->get('doctrine.authenticationservice.odm_default');
                },
                // Add this for SMTP transport
                // ToDo move it ot a separate module CsnMail
                'mail.transport' => function (ServiceManager $serviceManager) {
                    $config = $serviceManager->get('Config');
                    $transport = new Smtp();
                    $transport->setOptions(new SmtpOptions($config['mail']['transport']['options']));
                    return $transport;
                },
            )
        );
    }
}
