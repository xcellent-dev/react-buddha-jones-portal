<?php

namespace Application\Controller;

use Application\Entity\RediBilling;
use Application\Entity\RediBillingActivity;
use Application\Entity\RediBillingEstimate;
use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class BillingStatusController extends CustomAbstractActionController
{
    function getList()
    {
        $data = $this->_billingRepo->getAll();

        $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => $data
            );


        return new JsonModel($response);
    }
}
