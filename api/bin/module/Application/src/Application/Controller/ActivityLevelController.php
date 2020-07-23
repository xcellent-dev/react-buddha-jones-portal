<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class ActivityLevelController extends CustomAbstractActionController
{
    public function getList()
    {
        $allActivityType = $this->_activityRepo->getAllActivityType();

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $allActivityType,
        );


        return new JsonModel($response);
    }

}
