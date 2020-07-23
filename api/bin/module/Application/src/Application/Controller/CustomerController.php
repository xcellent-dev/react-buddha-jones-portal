<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class CustomerController extends CustomAbstractActionController
{
    public function getList()
    {
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
        $filter['first_letter'] = trim($this->getRequest()->getQuery('first_letter', ''));

        $data = $this->_customerRepo->search($offset, $length, $filter);
        $totalCount = $this->_customerRepo->searchCount($filter);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function get($id)
    {
        if($id=='first-letters') {
            $data = $this->_customerRepo->getDistinctCustomerFirstLetter();
        } else {
            $data = $this->_customerRepo->getById($id);
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }


}
