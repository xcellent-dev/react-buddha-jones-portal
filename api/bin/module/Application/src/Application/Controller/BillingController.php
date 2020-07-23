<?php

namespace Application\Controller;

use Application\Entity\RediBilling;
use Application\Entity\RediBillingActivity;
use Application\Entity\RediBillingApproval;
use Application\Entity\RediBillingEstimate;
use Application\Entity\RediEstimate;
use Application\Entity\RediEstimateToWorker;
use Application\Entity\RediTimeEntry;
use Zend\View\Model\JsonModel;
use League\Csv\Reader;

use Application\Entity\RediCcStatement;
use Application\Entity\RediCcStatementLine;

class BillingController extends CustomAbstractActionController
{
    public function getList()
    {
        $offset = (int)trim($this->getRequest()->getQuery('offset', 0));
        $length = (int)trim($this->getRequest()->getQuery('length', 10));

        $filter['sort'] = trim($this->getRequest()->getQuery('sort', ''));
        $filter['search'] = trim($this->getRequest()->getQuery('search', ''));
//        $filter['spot_id'] = (int)trim($this->getRequest()->getQuery('spot_id', 0));
        $filter['project_id'] = (int)trim($this->getRequest()->getQuery('project_id', 0));
        $filter['campaign_id'] = (int)trim($this->getRequest()->getQuery('campaign_id', 0));
//        $filter['work_type_id'] = (int)trim($this->getRequest()->getQuery('work_type_id', 0));
        $filter['status_id'] = (int)trim($this->getRequest()->getQuery('status_id', 0));
        $filter['customer_id'] = (int)trim($this->getRequest()->getQuery('customer_id', 0));
        $filter['approver_id'] = (int)trim($this->getRequest()->getQuery('approver_id', 0));
        $filter['approver_status'] = $this->getRequest()->getQuery('approver_status', null);

        $data = $this->_billingRepo->search($offset, $length, $filter);
        $totalCount = $this->_billingRepo->searchCount($filter);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'total_count' => $totalCount,
            'object_count' => count($data),
            'data' => $data
        );


        return new JsonModel($response);
    }

    public function get($billId)
    {
        $data = $this->_billingRepo->getById($billId);

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

    function create($data)
    {
        $customerId = (int)trim(isset($data['customer_id']) ? $data['customer_id'] : 0);
        $projectId = (int)trim(isset($data['project_id']) ? $data['project_id'] : 0);
        $campaignId = (int)trim(isset($data['campaign_id']) ? $data['campaign_id'] : 0);
        $spotId = (int)trim(isset($data['spot_id']) ? $data['spot_id'] : 0);
        $notes = trim(isset($data['notes']) ? $data['notes'] : '');
        $statusId = (int)trim(isset($data['status_id']) ? $data['status_id'] : 1);

        $estimate = (array)json_decode(trim(isset($data['estimate']) ? $data['estimate'] : ''), true);
        $activity = (array)json_decode(trim(isset($data['activity']) ? $data['activity'] : ''), true);

        $estimateList = [];
        $activityList = [];

        foreach ($estimate as $estimateId) {
            $checkEstimate = $this->_estimateRepository->find($estimateId);

            if ($checkEstimate) {
                $estimateList[] = $estimateId;
            }
        }

        foreach ($activity as $row) {
            if (isset($row['activity_id']) && $row['activity_id']) {
                $activityCheck = $this->_activityRepository->find($row['activity_id']);

                if ($activityCheck && isset($row['price'], $row['hour'])) {
                    $activityList[] = array(
                        'activity_id' => (int)$row['activity_id'],
                        'price' => (float)$row['price'],
                        'hour' => (float)$row['hour'],
                    );
                }
            }
        }

        if ($customerId && $projectId && $campaignId && $statusId && (count($estimateList) || count($activityList))) {
            $billing = new RediBilling();
            $billing->setCustomerId($customerId);
            $billing->setProjectId($projectId);
            $billing->setCampaignId($campaignId);
            $billing->setStatusId($statusId);
            $billing->setCreatedAt(new \DateTime('now'));

            if ($notes) {
                $billing->setNotes($notes);
            }

            if ($spotId) {
                $billing->setSpotId($spotId);
            }

            $this->_em->persist($billing);
            $this->_em->flush();

            $billingId = $billing->getId();

            if (count($estimateList)) {
                foreach ($estimateList as $estimateId) {
                    $billingEstimate = new RediBillingEstimate();
                    $billingEstimate->setEstimateId($estimateId);
                    $billingEstimate->setBillId($billingId);

                    $this->_em->persist($billingEstimate);
                }
            }

            if (count($activityList)) {
                foreach ($activityList as $row) {
                    $billingActivity = new RediBillingActivity();
                    $billingActivity->setBillId($billingId);
                    $billingActivity->setActivityId($row['activity_id']);
                    $billingActivity->setPrice($row['price']);
                    $billingActivity->setHour($row['hour']);

                    $this->_em->persist($billingActivity);
                }
            }

            $projectManager = $this->_billingRepo->getManagerByProjectAndCampaign($projectId, $campaignId);
            $projectProducer = $this->_billingRepo->getProducerByProjectAndCampaign($projectId, $campaignId);

            $approver = array_unique(array_merge($projectManager, $projectProducer));

            foreach($approver as $userId) {
                $billingApprovel = new RediBillingApproval();
                $billingApprovel->setBillId($billingId);
                $billingApprovel->setUserId($userId);
                $billingApprovel->setApproved(0);

                $this->_em->persist($billingApprovel);
            }

            $this->_em->flush();


            $response = array(
                'status' => 1,
                'message' => 'Request successful.',
                'data' => array(
                    'billing_id' => $billingId
                )
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data (customer_id, project_id, campaign_id, (activity or estimate).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }
}
