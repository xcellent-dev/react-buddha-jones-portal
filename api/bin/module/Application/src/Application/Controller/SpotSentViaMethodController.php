<?php

namespace Application\Controller;

use Application\Entity\RediProjectHistory;
use Application\Entity\RediSpot;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class SpotSentViaMethodController extends CustomAbstractActionController
{
    public function getList()
    {
        $workTypeId = (int)trim($this->getRequest()->getQuery('work_type_id', 0));

        if ($workTypeId) {
            $data = $this->_spotSentViaMethodRepository->findBy(array('workTypeId' => $workTypeId), array('parentId' => 'ASC'));

            $response = array();

            foreach($data as $row) {
                $tempItem = array(
                    'id' => $row->getId(),
                    'name' => $row->getName()
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

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required parameter (work_type_id).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }
}
