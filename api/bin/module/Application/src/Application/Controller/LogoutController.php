<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;
use Zend\Mail;


class LogoutController extends AbstractRestfulController
{
    protected $_em;
    protected $_userRepository;

    public function onDispatch(MvcEvent $e)
    {
        $this->_em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->_userRepository = $this->_em->getRepository('Application\Entity\RediUser');

        $this->getResponse()->getHeaders()
            // can be accessed by origin
            ->addHeaderLine('Access-Control-Allow-Origin','*')
            // set allow methods
            ->addHeaderLine('Access-Control-Allow-Methods','POST,PUT,DELETE,GET,OPTIONS')
            // set allow headers
            ->addHeaderLine('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
            // allow credentials
            ->addHeaderLine('Access-Control-Allow-Credential', 'true');

        return parent::onDispatch($e);
    }

    public function getList()
    {
        $auth = $this->getServiceLocator()->get('Zend\Authentication\AuthenticationService');

//        if ($auth->hasIdentity()) {
//            $identity = $auth->getIdentity();
//        }

        $auth->clearIdentity();

        return new JsonModel(array('status' => 1, 'message' => 'Logout successful'));
    }

    public function get($id)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function update($id, $data)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function delete($id)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }
    
    public function create($data)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function options()
    {
        $response = $this->getResponse();
        $headers  = $response->getHeaders();

        $headers->addHeaderLine('Allow', implode(',', array(
            'GET',
            'POST',
            'PUT',
        )));
        return $response;
    }

}
