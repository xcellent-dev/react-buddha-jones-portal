<?php

namespace Application\Controller;

use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class TimeEntryController extends CustomAbstractActionController
{
    public function getList()
    {
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));
        $filter['user_id'] = (int)trim($this->getRequest()->getQuery('user_id', 0));
        $filter['start_date'] = trim($this->getRequest()->getQuery('start_date', null));
        $filter['end_date'] = trim($this->getRequest()->getQuery('end_date', null));

        if ($filter['start_date']) {
            $filter['start_date'] = new \DateTime($filter['start_date']);
            $filter['start_date'] = $filter['start_date']->format('Y-m-d');
        }

        if ($filter['end_date']) {
            $filter['end_date'] = new \DateTime($filter['end_date']);
            $filter['end_date'] = $filter['end_date']->format('Y-m-d');
        }
//        var_dump($filter); exit;

        $data = $this->_timeEntryRepo->search($offset, $length, $filter);
        $totalCount = $this->_timeEntryRepo->searchCount($filter);

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
        $data = $this->_timeEntryRepo->getById($id);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function create($data)
    {
        $workerId = (int)trim(isset($data['worker_id']) ? $data['worker_id'] : $this->_user_id);
        $projectId = (int)trim(isset($data['project_id']) ? $data['project_id'] : 0);
        $campaignId = (int)trim(isset($data['campaign_id']) ? $data['campaign_id'] : 0);
        $spotId = (int)trim(isset($data['spot_id']) ? $data['spot_id'] : 0);
        $versionId = (int)trim(isset($data['version_id']) ? $data['version_id'] : 0);
        $startDateTime = trim(isset($data['start_date_time']) ? $data['start_date_time'] : '');
        $duration = trim(isset($data['duration']) ? $data['duration'] : '');
        $activityTypeId = trim(isset($data['activity_type_id']) ? $data['activity_type_id'] : '');

        $activityDescription = isset($data['activity_description']) ? trim($data['activity_description']) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;
        $nonBillable = (int)(isset($data['non_billable']) && strtolower(trim($data['non_billable'])) == 'true') ? 1 : 0;

        if ($workerId && $startDateTime && $duration && $activityTypeId) {
            $startDateTime = new \DateTime($startDateTime);

            $timeEntry = new RediTimeEntry();
            $timeEntry->setUserId($workerId);

            if ($projectId) {
                $timeEntry->setProjectId($projectId);
            }

            if ($campaignId) {
                $timeEntry->setCampaignId($campaignId);
            }

            if ($spotId) {
                $timeEntry->setSpotId($spotId);
            }

            if ($versionId) {
                $timeEntry->setVersionId($versionId);
            }

            $timeEntry->setStartDate($startDateTime);
            $timeEntry->setDuration($duration);
            $timeEntry->setActivityTypeId($activityTypeId);

            $timeEntry->setActivityDescription($activityDescription);
            $timeEntry->setNotes($notes);
            $timeEntry->setNonBillable($nonBillable);

            $timeEntry->setCreatedBy($this->_user_id);
            $timeEntry->setCreatedAt(new \DateTime('now'));
            $timeEntry->setStatus(1);

            $this->_em->persist($timeEntry);
            $this->_em->flush();

            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => [
                    'id' => $timeEntry->getId(),
                ],
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
//        $workerId = (int)trim(isset($data['worker_id']) ? $data['worker_id'] : $this->_user_id);
        $projectId = isset($data['project_id']) ? (int)$data['project_id'] : null;
        $campaignId = isset($data['campaign_id']) ? (int)$data['campaign_id'] : null;
        $spotId = isset($data['spot_id']) ? (int)$data['spot_id'] : null;
        $versionId = isset($data['version_id']) ? (int)$data['version_id'] : null;
        $startDateTime = isset($data['start_date_time']) ? trim($data['start_date_time']) : null;
        $duration = isset($data['duration']) ? (float)$data['duration'] : null;
        $activityTypeId = isset($data['activity_type_id']) ? (int)$data['activity_type_id'] : null;

        $activityDescription = isset($data['activity_description']) ? trim($data['activity_description']) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;
        $nonBillable = (isset($data['non_billable']))?((strtolower(trim($data['non_billable'])) == 'true')?1:0):null;

        if ($id) {
            $timeEntry = $this->_timeEntryRepository->find($id);
//            $timeEntry->setUserId($workerId);

            if($timeEntry) {
                if ($timeEntry->getStatus() == 1) {

                    if($timeEntry->getUserId()==$this->_user_id || $timeEntry->getCreatedBy()==$this->_user_id) {
                        if ($projectId !== null) {
                            $timeEntry->setProjectId($projectId);
                        }

                        if ($campaignId !== null) {
                            $timeEntry->setCampaignId($campaignId);
                        }

                        if ($spotId !== null) {
                            $timeEntry->setSpotId($spotId);
                        }

                        if ($versionId !== null) {
                            $timeEntry->setVersionId($versionId);
                        }

                        if ($startDateTime !== null) {
                            $startDateTime = new \DateTime($startDateTime);
                            $timeEntry->setStartDate($startDateTime);
                        }

                        if ($duration !== null) {
                            $timeEntry->setDuration($duration);
                        }

                        if ($activityTypeId !== null) {
                            $timeEntry->setActivityTypeId($activityTypeId);
                        }

                        if ($activityDescription !== null) {
                            $timeEntry->setActivityDescription($activityDescription);
                        }

                        if ($notes !== null) {
                            $timeEntry->setNotes($notes);
                        }

                        if ($nonBillable !== null) {
                            $timeEntry->setNonBillable($nonBillable);
                        }

//            $timeEntry->setCreatedBy($this->_user_id);
//            $timeEntry->setCreatedAt(new \DateTime('now'));
//            $timeEntry->setStatus(1);

                        $this->_em->persist($timeEntry);
                        $this->_em->flush();

                        $data = $this->_timeEntryRepo->getById($id);

                        $response = array(
                            'status' => 1,
                            'message' => 'Request successful.',
                            'data' => $data
                        );
                    } else {
                        $response = array(
                            'status' => 0,
                            'message' => 'Time entry does not belong to this user user.'
                        );
                    }
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'Time entry can not be changed now. It is not in draft status.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'Time entry does not exist.'
                );
            }
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


}
