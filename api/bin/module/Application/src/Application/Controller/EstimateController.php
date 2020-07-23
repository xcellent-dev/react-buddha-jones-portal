<?php

namespace Application\Controller;

use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateHistory;
use Application\Entity\RediEstimateTemporaryStaff;
use Application\Entity\RediEstimateToOutsideCost;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class EstimateController extends CustomAbstractActionController
{
    public function getList()
    {
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));
        $filter['sort'] = trim($this->getRequest()->getQuery('sort', ''));
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
        $filter['spot_id'] = (int)trim($this->getRequest()->getQuery('spot_id', 0));
        $filter['project_id'] = (int)trim($this->getRequest()->getQuery('project_id', 0));
        $filter['campaign_id'] = (int)trim($this->getRequest()->getQuery('campaign_id', 0));
        $filter['status_id'] = (int)trim($this->getRequest()->getQuery('status_id', 0));
        $filter['customer_id'] = (int)trim($this->getRequest()->getQuery('customer_id', 0));

        $data = $this->_estimateRepo->search($offset, $length, $filter);
        $totalCount = $this->_estimateRepo->searchCount($filter);

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
        $data = $this->_estimateRepo->getById($id);

        if ($data) {
            $imagePath = $this->_siteUrl . 'thumb/profile_image/';

            $data['workers'] = $this->_estimateRepo->getEstimateWorker($id);
            $data['submittedTo'] = $this->_estimateRepo->getSubmittedTo($data['submittedTo']);
            $data['temporaryStaff'] = $this->_estimateRepo->getEstimateTemporaryStaff($id);
            $data['outsideCost'] = $this->_estimateRepo->getEstimateOutsideCost($id);
            $data['history'] = $this->_estimateRepo->getHistoryByEstimateId($id, $imagePath);
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function create($data)
    {
        $spotId = (int)trim(isset($data['spot_id']) ? $data['spot_id'] : '');
        $multiplier = trim(isset($data['multiplier']) ? $data['multiplier'] : '');
        $workers = (array)json_decode(trim(isset($data['workers']) ? $data['workers'] : ''), true);
        $temporaryStaffs = (array)json_decode(trim(isset($data['temporary_staff']) ? $data['temporary_staff'] : ''), true);
        $outsideCosts = (array)json_decode(trim(isset($data['outside_cost']) ? $data['outside_cost'] : ''), true);
        $timeUnit = (isset($data['time_unit']) && in_array($data['time_unit'], array('D', 'H'))) ? strtoupper(trim($data['time_unit'])) : 'H';
        $versionId = isset($data['version_id']) ? (int)trim($data['version_id']) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;
        $submitTo = isset($data['submit_to']) ? (int)$data['submit_to'] : null;
        $statusId = isset($data['status_id']) ? (int)$data['status_id'] : null;
        $totalAmount = isset($data['total_amount']) ? (float)$data['total_amount'] : null;

        $workerList = [];
        $temporaryStaffList = [];
        $outsideCostList = [];
//        $totalEstimate = 0;

        foreach ($workers as $worker) {
            if (isset($worker['worker_id']) && (int)$worker['worker_id']) {
                $user = $this->_userRepository->find($worker['worker_id']);

                if ($user) {
                    $tempWorkerList = [
                        'worker_id' => (int)$worker['worker_id'],
                        'hourly_rate' => (float)$user->getHourlyRate(),
                        'estimated_regular' => isset($worker['estimated_regular']) ? $worker['estimated_regular'] : 0,
                        'estimated_overtime' => isset($worker['estimated_overtime']) ? $worker['estimated_overtime'] : 0,
                        'estimated_doubletime' => isset($worker['estimated_doubletime']) ? $worker['estimated_doubletime'] : 0,
                        'total_amount' => isset($worker['total_amount']) ? $worker['total_amount'] : null
                    ];

                    $workerList[] = $tempWorkerList;
                }
            }
        }


        foreach ($temporaryStaffs as $tempStaff) {
            $name = isset($tempStaff['name']) ? trim($tempStaff['name']) : null;
            $estimatedTime = isset($tempStaff['estimated_time']) ? (float)trim($tempStaff['estimated_time']) : 0;
            $rate = isset($tempStaff['rate']) ? (float)trim($tempStaff['rate']) : 0;
            $staffTotalAmount = isset($tempStaff['total_amount']) ? (float)trim($tempStaff['total_amount']) : null;

            if ($name && $estimatedTime && $rate) {
                $temporaryStaffList[] = array(
                    'name' => $name,
                    'estimated_time' => $estimatedTime,
                    'rate' => $rate,
                    'total_amount' => $staffTotalAmount
                );

            }
        }

        foreach ($outsideCosts as $outsideCost) {
            $outsideCostId = isset($outsideCost['outside_cost_id']) ? (int)trim($outsideCost['outside_cost_id']) : null;
            $cost = isset($outsideCost['cost']) ? (float)trim($outsideCost['cost']) : null;
            $typeId = isset($outsideCost['type_id']) ? (int)trim($outsideCost['type_id']) : null;

            if ($outsideCostId && $cost && $typeId) {
                $outsideCostList[] = array(
                    'outside_cost_id' => $outsideCostId,
                    'cost' => $cost,
                    'type_id' => $typeId
                );

            }
        }


        if ($spotId && $multiplier && count($workerList)) {
            $estimate = new RediEstimate();
            $estimate->setSpotId($spotId);
            $estimate->setMultiplier($multiplier);

            if ($submitTo) {
                $estimate->setSubmittedTo($submitTo);
            }

            if ($statusId) {
                $estimate->setStatusId($statusId);
            }

            $estimate->setTimeUnit($timeUnit);
            $estimate->setVersionId($versionId);
            $estimate->setNotes($notes);

            if ($totalAmount) {
                $estimate->setTotalAmount($totalAmount);
            }

            $estimate->setCreatedAt(new \DateTime('now'));

            $this->_em->persist($estimate);
            $this->_em->flush();

            $estimateId = $estimate->getId();

            // Insert worker list
            foreach ($workerList as $row) {
                $estimateWorker = new RediEstimateToWorker();
                $estimateWorker->setEstimateId($estimateId);
                $estimateWorker->setWorkerId($row['worker_id']);
                $estimateWorker->setHourlyRate($row['hourly_rate']);
                $estimateWorker->setEstimatedRegular($row['estimated_regular']);
                $estimateWorker->setEstimatedOvertime($row['estimated_overtime']);
                $estimateWorker->setEstimatedDoubletime($row['estimated_doubletime']);
                $estimateWorker->setTotalAmount($row['total_amount']);

                $this->_em->persist($estimateWorker);
            }

            // Insert temporary staff for estimate
            foreach ($temporaryStaffList as $row) {
                $estimateTemporaryStaff = new RediEstimateTemporaryStaff();
                $estimateTemporaryStaff->setEstimateId($estimateId);
                $estimateTemporaryStaff->setName($row['name']);
                $estimateTemporaryStaff->setEstimatedTime($row['estimated_time']);
                $estimateTemporaryStaff->setRate($row['rate']);
                $estimateTemporaryStaff->setTotalAmount($row['total_amount']);

                $this->_em->persist($estimateTemporaryStaff);
            }

            // Insert outside cost for estimate
            foreach ($outsideCostList as $row) {
                $estimateToOutsideCost = new RediEstimateToOutsideCost();
                $estimateToOutsideCost->setEstimateId($estimateId);
                $estimateToOutsideCost->setOutsideCostId($row['outside_cost_id']);
                $estimateToOutsideCost->setCost($row['cost']);
                $estimateToOutsideCost->setTypeId($row['type_id']);

                $this->_em->persist($estimateToOutsideCost);
            }

            $this->_em->flush();

            // estimate history
            $historyMessage = 'created estimate';
            $estimateHistory = new RediEstimateHistory();
            $estimateHistory->setEstimateId($estimateId);
            $estimateHistory->setUserId($this->_user_id);
            $estimateHistory->setMessage($historyMessage);
            $estimateHistory->setCreatedAt(new \DateTime('now'));
            $this->_em->persist($estimateHistory);
            $this->_em->flush();

            // Update total and hour value in estimate worker and temporary staff table
            $this->_estimateRepo->updateEstimateHourAndTotal($estimateId);

            $responseData = $this->_estimateRepo->getById($estimate->getId());

            if ($responseData) {
                $imagePath = $this->_siteUrl . 'thumb/profile_image/';

                $responseData['workers'] = $this->_estimateRepo->getEstimateWorker($estimate->getId());
                $responseData['submittedTo'] = $this->_estimateRepo->getSubmittedTo($responseData['submittedTo']);
                $responseData['temporaryStaff'] = $this->_estimateRepo->getEstimateTemporaryStaff($estimate->getId());
                $responseData['outsideCost'] = $this->_estimateRepo->getEstimateOutsideCost($estimate->getId());
                $responseData['history'] = $this->_estimateRepo->getHistoryByEstimateId($estimate->getId(), $imagePath);
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => $responseData,
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
        $spotId = isset($data['spot_id']) ? (int)$data['spot_id'] : null;
        $multiplier = isset($data['multiplier']) ? $data['multiplier'] : null;
        $versionId = isset($data['version_id']) ? (int)trim($data['version_id']) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;
        $submitTo = isset($data['submit_to']) ? (int)$data['submit_to'] : null;
        $statusId = isset($data['status_id']) ? (int)$data['status_id'] : null;
        $totalAmount = isset($data['total_amount']) ? (float)$data['total_amount'] : null;
        $temporaryStaffs = (array)json_decode(trim(isset($data['temporary_staff']) ? $data['temporary_staff'] : ''), true);
        $outsideCosts = (array)json_decode(trim(isset($data['outside_cost']) ? $data['outside_cost'] : ''), true);
        $timeUnit = (isset($data['time_unit']) && in_array($data['time_unit'], array('D', 'H'))) ? trim($data['time_unit']) : null;


        $workers = (array)json_decode(trim(isset($data['workers']) ? $data['workers'] : ''), true);

        $estimate = $this->_estimateRepository->find($id);


        if ($estimate) {

            if (!$multiplier) {
                $calculatedMultiplier = $estimate->getMultiplier();
            } else {
                $calculatedMultiplier = $multiplier;
            }

            $updateWorkerList = [];
            $temporaryStaffList = [];
            $outsideCostList = [];

            foreach ($workers as $worker) {
                if (isset($worker['worker_id']) && (int)$worker['worker_id']) {
                    $user = $this->_userRepository->find($worker['worker_id']);

                    if ($user) {
                        $tempWorkerList = [
                            'worker_id' => (int)$worker['worker_id'],
                            'hourly_rate' => (float)$user->getHourlyRate(),
                            'estimated_regular' => isset($worker['estimated_regular']) ? $worker['estimated_regular'] : null,
                            'estimated_overtime' => isset($worker['estimated_overtime']) ? $worker['estimated_overtime'] : null,
                            'estimated_doubletime' => isset($worker['estimated_doubletime']) ? $worker['estimated_doubletime'] : null,
                            'total_amount' => isset($worker['total_amount']) ? $worker['total_amount'] : null
                        ];

                        $updateWorkerList[] = $tempWorkerList;
                    }
                }
            }


            foreach ($temporaryStaffs as $tempStaff) {
                $name = isset($tempStaff['name']) ? trim($tempStaff['name']) : null;
                $estimatedTime = isset($tempStaff['estimated_time']) ? (float)trim($tempStaff['estimated_time']) : null;
                $rate = isset($tempStaff['rate']) ? (float)trim($tempStaff['rate']) : null;
                $staffTotalAmount = isset($tempStaff['total_amount']) ? (float)trim($tempStaff['total_amount']) : null;

                if ($name && $estimatedTime && $rate) {
                    $temporaryStaffList[] = array(
                        'name' => $name,
                        'estimated_time' => $estimatedTime,
                        'rate' => $rate,
                        'total_amount' => $staffTotalAmount
                    );

                }
            }

            foreach ($outsideCosts as $outsideCost) {
                $outsideCostId = isset($outsideCost['outside_cost_id']) ? (int)trim($outsideCost['outside_cost_id']) : null;
                $cost = isset($outsideCost['cost']) ? (float)trim($outsideCost['cost']) : null;
                $typeId = isset($outsideCost['type_id']) ? (int)trim($outsideCost['type_id']) : null;

                if ($outsideCostId && $cost && $typeId) {
                    $outsideCostList[] = array(
                        'outside_cost_id' => $outsideCostId,
                        'cost' => $cost,
                        'type_id' => $typeId
                    );

                }
            }

            if ($spotId) {
                $estimate->setSpotId($spotId);
            }

            if ($multiplier) {
                $estimate->setMultiplier($multiplier);
            }

            if ($submitTo) {
                $estimate->setSubmittedTo($submitTo);
            }

            if ($timeUnit) {
                $estimate->setTimeUnit($timeUnit);
            }

            if ($statusId) {
                if ($statusId != $estimate->getStatusId()) {
                    // estimate history
                    $historyMessage = 'updated estimate status';
                    $estimateHistory = new RediEstimateHistory();
                    $estimateHistory->setEstimateId($id);
                    $estimateHistory->setUserId($this->_user_id);
                    $estimateHistory->setMessage($historyMessage);
                    $estimateHistory->setCreatedAt(new \DateTime('now'));
                    $this->_em->persist($estimateHistory);
                    $this->_em->flush();
                }
                $estimate->setStatusId($statusId);
            }

            if ($versionId) {
                $estimate->setVersionId($versionId);
            }

            if ($notes) {
                $estimate->setNotes($notes);
            }

            if ($totalAmount) {
                $estimate->setTotalAmount($totalAmount);
            }
//            $estimate->setCreatedAt(new \DateTime('now'));
            $estimate->setUpdatedAt(new \DateTime('now'));

            $this->_em->persist($estimate);
            $this->_em->flush();

            $estimateId = $estimate->getId();

            // cleanup existing data
            if(count($updateWorkerList)) {
                $deleteWorkerList = $this->_estimateToWorkerRepository->findBy(['estimateId' => $id]);

                foreach ($deleteWorkerList as $row) {
                    $this->_em->remove($row);
                }

                foreach ($updateWorkerList as $row) {
                    $estimateWorker = new RediEstimateToWorker();
                    $estimateWorker->setEstimateId($estimateId);
                    $estimateWorker->setWorkerId($row['worker_id']);
                    $estimateWorker->setHourlyRate($row['hourly_rate']);
                    $estimateWorker->setEstimatedRegular($row['estimated_regular']);
                    $estimateWorker->setEstimatedOvertime($row['estimated_overtime']);
                    $estimateWorker->setEstimatedDoubletime($row['estimated_doubletime']);
                    $estimateWorker->setTotalAmount($row['total_amount']);

                    $this->_em->persist($estimateWorker);
                }

                $this->_em->flush();
            }

            // Insert temporary staff for estimate
            if(count($temporaryStaffList)) {
                $deleteTemporaryStaffList = $this->_estimateTemporaryStaffRepository->findBy(['estimateId' => $id]);

                foreach ($deleteTemporaryStaffList as $row) {
                    $this->_em->remove($row);
                }

                foreach ($temporaryStaffList as $row) {
                    $estimateTemporaryStaff = new RediEstimateTemporaryStaff();
                    $estimateTemporaryStaff->setEstimateId($estimateId);
                    $estimateTemporaryStaff->setName($row['name']);
                    $estimateTemporaryStaff->setEstimatedTime($row['estimated_time']);
                    $estimateTemporaryStaff->setRate($row['rate']);
                    $estimateTemporaryStaff->setTotalAmount($row['total_amount']);

                    $this->_em->persist($estimateTemporaryStaff);
                }
            }

            // Insert outside cost for estimate
            if(count($outsideCostList)) {
                $deleteOutsideCostList = $this->_estimateToOutsideCostRepository->findBy(['estimateId' => $id]);

                foreach ($deleteOutsideCostList as $row) {
                    $this->_em->remove($row);
                }
                $this->_em->flush();

                foreach ($outsideCostList as $row) {
                    $estimateToOutsideCost = new RediEstimateToOutsideCost();
                    $estimateToOutsideCost->setEstimateId($estimateId);
                    $estimateToOutsideCost->setOutsideCostId($row['outside_cost_id']);
                    $estimateToOutsideCost->setCost($row['cost']);
                    $estimateToOutsideCost->setTypeId($row['type_id']);

                    $this->_em->persist($estimateToOutsideCost);
                }

                $this->_em->flush();
            }



            if ($totalAmount) {
                $estimate->setTotalAmount($totalAmount);
            }


            $this->_em->persist($estimate);
            $this->_em->flush();

            // Update total and hour value in estimate worker and temporary staff table
            $this->_estimateRepo->updateEstimateHourAndTotal($estimateId);

            $responseData = $this->_estimateRepo->getById($id);

            if ($responseData) {
                $imagePath = $this->_siteUrl . 'thumb/profile_image/';
                $responseData['workers'] = $this->_estimateRepo->getEstimateWorker($id);
                $responseData['submittedTo'] = $this->_estimateRepo->getSubmittedTo($responseData['submittedTo']);
                $responseData['temporaryStaff'] = $this->_estimateRepo->getEstimateTemporaryStaff($estimate->getId());
                $responseData['outsideCost'] = $this->_estimateRepo->getEstimateOutsideCost($estimate->getId());
                $responseData['history'] = $this->_estimateRepo->getHistoryByEstimateId($estimate->getId(), $imagePath);
            }

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => $responseData
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Estimate entry not found.'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }


}
