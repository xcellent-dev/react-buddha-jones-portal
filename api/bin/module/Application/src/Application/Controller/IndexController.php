<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class IndexController extends AbstractRestfulController
{
    public function getList()
    {
        return new JsonModel(array('status' => 0, 'message' => 'no reposne'));
    }

    public function get($id)
    {

        return new JsonModel(array('status' => 0, 'message' => 'no reposne'));
    }
    
    public function create($data)
    {
        return new JsonModel(array('status' => 0, 'message' => 'no reposne'));
    }

    public function update($id, $data)
    {
        return new JsonModel(array('status' => 0, 'message' => 'no reposne'));
    }

    public function delete($id)
    {
        return new JsonModel(array('status' => 0, 'message' => 'no reposne'));
    }

//    // configure response
//    public function getResponseWithHeader()
//    {
//        $response = $this->getResponse();
//        $response->getHeaders()
//            //make can accessed by *
//            ->addHeaderLine('Access-Control-Allow-Origin','*')
//            //set allow methods
//            ->addHeaderLine('Access-Control-Allow-Methods','POST PUT DELETE GET');
//
//        return $response;
//    }
}
