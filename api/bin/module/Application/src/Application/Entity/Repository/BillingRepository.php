<?php
namespace Application\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;
use Zend\Config\Config;

class BillingRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediBilling";

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);
    }

    public function search($offset = 0, $length = 10, $filter=array())
    {
        $filter['offset'] = $offset;
        $filter['length'] = $length;

        $selectColumns = "b.id, 
                      b.spotId, s.spotName, 
                      b.projectId, p.projectName,
                      b.customerId, cu.customerName,
                      b.campaignId, c.campaignName,
                      b.statusId, bis.billStatus,
                      b.createdAt";

        $groupBy = ' GROUP BY b.id ';

        if(isset($filter['sort']) && strtolower($filter['sort'])=='priority') {
            $orderBy = " ORDER BY b.statusId ASC ";
        } else {
            $orderBy = " ORDER BY b.createdAt ASC ";
        }

        $data = $this->getResultByFilter($selectColumns, $filter, $groupBy, $orderBy, true, false);

        return $data;
    }


    public function searchCount($filter=array())
    {
        $selectColumns = " COUNT( DISTINCT  b.id) AS total_count ";

        $result = $this->getResultByFilter($selectColumns, $filter, null, null, false, true);

        return (isset($result['total_count'])?(int)$result['total_count']:0);
    }

    public function getById($billId)
    {
        $filter = array(
            'bill_id' => $billId,
            'length' => 1,
        );

        $selectColumns = "b.id, 
                      b.spotId, s.spotName, 
                      b.projectId, p.projectName,
                      b.customerId, cu.customerName,
                      b.campaignId, c.campaignName,
                      b.statusId, bis.billStatus,
                      b.createdAt";

        $groupBy = ' GROUP BY b.id ';


        $data = $this->getResultByFilter($selectColumns, $filter, $groupBy, null, true, true, true);

        return $data;
    }

    public function getResultByFilter($selectColumns, $filter=array(), $groupBy=null, $orderBy=null, $processExtraColumn=false, $returnOne=false, $returnEstimateActivity=false) {
        $dql = "SELECT  
                  " . $selectColumns . "
                FROM \Application\Entity\RediBilling b 
                LEFT JOIN \Application\Entity\RediSpot s
                  WITH b.spotId=s.id 
                LEFT JOIN \Application\Entity\RediBillingStatus bis 
                  WITH b.statusId=bis.id 
                LEFT JOIN \Application\Entity\RediProject p
                  WITH p.id=b.projectId
                LEFT JOIN \Application\Entity\RediCampaign c
                  WITH c.id=b.campaignId 
                LEFT JOIN \Application\Entity\RediCustomer cu
                  WITH cu.id=b.customerId 
                LEFT JOIN \Application\Entity\RediBillingApproval ba
                  WITH ba.billId=b.id ";

        $dqlFilter = [];

        if (isset($filter['bill_id']) && $filter['bill_id']) {
            $dqlFilter[] = " b.id=:bill_id ";
        }

      if (isset($filter['spot_id']) && $filter['spot_id']) {
            $dqlFilter[] = " b.spotId=:spot_id ";
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $dqlFilter[] = " b.projectId=:project_id ";
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $dqlFilter[] = " b.campaignId=:campaign_id ";
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $dqlFilter[] = " b.statusId=:status_id ";
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $dqlFilter[] = " b.customerId=:customer_id ";
        }

        if (isset($filter['approver_id']) && $filter['approver_id']) {
            $dqlFilter[] = " ba.userId=:approver_id ";
        }

        if (isset($filter['approver_status']) && $filter['approver_status']!==null) {
            $dqlFilter[] = " ba.approved=:approver_status ";
        }

        if (isset($filter['search']) && $filter['search']) {
            $dqlFilter[] = " (s.spotName LIKE :search OR p.projectName  LIKE :search OR  c.campaignName LIKE :search ) ";
        }

        if(count($dqlFilter)) {
            $dql .= " WHERE " .  implode(" AND ", $dqlFilter);
        }


        if($groupBy) {
            $dql .= " " . $groupBy . " ";
        }

        if($orderBy) {
            $dql .= " " . $orderBy . " ";
        }

        $query = $this->getEntityManager()->createQuery($dql);

        if(isset($filter['offset'])) {
            $query->setFirstResult($filter['offset']);
        }

        if(isset($filter['length'])) {
            $query->setMaxResults($filter['length']);
        }


        if (isset($filter['bill_id']) && $filter['bill_id']) {
            $query->setParameter('bill_id', $filter['bill_id']);
        }

        if (isset($filter['spot_id']) && $filter['spot_id']) {
            $query->setParameter('spot_id', $filter['spot_id']);
        }

        if (isset($filter['project_id']) && $filter['project_id']) {
            $query->setParameter('project_id', $filter['project_id']);
        }

        if (isset($filter['campaign_id']) && $filter['campaign_id']) {
            $query->setParameter('campaign_id', $filter['campaign_id']);
        }

        if (isset($filter['status_id']) && $filter['status_id']) {
            $query->setParameter('status_id', $filter['status_id']);
        }

        if (isset($filter['customer_id']) && $filter['customer_id']) {
            $query->setParameter('customer_id', $filter['customer_id']);
        }

        if (isset($filter['approver_id']) && $filter['approver_id']) {
            $query->setParameter('approver_id', $filter['approver_id']);
        }

        if (isset($filter['approver_status']) && $filter['approver_status']!==null) {
            $query->setParameter('approver_status', $filter['approver_status']);
        }

        if (isset($filter['search']) && $filter['search']) {
            $query->setParameter('search', '%' . $filter['search'] . '%');
        }

        $data = $query->getArrayResult();

        if($processExtraColumn) {
            foreach($data as &$row) {
                $row['id'] = (int)$row['id'];
                $row['createdAt'] = $row['createdAt']->format('Y-m-d H:i:s');

                $row['total'] = $this->getBillingTotal($row['id']);

                $row['approver'] = array(
                    'manager' => $this->getManagerByProjectAndCampaign($row['projectId'], $row['campaignId'], $row['id'], false),
                    'producer' => $this->getProducerByProjectAndCampaign($row['projectId'], $row['campaignId'], $row['id'], false)
                );

                if($returnEstimateActivity) {
                    $row['estimate'] = $this->getBillingEstimateByBillId($row['id']);
                    $row['activity'] = $this->getBillingActivityByBillId($row['id']);
                }
            }
        }

        if($returnOne) {
            $data = (isset($data[0]))?$data[0]:null;
        }

        return $data;
    }

    public function getAllStatus()
    {
        $dql = "SELECT 
                  b
                FROM \Application\Entity\RediBillingStatus b ";

        $query = $this->getEntityManager()->createQuery($dql);

        $data = $query->getArrayResult();

        return $data;
    }

    public function getAllApproverId($billId)
    {
        $dql = "SELECT 
                  b.userId
                FROM \Application\Entity\RediBillingApproval b 
                WHERE b.billId=:bill_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('bill_id', $billId);
        $data = $query->getArrayResult();

        $response =  array();

        foreach($data as $row) {
            $response[] = $row['userId'];
        }

        return $response;
    }

    public function getAllApproverByBillId($billId)
    {
        $dql = "SELECT 
                  b.userId AS approverId, b.approved
                FROM \Application\Entity\RediBillingApproval b 
                WHERE b.billId=:bill_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('bill_id', $billId);
        $data = $query->getArrayResult();

        return $data;
    }

    public function getBillingEstimateByBillId($billId)
    {
        $dql = "SELECT 
                  e.id, e.spotId, e.versionId, e.multiplier, e.notes, e.workTypeId, e.statusId, e.totalAmount
                FROM \Application\Entity\RediBillingEstimate bie 
                INNER JOIN \Application\Entity\RediEstimate e 
                  WITh bie.estimateId=e.id
                WHERE bie.billId=:bill_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('bill_id', $billId);
        $data = $query->getArrayResult();

        return $data;
    }

    public function getBillingActivityByBillId($billId)
    {
        $dql = "SELECT 
                  a.id, a.name, a.typeId, at.activityType, a.status, ba.price, ba.hour
                FROM \Application\Entity\RediBillingActivity ba 
                INNER JOIN \Application\Entity\RediActivity a 
                  WITh ba.activityId=a.id 
                INNER JOIN \Application\Entity\RediActivityType at 
                  WITh at.id=a.typeId
                WHERE ba.billId=:bill_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('bill_id', $billId);
        $data = $query->getArrayResult();

        return $data;
    }

    public function getManagerByProjectAndCampaign($projectId, $campaignId, $billId=null, $returnIdOnly=true)
    {
        $dql = "SELECT pcm.managerId, ba.approved
                FROM \Application\Entity\RediProjectToCampaign ptc 
                INNER JOIN \Application\Entity\RediProjectCampaignManager pcm
                  WITH ptc.id=pcm.projectCampaignId
                LEFT JOIN \Application\Entity\RediBillingApproval ba
                  WITH ba.billId=:bill_id AND ba.userId=pcm.managerId
                WHERE 
                  ptc.projectId=:project_id 
                  AND ptc.campaignId=:campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->setParameter('campaign_id', $campaignId);
        $query->setParameter('bill_id', $billId);
        $data =  $query->getArrayResult();

        $result = array();

        if($returnIdOnly) {
            foreach ($data as $manager) {
                $result[] = $manager['managerId'];
            }
        } else {
            foreach ($data as $manager) {
                $result[] = array(
                    'managerId' => $manager['managerId'],
                    'approved' => (int)$manager['approved']
                );
            }
        }

        return $result;
    }

    public function getProducerByProjectAndCampaign($projectId, $campaignId, $billId=null, $returnIdOnly=true)
    {
        $dql = "SELECT pcm.producerId, ba.approved
                FROM \Application\Entity\RediProjectToCampaign ptc 
                INNER JOIN \Application\Entity\RediProjectCampaignProducer pcm
                  WITH ptc.id=pcm.projectCampaignId
                LEFT JOIN \Application\Entity\RediBillingApproval ba
                  WITH ba.billId=:bill_id AND ba.userId=pcm.producerId
                WHERE 
                  ptc.projectId=:project_id 
                  AND ptc.campaignId=:campaign_id";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('project_id', $projectId);
        $query->setParameter('campaign_id', $campaignId);
        $query->setParameter('bill_id', $billId);
        $data =  $query->getArrayResult();

        $result = array();

        if($returnIdOnly) {
            foreach ($data as $manager) {
                $result[] = $manager['producerId'];
            }
        } else {
            foreach ($data as $manager) {
                $result[] = array(
                    'producerId' => $manager['producerId'],
                    'approved' => (int)$manager['approved']
                );
            }
        }

        return $result;
    }

    public function getBillingTotal($billId)
    {
        $total = $this->getBillEstimateTotal($billId) + $this->getBillActivityTotal($billId);

        return $total;
    }

    public function getBillEstimateTotal($billId){
        $dql = "SELECT 
                  SUM(e.totalAmount * e.multiplier) AS total
                FROM
                  \Application\Entity\RediBillingEstimate be 
                  INNER JOIN \Application\Entity\RediEstimate e 
                    WITH e.id = be.estimateId 
                WHERE be.billId = :bill_id ";

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameter('bill_id', $billId);
        $data =  $query->getArrayResult();

        return (float)$data[0]['total'];
    }

    public function getBillActivityTotal($billId) {
        $billActivity = $this->getBillingActivityByBillId($billId);

        $total = 0;
        foreach($billActivity as $activityPrice) {
            $hourSplit = explode('.', $activityPrice['hour']);
            $hour = (int)$hourSplit[0];
            $minute = (isset($hourSplit[1]))?(int)$hourSplit[1]:0;

            $total += $hour * $activityPrice['price'] + ($activityPrice['price']*$minute/60);
        }

        return $total;
    }

}
