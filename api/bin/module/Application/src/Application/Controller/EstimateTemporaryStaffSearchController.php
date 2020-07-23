<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateHistory;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediEstimateType;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class EstimateTemporaryStaffSearchController extends CustomAbstractActionController
{
    public function getList()
    {
        $length = (int)trim($this->getRequest()->getQuery('length', 10));
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));

        $data = $this->_estimateRepo->searchEstimateTemporaryStaff($filter, $length);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );

        return new JsonModel($response);
    }

}
