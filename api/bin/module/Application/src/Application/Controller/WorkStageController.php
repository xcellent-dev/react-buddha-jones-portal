<?php

namespace Application\Controller;

use Zend\View\Model\JsonModel;

class WorkStageController extends CustomAbstractActionController
{
    public function getList()
    {
        $data = $this->_workStageRepository->findAll(array(), array('parentId' => 'ASC'));

        $response = array();

        foreach($data as $row) {
            $tempItem = array(
                'id' => $row->getId(),
                'name' => $row->getWorkStage()
            );

            if(!$row->getParentId()) {
                $response[$row->getId()] = $tempItem;
            } else {
                $response[$row->getParentId()]['children'][] = $tempItem;
            }
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => array_values($response)
        );


        return new JsonModel($response);
    }




}
