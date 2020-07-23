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

class EstimateTypeController extends CustomAbstractActionController
{
    public function getList()
    {
        $filter['active'] = $this->getRequest()->getQuery('active', null);

        $data = $this->_estimateRepo->searchEstimateType($filter);

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
        $status = (int)(isset($data['status']) ? $data['status'] : 1);


        if ($name) {
            $estimateType = new RediEstimateType();
            $estimateType->setName($name);
            $estimateType->setStatus($status);

            $this->_em->persist($estimateType);
            $this->_em->flush();

            $estimateTypeId = $estimateType->getId();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => array(
                    'id' => $estimateTypeId
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
        $status = isset($data['status']) ? $data['status'] : null;

        $estimateType = $this->_estimateTypeRepository->find($id);


        if ($estimateType) {
            if ($name) {
                $estimateType->setName($name);
            }

            if ($status!==null) {
                $estimateType->setStatus($status);
            }

            $this->_em->persist($estimateType);
            $this->_em->flush();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.'
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Estimate type entry not found.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

}
