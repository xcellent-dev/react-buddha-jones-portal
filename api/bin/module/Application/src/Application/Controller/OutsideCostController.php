<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateHistory;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediEstimateType;
use Application\Entity\RediOutsideCost;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class OutsideCostController extends CustomAbstractActionController
{
    public function getList()
    {
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));

        $data = $this->_estimateRepo->searchOutsideCost($filter);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );

        return new JsonModel($response);
    }

    public function create($data)
    {
        $name = trim(isset($data['name']) ? $data['name'] : '');


        if ($name) {
            $outsideCost = new RediOutsideCost();
            $outsideCost->setName($name);

            $this->_em->persist($outsideCost);
            $this->_em->flush();

            $outsideCostId = $outsideCost->getId();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => array(
                    'id' => $outsideCostId
                ),
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function update($id, $data)
    {
        $name = trim(isset($data['name']) ? $data['name'] : '');

        $outsideCost = $this->_outsideCostRepository->find($id);

        if ($outsideCost) {
            if ($name) {
                $outsideCost->setName($name);
            }

            $this->_em->persist($outsideCost);
            $this->_em->flush();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.'
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Entry not found.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
