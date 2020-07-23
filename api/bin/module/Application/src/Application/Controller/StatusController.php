<?php

namespace Application\Controller;

use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class StatusController extends CustomAbstractActionController
{
    public function getList()
    {
        $data = $this->_statusRepository->findAll();

        $response = array();

        foreach($data as $row) {
            $response[] = array(
                'id' => $row->getId(),
                'status' => $row->getStatus()
            );
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $response
        );


        return new JsonModel($response);
    }




}
