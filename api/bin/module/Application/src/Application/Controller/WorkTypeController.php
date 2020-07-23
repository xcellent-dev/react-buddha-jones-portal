<?php

namespace Application\Controller;

use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class WorkTypeController extends CustomAbstractActionController
{
    public function getList()
    {
        $data = $this->_workTypeRepository->findAll();

        $response = array();

        foreach($data as $row) {
            $response[] = array(
                'id' => $row->getId(),
                'workType' => $row->getWorkType()
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
